from apps.prediction import views
from django.shortcuts import render

# Create your views here.
from django.urls import path, re_path

urlpatterns = [
    # The home page
    path("prediction", views.prediction, name="prediction"),
]
