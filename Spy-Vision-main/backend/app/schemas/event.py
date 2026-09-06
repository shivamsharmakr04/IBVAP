from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class EventType(str, Enum):
    PERSON_DETECTED = "PERSON_DETECTED"
    VEHICLE_DETECTED = "VEHICLE_DETECTED"
    FACE_MATCH = "FACE_MATCH"
    PLATE_DETECTED = "PLATE_DETECTED"
    INTRUSION = "INTRUSION"
    LOITERING = "LOITERING"
    NIGHT_MOVEMENT = "NIGHT_MOVEMENT"
    OBJECT_DETECTED = "OBJECT_DETECTED"
    REACTION_ANALYSIS = "REACTION_ANALYSIS"
    ANPR_MATCH = "ANPR_MATCH"


class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class EventCreate(BaseModel):
    camera_id: int
    event_type: EventType
    timestamp: datetime
    confidence: float | None = Field(default=None, ge=0, le=1)
    severity: Severity = Severity.LOW
    metadata: dict | None = None
    plate_number: str | None = None
    snapshot_path: str | None = None
    clip_path: str | None = None


class EventResponse(BaseModel):
    id: int
    camera_id: int
    event_type: EventType
    timestamp: datetime
    confidence: float | None
    severity: Severity
    metadata: dict | None = Field(default=None, alias="event_metadata")
    plate_number: str | None
    snapshot_path: str | None
    clip_path: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class EventListResponse(BaseModel):
    items: list[EventResponse]
    total: int
    page: int
    limit: int