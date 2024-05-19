from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

import journeys
from journeys.models import Journey, User, Comment, PlaceVisit, Tag, JoinJourney


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class BaseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='image')
    tags = TagSerializer(many=True)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=65, min_length=8, write_only=True)
    email = serializers.EmailField(max_length=255, min_length=4),
    first_name = serializers.CharField(max_length=255, min_length=2)
    last_name = serializers.CharField(max_length=255, min_length=2)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password'
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
    main_image = SerializerMethodField()

    def get_main_image(self, obj):
        return obj.main_image.url

    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'tags', 'description', 'user_journey']


class UpdateJourneySerializer(BaseSerializer):

    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'description']



class JourneyDetailSerializer(BaseSerializer):
    main_image = SerializerMethodField()
    def get_main_image(self, obj):
        return obj.main_image.url
    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'tags', 'description']



class AddJourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = ['active', 'name', 'description']


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


class PlaceVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceVisit
        fields = '__all__'
