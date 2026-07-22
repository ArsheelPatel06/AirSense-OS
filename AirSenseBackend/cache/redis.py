from typing import Optional
from redis.asyncio import Redis, ConnectionPool
from config.settings import settings

redis_pool: Optional[ConnectionPool] = None

def get_redis_pool() -> ConnectionPool:
    global redis_pool
    if redis_pool is None:
        redis_pool = ConnectionPool.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            max_connections=10
        )
    return redis_pool

async def get_redis_client() -> Redis:
    pool = get_redis_pool()
    return Redis(connection_pool=pool)

async def close_redis_pool():
    global redis_pool
    if redis_pool:
        await redis_pool.disconnect()
        redis_pool = None
