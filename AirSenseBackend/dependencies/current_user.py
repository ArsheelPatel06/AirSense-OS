from typing import Any
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from auth.jwt_handler import verify_token
from core.exceptions import UnauthorizedException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

class CurrentUser:
    def __init__(self, user_id: str, role: str):
        self.user_id = user_id
        self.role = role

def get_current_user_token_payload(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    payload = verify_token(token)
    user_id: str | None = payload.get("sub")
    role: str | None = payload.get("role")
    if user_id is None or role is None:
        raise UnauthorizedException(message="Invalid authentication credentials")
    
    return CurrentUser(user_id=user_id, role=role)

# In a full implementation, you'd fetch the DB User here:
# async def get_current_user(payload = Depends(get_current_user_token_payload), db = Depends(get_db_session)) -> User: ...
