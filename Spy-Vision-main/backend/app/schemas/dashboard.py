from pydantic import BaseModel


class CameraStats(BaseModel):
    total: int
    online: int
    offline: int


class DashboardStatsResponse(BaseModel):
    cameras: CameraStats
    events_today: int
    active_alerts: int
    intrusions_today: int
    vehicles_today: int
    people_today: int