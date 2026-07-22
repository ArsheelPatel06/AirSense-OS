"""Internal API isolating ML Models from raw file access."""
from typing import Dict, Any, List

class DataAPI:
    """The only allowed way for ML Models or Backend to fetch data."""
    
    @staticmethod
    def get_feature_vector(location_id: str, timestamp: str) -> Dict[str, Any]:
        """Returns the engineered feature vector for the given space/time."""
        return {
            "pm25": 142.5,
            "no2": 65.2,
            "wind_speed": 12.0,
            "traffic_density": 0.85
        }
        
    @staticmethod
    def get_training_dataset(version: str = "latest") -> Any:
        """Fetches the approved, split training dataset."""
        pass
        
    @staticmethod
    def get_geospatial_layer(layer_name: str, bbox: Dict[str, float]) -> Any:
        """Fetches raster or vector GIS data for a bounding box."""
        pass
