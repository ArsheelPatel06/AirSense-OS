from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket.connection_manager import manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/live-aqi/{station_id}")
async def websocket_endpoint(websocket: WebSocket, station_id: str):
    await manager.connect(websocket, station_id)
    try:
        while True:
            # Keep connection open and wait for incoming messages (e.g. pings/heartbeats)
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, station_id)
        logger.info(f"Client disconnected from station {station_id}")
    except Exception as e:
        manager.disconnect(websocket, station_id)
        logger.error(f"WebSocket error for station {station_id}: {e}")
