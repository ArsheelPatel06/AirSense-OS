"""
Official Indian AQI Breakpoints.

Source: CPCB Technical Report — "Measurement of CAQI and AQI for Indian Conditions"
        (FINAL-REPORT_AQI_.pdf, knowledge/standards/)

The Indian National AQI (IND-AQI) covers EIGHT pollutants.
Each has its own set of concentration breakpoints and corresponding AQI breakpoints.

Structure of each entry in BREAKPOINTS:
    [(C_lo, C_hi, I_lo, I_hi), ...]
    where:
        C_lo / C_hi — concentration range (µg/m³ or ppb as noted)
        I_lo / I_hi — corresponding AQI sub-index range

All values are sourced directly from Table 1 of the CPCB technical report.
"""

from __future__ import annotations

# Averaging period per pollutant (as specified in the CPCB report)
AVERAGING_PERIODS: dict[str, str] = {
    "PM2.5": "24-hour",
    "PM10": "24-hour",
    "NO2": "24-hour",
    "SO2": "24-hour",
    "CO": "8-hour",
    "O3": "8-hour",
    "NH3": "24-hour",
    "Pb": "24-hour",
}

# ---------------------------------------------------------------------------
# Official Breakpoint Tables (CPCB Technical Report — Table 1)
# Each sub-list: (C_low, C_high, AQI_low, AQI_high)
# ---------------------------------------------------------------------------

BREAKPOINTS: dict[str, list[tuple[float, float, int, int]]] = {

    # PM2.5  (µg/m³ — 24-hr average)
    "PM2.5": [
        (0.0,   30.0,   0,    50),
        (30.0,  60.0,   51,  100),
        (60.0,  90.0,  101,  200),
        (90.0, 120.0,  201,  300),
        (120.0, 250.0, 301,  400),
        (250.0, 380.0, 401,  500),
    ],

    # PM10  (µg/m³ — 24-hr average)
    "PM10": [
        (0.0,    50.0,   0,   50),
        (50.0,  100.0,  51,  100),
        (100.0, 250.0, 101,  200),
        (250.0, 350.0, 201,  300),
        (350.0, 430.0, 301,  400),
        (430.0, 600.0, 401,  500),
    ],

    # NO2  (µg/m³ — 24-hr average)
    "NO2": [
        (0.0,    40.0,   0,   50),
        (40.0,   80.0,  51,  100),
        (80.0,  180.0, 101,  200),
        (180.0, 280.0, 201,  300),
        (280.0, 400.0, 301,  400),
        (400.0, 800.0, 401,  500),
    ],

    # SO2  (µg/m³ — 24-hr average)
    "SO2": [
        (0.0,    40.0,   0,   50),
        (40.0,   80.0,  51,  100),
        (80.0,  380.0, 101,  200),
        (380.0, 800.0, 201,  300),
        (800.0, 1600.0, 301, 400),
        (1600.0, 2100.0, 401, 500),
    ],

    # CO  (mg/m³ — 8-hr average)
    "CO": [
        (0.0,   1.0,    0,   50),
        (1.0,   2.0,   51,  100),
        (2.0,  10.0,  101,  200),
        (10.0, 17.0,  201,  300),
        (17.0, 34.0,  301,  400),
        (34.0, 50.0,  401,  500),
    ],

    # O3 / Ozone  (µg/m³ — 8-hr average)
    "O3": [
        (0.0,   50.0,   0,   50),
        (50.0, 100.0,  51,  100),
        (100.0, 168.0, 101, 200),
        (168.0, 208.0, 201, 300),
        (208.0, 748.0, 301, 400),
        (748.0, 1000.0, 401, 500),
    ],

    # NH3  (µg/m³ — 24-hr average)
    "NH3": [
        (0.0,    200.0,   0,   50),
        (200.0,  400.0,  51,  100),
        (400.0,  800.0, 101,  200),
        (800.0, 1200.0, 201,  300),
        (1200.0, 1800.0, 301, 400),
        (1800.0, 2400.0, 401, 500),
    ],

    # Lead / Pb  (µg/m³ — 24-hr average)
    "Pb": [
        (0.0,   0.5,    0,   50),
        (0.5,   1.0,   51,  100),
        (1.0,   2.0,  101,  200),
        (2.0,   3.0,  201,  300),
        (3.0,   3.5,  301,  400),
        (3.5,   4.0,  401,  500),
    ],
}

# Supported pollutant names (canonical)
POLLUTANTS: list[str] = list(BREAKPOINTS.keys())
