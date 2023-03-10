# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse


#@login_required(login_url="/login/")

def frontPage(request):
    context = {"segment": "index"}
    html_template = loader.get_template("home/front_page.html")
    return HttpResponse(html_template.render(context, request))

