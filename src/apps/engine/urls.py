from apps.engine import views
from django.shortcuts import render

# Create your views here.
from django.urls import path, re_path

urlpatterns = [
    path("engine/real_time", views.engine_real_time, name="engine"),
]
