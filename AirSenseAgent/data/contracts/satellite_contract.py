"""Contract for Satellite Observations (Sentinel-5P, MODIS)."""
from pydantic import Field
from typing import Optional
from .base_contract import DataContract

class SatelliteContract(DataContract):
    satellite: str  # e.g., Sentinel-5P
    orbit_number: int
    pixel_size_km: float
    
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    
    # Column densities
    no2_column_density: Optional[float]
    so2_column_density: Optional[float]
    aerosol_index: Optional[float]
    
    cloud_fraction: float = Field(..., ge=0.0, le=1.0)
    quality_flag: float = Field(..., ge=0.0, le=1.0)
