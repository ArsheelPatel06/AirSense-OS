import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from main import app
from dependencies.database import get_db_session
from dependencies.redis import get_redis
import unittest.mock

# Patch the AI engine to avoid instantiation errors when running tests locally without proper paths
patcher = unittest.mock.patch('integrations.airsense_engine.AirSenseEngineIntegration')
patcher.start()
@pytest.fixture
def mock_db():
    db = AsyncMock()
    # Stub database queries if needed
    return db

@pytest.fixture
def mock_redis():
    redis = AsyncMock()
    redis.ping = AsyncMock(return_value=True)
    return redis

@pytest.fixture
def client(mock_db, mock_redis):
    # Override dependencies
    app.dependency_overrides[get_db_session] = lambda: mock_db
    app.dependency_overrides[get_redis] = lambda: mock_redis
    
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.clear()
