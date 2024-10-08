from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

import journeys
from journeyapp import settings
from journeys.models import Journey, User, Comment, PlaceVisit, Tag, JoinJourney, ImageJourney, CommentImageJourney, \
    Report, ActivityLog, Rating


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class BaseSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField(source='image')
    tags = TagSerializer(many=True)
    def get_main_image(self, journey):

        if journey.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % journey.main_image.name)
            return '/static/%s' % journey.main_image.name


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=65, write_only=True)
    email = serializers.EmailField(max_length=255, min_length=4),
    first_name = serializers.CharField(max_length=255, min_length=2)
    last_name = serializers.CharField(max_length=255, min_length=2)
    avatar = SerializerMethodField()
    def get_avatar(self,obj):
        if obj.avatar:
            return '{}{}'.format(settings.CLOUDINARY_ROOT_URL, obj.avatar)
        return None

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'first_name', 'last_name', 'email', 'password','role'
                  ]


    def validate(self, attrs):
        email = attrs.get('email', '')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {'email': ('Email is already in use')})
        return super().validate(attrs)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'avatar', 'role', 'first_name', 'last_name', 'id']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            avatar=validated_data['avatar'],
            role=validated_data['role'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    journey_count = serializers.SerializerMethodField()
    avatar = SerializerMethodField()

    def get_avatar(self, obj):
        if obj.avatar:
            return '{}{}'.format(settings.CLOUDINARY_ROOT_URL, obj.avatar)
        return None

    def get_journey_count(self, obj):
        return Journey.objects.filter(user_journey=obj).count()

    def get_average_rating(self, obj):
        journeys = Journey.objects.filter(user_journey=obj)
        ratings = Rating.objects.filter(journey__in=journeys)
        if ratings.exists():
            total_rating = sum(r.rate for r in ratings)
            count = ratings.count()
            return total_rating / count if count > 0 else 0
        return 0

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'first_name', 'last_name', 'email', 'password', 'average_rating', 'journey_count']
        read_only_fields = ['username', 'email', 'password', 'average_rating', 'journey_count']


class PlaceVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceVisit
        fields = ['id', 'latitude', 'longitude', 'name', 'description', 'address', 'image', 'journey']


class JourneySerializer(BaseSerializer):
    user_journey = UserSerializer()
    comments_count = serializers.SerializerMethodField()
    join_count = serializers.SerializerMethodField()
    tags = serializers.StringRelatedField(many=True)
    placevisits = PlaceVisitSerializer(many=True, read_only=True)

    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'created_date', 'tags', 'description', 'user_journey', 'comments_count', 'join_count', 'placevisits',  'end_date', 'start_date']

    def get_comments_count(self, obj):
        return Comment.objects.filter(journey=obj).count()

    def get_join_count(self, obj):
        return JoinJourney.objects.filter(journey=obj).count()


class AddJourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = ['id', 'name', 'description', 'main_image', 'end_date', 'start_date']

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user if request else None
        return Journey.objects.create(user_journey=user, **validated_data)


class UpdateJourneySerializer(BaseSerializer):

    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'description',  'end_date', 'start_date']


class ImageJourneySerializer(serializers.ModelSerializer):
    image = SerializerMethodField()
    user = UserSerializer()

    def get_image(self, obj):
        return '{}{}'.format(settings.CLOUDINARY_ROOT_URL, obj.image)
    class Meta:
        model = ImageJourney
        fields = ['id', 'user', 'image','content',  'created_date']


class CommentImageJourneySerializer(serializers.ModelSerializer):
    user= UserSerializer()
    class Meta:
        model = CommentImageJourney
        fields = ['id', 'cmt','user']


class JourneyDetailSerializer(BaseSerializer):

    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'tags', 'description', 'is_completed', 'comments_closed', 'end_date', 'start_date']


class LoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=65, write_only=True)
    username = serializers.CharField(max_length=255, min_length=2)

    class Meta:
        model = User
        fields = ['username', 'password']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'cmt', 'user', 'created_date']
        # read_only_fields = 'user'


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['activity_type', 'description', 'timestamp']


class JoinJourneySerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = JoinJourney
        fields = ['id', 'user', 'created_date']


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'reason', 'reported_user', 'reporter', 'created_date', 'active']
        read_only_fields = ['reporter', 'created_date', 'active']


class ActiveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'journey', 'user', 'rate', 'content']
        read_only_fields = ['user']

    def validate(self, data):
        if not data['journey'].is_completed:
            raise serializers.ValidationError("Hành trình chưa kết thúc, không thể rating.")

        user = self.context['request'].user
        if not JoinJourney.objects.filter(journey=data['journey'], user=user).exists():
            raise serializers.ValidationError("User chưa tham gia hành trình này.")

        if Rating.objects.filter(journey=data['journey'], user=user).exists():
            raise serializers.ValidationError("User đã rating hành trình này rồi.")

        return data


from django.utils import timezone

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)
    user = serializers.CharField(max_length=100, required=False)  # Đặt required=False để không bắt buộc từ client
    timestamp = serializers.DateTimeField(default=timezone.now)
    chat_id = serializers.CharField(max_length=100, required=False)
    type = serializers.CharField(max_length=20, required=False)