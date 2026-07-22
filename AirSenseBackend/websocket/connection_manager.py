import logging
from typing import Dict, List
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Maps station_id to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, station_id: str):
        await websocket.accept()
        if station_id not in self.active_connections:
            self.active_connections[station_id] = []
        self.active_connections[station_id].append(websocket)
        logger.info(f"WebSocket connected for station: {station_id}. Total: {len(self.active_connections[station_id])}")

    def disconnect(self, websocket: WebSocket, station_id: str):
        if station_id in self.active_connections:
            if websocket in self.active_connections[station_id]:
                self.active_connections[station_id].remove(websocket)
                logger.info(f"WebSocket disconnected for station: {station_id}. Remaining: {len(self.active_connections[station_id])}")
            if not self.active_connections[station_id]:
                del self.active_connections[station_id]

    async def broadcast_to_station(self, station_id: str, message: dict):
        if station_id in self.active_connections:
            disconnected_clients = []
            for connection in self.active_connections[station_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Failed to send message to client on station {station_id}: {e}")
                    disconnected_clients.append(connection)
            
            # Clean up broken connections
            for connection in disconnected_clients:
                self.disconnect(connection, station_id)

manager = ConnectionManager()

async def handle_reading_received(payload: dict):
    """
    Callback for the Event Bus.
    When a new reading is received, broadcast it to all WebSocket clients
    listening to the corresponding station.
    """
    station_id = payload.get("station_id")
    if station_id:
        # Wrap payload in the standard backend envelope format
        message = {
            "type": "reading.received",
            "data": payload
        }
        await manager.broadcast_to_station(station_id, message)
