from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class AlertSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"


class AlertResponse(BaseModel):
    id: int
    event_id: int
    severity: AlertSeverity
    status: AlertStatus
    message: str
    created_at: datetime
    acknowledged_at: datetime | None
    resolved_at: datetime | None

    model_config = ConfigDict(from_attributes=True)



# from datetime import datetime

# from pydantic import BaseModel, ConfigDict


# class AlertResponse(BaseModel):
#     id: int
#     event_id: int
#     severity: str
#     status: str
#     message: str
#     created_at: datetime
#     acknowledged_at: datetime | None
#     resolved_at: datetime | None

#     model_config = ConfigDict(from_attributes=True)