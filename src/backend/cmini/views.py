"""
Django request handler
"""
from django.shortcuts import render
from django.http.request import HttpRequest
from django.http import HttpResponse

from .src.main import get_cmini_response

def send_cmini_response(request: HttpRequest):
    default_command = "!cmini help"
    command: str = request.POST.get("command", default_command)
    response: str = get_cmini_response(command)
    return HttpResponse(response)
