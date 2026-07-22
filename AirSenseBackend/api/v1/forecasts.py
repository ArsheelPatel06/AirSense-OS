from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from dependencies.database import get_db_session
from dependencies.redis import get_redis
from dependencies.permissions import require_analyst
from dependencies.current_user import CurrentUser
from integrations.airsense_engine import AirSenseEngineIntegration
from services.forecast_service import ForecastService
from application.forecast_application import ForecastApplication
from core.responses import APIResponse

router = APIRouter()

# Dependency factory for the Application
def get_forecast_app(
    db: AsyncSession = Depends(get_db_session), 
    redis: Redis = Depends(get_redis)
) -> ForecastApplication:
    # In a real DI container this is much cleaner, but manual injection suffices here
    engine = AirSenseEngineIntegration()
    service = ForecastService(db=db, redis=redis, engine=engine)
    return ForecastApplication(forecast_service=service)

@router.get("/{station_id}", summary="Get Multi-Horizon Forecast")
async def get_forecast(
    station_id: str,
    request: Request,
    app: ForecastApplication = Depends(get_forecast_app),
    user: CurrentUser = Depends(require_analyst)
):
    """Retrieve 24-72h AQI forecasts for a specific station. Requires Analyst role."""
    data = await app.get_multi_horizon_forecast(station_id)
    
    # Simulate adding AI metadata as requested
    meta = {
        "model": {
            "name": "aqi_forecast_lightgbm",
            "version": "1.4.2",
            "confidence": 0.91
        }
    }
    
    return APIResponse.success(
        request_id=request.state.request_id,
        data=data.model_dump(),
        meta=meta
    )
