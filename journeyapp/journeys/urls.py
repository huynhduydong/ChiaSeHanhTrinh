from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('journeys', views.JourneyDetailViewSet, basename='journey_detail')
router.register('journeys', views.JourneyViewSet, basename='journeys')
router.register('user', views.UserViewSet, basename='user')



urlpatterns = [
    path('', include(router.urls)),
    path('journeys/<int:id>', views.JourneyRetrieveUpdateDestory.as_view(),name='update'),
    path('comment/<int:id>',  views.CommentRetrieveUpdateDestory.as_view(),name='update_comment'),
    path('register', views.RegisterViewSet.as_view()),
    path('login', views.LoginView.as_view()),

]
