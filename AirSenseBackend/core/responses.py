from typing import Any, Generic, TypeVar, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse
from fastapi import status

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    is_success: bool = Field(alias="success")
    request_id: str
    timestamp: str
    data: Optional[T] = None
    meta: Optional[dict[str, Any]] = None
    error_details: Optional[dict[str, Any]] = Field(default=None, alias="error")

    model_config = {"populate_by_name": True}

    @classmethod
    def success(
        cls, 
        request_id: str,
        data: Any = None, 
        meta: dict[str, Any] | None = None,
        status_code: int = status.HTTP_200_OK
    ) -> JSONResponse:
        content = cls(
            is_success=True,
            request_id=request_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            data=data if data is not None else {},
            meta=meta if meta is not None else {}
        ).model_dump(exclude_none=True, by_alias=True)
        return JSONResponse(status_code=status_code, content=content)

    @classmethod
    def error(
        cls, 
        request_id: str,
        code: str,
        message: str,
        details: dict[str, Any] | None = None,
        status_code: int = status.HTTP_400_BAD_REQUEST
    ) -> JSONResponse:
        content = cls(
            is_success=False,
            request_id=request_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            error_details={
                "code": code,
                "message": message,
                "details": details if details is not None else {}
            }
        ).model_dump(exclude_none=True, by_alias=True)
        return JSONResponse(status_code=status_code, content=content)
