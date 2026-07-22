"""Final arbiter of what action to take based on the Plan."""
from typing import Dict, Any

class DecisionEngine:
    def __init__(self):
        pass
        
    def decide(self, plan: Dict[str, Any], goal: str) -> Dict[str, Any]:
        """
        Takes the recommended plan and locks in the decision, 
        triggering the WorkflowEngine.
        """
        # Simulated logic
        decision = {
            "action": plan.get("selected_strategy", "None"),
            "approved": True,
            "justification": f"Aligns with primary goal: {goal}"
        }
        return decision
