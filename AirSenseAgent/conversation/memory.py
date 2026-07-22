"""Handles multi-turn state separately from logic."""
from typing import Dict, Any, List

class ConversationMemory:
    def __init__(self):
        self._history = {}
        
    def add_turn(self, context_id: str, role: str, message: str):
        if context_id not in self._history:
            self._history[context_id] = []
        self._history[context_id].append({"role": role, "message": message})
        
    def get_history(self, context_id: str) -> List[Dict[str, str]]:
        return self._history.get(context_id, [])
