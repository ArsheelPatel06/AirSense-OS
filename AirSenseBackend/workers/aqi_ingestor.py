import logging
from datetime import datetime, timezone
from events.event_bus import event_bus, TOPIC_READING_RECEIVED

logger = logging.getLogger(__name__)

async def simulate_aqi_ingestion():
    """Dummy background job that simulates receiving new AQI data."""
    logger.info("Running simulate_aqi_ingestion background job...")
    
    # Mock data payload (this would normally be fetched from an external API or DB)
    mock_payload = {
        "station_id": "DL001",
        "aqi": 115,
        "pm25": 42.5,
        "status": "Moderate",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # Publish to Event Bus
    await event_bus.publish(TOPIC_READING_RECEIVED, mock_payload)
    logger.info(f"Published mock AQI data for {mock_payload['station_id']}")

def register_jobs(scheduler):
    """Register all background jobs with the scheduler."""
    scheduler.add_job(
        simulate_aqi_ingestion, 
        'interval', 
        seconds=60, 
        id='simulate_aqi_ingestion',
        replace_existing=True
    )
    logger.info("Registered simulate_aqi_ingestion job (60s interval)")
