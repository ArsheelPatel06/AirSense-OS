from typing import AsyncGenerator
from redis.asyncio import Redis
from cache.redis import get_redis_client

async def get_redis() -> AsyncGenerator[Redis, None]:
    """Dependency for getting async redis client."""
    client = await get_redis_client()
    try:
        yield client
    finally:
        await client.close()
