from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from dependencies.database import get_db_session
from dependencies.redis import get_redis
from dependencies.permissions import require_citizen
from dependencies.current_user import CurrentUser
from integrations.airsense_engine import AirSenseEngineIntegration
from services.forecast_service import ForecastService
from application.dashboard_application import DashboardApplication
from core.responses import APIResponse

router = APIRouter()

def get_dashboard_app(
    db: AsyncSession = Depends(get_db_session), 
    redis: Redis = Depends(get_redis)
) -> DashboardApplication:
    engine = AirSenseEngineIntegration()
    f_service = ForecastService(db=db, redis=redis, engine=engine)
    return DashboardApplication(forecast_service=f_service, db=db, redis=redis)

@router.get("/{station_id}", summary="Frontend Unified Dashboard")
async def get_dashboard(
    station_id: str,
    request: Request,
    app: DashboardApplication = Depends(get_dashboard_app),
    user: CurrentUser = Depends(require_citizen)
):
    """Retrieve all intelligence context (Live, Forecast, Alert, Insight) for a single station in one request."""
    data = await app.get_station_dashboard(station_id)
    return APIResponse.success(request_id=request.state.request_id, data=data)
