"""
Base Provider Interface.

Every provider in AirSense (CPCB, IMD, Sentinel, OSM) must implement this ABC.
Providers are responsible ONLY for raw communication with the external source.
They know nothing about the lake, connectors, or the feature store.

Lifecycle:
    connect() -> authenticate() -> fetch() -> metadata() -> close()
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class ProviderMetadata:
    """Provenance record automatically produced after every fetch."""
    provider: str
    dataset: str
    download_time: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    rows: int = 0
    checksum: str = ""
    quality: float = 0.0
    source_url: str = ""
    extra: dict = field(default_factory=dict)


class BaseProvider(ABC):
    """
    Abstract base for all data providers.

    Providers handle the 'how' of data retrieval.
    Connectors handle the 'what' (parsing, normalizing, storing).
    These two concerns must never be mixed.
    """

    def __init__(self, name: str, config: dict | None = None):
        self.name = name
        self.config = config or {}
        self._connected = False

    # ------------------------------------------------------------------
    # Lifecycle (enforced ordering: connect → auth → fetch → close)
    # ------------------------------------------------------------------

    @abstractmethod
    def connect(self) -> None:
        """Establish a connection / open a session to the data source."""
        ...

    @abstractmethod
    def authenticate(self) -> None:
        """Authenticate with the data source (API key, OAuth, etc.)."""
        ...

    @abstractmethod
    def fetch(self, **kwargs) -> Any:
        """
        Download or retrieve raw data.

        Returns raw bytes, a dict, a file path, or any provider-specific
        payload. The connector is responsible for further processing.
        """
        ...

    @abstractmethod
    def metadata(self) -> ProviderMetadata:
        """
        Return a ProviderMetadata record describing the last fetch.

        This is automatically attached to every raw-lake write as
        a sidecar JSON file.
        """
        ...

    def close(self) -> None:
        """
        Release resources (HTTP sessions, file handles, etc.).
        Override when needed; default is a no-op.
        """
        self._connected = False

    # ------------------------------------------------------------------
    # Context-manager support  (with CPCBProvider(...) as p:)
    # ------------------------------------------------------------------

    def __enter__(self):
        self.connect()
        self.authenticate()
        return self

    def __exit__(self, *_):
        self.close()

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r} connected={self._connected}>"
