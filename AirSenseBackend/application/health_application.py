import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from redis.asyncio import Redis

from integrations.airsense_engine import AI_AVAILABLE

logger = logging.getLogger(__name__)

class HealthApplication:
    def __init__(self, db: AsyncSession, redis: Redis):
        self.db = db
        self.redis = redis

    async def get_liveness(self) -> dict:
        return {"status": "alive"}
        
    async def get_health(self) -> dict:
        return {"status": "ok", "app": "airsense_backend"}

    async def get_readiness(self) -> dict:
        # Check DB
        db_ok = False
        try:
            await self.db.execute(text("SELECT 1"))
            db_ok = True
        except Exception as e:
            logger.error(f"DB readiness failed: {e}")

        # Check Redis
        redis_ok = False
        try:
            await self.redis.ping()
            redis_ok = True
        except Exception as e:
            logger.error(f"Redis readiness failed: {e}")

        # AirSenseAgent & Event Bus
        ai_ok = AI_AVAILABLE
        
        status = "ready" if all([db_ok, redis_ok, ai_ok]) else "unavailable"
        
        return {
            "status": status,
            "components": {
                "database": "up" if db_ok else "down",
                "redis": "up" if redis_ok else "down",
                "airsense_agent": "up" if ai_ok else "down",
                "event_bus": "up" # In memory, always up if app is up
            }
        }
