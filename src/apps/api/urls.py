from django.urls import path

from apps.api import views

urlpatterns = [
    # crane data
    path('sensor_detection', views.index, name='sensor'),
    path("crane/real_time_data", views.CraneRealTime, name="crane"),
    path("crane/history_data/<str:info>", views.historicData, name="crane"),
    path("crane/timeline_data/<str:info>", views.TimelineData, name="crane"),
    # ship motion data
    path("ship_motion/real_time_data", views.ShipPositionRealTime, name="ship motion"),
    path('mqttrealfigure/<path:topic>', views.draw_data),
    # engine data
    path("engine/real_time_data", views.EngineRealTime, name="ship motion"),
    path("prediction/model1_data", views.prediction, name="crane"),
]
