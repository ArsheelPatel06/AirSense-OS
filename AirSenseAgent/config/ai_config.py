"""AI and algorithmic configuration (thresholds, ranges, and confidence weights)."""

# --- AQI Thresholds (WHO & domain specifics) ---
AQI_HAZARDOUS = 150
AQI_HIGH = 75
AQI_MODERATE = 35
AQI_LOW = 10
SPIKE_THRESHOLD = 15

# --- Hysteresis Logic ---
HYSTERESIS_DOWN_HIGH = 65
HYSTERESIS_DOWN_MEDIUM = 25

# --- Filter Health Definitions ---
FILTER_CRITICAL_PCT = 5
FILTER_REPLACE_SOON_PCT = 20
FILTER_FAIR_PCT = 40
FILTER_GOOD_PCT = 80
FILTER_LIFE_HOURS = 5000

# --- Sensor Validation Ranges ---
PM25_VALID_RANGE = (0.0, 1000.0)
PM10_VALID_RANGE = (0.0, 2000.0)
TEMPERATURE_VALID_RANGE = (-40.0, 60.0)
HUMIDITY_VALID_RANGE = (0.0, 100.0)
GAS_INDEX_VALID_RANGE = (0.0, 500.0)

# --- Feature Engineering ---
ROLLING_WINDOW_SIZE = 10
RUSH_HOUR_RANGES = [(7, 10), (17, 20)]

# --- Confidence weights ---
CONFIDENCE_MAX_SCORE = 95.0
CONFIDENCE_WEIGHTS = {
    "model_accuracy": 0.20,
    "sensor_health": 0.15,
    "weather_reliability": 0.10,
    "historical_stability": 0.20,
    "data_completeness": 0.15,
    "prediction_horizon": 0.10,
    "recent_drift": 0.10,
}
