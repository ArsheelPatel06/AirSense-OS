from fastapi import APIRouter
from api.v1 import health, auth, forecasts, dashboard, metrics, stations, scenarios, digital_twin
api_router = APIRouter()

api_router.include_router(health.router, prefix="/system", tags=["System"])
api_router.include_router(metrics.router, prefix="/system/metrics", tags=["System"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(forecasts.router, prefix="/forecasts", tags=["Forecasts"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(stations.router, prefix="/stations", tags=["Stations"])
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["Scenarios"])
api_router.include_router(digital_twin.router, prefix="/digital-twin", tags=["Digital Twin"])

from api.v1.ws import router as ws_router
api_router.include_router(ws_router, prefix="/ws", tags=["WebSockets"])
