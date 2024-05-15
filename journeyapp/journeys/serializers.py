from rest_framework import serializers

import journeys
from journeys.models import Journey, User, Comment, PlaceVisit, Tag



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
        fields = ['username', 'first_name', 'last_name', 'email', 'password'
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


class JourneyDetailSerializer(BaseSerializer):
    class Meta:
        model = Journey
        fields = ['id', 'name', 'main_image', 'tags', 'description']


class AddJourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = ['active','name','description']

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
        fields = ['id', 'cmt', 'user']


class PlaceVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceVisit
        fields = '__all__'
