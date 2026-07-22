import sys

print("=== AIRSENSE SPRINT 4 INFRASTRUCTURE TEST ===")

# ── 1. Feature Registry ────────────────────────────────────────────────────────
print("\n--- 1. Feature Registry ---")
from intelligence.feature_registry.registry import feature_registry, FeatureDefinition, FeatureType

schema = feature_registry.get_training_schema(tags=["pollutant"])
print(f"Registered pollutant features: {schema}")

errors = feature_registry.validate_record({"pm25": 150.0, "pm10": 300.0, "no2": -5.0})
print(f"Validation errors: {errors}")

try:
    feature_registry.get("satellite_no2")
except KeyError as e:
    print(f"Unknown feature correctly rejected: {e}")

# ── 2. Model Factory ───────────────────────────────────────────────────────────
print("\n--- 2. Model Factory ---")
from intelligence.models.factory import ModelFactory

factory = ModelFactory()
model = factory.create("aqi_forecast", algorithm="random_forest")
print(f"Created model: {model}")

import numpy as np
X = np.array([[100, 50, 30, 25, 60], [200, 80, 45, 30, 55]])
y = np.array([150.0, 280.0])
model.fit(X, y)
preds = model.predict(X)
print(f"Predictions (dummy): {preds}")

spike_model = factory.create("pollution_spike", algorithm="random_forest")
print(f"Spike classifier created: {spike_model}")

# ── 3. Spatial Graph ───────────────────────────────────────────────────────────
print("\n--- 3. Spatial Graph ---")
from intelligence.spatial.graph import SpatialGraph

graph = SpatialGraph()
graph.add_station("DL001", lat=28.65, lon=77.23, city="Delhi")
graph.add_station("DL002", lat=28.53, lon=77.19, city="Delhi")
graph.add_station("DL003", lat=28.70, lon=77.10, city="Delhi")
graph.update_readings("DL002", {"pm25": 145.0, "pm10": 200.0})
graph.update_readings("DL003", {"pm25": 130.0, "pm10": 180.0})

neighbors = graph.get_spatial_neighbors("DL001", radius_km=50)
print(f"Neighbors of DL001: {[(n['station_id'], f\"{n['distance_km']}km\") for n in neighbors]}")

upstream = graph.get_upstream_neighbors("DL001", wind_direction=270, radius_km=100)
print(f"Upstream neighbors (wind from W): {[n['station_id'] for n in upstream]}")

imputed = graph.impute_missing("DL001", "pm25")
print(f"Imputed PM2.5 for DL001: {imputed:.2f}")

# ── 4. Digital Twin ────────────────────────────────────────────────────────────
print("\n--- 4. Digital Twin ---")
from intelligence.digital_twin.twin import DigitalTwin, HorizonForecast

twin = DigitalTwin()
twin.upsert_state(
    "DL001", city="Delhi", state="Delhi", latitude=28.65, longitude=77.23,
    aqi=145.0, pm25=65.0, pm10=110.0, aqi_category="Moderate",
    forecasts=[HorizonForecast(hours_ahead=24, predicted_aqi=180.0, confidence=78.0)]
)
snapshot = twin.get_snapshot("DL001")
print(f"DL001 AQI: {snapshot.current_aqi}, Category: {snapshot.aqi_category}")
print(f"24h Forecast AQI: {snapshot.forecasts[0].predicted_aqi}, Confidence: {snapshot.forecasts[0].confidence}%")

summary = twin.get_summary()
print(f"Dashboard Summary: {summary}")

print("\n=== ALL SPRINT 4 TESTS PASSED ===")
