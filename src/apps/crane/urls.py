from apps.crane import views
from django.shortcuts import render

# Create your views here.
from django.urls import path, re_path

urlpatterns = [
    # The home page
    path("crane/control", views.crane_control, name="crane"),
    path("crane/real_time", views.crane_real_time, name="crane"),
    path("crane/history", views.crane_history, name="crane"),
]
