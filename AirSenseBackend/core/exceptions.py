from fastapi import HTTPException, status
from typing import Any

class AirSenseException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict[str, Any] | None = None
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}

class NotFoundException(AirSenseException):
    def __init__(self, message: str = "Resource not found", details: dict[str, Any] | None = None):
        super().__init__(code="NOT_FOUND", message=message, status_code=status.HTTP_404_NOT_FOUND, details=details)

class UnauthorizedException(AirSenseException):
    def __init__(self, message: str = "Not authenticated", details: dict[str, Any] | None = None):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=status.HTTP_401_UNAUTHORIZED, details=details)

class ForbiddenException(AirSenseException):
    def __init__(self, message: str = "Not enough permissions", details: dict[str, Any] | None = None):
        super().__init__(code="FORBIDDEN", message=message, status_code=status.HTTP_403_FORBIDDEN, details=details)

class ValidationException(AirSenseException):
    def __init__(self, message: str = "Validation error", details: dict[str, Any] | None = None):
        super().__init__(code="VALIDATION_ERROR", message=message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, details=details)
