from fastapi import APIRouter, Depends, Request
from dependencies.permissions import require_admin
from dependencies.current_user import CurrentUser
from core.responses import APIResponse

router = APIRouter()

@router.get("", summary="Application Metrics")
async def get_metrics(
    request: Request,
    user: CurrentUser = Depends(require_admin)
):
    """Retrieve runtime metrics (Admin only)"""
    # In a full implementation, these would pull from Prometheus/Redis/DB counters
    data = {
        "requests": {
            "total": 14250,
            "errors": 23,
            "avg_latency_ms": 112
        },
        "forecasts": {
            "avg_inference_time_ms": 840,
            "queue_size": 0
        },
        "websockets": {
            "active_connections": 14
        },
        "database": {
            "avg_latency_ms": 12,
            "active_connections": 8
        },
        "redis": {
            "avg_latency_ms": 3
        }
    }
    
    return APIResponse.success(request_id=request.state.request_id, data=data)
