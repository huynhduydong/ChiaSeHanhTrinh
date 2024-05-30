from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

import journeys
from journeyapp import settings
from journeys.models import Journey, User, Comment, PlaceVisit, Tag, JoinJourney, ImageJourney, CommentImageJourney, \
    Report


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
        max_length=65, min_length=8, write_only=True)
    email = serializers.EmailField(max_length=255, min_length=4),
    first_name = serializers.CharField(max_length=255, min_length=2)
    last_name = serializers.CharField(max_length=255, min_length=2)
    avatar = SerializerMethodField()
    def get_avatar(self,obj):
        return'{}{}'.format(settings.CLOUDINARY_ROOT_URL,obj.avatar)


    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'first_name', 'last_name', 'email', 'password'
                  ]


    def validate(self, attrs):
        email = attrs.get('email', '')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {'email': ('Email is already in use')})
        return super().validate(attrs)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class JourneySerializer(BaseSerializer):
    user_journey = UserSerializer()
    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'tags', 'description', 'user_journey']


class UpdateJourneySerializer(BaseSerializer):

    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'description']


class PlaceVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceVisit
        fields = '__all__'


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
        fields = ['id', 'name', 'main_image', 'tags', 'description']



class AddJourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = ['name', 'description']


class LoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=65, min_length=8, write_only=True)
    username = serializers.CharField(max_length=255, min_length=2)

    class Meta:
        model = User
        fields = ['username', 'password']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'cmt', 'user', 'created_date']


class JoinJourneySerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = JoinJourney
        fields = ['id', 'user', 'created_date']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'reason', 'reported_user', 'reporter', 'created_date', 'active']
        read_only_fields = ['created_date', 'active']


class PlaceVisitSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField(source='image')
    # # tags = TagSerializer(many=True)
    # def get_image(self, placevisit):
    #
    #     if placevisit.image:
    #         request = self.context.get('request')
    #         if request:
    #             return request.build_absolute_uri('/static/%s' % placevisit.image.name)
    #         return '/static/%s' % placevisit.image.name
    class Meta:
        model = PlaceVisit
        fields = ['id', 'image', 'latitude', 'longitude', 'address', 'description']
