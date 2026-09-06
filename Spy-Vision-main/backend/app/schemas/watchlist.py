from datetime import datetime

from pydantic import BaseModel, ConfigDict


# -------------------------
# Person Watchlist
# -------------------------

class WatchlistPersonCreate(BaseModel):
    name: str
    external_reference: str | None = None
    image_path: str | None = None
    description: str | None = None
    enabled: bool = True


class WatchlistPersonUpdate(BaseModel):
    name: str | None = None
    external_reference: str | None = None
    image_path: str | None = None
    description: str | None = None
    enabled: bool | None = None


class WatchlistPersonResponse(BaseModel):
    id: int
    name: str
    external_reference: str | None
    image_path: str | None
    description: str | None
    enabled: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------------
# Vehicle Watchlist
# -------------------------

class WatchlistVehicleCreate(BaseModel):
    plate_number: str
    vehicle_type: str | None = None
    description: str | None = None
    enabled: bool = True


class WatchlistVehicleUpdate(BaseModel):
    plate_number: str | None = None
    vehicle_type: str | None = None
    description: str | None = None
    enabled: bool | None = None


class WatchlistVehicleResponse(BaseModel):
    id: int
    plate_number: str
    vehicle_type: str | None
    description: str | None
    enabled: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)