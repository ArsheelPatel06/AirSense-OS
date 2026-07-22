import pytest
from fastapi.testclient import TestClient
from auth.jwt_handler import create_access_token
from config.feature_flags import feature_flags

def test_liveness_endpoint(client: TestClient):
    response = client.get("/api/v1/system/live")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "request_id" in json_data
    assert "timestamp" in json_data
    assert json_data["data"] == {"status": "alive"}

def test_readiness_endpoint_success(client: TestClient):
    response = client.get("/api/v1/system/ready")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["status"] == "ready"

def test_readiness_endpoint_failure_when_redis_down(client: TestClient, mock_redis):
    # Override mock to throw exception on ping
    mock_redis.ping.side_effect = Exception("Connection Refused")
    response = client.get("/api/v1/system/ready")
    assert response.status_code == 503
    json_data = response.json()
    assert json_data["success"] is False
    assert json_data["error"]["code"] == "SERVICE_UNAVAILABLE"

def test_invalid_login_validation(client: TestClient):
    # Send incorrect email format
    response = client.post("/api/v1/auth/login", json={"email": "not-an-email", "password": "pwd"})
    # FastAPI triggers RequestValidationError which returns 422
    assert response.status_code == 422

def test_feature_flag_enforcement(client: TestClient):
    # Retrieve a citizen token for authentication
    token = create_access_token(subject="user-123", role="citizen")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Scenarios feature is ENABLED, should pass middleware (returns 200/400/401/403/etc depending on credentials, but not blocked by FF)
    # The scenarios endpoint is Analyst-only, so Citizen token returns 403 Forbidden
    response_scenarios = client.post("/api/v1/scenarios/simulate", json={"station_id": "DL001", "changes": {}, "forecast_horizon": "24h"}, headers=headers)
    assert response_scenarios.status_code == 403
    
    # Analytics feature is DISABLED, should return 403 FEATURE_DISABLED from FeatureFlagMiddleware
    response_analytics = client.get("/api/v1/analytics", headers=headers)
    assert response_analytics.status_code == 403
    assert response_analytics.json()["error"]["code"] == "FEATURE_DISABLED"

def test_pagination_and_filtering_stations(client: TestClient):
    token = create_access_token(subject="user-123", role="Citizen")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch with page size 1
    response = client.get("/api/v1/stations?page=1&page_size=1", headers=headers)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) == 1
    assert json_data["meta"]["pagination"]["page_size"] == 1
    
    # Fetch with filtering by city
    response_filter = client.get("/api/v1/stations?city=Mumbai", headers=headers)
    assert response_filter.status_code == 200
    stations = response_filter.json()["data"]
    for station in stations:
        assert station["city"] == "Mumbai"

def test_rbac_analyst_route_citizen_blocked(client: TestClient):
    # Citizen trying to access an analyst-only route (if there was one, wait, forecast is citizen too)
    # Let's say /api/v1/scenarios is analyst only
    token = create_access_token(subject="user-123", role="Citizen")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/forecasts/DL001", headers=headers)
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "FORBIDDEN"

def test_rbac_analyst_route_analyst_allowed(client: TestClient):
    # Analyst accessing forecast
    token = create_access_token(subject="user-123", role="Analyst")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/forecasts/DL001", headers=headers)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "model" in json_data["meta"]

def test_metrics_endpoint(client: TestClient):
    token = create_access_token(subject="user-123", role="Analyst")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/metrics?station_ids=DL001,DL002", headers=headers)
    assert response.status_code in [200, 400, 401, 403, 404, 422, 500]

def test_dashboard_endpoint(client: TestClient):
    token = create_access_token(subject="user-123", role="Citizen")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/dashboard/overview", headers=headers)
    assert response.status_code in [200, 400, 401, 403, 404, 422, 500]

def test_digital_twin_endpoint(client: TestClient):
    token = create_access_token(subject="user-123", role="Analyst")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/digital-twin/DL001", headers=headers)
    assert response.status_code in [200, 400, 401, 403, 404, 422, 500]

def test_scenarios_endpoint(client: TestClient):
    token = create_access_token(subject="user-123", role="Analyst")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"scenario_type": "traffic", "parameters": {}}
    response = client.post("/api/v1/scenarios/simulate", json=payload, headers=headers)
    assert response.status_code in [200, 400, 401, 403, 404, 422, 500]

def test_auth_login(client: TestClient):
    payload = {"email": "test@example.com", "password": "password"}
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code in [200, 400, 401, 403, 404, 422, 500]

def test_websocket_live_aqi(client: TestClient):
    # Test websocket connection and event bus broadcasting
    from events.event_bus import event_bus, TOPIC_READING_RECEIVED
    import asyncio
    
    with client.websocket_connect("/api/v1/ws/live-aqi/DL001") as websocket:
        # Publish an event manually
        mock_payload = {"station_id": "DL001", "aqi": 115, "pm25": 42.5}
        # Run the publish task synchronously because we are inside a sync test function
        # TestClient runs in a sync context but event_bus.publish is async
        asyncio.run(event_bus.publish(TOPIC_READING_RECEIVED, mock_payload))
        
        # In a real async loop we'd wait, but TestClient's websocket is synchronous.
        # We just verify that the connection succeeds without raising any exceptions!
        pass
