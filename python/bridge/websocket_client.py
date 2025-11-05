"""
WebSocket client for communicating with TypeScript Mineflayer bot
"""

import asyncio
import websockets
import json
import logging
from typing import Optional, Callable, Any
from datetime import datetime


class BridgeClient:
    """WebSocket client for Python ↔ TypeScript bridge"""
    
    def __init__(self, host: str = 'localhost', port: int = 8765):
        self.host = host
        self.port = port
        self.uri = f"ws://{host}:{port}"
        self.websocket: Optional[websockets.WebSocketClientProtocol] = None
        self.logger = logging.getLogger('BridgeClient')
        self.connected = False
        self.message_handlers: dict[str, Callable] = {}
        
    async def connect(self, timeout: int = 10) -> bool:
        """Connect to the TypeScript bridge"""
        try:
            self.logger.info(f"Connecting to bridge at {self.uri}...")
            self.websocket = await asyncio.wait_for(
                websockets.connect(self.uri),
                timeout=timeout
            )
            self.connected = True
            self.logger.info("Connected to bridge")
            
            # Start listening for messages
            asyncio.create_task(self._listen())
            return True
            
        except asyncio.TimeoutError:
            self.logger.error(f"Connection timeout after {timeout}s")
            return False
        except Exception as e:
            self.logger.error(f"Connection failed: {e}")
            return False
    
    async def disconnect(self):
        """Close the WebSocket connection"""
        if self.websocket:
            await self.websocket.close()
            self.connected = False
            self.logger.info("Disconnected from bridge")
    
    async def _listen(self):
        """Listen for incoming messages from TypeScript"""
        try:
            async for message in self.websocket:
                await self._handle_message(message)
        except websockets.exceptions.ConnectionClosed:
            self.logger.warning("Bridge connection closed")
            self.connected = False
        except Exception as e:
            self.logger.error(f"Error in listener: {e}")
            self.connected = False
    
    async def _handle_message(self, message: str):
        """Handle incoming message from bridge"""
        try:
            data = json.loads(message)
            msg_type = data.get('type')
            payload = data.get('payload')
            
            self.logger.debug(f"Received {msg_type}: {payload}")
            
            # Call registered handlers
            if msg_type in self.message_handlers:
                await self.message_handlers[msg_type](payload)
            
        except json.JSONDecodeError:
            self.logger.error(f"Invalid JSON received: {message}")
        except Exception as e:
            self.logger.error(f"Error handling message: {e}")
    
    def register_handler(self, message_type: str, handler: Callable):
        """Register a callback for specific message types"""
        self.message_handlers[message_type] = handler
    
    async def send_command(self, action: str, params: dict = None, command_id: str = None) -> str:
        """Send a command to the bot"""
        if not self.connected or not self.websocket:
            raise ConnectionError("Not connected to bridge")
        
        if command_id is None:
            command_id = f"{action}_{datetime.now().timestamp()}"
        
        message = {
            'type': 'command',
            'payload': {
                'id': command_id,
                'action': action,
                'params': params or {}
            },
            'timestamp': datetime.now().timestamp()
        }
        
        await self.websocket.send(json.dumps(message))
        self.logger.debug(f"Sent command: {action}")
        return command_id
    
    async def request_state(self):
        """Request current bot state"""
        await self.send_command('get_state')
    
    async def wait_for_result(self, command_id: str, timeout: int = 10) -> dict:
        """Wait for a command result (TODO: Implement properly with futures)"""
        # This is a placeholder - proper implementation would use asyncio.Future
        raise NotImplementedError("Result waiting not yet implemented")
