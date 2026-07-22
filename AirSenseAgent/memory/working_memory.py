"""Working Memory representing current short-term state and immediate context."""
from typing import Dict, Any, List, Optional
import time

class WorkingMemory:
    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self.current_observation: Optional[Dict[str, Any]] = None
        self.recent_history: List[Dict[str, Any]] = []
        self._last_update_time: float = 0.0

    def update_observation(self, observation: Dict[str, Any]) -> None:
        self.current_observation = observation
        self._last_update_time = time.time()
        self.recent_history.append(observation)
        if len(self.recent_history) > 10:
            self.recent_history.pop(0)

    def get_current_state(self) -> Optional[Dict[str, Any]]:
        if time.time() - self._last_update_time > self.ttl_seconds:
            return None
        return self.current_observation
        
    def get_delta(self, field: str) -> float:
        if len(self.recent_history) < 2:
            return 0.0
        current = self.recent_history[-1].get(field, 0.0)
        previous = self.recent_history[-2].get(field, 0.0)
        try:
            return float(current) - float(previous)
        except (ValueError, TypeError):
            return 0.0
