from django.contrib.auth import authenticate
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.parsers import MultiPartParser, FormParser

from journeys import serializers, perms
from journeys.models import *
from journeys.serializers import UserSerializer, PlaceVisitSerializer, ReportSerializer, LoginSerializer, \
    UserRegisterSerializer, UserProfileSerializer, TagSerializer, RatingSerializer


class AddJourneyViewSet(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.AddJourneySerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = serializers.AddJourneySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            journey = serializer.save()
            ActivityLog.objects.create(
                user=request.user,
                activity_type='create_journey',
                description=f'Created journey: {journey.name}'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TagViewSet(viewsets.ViewSet,generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer


class JourneyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Journey.objects.all()
    serializer_class = serializers.JourneySerializer

    def get_queryset(self):
        return Journey.objects.active()

    def get_permissions(self):
        if self.action in ['journeys']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'])
    def search(self, request):
        queryset = self.get_queryset()
        keyword = request.query_params.get('keyword', None)
        tags = request.query_params.getlist('tags', None)
        username = request.query_params.get('username', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        place_name = request.query_params.get('place_name', None)

        if keyword:
            queryset = queryset.search_by_keyword(keyword)
        if tags:
            queryset = queryset.filter_by_tags(tags)
        if username:
            queryset = queryset.filter_by_username(username)
        if start_date and end_date:
            queryset = queryset.filter_by_end_date_range(start_date, end_date)
        if place_name:
            queryset = queryset.search_by_place_name(place_name)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(url_path='journey_by_user', detail=False, methods=['get'])
    def journeys(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        journeys = Journey.objects.filter(user_journey=user)
        data = []
        for journey in journeys:
            comments_count = Comment.objects.filter(journey=journey).count()
            join_count = JoinJourney.objects.filter(journey=journey).count()
            data.append({
                'id': journey.id,
                'name': journey.name,
                'created_date': journey.created_date,
                'updated_date': journey.updated_date,
                'main_image': journey.main_image.url,
                'comments_count': comments_count,
                'join_count': join_count
            })
        return Response(data, status=status.HTTP_200_OK)

    @action(url_path='joined_journeys', detail=False, methods=['get'])
    def joined_journeys(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        joined_journey_ids = JoinJourney.objects.filter(user=user).values_list('journey_id', flat=True)
        journeys = Journey.objects.filter(id__in=joined_journey_ids)
        serializer = self.get_serializer(journeys, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JourneyDetailViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Journey.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.JourneyDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['get_comments', 'get_join_journey', 'image', 'complete', 'close_comments'] and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        journey = self.get_object()
        if journey.user_journey != request.user:
            return Response({'error': 'You do not have permission to complete this journey.'}, status=403)

        journey.is_completed = True
        journey.save()
        return Response({'status': 'Journey marked as completed.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def close_comments(self, request, pk=None):
        journey = self.get_object()
        if journey.user_journey != request.user:
            return Response({'error': 'You do not have permission to closed comments this journey.'}, status=403)

        journey.comments_closed = True
        journey.save()
        return Response({'status': 'Journey closed comments .'})

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().comment_set.filter(is_deleted=False).select_related('user').all()
            return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = Comment.objects.create(user=request.user, journey=self.get_object(), cmt=request.data.get('cmt'))

            # Ghi lại hoạt động thêm bình luận
            ActivityLog.objects.create(
                user=request.user,
                activity_type='add_comment',
                description=f'Commented on journey {self.get_object().name}: {c.cmt}'
            )

            return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'post'], url_path='join', detail=True)
    def get_join_journey(self, request, pk):
        journey = self.get_object()

        if request.method == 'GET':
            join_requests = journey.joinjourney_set.select_related('user').all()
            return Response(serializers.JoinJourneySerializer(join_requests, many=True).data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            if journey.user_journey != request.user:
                return Response({'detail': 'Chỉ chủ sở hữu của hành trình mới có thể duyệt yêu cầu tham gia.'},
                                status=status.HTTP_403_FORBIDDEN)

            user_id = request.data.get('user_id')
            if not user_id:
                return Response({'detail': 'user_id là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

            user_to_join = User.objects.get(pk=user_id)
            c = JoinJourney.objects.create(user=user_to_join, journey=journey)

            ActivityLog.objects.create(
                user=request.user,
                activity_type='join_journey',
                description=f'Duyệt cho {user_to_join.username} tham gia hành trình {journey.name}'
            )

            return Response(serializers.JoinJourneySerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'post'], url_path='image', detail=True)
    def image(self, request, pk):
        journey = self.get_object()

        if request.method == 'GET':
            image = self.get_object().imagejourney_set.select_related('user').all()
            return Response(serializers.ImageJourneySerializer(image, many=True).data, status=status.HTTP_200_OK)
        elif request.method == 'POST':
            if journey.user_journey != request.user and not journey.joinjourney_set.filter(user=request.user).exists():
                return Response({
                                    'detail': 'Chỉ chủ sở hữu hoặc người đã được chấp nhận tham gia hành trình mới có thể thêm hình ảnh.'},
                                status=status.HTTP_403_FORBIDDEN)
            c = ImageJourney.objects.create(user=request.user, journey=self.get_object(),
                                            image=request.data.get('image'), content=request.data.get('content'))

            ActivityLog.objects.create(
                user=request.user,
                activity_type='add_image',
                description=f'Added image to journey {journey.name}'
            )

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

    @action(methods=['get'], url_path='current-user', url_name='current-user', detail=False)
    def current_user(self, request):
        return Response(UserSerializer(request.user).data)

    @action(methods=['get'], detail=True, url_path='profile_user', url_name='profile_user')
    def profile_user(self, request, pk=None):
        try:
            user = self.get_object()
            return Response(UserProfileSerializer(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    @action(methods=['get', 'patch'], detail=False, url_path='current_user_profile', url_name='current_user_profile')
    def current_user_profile(self, request):
        user = request.user
        if request.method == "GET":
            try:
                return Response(UserProfileSerializer(user).data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        elif request.method == "PATCH":
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], url_path="login", detail=False, permission_classes=[AllowAny],
            serializer_class=LoginSerializer)
    def login(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(username=serializer.validated_data['username'],
                            password=serializer.validated_data['password'])
        if user:
            # Ghi lại hoạt động đăng nhập
            ActivityLog.objects.create(
                user=user,
                activity_type='login',
                description='User logged in'
            )
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def activity_log(self, request):
        user = request.user
        activities = ActivityLog.objects.filter(user=user).order_by('-timestamp')
        serializer = serializers.ActivityLogSerializer(activities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
    queryset = ImageJourney.objects.filter(active=True)
    serializer_class = serializers.ImageJourneySerializer

    def get_permissions(self):
        if self.action in ['get_comment'] and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get', 'post'], url_path='comment', detail=True)
    def get_comment(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().comments.select_related('user').all()
            return Response(serializers.CommentImageJourneySerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = CommentImageJourney.objects.create(user=request.user, imagejourney=self.get_object(),
                                                   cmt=request.data.get('cmt'))

            # Ghi lại hoạt động thêm bình luận vào hình ảnh
            ActivityLog.objects.create(
                user=request.user,
                activity_type='add_image_comment',
                description=f'Commented on image in journey {self.get_object().journey.name}'
            )

            return Response(serializers.CommentImageJourneySerializer(c).data, status=status.HTTP_201_CREATED)


class IsOwnerOrJourneyOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or obj.journey.user_journey == request.user


class CommentRetrieveUpdateDestory(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    lookup_field = "id"
    permission_classes = [IsOwnerOrJourneyOwnerOrReadOnly]
    def perform_update(self, serializer):
        # Kiểm tra nếu user hiện tại là chủ sở hữu của bình luận
        comment = self.get_object()
        if comment.user != self.request.user:
            raise PermissionDenied("Bạn không có quyền cập nhật bình luận này.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user and instance.journey.user_journey != self.request.user:
            raise PermissionDenied("Bạn không có quyền xóa bình luận này.")
        instance.is_deleted = True
        instance.save()
        ActivityLog.objects.create(
            user=self.request.user,
            activity_type='delete_comment',
            description=f'Deleted comment: {instance.cmt}'
        )

class AddPlaceVisitView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = PlaceVisitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(journey_id=kwargs['journey_id'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

        # Ghi lại hoạt động thêm điểm đến
        ActivityLog.objects.create(
            user=self.request.user,
            activity_type='add_place_visit',
            description=f'Added place visit to journey: {journey.name}'
        )


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

        # # Ghi lại hoạt động báo cáo
        # ActivityLog.objects.create(
        #     user=self.request.user,
        #     activity_type='create_report',
        #     description=f'Reported user: {serializer.validated_data["user"].name}'
        # )


class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        rating = serializer.save(user=self.request.user)
        ActivityLog.objects.create(
            user=self.request.user,
            activity_type='Rating',
            description=f'User {self.request.user.username} rated Journey {rating.journey.name} with a score of {rating.rate}'
        )

