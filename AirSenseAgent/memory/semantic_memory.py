"""Semantic Memory representing static domain knowledge and unchangeable facts."""
from typing import Dict, Any, List

class SemanticMemory:
    def __init__(self):
        self._knowledge_base: Dict[str, Any] = {}
        self._load_core_knowledge()

    def _load_core_knowledge(self) -> None:
        self._knowledge_base["aqi_bands"] = {
            "good": (0, 50),
            "moderate": (51, 100),
            "unhealthy_sensitive": (101, 150),
            "unhealthy": (151, 200),
            "very_unhealthy": (201, 300),
            "hazardous": (301, 500)
        }
        self._knowledge_base["device_specs"] = {
            "max_fan_rpm": 3000,
            "filter_lifespan_hours": 5000,
            "power_draw_watts": 45
        }

    def get_fact(self, category: str, key: str = None) -> Any:
        category_data = self._knowledge_base.get(category, {})
        if key:
            return category_data.get(key)
        return category_data
