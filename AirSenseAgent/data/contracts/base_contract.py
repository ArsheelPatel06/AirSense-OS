"""Base contract that all data schemas must inherit from."""
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime

class DataContract(BaseModel, ABC):
    """Base schema enforcing provenance tracking."""
    dataset_id: str
    timestamp: datetime
    source_system: str
    
    class Config:
        extra = "forbid"  # Reject any undocumented columns
