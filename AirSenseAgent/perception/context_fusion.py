"""Fuses contextual data streams (weather, traffic, space) into the Environmental Context."""
from typing import Dict, Any
from .schemas import UnifiedObservation

class ContextFusionEngine:
    """
    Combines external metadata to build the 'world state' around the physical sensors.
    """
    def __init__(self):
        pass

    def build_context(self, observation: UnifiedObservation) -> Dict[str, Any]:
        """Merges contextual dimensions."""
        context = {}
        
        # Merge weather
        if observation.weather:
            context.update({f"weather_{k}": v for k, v in observation.weather.items()})
            
        # Merge traffic
        if observation.traffic:
            context.update({f"traffic_{k}": v for k, v in observation.traffic.items()})
            
        # Merge spatial/satellite
        if observation.satellite:
            context.update({f"satellite_{k}": v for k, v in observation.satellite.items()})
            
        # Merge citizen intelligence
        if observation.citizen:
            context.update({f"citizen_{k}": v for k, v in observation.citizen.items()})
            
        # Merge drone intelligence
        if observation.drone:
            context.update({f"drone_{k}": v for k, v in observation.drone.items()})
            
        return context
