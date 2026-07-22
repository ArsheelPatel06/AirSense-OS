from pydantic import BaseModel, Field
from typing import Dict, Any

class ScenarioSimulationRequest(BaseModel):
    station_id: str
    changes: Dict[str, float] = Field(
        ..., 
        description="Dictionary of sensor reading modifications (e.g. {'wind_speed': 5.0, 'traffic_density': -0.2})"
    )
    forecast_horizon: str = Field("24h", description="Forecast duration, e.g. 24h, 48h, 72h")
