from datetime import datetime

from ckeditor.fields import RichTextField
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from cloudinary.models import CloudinaryField
from django.db.models import Q, Count
from django.utils import timezone


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=False)
    role = models.CharField(max_length=255)


    def __str__(self):
        return self.username

    def is_admin(user):
        if user.roles.filter(role='admin').exists():
            return True
        return False

    def is_customer(user):
        if user.roles.filter(role='customer').exists():
            return True
        return False


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class JourneyQuerySet(models.QuerySet):
    def active(self):
        return self.filter(
            is_completed=False,
            end_date__gte=timezone.now().date()
        ) | self.filter(
            is_completed=False,
            end_date__isnull=True
        )

    def search_by_keyword(self, keyword):
        return self.filter(Q(name__icontains=keyword) | Q(description__icontains=keyword))

    def filter_by_tags(self, tags):
        if not tags:
            return self
        query = self
        query = query.annotate(
            matching_tags_count=Count('tags', filter=Q(tags__id__in=tags))
        ).filter(
            matching_tags_count=len(tags)
        )
        return query

    def filter_by_username(self, username):
        return self.filter(user_journey__username__icontains=username)

    def filter_by_end_date_range(self, start_date, end_date):
        return self.filter(end_date__range=(start_date, end_date))

    def search_by_place_name(self, place_name):
        return self.filter(placevisits__name__icontains=place_name).distinct()


class Journey(BaseModel):
    name = models.CharField(max_length=150, null=False)
    main_image = models.ImageField(upload_to='journeys/%Y/%m', default=None,null=True)
    description = RichTextField(null=True, default=None)
    user_journey = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    tags = models.ManyToManyField('Tag')
    end_date = models.DateField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    comments_closed = models.BooleanField(default=False)
    objects = JourneyQuerySet.as_manager()

    def __str__(self):
        return self.name

    def is_active(self):
        return not self.is_completed and (self.end_date is None or self.end_date >= timezone.now().date())


class Interaction(BaseModel):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    class Meta:
        abstract = True


class Comment(Interaction):
    cmt = models.CharField(max_length=200, null=False)
    is_deleted = models.BooleanField(default=False)  # Thêm trường này


class JoinJourney(Interaction):
    pass


class Rating(Interaction):
    rate = models.SmallIntegerField(
        default=0,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    content = models.CharField(max_length=200,null= True)


class Report(models.Model):
    reason = models.CharField(max_length=200, blank=True, null=True)
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_reports') # User bị report
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made') # User tạo report
    created_date = models.DateTimeField(default=datetime.now)
    active = models.BooleanField(default=True)
    def __str__(self):
        return f"Report by {self.reporter} on {self.reported_user} for {self.reason}"


class ImageJourney(Interaction):
    image = CloudinaryField('image', null=False)
    content = models.CharField(max_length=200,null= True)


class CommentImageJourney(BaseModel):
    cmt = models.CharField(max_length=200, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    imagejourney = models.ForeignKey(ImageJourney, on_delete=models.CASCADE, related_name='comments', default=1)


class PlaceVisit(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    name = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='place_images/%Y/%m', default=None,null=True)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='placevisits', null=True)

    def __str__(self):
        return self.name if self.name else f'Place at ({self.latitude}, {self.longitude})'


class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.activity_type} at {self.timestamp}'