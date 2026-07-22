"""Maintains the government audit trail of executed workflows."""
from typing import Dict, Any
from datetime import datetime

class ExecutionTracker:
    def __init__(self):
        self.ledger = []
        
    def log_execution(self, workflow_id: str, task: str, status: str, duration_sec: int):
        self.ledger.append({
            "workflow_id": workflow_id,
            "task": task,
            "started": datetime.utcnow().isoformat(),
            "status": status,  # Success, Failure, In_Progress
            "duration": duration_sec
        })
