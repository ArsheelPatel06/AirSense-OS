import asyncio
import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)

# Frozen Event Topics
TOPIC_READING_RECEIVED = "reading.received"
TOPIC_FORECAST_COMPLETED = "forecast.completed"
TOPIC_INSIGHT_GENERATED = "insight.generated"
TOPIC_ALERT_CREATED = "alert.created"
TOPIC_NOTIFICATION_SENT = "notification.sent"
TOPIC_USER_LOGIN = "user.login"
TOPIC_MODEL_UPDATED = "model.updated"
TOPIC_WORKER_FAILED = "worker.failed"

class EventBus:
    """Simple async in-memory Pub/Sub Event Bus for decoupling backend tasks."""
    
    def __init__(self):
        self._subscribers: Dict[str, list] = {}

    def subscribe(self, event_type: str, callback: Any):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)
        logger.info(f"Subscribed to event: {event_type}")

    async def publish(self, event_type: str, payload: Any):
        if event_type in self._subscribers:
            for callback in self._subscribers[event_type]:
                try:
                    # Fire and forget (in the background)
                    asyncio.create_task(callback(payload))
                except Exception as e:
                    logger.error(f"Error executing callback for event {event_type}: {str(e)}")

# Global singleton
event_bus = EventBus()
