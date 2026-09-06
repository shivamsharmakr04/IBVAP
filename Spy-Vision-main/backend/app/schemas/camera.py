from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class CameraStatus(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"


class CameraBase(BaseModel):
    name: str
    location: str
    stream_url: str
    status: CameraStatus = CameraStatus.OFFLINE


class CameraCreate(CameraBase):
    pass


class CameraUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    stream_url: str | None = None
    status: CameraStatus | None = None


class CameraResponse(CameraBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# from datetime import datetime

# from pydantic import BaseModel, ConfigDict


# class CameraBase(BaseModel):
#     name: str
#     location: str
#     stream_url: str
#     status: str = "OFFLINE"


# class CameraCreate(CameraBase):
#     pass


# class CameraUpdate(BaseModel):
#     name: str | None = None
#     location: str | None = None
#     stream_url: str | None = None
#     status: str | None = None


# class CameraResponse(CameraBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime

#     model_config = ConfigDict(from_attributes=True)