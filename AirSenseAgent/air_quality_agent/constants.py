"""Shared system-wide constants and enums for AirSense."""
from enum import Enum

class FanSpeed(str, Enum):
    OFF = "OFF"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class AirQualityLevel(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    MODERATE = "Moderate"
    POOR = "Poor"
    HAZARDOUS = "Hazardous"

class FilterStatus(str, Enum):
    GOOD = "Good"
    FAIR = "Fair"
    REPLACE_SOON = "Replace Soon"
    CRITICAL = "CRITICAL: Replace Immediately"

class ConfidenceLevel(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"

SPEED_TO_NUMERIC = {
    FanSpeed.OFF: 0,
    FanSpeed.LOW: 30,
    FanSpeed.MEDIUM: 55,
    FanSpeed.HIGH: 80
}

SPEED_TO_ENERGY_COST = {
    FanSpeed.OFF: 0.0,
    FanSpeed.LOW: 0.2,
    FanSpeed.MEDIUM: 0.5,
    FanSpeed.HIGH: 1.0
}

SPEED_ORDER = [FanSpeed.OFF, FanSpeed.LOW, FanSpeed.MEDIUM, FanSpeed.HIGH]
