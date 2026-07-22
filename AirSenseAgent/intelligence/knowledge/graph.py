"""
Knowledge Graph.

A structured graph linking pollutants, sources, health effects, weather conditions,
and events. This allows the reasoning engine to traverse relationships and infer
causes rather than applying hardcoded conditionals.

Graph nodes: Pollutant, Source, HealthEffect, Event, MeteoCondition, Season
Graph edges: CAUSES, AFFECTS, WORSENS, DISPERSES_BY, INDICATES, OCCURS_IN

Usage:
    from intelligence.knowledge.graph import KnowledgeGraph

    graph = KnowledgeGraph()
    sources = graph.get_sources("PM2.5")
    health_effects = graph.get_health_effects("PM2.5")
    events_for_region = graph.get_events_for_conditions(month=11, region="Delhi")
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any

from intelligence.knowledge.events.definitions import EVENT_KNOWLEDGE
from intelligence.knowledge.pollutants.definitions import POLLUTANT_KNOWLEDGE

logger = logging.getLogger(__name__)


class RelationType(str, Enum):
    CAUSES = "CAUSES"                   # Source CAUSES Pollutant
    AFFECTS = "AFFECTS"                 # Pollutant AFFECTS HealthEffect
    WORSENS = "WORSENS"                 # MeteoCondition WORSENS Pollutant dispersion
    DISPERSES_BY = "DISPERSES_BY"       # Pollutant DISPERSES_BY MeteoCondition
    INDICATES = "INDICATES"             # Feature pattern INDICATES Event
    OCCURS_IN = "OCCURS_IN"            # Event OCCURS_IN Season/Month


@dataclass
class GraphNode:
    node_id: str
    node_type: str       # "pollutant", "source", "health_effect", "event", "meteo", "season"
    label: str
    attributes: dict[str, Any] = field(default_factory=dict)


@dataclass
class GraphEdge:
    from_id: str
    to_id: str
    relation: RelationType
    weight: float = 1.0          # Strength of the relationship
    attributes: dict[str, Any] = field(default_factory=dict)


class KnowledgeGraph:
    """
    Environmental Knowledge Graph for AirSense reasoning.
    Automatically populated from the Environmental Knowledge Base.
    """

    def __init__(self):
        self._nodes: dict[str, GraphNode] = {}
        self._edges: list[GraphEdge] = []
        self._build_from_ekb()

    def _add_node(self, node: GraphNode) -> None:
        if node.node_id not in self._nodes:
            self._nodes[node.node_id] = node

    def _add_edge(self, edge: GraphEdge) -> None:
        self._edges.append(edge)

    def _build_from_ekb(self) -> None:
        """Populate graph from Environmental Knowledge Base definitions."""

        # ── Pollutants and their sources / health effects ─────────────────────
        for key, p in POLLUTANT_KNOWLEDGE.items():
            poll_id = f"pollutant:{key}"
            self._add_node(GraphNode(
                node_id=poll_id,
                node_type="pollutant",
                label=p.name,
                attributes={"units": p.units, "who_daily": p.who_daily_guideline_ugm3},
            ))

            for src in p.sources:
                src_id = f"source:{src.lower().replace(' ', '_')[:30]}"
                self._add_node(GraphNode(node_id=src_id, node_type="source", label=src))
                self._add_edge(GraphEdge(from_id=src_id, to_id=poll_id, relation=RelationType.CAUSES))

            for effect in p.health_effects:
                eff_id = f"health:{effect.lower().replace(' ', '_')[:40]}"
                self._add_node(GraphNode(node_id=eff_id, node_type="health_effect", label=effect))
                self._add_edge(GraphEdge(from_id=poll_id, to_id=eff_id, relation=RelationType.AFFECTS))

        # ── Meteorological dispersion relationships ───────────────────────────
        meteo_dispersion = [
            ("low_wind", "Low Wind Speed", "WORSENS", ["pollutant:pm25", "pollutant:pm10", "pollutant:no2"]),
            ("high_humidity", "High Humidity", "WORSENS", ["pollutant:pm25"]),
            ("temperature_inversion", "Temperature Inversion", "WORSENS", ["pollutant:pm25", "pollutant:pm10"]),
            ("rainfall", "Rainfall", "DISPERSES_BY", ["pollutant:pm25", "pollutant:pm10"]),
            ("strong_wind", "Strong Wind", "DISPERSES_BY", ["pollutant:pm25", "pollutant:pm10", "pollutant:no2"]),
        ]
        for meteo_id, label, relation_str, pollutants in meteo_dispersion:
            mid = f"meteo:{meteo_id}"
            self._add_node(GraphNode(node_id=mid, node_type="meteo", label=label))
            for p_id in pollutants:
                rel = RelationType.WORSENS if relation_str == "WORSENS" else RelationType.DISPERSES_BY
                self._add_edge(GraphEdge(from_id=mid, to_id=p_id, relation=rel))

        # ── Events and their indicator pollutants ─────────────────────────────
        for key, event in EVENT_KNOWLEDGE.items():
            ev_id = f"event:{key}"
            self._add_node(GraphNode(
                node_id=ev_id,
                node_type="event",
                label=event.name,
                attributes={
                    "seasonal_months": event.seasonal_months,
                    "affected_regions": event.affected_regions,
                    "confidence_boost_features": event.confidence_boost_features,
                },
            ))
            for poll_key in event.primary_pollutants:
                self._add_edge(GraphEdge(
                    from_id=ev_id,
                    to_id=f"pollutant:{poll_key}",
                    relation=RelationType.CAUSES,
                    weight=0.9,
                ))

        logger.info(f"[KnowledgeGraph] Built: {len(self._nodes)} nodes, {len(self._edges)} edges.")

    # ── Query API ─────────────────────────────────────────────────────────────

    def get_sources(self, pollutant_key: str) -> list[str]:
        """Return known emission sources for a pollutant."""
        poll_id = f"pollutant:{pollutant_key}"
        return [
            self._nodes[e.from_id].label
            for e in self._edges
            if e.to_id == poll_id and e.relation == RelationType.CAUSES
            and self._nodes.get(e.from_id, GraphNode("", "source", "")).node_type == "source"
        ]

    def get_health_effects(self, pollutant_key: str) -> list[str]:
        """Return known health effects of a pollutant."""
        poll_id = f"pollutant:{pollutant_key}"
        return [
            self._nodes[e.to_id].label
            for e in self._edges
            if e.from_id == poll_id and e.relation == RelationType.AFFECTS
        ]

    def get_worsening_conditions(self, pollutant_key: str) -> list[str]:
        """Return meteorological conditions that worsen dispersion for a pollutant."""
        poll_id = f"pollutant:{pollutant_key}"
        return [
            self._nodes[e.from_id].label
            for e in self._edges
            if e.to_id == poll_id and e.relation == RelationType.WORSENS
        ]

    def get_events_for_conditions(self, month: int, region: str = "") -> list[str]:
        """Return events that could plausibly occur given month and region."""
        matching = []
        for ev_id, node in self._nodes.items():
            if node.node_type != "event":
                continue
            months = node.attributes.get("seasonal_months", [])
            regions = node.attributes.get("affected_regions", [])
            if month in months:
                if not region or any(region.lower() in r.lower() for r in regions) or "All" in " ".join(regions):
                    matching.append(node.label)
        return matching

    def get_events_causing_pollutant(self, pollutant_key: str) -> list[str]:
        """Return event types that are known to cause a given pollutant."""
        poll_id = f"pollutant:{pollutant_key}"
        return [
            self._nodes[e.from_id].label
            for e in self._edges
            if e.to_id == poll_id
            and e.relation == RelationType.CAUSES
            and self._nodes.get(e.from_id, GraphNode("", "", "")).node_type == "event"
        ]

    def summary(self) -> dict:
        node_types = {}
        for n in self._nodes.values():
            node_types[n.node_type] = node_types.get(n.node_type, 0) + 1
        return {"total_nodes": len(self._nodes), "total_edges": len(self._edges), "by_type": node_types}


# Module-level singleton
knowledge_graph = KnowledgeGraph()
