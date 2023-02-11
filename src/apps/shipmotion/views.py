from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse


def ship_motion_real_time(request):
    context = {"segment": "index"}
    html_template = loader.get_template("ship_motion/real_time.html")
    return HttpResponse(html_template.render(context, request))

def ship_motion_real_time_2(request):
    context = {"segment": "index"}
    html_template = loader.get_template("ship_motion/shipmotion2.html")
    return HttpResponse(html_template.render(context, request))