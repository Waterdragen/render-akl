"""
URL configuration
- always end url with forward slash
"""

from django.urls import path
from . import views

urlpatterns = [
    path("commands/", views.send_cmini_response)
]
