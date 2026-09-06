from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.alert import Alert
from app.models.camera import Camera
from app.models.event import Event
from app.schemas.dashboard import DashboardStatsResponse

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    start_of_day = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    total_cameras = db.query(Camera).count()

    online_cameras = (
        db.query(Camera)
        .filter(Camera.status == "ONLINE")
        .count()
    )

    offline_cameras = total_cameras - online_cameras

    events_today = (
        db.query(Event)
        .filter(Event.timestamp >= start_of_day)
        .count()
    )

    active_alerts = (
        db.query(Alert)
        .filter(Alert.status == "ACTIVE")
        .count()
    )

    intrusions_today = (
        db.query(Event)
        .filter(
            Event.event_type == "INTRUSION",
            Event.timestamp >= start_of_day,
        )
        .count()
    )

    vehicles_today = (
        db.query(Event)
        .filter(
            Event.event_type == "VEHICLE_DETECTED",
            Event.timestamp >= start_of_day,
        )
        .count()
    )

    people_today = (
        db.query(Event)
        .filter(
            Event.event_type == "PERSON_DETECTED",
            Event.timestamp >= start_of_day,
        )
        .count()
    )

    return {
        "cameras": {
            "total": total_cameras,
            "online": online_cameras,
            "offline": offline_cameras,
        },
        "events_today": events_today,
        "active_alerts": active_alerts,
        "intrusions_today": intrusions_today,
        "vehicles_today": vehicles_today,
        "people_today": people_today,
    }