from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from config.feature_flags import feature_flags
from core.responses import APIResponse
from core.constants import HEADER_REQUEST_ID

class FeatureFlagMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # A simple check: if a route starts with a disabled feature path, block it.
        # This is a broad middleware approach. A dependency injection approach per route is often better,
        # but middleware can catch entire prefixes like /api/v1/scenarios.
        path = request.url.path
        
        req_id = request.headers.get(HEADER_REQUEST_ID, getattr(request.state, "request_id", "unknown"))

        if "/api/v1/scenarios" in path and not feature_flags.ENABLE_SCENARIOS:
            return APIResponse.error(
                request_id=req_id,
                code="FEATURE_DISABLED",
                message="The Scenarios feature is currently disabled.",
                status_code=403
            )
            
        if "/api/v1/analytics" in path and not feature_flags.ENABLE_ANALYTICS:
            return APIResponse.error(
                request_id=req_id,
                code="FEATURE_DISABLED",
                message="The Analytics feature is currently disabled.",
                status_code=403
            )

        if "/api/v1/digital-twin" in path and not feature_flags.ENABLE_DIGITAL_TWIN:
            return APIResponse.error(
                request_id=req_id,
                code="FEATURE_DISABLED",
                message="The Digital Twin feature is currently disabled.",
                status_code=403
            )

        return await call_next(request)
