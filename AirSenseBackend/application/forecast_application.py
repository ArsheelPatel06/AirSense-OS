import logging
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from services.forecast_service import ForecastService
from schemas.response.intelligence import ForecastResponse
from core.exceptions import NotFoundException

logger = logging.getLogger(__name__)

class ForecastApplication:
    """Orchestrates Forecast generation across caching and ML service boundaries."""
    
    def __init__(self, forecast_service: ForecastService):
        self.forecast_service = forecast_service

    async def get_multi_horizon_forecast(self, station_id: str) -> ForecastResponse:
        logger.info(f"Generating forecast for {station_id}")
        
        try:
            forecast = await self.forecast_service.get_forecast_for_station(station_id)
            if not forecast:
                raise NotFoundException(message=f"Forecast for station {station_id} could not be generated.")
            return forecast
            
        except Exception as e:
            logger.error(f"Error generating forecast: {e}")
            raise
