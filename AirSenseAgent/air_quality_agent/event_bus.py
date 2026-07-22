"""Pub/Sub Event Bus for decoupled asynchronous-style component interactions."""
from typing import Callable, Dict, List, Any
import logging

class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}
        self.logger = logging.getLogger("EventBus")

    def subscribe(self, event_type: str, callback: Callable) -> None:
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)

    def publish(self, event_type: str, payload: Dict[str, Any] = None) -> None:
        if payload is None:
            payload = {}
        if event_type in self._subscribers:
            for callback in self._subscribers[event_type]:
                try:
                    callback(payload)
                except Exception as e:
                    self.logger.error(f"Error in EventBus subscriber for '{event_type}': {e}")
