"""
Set the path to the cmini websocket
example: ws://localhost:8000/<path>
"""

from django.urls import path

from . import consumers

WEBSOCKET_URLPATTERNS = [
    path(r"cmini/", consumers.CminiConsumer.as_asgi())
]
