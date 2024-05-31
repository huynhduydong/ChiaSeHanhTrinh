import cloudinary
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
from rest_framework import generics, viewsets, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib import auth
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from journeys import serializers, perms
from journeys.models import Journey, User, Comment, JoinJourney, PlaceVisit, ImageJourney, CommentImageJourney, Report
import jwt
from django.conf import settings
from journeys.serializers import UserSerializer, UpdateJourneySerializer, PlaceVisitSerializer, \
    CommentImageJourneySerializer, ReportSerializer, LogoutSerializer, ActiveUserSerializer, LoginSerializer, \
    RefreshTokenSerializer, ForgotPasswordSerializer, SendResetPasswordLinkSerializer, SendOTPSerializer, \
    ResetPasswordSerializer, UserRegisterSerializer


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
                # 'main_image': journey.main_image.url,
                'updated_date': journey.updated_date,
                'comments_count': comments_count,
                'join_count': join_count
            })
        return Response(data, status=status.HTTP_200_OK)


class JourneyDetailViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    # queryset = Journey.objects.all()
    queryset = Journey.objects.prefetch_related('tags').filter(active=True)

    serializer_class = serializers.JourneyDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['get_comments', 'get_join_journey','image']:
            return [permissions.IsAuthenticated()]

        return self.permission_classes
    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().comment_set.select_related('user').all()
            return Response(serializers.CommentSerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            # fixed_user = User.objects.get(pk=3)  # gán cứng user
            c = Comment.objects.create(user = request.user, journey=self.get_object(), cmt=request.data.get('cmt'))
            # user = request.user,
            return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'post'], url_path='join', detail=True)
    def get_join_journey(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().joinjourney_set.select_related('user').all()
            return Response(serializers.JoinJourneySerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = JoinJourney.objects.create(user = request.user, journey=self.get_object())
            return Response(serializers.JoinJourneySerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'post'], url_path='image', detail=True)
    def image(self, request, pk):
        if request.method == 'GET':
            image = self.get_object().imagejourney_set.select_related('user').all()
            return Response(serializers.ImageJourneySerializer(image, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = ImageJourney.objects.create(user = request.user, journey=self.get_object(), image=request.data.get('image'),content=request.data.get('content'))
            return Response(serializers.ImageJourneySerializer(c).data, status=status.HTTP_201_CREATED)



class UserViewSet(ViewSet, GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()
    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def toggle_active(self, request, pk=None):
        try:
            user = self.get_object()
            user.is_active = not user.is_active
            user.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=["get"], url_path="current", detail=False, serializer_class=UserSerializer)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    @action(methods=["post"], url_path="login", detail=False, permission_classes=[AllowAny],
            serializer_class=LoginSerializer)
    def login(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(username=serializer.validated_data['username'],
                            password=serializer.validated_data['password'])
        if user:
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], url_path="refresh-token", detail=False, permission_classes=[AllowAny],
            serializer_class=RefreshTokenSerializer)
    def refresh_token(self, request):
        # Implement refresh token logic here
        pass

    @action(methods=["post"], url_path="forgot-password", detail=False, permission_classes=[AllowAny],
            serializer_class=ForgotPasswordSerializer)
    def forgot_password(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Implement forgot password logic here
        pass

    @action(methods=["post"], url_path="email", detail=False, permission_classes=[AllowAny],
            serializer_class=SendResetPasswordLinkSerializer)
    def send_reset_password_link(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Implement send reset password link logic here
        pass

    @action(methods=["get", "post"], url_path="password", detail=False, permission_classes=[AllowAny],
            serializer_class=ResetPasswordSerializer)
    def reset_password(self, request):
        if request.method == "GET":
            return self.get_reset_password_form(request)
        elif request.method == "POST":
            return self.post_reset_password(request)

    def get_reset_password_form(self, request):
        # Implement get reset password form logic here
        pass

    def post_reset_password(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Implement post reset password logic here
        pass

    @action(methods=["post"], url_path="logout", detail=False, permission_classes=[IsAuthenticated],
            serializer_class=LogoutSerializer)
    def logout(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Implement logout logic here
        pass


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.OwnerAuthenticated]


class JoinJourneyRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = JoinJourney.objects.all()
    serializer_class = serializers.JoinJourneySerializer
    lookup_field = "id"


class ImageJourneyDetail(viewsets.ViewSet, generics.RetrieveUpdateDestroyAPIView):
    # queryset = Journey.objects.all()
    queryset = ImageJourney.objects.filter(active=True)
    serializer_class = serializers.ImageJourneySerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['get_comment']:
            return [permissions.IsAuthenticated()]

        return self.permission_classes
    @action(methods=['get', 'post'], url_path='comment', detail=True)
    def get_comment(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().comments.select_related('user').all()
            return Response(serializers.CommentImageJourneySerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = CommentImageJourney.objects.create(user=request.user, imagejourney=self.get_object(),cmt=request.data.get('cmt'))
            return Response(serializers.CommentImageJourneySerializer(c).data, status=status.HTTP_201_CREATED)



class CommentRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    lookup_field = "id"

class PlaceVisitViewSet(viewsets.ModelViewSet):
    queryset = PlaceVisit.objects.all()
    serializer_class = serializers.PlaceVisitSerializer

    def get_queryset(self):
        journey_id = self.kwargs['journey_id']
        return PlaceVisit.objects.filter(journey_id=journey_id)

    def perform_create(self, serializer):
        journey_id = self.kwargs['journey_id']
        journey = Journey.objects.get(id=journey_id)
        serializer.save(journey=journey)

class JourneyRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = Journey.objects.all()
    serializer_class = serializers.JourneySerializer
    lookup_field = "id"
    def get_place_visits(self, request, *args, **kwargs):
        journey = self.get_object()
        place_visits = PlaceVisit.objects.filter(journey=journey)
        serializer = PlaceVisitSerializer(place_visits, many=True)
        return Response(serializer.data)

    def post_place_visit(self, request, *args, **kwargs):
        journey = self.get_object()
        serializer = PlaceVisitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(journey=journey)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaceVisitRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlaceVisit.objects.all()
    serializer_class = serializers.PlaceVisitSerializer
    lookup_field = "id"


class ReportCreateView(generics.CreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)



# class LoginView(generics.GenericAPIView):
#     serializer_class = serializers.LoginSerializer
#
#
#     def post(self, request):
#         data = request.data
#         username = data.get('username', '')
#         password = data.get('password', '')
#         user = auth.authenticate(username=username, password=password)
#         if user:
#             auth_token = jwt.encode(
#                 {'username': user.username}, settings.JWT_SECRET_KEY, algorithm="HS256")
#
#             serializer = UserSerializer(user)
#
#             data = {'user': serializer.data, 'token': auth_token}
#
#             return Response(data, status=status.HTTP_200_OK)
#
#         return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)