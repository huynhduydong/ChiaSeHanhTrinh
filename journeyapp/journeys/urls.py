from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('journeys', views.JourneyViewSet, basename='journeys')
#router.register('journeys/<int: id>', views.JourneyViewSet.journey_detail, basename='journeys')
router.register('user', views.UserViewSet, basename='user')
# router.register('addjourney', views.AddJourneyViewSet, basename='addjourney')


urlpatterns = [
    path('', include(router.urls)),
    path('journeys/<int:id>', views.JourneyRetrieveUpdateDestory.as_view(),name='update'),
    path('register', views.RegisterViewSet.as_view()),
    path('login', views.LoginView.as_view()),

]
