from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from dependencies.database import get_db_session
from dependencies.permissions import require_citizen
from dependencies.current_user import CurrentUser
from application.station_application import StationApplication
from core.pagination import PaginationParams
from core.responses import APIResponse

router = APIRouter()

def get_station_app(db: AsyncSession = Depends(get_db_session)) -> StationApplication:
    return StationApplication(db)

@router.get("", summary="List Stations (Paginated & Filtered)")
async def list_stations(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    app: StationApplication = Depends(get_station_app),
    user: CurrentUser = Depends(require_citizen)
):
    """Retrieve all air monitoring stations with support for pagination and filtering by city, state, or status."""
    params = PaginationParams(page=page, page_size=page_size, sort=sort, order=order)
    paginated_result = await app.list_stations(params, city=city, state=state, status_filter=status)
    
    return APIResponse.success(
        request_id=request.state.request_id,
        data=paginated_result.items,
        meta={
            "pagination": {
                "total": paginated_result.total,
                "page": paginated_result.page,
                "page_size": paginated_result.page_size,
                "total_pages": paginated_result.total_pages,
                "has_next": paginated_result.has_next,
                "has_prev": paginated_result.has_prev
            }
        }
    )
