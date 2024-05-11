from django.urls import path, include

from hanhtrinh import views

urlpatterns = [
    path('', views.index, name="index")
]