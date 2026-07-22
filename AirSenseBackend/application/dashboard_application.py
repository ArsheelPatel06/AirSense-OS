import logging
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
import asyncio

from services.forecast_service import ForecastService
# from services.provider_service import ProviderService
# from services.alert_service import AlertService
from schemas.response.intelligence import ForecastResponse, AlertResponse
from core.exceptions import NotFoundException

logger = logging.getLogger(__name__)

class DashboardApplication:
    """Orchestrates the frontend-friendly mega-endpoint returning all station intelligence."""
    
    def __init__(self, forecast_service: ForecastService, db: AsyncSession, redis: Redis):
        self.forecast_service = forecast_service
        self.db = db
        self.redis = redis

    async def get_station_dashboard(self, station_id: str) -> dict:
        logger.info(f"Generating dashboard payload for {station_id}")
        
        # In a full implementation, you'd run these concurrently using asyncio.gather
        
        try:
            forecast = await self.forecast_service.get_forecast_for_station(station_id)
            
            # Mocking other services for now until implemented
            live_aqi = {"aqi": 184, "category": "Poor", "pm25": 112.5}
            active_alert = AlertResponse(
                level="red", title="CRITICAL AQI Alert", 
                message="Deteriorating conditions", aqi_current=184, issued_at="2026-07-22T00:00:00Z"
            )
            insight = {"top_cause": "Temperature Inversion", "confidence": 88.0}
            
            return {
                "station_id": station_id,
                "live": live_aqi,
                "forecast": forecast.model_dump(),
                "alert": active_alert.model_dump(),
                "insight": insight,
                "trend": "deteriorating"
            }
        except Exception as e:
            logger.error(f"Failed to generate dashboard for {station_id}: {e}")
            raise
