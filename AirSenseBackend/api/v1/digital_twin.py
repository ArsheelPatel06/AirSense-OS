from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from dependencies.database import get_db_session
from dependencies.redis import get_redis
from dependencies.permissions import require_analyst
from dependencies.current_user import CurrentUser
from application.digital_twin_application import DigitalTwinApplication
from core.responses import APIResponse

router = APIRouter()

def get_digital_twin_app(
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis)
) -> DigitalTwinApplication:
    return DigitalTwinApplication(db=db, redis=redis)

@router.get("/{station_id}", summary="Get Digital Twin Real-Time Status")
async def get_digital_twin(
    station_id: str,
    request: Request,
    app: DigitalTwinApplication = Depends(get_digital_twin_app),
    user: CurrentUser = Depends(require_analyst)
):
    """Retrieve full live state, drift metrics, and active warnings for the Digital Twin. Requires Analyst role."""
    data = await app.get_digital_twin_state(station_id)
    
    # Enforce strict AI metadata contract
    meta = {
        "model": {
            "name": "digital_twin_core",
            "version": "2.1.0",
            "confidence": 0.95
        }
    }
    
    return APIResponse.success(
        request_id=request.state.request_id,
        data=data,
        meta=meta
    )
