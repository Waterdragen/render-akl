"""
Defines what the server side should do after connection
"""

from channels.generic.websocket import AsyncWebsocketConsumer
from .src.main import get_cmini_response
import logging
import traceback

class CminiConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data: str = None, bytes_data=None):
        try:
            cmini_response = get_cmini_response(text_data)
        except Exception as e:
            traceback.print_exc()
            return
        if cmini_response is None:
            return
        await self.send(text_data=get_cmini_response(text_data))

    async def disconnect(self, code):
        pass

