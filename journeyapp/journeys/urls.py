from django.urls import path, include
from rest_framework import routers
from . import views

# Main routers
router = routers.DefaultRouter()
router.register('journey', views.JourneyDetailViewSet, basename='journey_detail')
router.register('journeys', views.JourneyViewSet, basename='journeys')
router.register('user', views.UserViewSet, basename='user')
router.register('image_journey', views.ImageJourneyDetail, basename='image_journey')
router.register('tags', views.TagViewSet, basename='tags')



urlpatterns = [
    path('', include(router.urls)),

    path('journeys/<int:journey_id>/place_visits/',views.PlaceVisitViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('journeys/<int:id>/', views.JourneyRetrieveUpdateDestory.as_view(), name='journey_update'),
    path('comment/<int:id>', views.CommentRetrieveUpdateDestory.as_view(), name='update_comment'),
    path('place_visit/<int:id>', views.PlaceVisitRetrieveUpdateDestory.as_view(), name='update_place_visit'),
    path('join/<int:id>', views.JoinJourneyRetrieveUpdateDestory.as_view(), name='update_join'),
    path('register', views.UserRegisterView.as_view()),
    path('add_journey/', views.AddJourneyViewSet.as_view(),name='add-journey'),
    path('add_journey/<int:journey_id>/add_place_visit/', views.AddPlaceVisitView.as_view(), name='add_place_visit'),
    path('reports/', views.ReportCreateView.as_view(), name='report-create'),
    path('rating/', views.RatingCreateView.as_view(), name='rating-create'),
    path('messages/<str:chat_id>/', views.MessageList.as_view(), name='message-list'),
    path('chat/', views.ChatView.as_view(), name='chat'),
    path('admin/report-stats/', views.report_stats, name='admin_report_stats'),
    path('admin/user/<int:user_id>/reports/', views.user_report_details, name='admin_user_report_details'),
    path('admin/user/<int:user_id>/deactivate/', views.deactivate_user, name='admin_deactivate_user'),
    path('send_verification_email/<int:user_id>/', views.send_verification_email, name='send_verification_email'),
    path('reset/<uidb64>/<token>/', views.CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),

]
