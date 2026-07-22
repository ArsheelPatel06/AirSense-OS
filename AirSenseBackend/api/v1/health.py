from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from dependencies.database import get_db_session
from dependencies.redis import get_redis
from application.health_application import HealthApplication
from core.responses import APIResponse

router = APIRouter()

def get_health_app(db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    return HealthApplication(db, redis)

@router.get("/health", summary="Application Health", tags=["System"])
async def check_health(request: Request, app: HealthApplication = Depends(get_health_app)):
    data = await app.get_health()
    return APIResponse.success(request_id=request.state.request_id, data=data)

@router.get("/live", summary="Liveness Probe", tags=["System"])
async def check_liveness(request: Request, app: HealthApplication = Depends(get_health_app)):
    data = await app.get_liveness()
    return APIResponse.success(request_id=request.state.request_id, data=data)

@router.get("/ready", summary="Readiness Probe", tags=["System"])
async def check_readiness(request: Request, app: HealthApplication = Depends(get_health_app)):
    data = await app.get_readiness()
    status_code = 200 if data["status"] == "ready" else 503
    
    if status_code == 200:
        return APIResponse.success(request_id=request.state.request_id, data=data)
    else:
        return APIResponse.error(
            request_id=request.state.request_id, 
            code="SERVICE_UNAVAILABLE", 
            message="One or more critical dependencies are down.",
            details=data,
            status_code=503
        )
