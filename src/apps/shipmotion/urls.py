from apps.shipmotion import views
from django.shortcuts import render

# Create your views here.
from django.urls import path, re_path

urlpatterns = [
    # The home page
    path("ship_motion/real_time", views.ship_motion_real_time, name="ship motion"),
    path("ship_motion/real_time_2", views.ship_motion_real_time_2, name="ship motion")  
]
