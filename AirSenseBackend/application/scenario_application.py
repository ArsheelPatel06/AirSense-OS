import logging
from schemas.request.scenario import ScenarioSimulationRequest
from schemas.response.intelligence import ScenarioResponse
from core.exceptions import ValidationException

logger = logging.getLogger(__name__)

class ScenarioApplication:
    def __init__(self):
        pass

    async def simulate_scenario(self, payload: ScenarioSimulationRequest) -> ScenarioResponse:
        logger.info(f"Simulating scenario for station {payload.station_id} with changes: {payload.changes}")
        
        # Validations
        if not payload.changes:
            raise ValidationException(message="Changes dictionary cannot be empty.")
        
        # Simulate base forecast prediction and the modified variant delta
        # Usually connects to ScenarioSimulator inside airsense_agent
        base_aqi = 150.0
        
        # Simple impact model mapping logic
        delta = 0.0
        if "wind_speed" in payload.changes:
            # High wind speed disperses pollutants, lowering AQI
            delta -= payload.changes["wind_speed"] * 4.5
        if "traffic_density" in payload.changes:
            # High traffic density increases emissions
            delta += payload.changes["traffic_density"] * 60.0
            
        modified_aqi = max(0.0, base_aqi + delta)
        delta_pct = (delta / base_aqi) * 100.0 if base_aqi > 0 else 0.0
        
        interpretation = "Improvement in air quality due to increased wind dispersion." if delta < 0 else "Deterioration in air quality."
        
        return ScenarioResponse(
            scenario_name=f"Custom Scenario ({payload.forecast_horizon})",
            base_prediction=base_aqi,
            modified_prediction=modified_aqi,
            delta=delta,
            delta_pct=delta_pct,
            interpretation=interpretation
        )
