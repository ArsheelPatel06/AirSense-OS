"""The primary orchestrator for the Perception Layer."""
from typing import Dict, Any, Tuple
from .schemas import UnifiedObservation, PerceivedEnvironment, PerceptionReport
from .sensor_fusion import SensorFusionEngine
from .context_fusion import ContextFusionEngine
from .data_quality import DataQualityEngine
from .sensor_validator import SensorValidator
from .sensor_cleaner import SensorCleaner
from .outlier_detector import OutlierDetector

class PerceptionPipeline:
    """
    Orchestrates the conversion of raw, disparate streams into a 
    validated, fused, and quality-scored PerceivedEnvironment.
    No Machine Learning happens here.
    """
    def __init__(self):
        self.sensor_fusion = SensorFusionEngine()
        self.context_fusion = ContextFusionEngine()
        self.data_quality = DataQualityEngine(["pm25", "temperature", "humidity"])
        self.validator = SensorValidator()
        self.cleaner = SensorCleaner()
        self.outlier = OutlierDetector(spike_threshold=100.0)

    def perceive(self, raw_streams: Dict[str, Dict[str, Any]], last_sensors: Dict[str, float] = None) -> Tuple[PerceivedEnvironment, PerceptionReport]:
        """
        Executes the full perception pipeline.
        
        Args:
            raw_streams: e.g. {"iot": {...}, "weather": {...}, "satellite": {...}}
            last_sensors: Previous cycle's validated sensors (for outlier detection)
        """
        # 1. Sensor Fusion
        obs = self.sensor_fusion.fuse(
            iot_data=raw_streams.get("iot"),
            satellite_data=raw_streams.get("satellite"),
            citizen_data=raw_streams.get("citizen"),
            weather_data=raw_streams.get("weather"),
            traffic_data=raw_streams.get("traffic"),
            drone_data=raw_streams.get("drone")
        )
        
        # 2. Base Quality Report
        report = self.data_quality.evaluate(obs)
        
        # 3. Validation (Bounds checking)
        valid_sensors = self.validator.validate(obs.iot_sensors, report)
        
        # 4. Outlier Detection & Capping
        safe_sensors = self.outlier.detect_and_cap(valid_sensors, last_sensors or {}, report)
        
        # 5. Cleaning (Imputation of strictly required fields)
        clean_sensors = self.cleaner.clean(safe_sensors, self.data_quality.required_sensors, report)
        
        # 6. Context Fusion
        env_context = self.context_fusion.build_context(obs)
        
        # 7. Build Output
        env = PerceivedEnvironment(
            timestamp=obs.timestamp,
            fused_sensors=clean_sensors,
            environmental_context=env_context
        )
        
        return env, report
