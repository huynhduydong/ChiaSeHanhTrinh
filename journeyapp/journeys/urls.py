from django.urls import path, include
from rest_framework import routers
from rest_framework_nested import routers as nested_routers
from . import views

# Main routers
router = routers.DefaultRouter()
router.register('journey', views.JourneyDetailViewSet, basename='journey_detail')
router.register('journeys', views.JourneyViewSet, basename='journeys')
router.register('user', views.UserViewSet, basename='user')
router.register('image_journey', views.ImageJourneyDetail, basename='image_journey')


urlpatterns = [
    path('', include(router.urls)),

    path('journeys/<int:journey_id>/place_visits/',views.PlaceVisitViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('journeys/<int:id>/', views.JourneyRetrieveUpdateDestory.as_view(), name='journey_update'),
    path('comment/<int:id>', views.CommentRetrieveUpdateDestory.as_view(), name='update_comment'),
    path('place_visit/<int:id>', views.PlaceVisitRetrieveUpdateDestory.as_view(), name='update_place_visit'),
    path('join/<int:id>', views.JoinJourneyRetrieveUpdateDestory.as_view(), name='update_join'),
    path('register', views.RegisterViewSet.as_view()),
    path('login', views.LoginView.as_view()),
    path('reports/', views.ReportCreateView.as_view(), name='report-create'),

]
