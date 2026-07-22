"""Tracks physical resources available for interventions."""
from typing import Dict, Any, List

class ResourceManager:
    def __init__(self):
        # Simulated database of assets
        self.available_officers = 12
        self.available_drones = 2
        self.water_cannons = 1
        
    def query_availability(self, resource_type: str) -> int:
        if resource_type == "drone":
            return self.available_drones
        if resource_type == "officer":
            return self.available_officers
        return 0
        
    def allocate(self, resource_type: str) -> bool:
        """Attempts to lock a resource for a workflow."""
        if self.query_availability(resource_type) > 0:
            if resource_type == "drone": self.available_drones -= 1
            if resource_type == "officer": self.available_officers -= 1
            return True
        return False
