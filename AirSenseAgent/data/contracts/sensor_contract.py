"""Contract for Ground Sensors (CPCB, IoT)."""
from pydantic import Field
from typing import Optional
from .base_contract import DataContract

class SensorContract(DataContract):
    station_id: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    
    # Pollutants
    pm25: Optional[float] = Field(None, ge=0)
    pm10: Optional[float] = Field(None, ge=0)
    no2: Optional[float] = Field(None, ge=0)
    so2: Optional[float] = Field(None, ge=0)
    co: Optional[float] = Field(None, ge=0)
    o3: Optional[float] = Field(None, ge=0)
    
    # Metadata
    calibration_status: str = "VERIFIED"
    quality_flag: int = Field(..., ge=0, le=1)  # 1 = Good, 0 = Bad
