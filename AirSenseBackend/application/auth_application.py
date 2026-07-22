import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.auth import User
from core.security import verify_password
from core.exceptions import UnauthorizedException
from schemas.request.auth import LoginRequest
from schemas.response.auth import LoginResponse, TokenResponse, UserResponse
from auth.jwt_handler import create_access_token, create_refresh_token
from events.event_bus import event_bus, TOPIC_USER_LOGIN

logger = logging.getLogger(__name__)

class AuthApplication:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def login(self, request: LoginRequest) -> LoginResponse:
        result = await self.db.execute(select(User).where(User.email == request.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(request.password, user.hashed_password):
            logger.warning(f"Failed login attempt for {request.email}")
            raise UnauthorizedException(message="Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException(message="Account is disabled")

        # Create tokens
        access_token = create_access_token(subject=str(user.id), role=user.role)
        refresh_token = create_refresh_token(subject=str(user.id), role=user.role)

        # Publish event
        await event_bus.publish(TOPIC_USER_LOGIN, {"user_id": str(user.id), "email": user.email})

        # Assemble Response Model
        return LoginResponse(
            token=TokenResponse(access_token=access_token, refresh_token=refresh_token),
            user=UserResponse.model_validate(user)
        )
