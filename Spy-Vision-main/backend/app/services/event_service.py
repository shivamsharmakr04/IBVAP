from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.camera import Camera
from app.models.event import Event
from app.schemas.event import EventCreate
from app.services.alert_service import create_alert
import logging

logger = logging.getLogger(__name__)

def create_event(db: Session, event_data: EventCreate) -> Event:
    camera = (
        db.query(Camera)
        .filter(Camera.id == event_data.camera_id)
        .first()
    )

    if not camera:
        raise ValueError("Camera not found")

    event = Event(
        camera_id=event_data.camera_id,
        event_type=event_data.event_type,
        timestamp=event_data.timestamp,
        confidence=event_data.confidence,
        severity=event_data.severity,
        event_metadata=event_data.metadata,
        plate_number=event_data.plate_number,
        snapshot_path=event_data.snapshot_path,
        clip_path=event_data.clip_path,
    )

    try:
        db.add(event)

        # Generate event.id before creating the alert.
        db.flush()

        create_alert(db, event)

        # Event + Alert are committed together.
        db.commit()

        db.refresh(event)

        logger.info(
            "Event created successfully: event_id=%s, type=%s, camera_id=%s",
            event.id,
            event.event_type,
            event.camera_id,
        )
        return event

    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error while creating event")
        raise
