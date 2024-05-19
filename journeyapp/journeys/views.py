import cloudinary
from rest_framework import generics, viewsets, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib import auth
from rest_framework.views import APIView

from journeys import serializers, perms
from journeys.models import Journey, User, Comment, JoinJourney
import jwt
from django.conf import settings

from journeys.serializers import UserSerializer, UpdateJourneySerializer


class JourneyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Journey.objects.all()
    serializer_class = serializers.JourneySerializer
    # permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action in ['add_comment', 'add_journey']:
    #         return [permissions.IsAuthenticated()]
    #
    #     return self.permission_classes

    @action(methods=['post'], detail=False, url_path='addjourney', url_name='add_journey')
    def add_journey(self, request):
        fixed_user = User.objects.get(pk=3)

        # Tạo Journey với thông tin người dùng cố định
        j = Journey.objects.create(
            name=request.data.get('name'),
            description=request.data.get('description'),
            user_journey=fixed_user
        )
        if request.method == 'POST':
            return Response(serializers.AddJourneySerializer(j).data, status=status.HTTP_201_CREATED)

    @action(url_path='journey_by_user',detail=True, methods=['get'])
    def journeys(self, request, pk=None):
        user = User.objects.get(pk=pk)
        journeys = Journey.objects.filter(user_journey=user)
        data = []
        for journey in journeys:
            comments_count = Comment.objects.filter(journey=journey).count()
            join_count = JoinJourney.objects.filter(journey=journey).count()
            data.append({
                'id': journey.id,
                'name': journey.name,
                'created_date': journey.created_date,
                'main_image': journey.main_image.url,
                'updated_date': journey.updated_date,
                'comments_count': comments_count,
                'join_count': join_count
            })
        return Response(data, status=status.HTTP_200_OK)


class JourneyDetailViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    # queryset = Journey.objects.all()
    queryset = Journey.objects.prefetch_related('tags').filter(active=True)

    serializer_class = serializers.JourneyDetailSerializer
    # permission_classes = [permissions.AllowAny]

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().comment_set.select_related('user').all()
            return Response(serializers.CommentSerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            fixed_user = User.objects.get(pk=3)  # gán cứng user
            c = Comment.objects.create(user=fixed_user, journey=self.get_object(), cmt=request.data.get('cmt'))
            # user = request.user,
            return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'post'], url_path='join', detail=True)
    def get_join_journey(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().joinjourney_set.select_related('user').all()
            return Response(serializers.JoinJourneySerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            fixed_user = User.objects.get(pk=3)  # gán cứng user
            c = JoinJourney.objects.create(user=fixed_user, journey=self.get_object())
            # user = request.user,
            return Response(serializers.JoinJourneySerializer(c).data, status=status.HTTP_201_CREATED)




class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]
    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user',url_name='current-user', detail=False)
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)


class RegisterViewSet(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.OwnerAuthenticated]


class JoinJourneyRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = JoinJourney.objects.all()
    serializer_class = serializers.JoinJourneySerializer
    lookup_field = "id"

class CommentRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    lookup_field = "id"

# class JourneyRetrieveUpdateDestory(generics.UpdateAPIView):
#     queryset = Journey.objects.all()
#     serializer_class = serializers.UpdateJourneySerializer
#     lookup_field = "id"
#     def partial_update(self, request, *args, **kwargs):
#         journey = self.get_object()
#         serializer = serializers.UpdateJourneySerializer(journey, data=request.data)
#         if serializer.is_valid():
#             main_image = request.data.get('main_image')
#             if journey.main_image:
#                 public_id = journey.main_image.public_id
#                 cloudinary.uploader.destroy(public_id)
#             if main_image:
#                 uploaded_avatar = cloudinary.uploader.upload(main_image, folder=f'user-avt/{journey.id}/',
#                                                              orverwrite=True)
#                 journey.main_image = uploaded_avatar['secure_url']
#                 journey.save()
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)

class JourneyRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = Journey.objects.all()
    serializer_class = serializers.JourneySerializer
    lookup_field = "id"

class LoginView(generics.GenericAPIView):
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        data = request.data
        username = data.get('username', '')
        password = data.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user:
            auth_token = jwt.encode(
                {'username': user.username}, settings.JWT_SECRET_KEY, algorithm="HS256")

            serializer = UserSerializer(user)

            data = {'user': serializer.data, 'token': auth_token}

            return Response(data, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)