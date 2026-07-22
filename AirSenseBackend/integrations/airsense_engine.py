import logging
from typing import Any, Dict

# This file is the ONLY place in the backend that is allowed to import from `airsense_agent`.
# If the AI engine is split into a microservice later, only this file changes.

try:
    from intelligence.models.factory import ModelFactory
    from intelligence.digital_twin.twin import DigitalTwin
    from intelligence.reasoning.insight_generator import InsightGenerator
    from intelligence.reasoning.scenario_simulator import ScenarioSimulator
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    logging.warning("airsense_agent package not found. AI integration will fail.")

class AirSenseEngineIntegration:
    """Gateway to the AirSense Agent AI internals."""
    
    def __init__(self):
        if not AI_AVAILABLE:
            raise RuntimeError("airsense_agent is not installed.")
        
        self.insight_generator = InsightGenerator()
        # self.twin = DigitalTwin(...)
        # self.model_factory = ModelFactory(...)
    
    def generate_insight(self, station_id: str, city: str, current_features: Dict[str, Any]) -> Any:
        return self.insight_generator.generate(
            station_id=station_id,
            city=city,
            aqi_current=current_features.get("aqi", 0),
            features=current_features
        )
