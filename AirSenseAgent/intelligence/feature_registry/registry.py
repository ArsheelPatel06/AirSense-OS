"""
Feature Registry.

The single source of truth for every feature used in training and inference.
Ensures that features are consistently typed, normalized, and documented
whether we're reading from the Feature Store or a live prediction request.

When new data sources are added (satellite NO2, traffic, pollen, crop burning),
register them here first. Models never see unregistered features.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Optional

logger = logging.getLogger(__name__)


class FeatureType(str, Enum):
    FLOAT = "float"
    INT = "int"
    BOOL = "bool"
    STRING = "string"
    CATEGORICAL = "categorical"


class NormalizationStrategy(str, Enum):
    STANDARD = "standard"        # (x - mean) / std
    MINMAX = "minmax"            # (x - min) / (max - min)
    LOG = "log"                  # log1p(x)
    NONE = "none"                # No normalization (categoricals, IDs)


@dataclass
class FeatureDefinition:
    """Schema definition for a single feature."""
    name: str
    dtype: FeatureType
    source: str                                  # e.g., "CPCB", "OpenWeather", "Engineered"
    nullable: bool = True
    normalization: NormalizationStrategy = NormalizationStrategy.STANDARD
    units: Optional[str] = None
    description: str = ""
    valid_min: Optional[float] = None
    valid_max: Optional[float] = None
    tags: list[str] = field(default_factory=list) # e.g., ["pollutant", "weather", "temporal"]


class FeatureRegistry:
    """
    Central registry of all features used by AirSense models.

    Usage:
        registry = FeatureRegistry()
        registry.register(FeatureDefinition(name="pm25", ...))
        schema = registry.get_training_schema()
    """

    def __init__(self):
        self._features: dict[str, FeatureDefinition] = {}
        self._register_defaults()

    def register(self, feature: FeatureDefinition) -> None:
        """Register a new feature. Raises if already registered."""
        if feature.name in self._features:
            raise ValueError(f"Feature '{feature.name}' is already registered. Use update() to modify.")
        self._features[feature.name] = feature
        logger.info(f"[FeatureRegistry] Registered feature: {feature.name} ({feature.dtype.value})")

    def update(self, feature: FeatureDefinition) -> None:
        """Update an existing feature definition."""
        self._features[feature.name] = feature
        logger.info(f"[FeatureRegistry] Updated feature: {feature.name}")

    def get(self, name: str) -> FeatureDefinition:
        """Retrieve a feature definition by name. Raises if unknown."""
        if name not in self._features:
            raise KeyError(f"Feature '{name}' is not registered. Register it in FeatureRegistry first.")
        return self._features[name]

    def validate_record(self, record: dict[str, Any]) -> list[str]:
        """
        Validate a feature record against the registry.

        Returns a list of validation errors (empty = valid).
        """
        errors = []
        for name, defn in self._features.items():
            val = record.get(name)

            # Nullability check
            if val is None and not defn.nullable:
                errors.append(f"'{name}' is required (nullable=False) but is missing.")
                continue

            if val is None:
                continue

            # Type check
            if defn.dtype == FeatureType.FLOAT:
                try:
                    float(val)
                except (TypeError, ValueError):
                    errors.append(f"'{name}' expects float, got {type(val).__name__}.")
            elif defn.dtype == FeatureType.INT:
                try:
                    int(val)
                except (TypeError, ValueError):
                    errors.append(f"'{name}' expects int, got {type(val).__name__}.")

            # Range check
            if defn.valid_min is not None and float(val) < defn.valid_min:
                errors.append(f"'{name}' value {val} is below valid_min={defn.valid_min}.")
            if defn.valid_max is not None and float(val) > defn.valid_max:
                errors.append(f"'{name}' value {val} exceeds valid_max={defn.valid_max}.")

        return errors

    def get_training_schema(self, tags: Optional[list[str]] = None) -> list[str]:
        """
        Get feature names suitable for training.
        Optionally filter by tags (e.g., tags=['pollutant', 'weather']).
        """
        features = [
            name for name, defn in self._features.items()
            if defn.dtype not in (FeatureType.STRING, FeatureType.CATEGORICAL)
        ]
        if tags:
            features = [
                name for name in features
                if any(t in self._features[name].tags for t in tags)
            ]
        return features

    def list_all(self) -> dict[str, FeatureDefinition]:
        return dict(self._features)

    def _register_defaults(self) -> None:
        """Register the canonical AirSense feature set."""

        # ── Pollutants ─────────────────────────────────────────────────────────
        pollutants = [
            ("pm25",   "µg/m³", 0.0, 1000.0),
            ("pm10",   "µg/m³", 0.0, 1500.0),
            ("no2",    "µg/m³", 0.0, 2000.0),
            ("so2",    "µg/m³", 0.0, 3000.0),
            ("co",     "mg/m³", 0.0,  100.0),
            ("o3",     "µg/m³", 0.0, 1000.0),
            ("nh3",    "µg/m³", 0.0,  500.0),
        ]
        for name, units, lo, hi in pollutants:
            self._features[name] = FeatureDefinition(
                name=name,
                dtype=FeatureType.FLOAT,
                source="CPCB",
                nullable=True,
                normalization=NormalizationStrategy.LOG,  # Pollutants are right-skewed
                units=units,
                valid_min=lo,
                valid_max=hi,
                tags=["pollutant"],
            )

        # ── Weather ────────────────────────────────────────────────────────────
        weather = [
            ("temperature",     "°C",    -20.0,  60.0),
            ("humidity",        "%",       0.0, 100.0),
            ("pressure",        "hPa",   900.0, 1100.0),
            ("wind_speed",      "m/s",     0.0, 100.0),
            ("wind_direction",  "degrees", 0.0, 360.0),
            ("rain",            "mm",      0.0, 500.0),
            ("cloud_cover",     "%",       0.0, 100.0),
        ]
        for name, units, lo, hi in weather:
            self._features[name] = FeatureDefinition(
                name=name,
                dtype=FeatureType.FLOAT,
                source="OpenWeather",
                nullable=True,
                normalization=NormalizationStrategy.STANDARD,
                units=units,
                valid_min=lo,
                valid_max=hi,
                tags=["weather"],
            )

        # ── Engineered / Temporal ──────────────────────────────────────────────
        temporal = [
            ("hour_sin",   "sin(2π·hour/24)"),
            ("hour_cos",   "cos(2π·hour/24)"),
            ("dow_sin",    "sin(2π·dayofweek/7)"),
            ("dow_cos",    "cos(2π·dayofweek/7)"),
            ("month_sin",  "sin(2π·month/12)"),
            ("month_cos",  "cos(2π·month/12)"),
        ]
        for name, desc in temporal:
            self._features[name] = FeatureDefinition(
                name=name,
                dtype=FeatureType.FLOAT,
                source="Engineered",
                nullable=False,
                normalization=NormalizationStrategy.NONE,
                description=desc,
                valid_min=-1.0,
                valid_max=1.0,
                tags=["temporal", "engineered"],
            )

        # ── Boolean flags ──────────────────────────────────────────────────────
        flags = [
            ("is_weekend", "1 if weekend, 0 otherwise"),
            ("is_rush_hour", "1 if 7–10AM or 5–8PM"),
            ("is_monsoon", "1 if Indian monsoon season (June–September)"),
            ("is_festival", "1 if known Indian festival (Diwali etc.)"),
        ]
        for name, desc in flags:
            self._features[name] = FeatureDefinition(
                name=name,
                dtype=FeatureType.INT,
                source="Engineered",
                nullable=False,
                normalization=NormalizationStrategy.NONE,
                description=desc,
                valid_min=0.0,
                valid_max=1.0,
                tags=["contextual", "engineered"],
            )


# ── Module-level singleton ────────────────────────────────────────────────────
feature_registry = FeatureRegistry()
