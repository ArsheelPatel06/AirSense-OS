"""Episodic Memory representing a sequence of events for online learning and reflection."""
from typing import Dict, Any, List
from collections import deque
from config.training_config import EXPERIENCE_BUFFER_SIZE

class EpisodicMemory:
    def __init__(self, max_size: int = EXPERIENCE_BUFFER_SIZE):
        self.buffer: deque = deque(maxlen=max_size)

    def record_episode(self, state: Dict[str, Any], action: Dict[str, Any], reward: float, next_state: Dict[str, Any] = None) -> None:
        episode = {
            "state": state,
            "action": action,
            "reward": reward,
            "next_state": next_state
        }
        self.buffer.append(episode)

    def retrieve_recent(self, limit: int = 10) -> List[Dict[str, Any]]:
        return list(self.buffer)[-limit:]

    def get_all(self) -> List[Dict[str, Any]]:
        return list(self.buffer)
        
    def clear(self) -> None:
        self.buffer.clear()
