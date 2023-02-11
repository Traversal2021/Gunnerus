# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse


#@login_required(login_url="/crane/control")
def crane_control(request):
    context = {"segment": "index"}
    html_template = loader.get_template("crane/crane_control.html")
    return HttpResponse(html_template.render(context, request))


#@login_required(login_url="/crane/real_time")
def crane_real_time(request):
    context = {"segment": "index"}
    html_template = loader.get_template("crane/crane_real_time.html")
    return HttpResponse(html_template.render(context, request))


#@login_required(login_url="/crane/history")
def crane_history(request):
    context = {"segment": "index"}
    html_template = loader.get_template("crane/crane_history.html")
    return HttpResponse(html_template.render(context, request))
