"""Simplified Memory API for the Orchestration Pipeline."""
from typing import Dict, Any, List, Optional
from .memory import MemoryLayer

class MemoryManager:
    """
    Facade hiding the complexity of the 4 underlying memory systems from the pipeline.
    """
    def __init__(self):
        self._memory = MemoryLayer()
        
    def update_observation(self, observation: Dict[str, Any]) -> None:
        """Stores the immediate transient sensor data."""
        self._memory.working.update_observation(observation)
        
    def get_current_context(self) -> Optional[Dict[str, Any]]:
        """Retrieves the unified current working state."""
        return self._memory.working.get_current_state()
        
    def get_delta(self, field: str) -> float:
        """Calculates instantaneous change in a field."""
        return self._memory.working.get_delta(field)

    def store_episode(self, state: Dict[str, Any], action: Dict[str, Any], reward: float, next_state: Dict[str, Any] = None) -> None:
        """Records a full cycle for RL and Reflection."""
        self._memory.episodic.record_episode(state, action, reward, next_state)
        
    def get_recent_episodes(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieves episodes for reflection/learning."""
        return self._memory.episodic.retrieve_recent(limit)

    def retrieve_knowledge(self, category: str, key: str = None) -> Any:
        """Queries immutable domain rules (e.g. max_fan_rpm, AQI bands)."""
        return self._memory.semantic.get_fact(category, key)

    def save_long_term_action(self, action_data: Dict[str, Any]) -> None:
        """Persists a final decision to the database."""
        self._memory.long_term.store_action(action_data)
        
    def close(self):
        self._memory.close()
