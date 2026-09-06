from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from sqlalchemy import text

from app.config import settings
from app.database import engine, Base

# Import all models to register with Base.metadata
from app.models.camera import Camera
from app.models.zone import Zone
from app.models.event import Event
from app.models.alert import Alert
from app.models.watchlist_person import WatchlistPerson
from app.models.watchlist_vehicle import WatchlistVehicle
from app.models.user import User

from app.routers.cameras import router as cameras_router
from app.routers.zones import router as zones_router
from app.routers.events import router as events_router
from app.routers.alerts import router as alerts_router
from app.routers.media import router as media_router
from app.websocket.manager import manager
from app.routers import watchlist
from app.routers import dashboard
from app.utils.logging import setup_logging
from fastapi.middleware.cors import CORSMiddleware

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_logging()

app.include_router(cameras_router)
app.include_router(zones_router)
app.include_router(events_router)
app.include_router(alerts_router)
app.include_router(watchlist.router)
app.include_router(dashboard.router)
app.include_router(media_router)


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@app.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)