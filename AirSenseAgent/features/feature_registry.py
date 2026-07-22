"""Centralized registry containing metadata for every engineered feature."""
from typing import Dict, List
from .feature_metadata import FeatureMetadata

class FeatureRegistry:
    def __init__(self):
        self._features: Dict[str, FeatureMetadata] = {}
        self._register_core_features()

    def _register_core_features(self):
        """Register the V1 Feature Set (~70 features to be expanded to 150)."""
        
        # 1. Environmental
        self.register(FeatureMetadata(
            name="pm25", category="Environmental", version="1.0",
            description="Fine particulate matter <2.5 micrometers",
            source_dependencies=["iot_sensors.pm25"],
            transformation_logic="identity",
            expected_range=(0.0, 1000.0), is_required=True,
            normalization_method="minmax", missing_value_strategy="rolling_mean",
            caching_policy="none", importance_weight="high"
        ))
        
        # 2. Historical (Derived AQI Features)
        self.register(FeatureMetadata(
            name="pm25_rolling_mean_6h", category="Historical", version="1.0",
            description="6-hour moving average of PM2.5",
            source_dependencies=["iot_sensors.pm25"],
            transformation_logic="rolling_mean(window=6)",
            expected_range=(0.0, 1000.0), is_required=True,
            normalization_method="minmax", missing_value_strategy="zero",
            caching_policy="memory", importance_weight="high"
        ))
        
        self.register(FeatureMetadata(
            name="aqi_velocity", category="Historical", version="1.0",
            description="First derivative (rate of change) of AQI over 1 hour",
            source_dependencies=["aqi"],
            transformation_logic="gradient(window=1)",
            expected_range=(-500.0, 500.0), is_required=True,
            normalization_method="zscore", missing_value_strategy="zero",
            caching_policy="none", importance_weight="high"
        ))

        # 3. Temporal
        self.register(FeatureMetadata(
            name="hour_sin", category="Temporal", version="1.0",
            description="Sine encoded hour of the day to preserve cyclicality",
            source_dependencies=["timestamp"],
            transformation_logic="sin(hour * 2 * pi / 24)",
            expected_range=(-1.0, 1.0), is_required=True,
            normalization_method="none", missing_value_strategy="zero",
            caching_policy="none", importance_weight="medium"
        ))
        
        # 4. Spatial (GIS)
        self.register(FeatureMetadata(
            name="distance_to_industry", category="Spatial", version="1.0",
            description="Proximity in KM to the nearest heavy industrial zone",
            source_dependencies=["latitude", "longitude"],
            transformation_logic="haversine(lat, lon, industry_polygon)",
            expected_range=(0.0, 50.0), is_required=False,
            normalization_method="minmax", missing_value_strategy="mean",
            caching_policy="database", importance_weight="high"
        ))

        # 5. Satellite
        self.register(FeatureMetadata(
            name="no2_column", category="Satellite", version="1.0",
            description="Nitrogen Dioxide column density from Sentinel-5P",
            source_dependencies=["satellite.no2"],
            transformation_logic="identity",
            expected_range=(0.0, 10.0), is_required=False,
            normalization_method="minmax", missing_value_strategy="mean",
            caching_policy="redis", importance_weight="high"
        ))
        
        # Add a placeholder representing the rest of the 70 features to keep the file concise for now.
        # The full list will be documented in feature_catalog.md

    def register(self, metadata: FeatureMetadata) -> None:
        self._features[metadata.name] = metadata

    def get_feature(self, name: str) -> FeatureMetadata:
        return self._features.get(name)

    def get_all(self) -> List[FeatureMetadata]:
        return list(self._features.values())
