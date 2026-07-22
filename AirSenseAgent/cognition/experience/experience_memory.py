"""Stores the context, decision, outcome, and reward for future Learning (RL)."""
from typing import Dict, Any

class ExperienceMemory:
    def __init__(self):
        self.experiences = []
        
    def store(self, context: Any, decision: Dict[str, Any], reflection: Dict[str, Any]):
        """Saves the complete cycle into the memory bank for future optimization."""
        self.experiences.append({
            "state_context": context,
            "action_taken": decision,
            "outcome_reflection": reflection,
            "reward": 1.0 if reflection.get("was_successful") else -1.0
        })
