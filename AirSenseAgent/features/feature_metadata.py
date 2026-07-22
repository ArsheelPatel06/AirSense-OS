"""Definitions for Feature Metadata and Lineage."""
from dataclasses import dataclass, field
from typing import List, Tuple, Any

@dataclass
class FeatureMetadata:
    """Enterprise-grade feature definition and lineage tracking."""
    name: str
    category: str
    version: str
    description: str
    
    # Lineage tracking
    source_dependencies: List[str] 
    transformation_logic: str      
    
    # Data Contracts
    expected_range: Tuple[float, float]
    is_required: bool
    
    # Strategies
    normalization_method: str      
    missing_value_strategy: str    
    caching_policy: str            
    importance_weight: str
    
    def to_dict(self):
        return {
            "name": self.name,
            "category": self.category,
            "version": self.version,
            "description": self.description,
            "source_dependencies": self.source_dependencies,
            "transformation_logic": self.transformation_logic,
            "expected_range": self.expected_range,
            "is_required": self.is_required,
            "normalization_method": self.normalization_method,
            "missing_value_strategy": self.missing_value_strategy,
            "caching_policy": self.caching_policy,
            "importance_weight": self.importance_weight
        }
