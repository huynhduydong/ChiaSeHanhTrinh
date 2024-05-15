from ckeditor.fields import RichTextField
from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from django.shortcuts import get_object_or_404


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


class Journey(BaseModel):
    name = models.CharField(max_length=150, null=False)
    main_image = models.ImageField(upload_to='journeys/%Y/%m', default=None)
    description = RichTextField(null=True, default=None)
    user_journey = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return self.name


class Interaction(BaseModel):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    class Meta:
        abstract = True


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Comment(Interaction):
    cmt = models.CharField(max_length=200, null=False)


class JoinJourney(Interaction):
    content = models.CharField(max_length=200, null=False)


class Rating(Interaction):
    rate = models.SmallIntegerField(default=0)


class Report(BaseModel):
    reason = models.CharField(max_length=200, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)


class PlaceVisit(models.Model):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    name = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='place_images/', blank=True, null=True)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name if self.name else f'Place at ({self.latitude}, {self.longitude})'
