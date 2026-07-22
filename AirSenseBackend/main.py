from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware

from config.settings import settings
from middleware.rate_limit import limiter
from middleware.request_id import RequestIDMiddleware
from middleware.logging import LoggingMiddleware
from middleware.feature_flags import FeatureFlagMiddleware
from core.exceptions import AirSenseException
from core.responses import APIResponse
from fastapi import Request
from contextlib import asynccontextmanager
from scheduler.registry import start_scheduler, shutdown_scheduler, scheduler
from workers.aqi_ingestor import register_jobs
from events.event_bus import event_bus, TOPIC_READING_RECEIVED
from websocket.connection_manager import handle_reading_received

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    event_bus.subscribe(TOPIC_READING_RECEIVED, handle_reading_received)
    register_jobs(scheduler)
    start_scheduler()
    yield
    # Shutdown
    shutdown_scheduler()

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

@app.exception_handler(AirSenseException)
async def airsense_exception_handler(request: Request, exc: AirSenseException):
    req_id = getattr(request.state, "request_id", "unknown")
    return APIResponse.error(
        request_id=req_id,
        code=exc.code,
        message=exc.message,
        details=exc.details,
        status_code=exc.status_code
    )

# Custom OpenAPI Schema Generation
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="AirSense Intelligence Platform Backend API.",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Middlewares
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(FeatureFlagMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(LoggingMiddleware)

# CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"]
    )

# API Router
from api.router import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)
