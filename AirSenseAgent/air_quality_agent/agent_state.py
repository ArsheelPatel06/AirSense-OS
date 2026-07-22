"""In-memory AgentState object for fast, cycle-to-cycle persistence."""
from typing import Dict, Any, List, Optional
from datetime import datetime

class AgentState:
    def __init__(self):
        self.current_cycle_id: Optional[str] = None
        self.active_models: Dict[str, str] = {}
        self.active_alerts: List[str] = []
        self.running_strategy: str = "rule_based"
        self.last_decision: Optional[Dict[str, Any]] = None
        self.runtime_statistics: Dict[str, Any] = {
            "total_cycles": 0,
            "average_latency_ms": 0.0,
            "last_error": None
        }
        self.last_observation: Optional[Dict[str, Any]] = None
        self.started_at: datetime = datetime.utcnow()
        
        # Phase 5: Cognitive Operations
        self.current_city: str = "Unknown"
        self.current_incident: Optional[str] = None
        self.current_priority: str = "Routine"
        self.current_mode: str = "Monitoring"  # Monitoring, Prediction, Investigation, Emergency, Maintenance, Simulation
        self.current_mission: Optional[str] = None
        self.current_strategy: Optional[str] = None
        self.current_goal: Optional[str] = None
        self.current_alert_level: str = "Normal"
        self.recent_failures: List[str] = []
        self.recent_successes: List[str] = []

    def update(self, **kwargs) -> None:
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
                
    def increment_cycle_count(self) -> None:
        self.runtime_statistics["total_cycles"] += 1
