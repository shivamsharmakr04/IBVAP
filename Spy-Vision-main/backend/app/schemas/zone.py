from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ZoneBase(BaseModel):
    name: str
    type: str
    coordinates: dict
    enabled: bool = True


class ZoneCreate(ZoneBase):
    pass


class ZoneUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    coordinates: dict | None = None
    enabled: bool | None = None


class ZoneResponse(ZoneBase):
    id: int
    camera_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)