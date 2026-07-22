from typing import Callable
from fastapi import Depends

from dependencies.current_user import CurrentUser, get_current_user_token_payload
from core.exceptions import ForbiddenException
from core.constants import ROLE_ADMIN, ROLE_ANALYST, ROLE_CITIZEN

def require_role(allowed_roles: list[str]) -> Callable:
    def role_checker(current_user: CurrentUser = Depends(get_current_user_token_payload)):
        if current_user.role not in allowed_roles:
            raise ForbiddenException(details={"allowed_roles": allowed_roles, "current_role": current_user.role})
        return current_user
    return role_checker

# Common dependency shortcuts
require_admin = require_role([ROLE_ADMIN])
require_analyst = require_role([ROLE_ADMIN, ROLE_ANALYST])
require_citizen = require_role([ROLE_ADMIN, ROLE_ANALYST, ROLE_CITIZEN])
