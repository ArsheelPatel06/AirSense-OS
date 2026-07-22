from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies.database import get_db_session
from application.auth_application import AuthApplication
from schemas.request.auth import LoginRequest
from core.responses import APIResponse

router = APIRouter()

def get_auth_app(db: AsyncSession = Depends(get_db_session)) -> AuthApplication:
    return AuthApplication(db)

@router.post("/login", summary="User Login")
async def login(
    request: Request,
    payload: LoginRequest,
    app: AuthApplication = Depends(get_auth_app)
):
    """Authenticates a user and returns JWT tokens along with the user profile."""
    data = await app.login(payload)
    return APIResponse.success(
        request_id=request.state.request_id,
        data=data.model_dump()
    )
