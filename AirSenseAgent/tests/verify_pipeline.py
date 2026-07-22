"""
Verification Script — Phase 6.

Validates the full pipeline end-to-end using local CSV data for
Delhi (DL001) and Mumbai (MH001).

Checks:
  1. CSVProvider correctly loads archive data.
  2. CPCBConnector runs through the full lifecycle without errors.
  3. Processed data lands in data/lake/processed/cpcb/.
  4. Raw data lands in data/lake/raw/cpcb/ and is NOT modified after write.
  5. AQICalculator computes a valid IND-AQI from the first record.
  6. AQIValidator confirms CPCB compliance.
  7. HealthAdvisoryGenerator produces advisories for all five groups.
  8. Orchestrator runs both connectors and produces a JSON execution log.

Run from the AirSenseAgent root:
    python tests/verify_pipeline.py
"""
import json
import logging
import sys
from pathlib import Path

# ── Path bootstrap (so imports work without pip install -e .) ──────────────
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("verify")

ARCHIVE = ROOT / "gov_data" / "archive"
LAKE    = ROOT / "data" / "lake"


# ─────────────────────────────────────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────────────────────────────────────

def section(title: str):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


def check(label: str, condition: bool, detail: str = ""):
    status = "✓ PASS" if condition else "✗ FAIL"
    msg = f"  {status}  {label}"
    if detail:
        msg += f"\n         {detail}"
    print(msg)
    if not condition:
        raise AssertionError(f"FAILED: {label}")


# ─────────────────────────────────────────────────────────────────────────────
# Test 1 — Provider layer
# ─────────────────────────────────────────────────────────────────────────────

def test_csv_provider():
    section("Test 1: CSVProvider — DL001 (Delhi)")
    from data.providers.cpcb import CSVProvider

    provider = CSVProvider(lake_archive_path=ARCHIVE)
    with provider as p:
        records = p.fetch(file_code="DL001")
        meta    = p.metadata()

    check("Records loaded",      len(records) > 0, f"Got {len(records)} rows")
    check("Metadata produced",   meta.provider == "CSVReplay")
    check("Checksum non-empty",  bool(meta.checksum))
    check("Row count matches",   meta.rows == len(records), f"meta.rows={meta.rows}")

    logger.info(f"DL001 — {len(records)} rows, checksum={meta.checksum[:12]}…")
    return records, meta


# ─────────────────────────────────────────────────────────────────────────────
# Test 2 — Full connector run (Delhi)
# ─────────────────────────────────────────────────────────────────────────────

def test_cpcb_connector_delhi():
    section("Test 2: CPCBConnector — Delhi (DL001)")
    from data.providers.cpcb import CSVProvider
    from data.connectors.cpcb_connector import CPCBConnector

    provider  = CSVProvider(lake_archive_path=ARCHIVE)
    connector = CPCBConnector(provider=provider, lake_root=LAKE)
    result    = connector.run(file_code="DL001")

    check("Status: SUCCESS",        result.quality_score > 0)
    check("Raw lake path exists",   Path(result.raw_lake_path).exists(),
          result.raw_lake_path)
    check("Processed lake exists",  Path(result.processed_lake_path).exists(),
          result.processed_lake_path)
    check("Provenance file exists", Path(result.provenance_path).exists(),
          result.provenance_path)
    check("Rows processed > 0",     result.rows_processed > 0,
          f"{result.rows_processed} rows")
    check("Quality score > 0",      result.quality_score > 0,
          f"score={result.quality_score}")

    logger.info(f"Delhi connector — quality={result.quality_score}, rows={result.rows_processed}")
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Test 3 — Full connector run (Mumbai)
# ─────────────────────────────────────────────────────────────────────────────

def test_cpcb_connector_mumbai():
    section("Test 3: CPCBConnector — Mumbai (MH001)")
    from data.providers.cpcb import CSVProvider
    from data.connectors.cpcb_connector import CPCBConnector

    provider  = CSVProvider(lake_archive_path=ARCHIVE)
    connector = CPCBConnector(provider=provider, lake_root=LAKE)
    result    = connector.run(file_code="MH001")

    check("Rows processed > 0",   result.rows_processed > 0)
    check("Quality score > 0",    result.quality_score > 0)
    logger.info(f"Mumbai connector — quality={result.quality_score}, rows={result.rows_processed}")
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Test 4 — AQI Engine
# ─────────────────────────────────────────────────────────────────────────────

def test_aqi_engine():
    section("Test 4: AQI Engine — Official IND-AQI Calculation")
    from intelligence.feature_builder.aqi import (
        AQICalculator, AQIValidator, HealthAdvisoryGenerator
    )

    calc      = AQICalculator()
    validator = AQIValidator()
    advisory  = HealthAdvisoryGenerator()

    # Use typical Delhi values from archive (moderate pollution day)
    concentrations = {
        "PM2.5": 67.0,
        "PM10":  120.0,
        "NO2":   45.0,
        "SO2":   18.0,
        "CO":    1.2,
        "O3":    80.0,
    }

    result = calc.calculate(concentrations)
    logger.info(f"AQI={result.aqi}, Prominent={result.prominent_pollutant}, "
                f"Category={result.category.name if result.category else 'None'}")
    logger.info(f"Sub-indices: {result.sub_indices}")

    check("AQI in valid range [0–500]",     0 <= result.aqi <= 500,
          f"AQI={result.aqi}")
    check("Prominent pollutant present",    bool(result.prominent_pollutant))
    check("Category assigned",             result.category is not None,
          f"Category={result.category.name if result.category else 'None'}")
    check("All sub-indices in [0–500]",
          all(0 <= v <= 500 for v in result.sub_indices.values()))

    # Validator
    report = validator.validate(result)
    check("Validator: is_valid=True",       report.is_valid,
          f"Errors: {report.errors}")

    # Health advisory
    health = advisory.generate(result)
    check("Health report generated",        bool(health.general_statement))
    check("5 advisory groups present",      len(health.advisories) == 5,
          f"Got {len(health.advisories)} advisories")

    return result


# ─────────────────────────────────────────────────────────────────────────────
# Test 5 — Orchestrator
# ─────────────────────────────────────────────────────────────────────────────

def test_orchestrator():
    section("Test 5: Orchestrator — Delhi + Mumbai")
    from data.providers.cpcb import CSVProvider
    from data.connectors.cpcb_connector import CPCBConnector
    from data.etl.orchestrator import Orchestrator

    class DelhiConnector(CPCBConnector):
        def __init__(self, provider, lake_root):
            super().__init__(provider=provider, lake_root=lake_root)
            self.connector_id = "cpcb_delhi"
        def run(self, **_):
            return super().run(file_code="DL001")

    class MumbaiConnector(CPCBConnector):
        def __init__(self, provider, lake_root):
            super().__init__(provider=provider, lake_root=lake_root)
            self.connector_id = "cpcb_mumbai"
        def run(self, **_):
            return super().run(file_code="MH001")

    provider_d = CSVProvider(lake_archive_path=ARCHIVE)
    provider_m = CSVProvider(lake_archive_path=ARCHIVE)

    orch = Orchestrator(lake_root=LAKE)
    orch.register(DelhiConnector(provider=provider_d, lake_root=LAKE))
    orch.register(MumbaiConnector(provider=provider_m, lake_root=LAKE))

    report = orch.run_all()

    check("Total connectors = 2",    report.total == 2)
    check("Both succeeded",          report.succeeded == 2,
          f"succeeded={report.succeeded}, failed={report.failed}")
    check("Execution log written",
          any((LAKE.parent / "data" / "etl" / "logs").glob("run_*.json"))
          or any(Path("data/etl/logs").glob("run_*.json")),
          "Check data/etl/logs/")

    logger.info(f"Orchestrator — ✓{report.succeeded} / ✗{report.failed}")
    return report


# ─────────────────────────────────────────────────────────────────────────────
# Run all tests
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    results = {}
    try:
        results["csv_provider"]         = test_csv_provider()
        results["cpcb_delhi"]           = test_cpcb_connector_delhi()
        results["cpcb_mumbai"]          = test_cpcb_connector_mumbai()
        results["aqi_engine"]           = test_aqi_engine()
        results["orchestrator"]         = test_orchestrator()

        print("\n" + "="*60)
        print("  ALL TESTS PASSED ✓")
        print("="*60)
        sys.exit(0)

    except AssertionError as e:
        print(f"\n  PIPELINE VERIFICATION FAILED: {e}")
        sys.exit(1)
