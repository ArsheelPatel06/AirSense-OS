from uuid import UUID
from pydantic import BaseModel, EmailStr

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str | None = None
    role: str
    is_active: bool
    tenant_id: UUID | None = None

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    token: TokenResponse
    user: UserResponse
