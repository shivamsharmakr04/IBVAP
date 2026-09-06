from fastapi.testclient import TestClient

from app.main import app
from uuid import uuid4
client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_create_event():
    response = client.post(
        "/api/v1/events",
        json={
            "camera_id": 1,
            "event_type": "INTRUSION",
            "timestamp": "2026-09-05T10:00:00Z",
            "confidence": 0.95,
            "severity": "HIGH",
            "metadata": {
                "object_type": "person"
            }
        },
        headers={
            "X-AI-API-Key": "ibvap-ai-secret-2026"
        },
    )

    assert response.status_code == 201
    assert response.json()["event_type"] == "INTRUSION"


def test_create_event_without_api_key():
    response = client.post(
        "/api/v1/events",
        json={
            "camera_id": 1,
            "event_type": "INTRUSION",
            "timestamp": "2026-09-05T10:00:00Z",
            "confidence": 0.95,
            "severity": "HIGH",
        },
    )

    assert response.status_code == 401



def test_create_event_with_invalid_api_key():
    response = client.post(
        "/api/v1/events",
        json={
            "camera_id": 1,
            "event_type": "INTRUSION",
            "timestamp": "2026-09-05T10:00:00Z",
            "confidence": 0.95,
            "severity": "HIGH",
        },
        headers={
            "X-AI-API-Key": "wrong-key",
        },
    )

    assert response.status_code == 401

def test_intrusion_creates_alert():
    response = client.post(
        "/api/v1/events",
        json={
            "camera_id": 1,
            "event_type": "INTRUSION",
            "timestamp": "2026-09-05T10:00:00Z",
            "confidence": 0.95,
            "severity": "HIGH",
        },
        headers={"X-AI-API-Key": "ibvap-ai-secret-2026"},
    )

    assert response.status_code == 201

    event_id = response.json()["id"]

    alert_response = client.get(f"/api/v1/alerts")

    assert alert_response.status_code == 200
    alerts = alert_response.json()

    assert any(alert["event_id"] == event_id for alert in alerts)


def test_watchlist_plate_creates_alert():
    plate_number = f"UP32TEST{uuid4().hex[:4].upper()}"

    watchlist_response = client.post(
        "/api/v1/watchlist/vehicles",
        json={
            "plate_number": plate_number,
            "vehicle_type": "SUV",
            "description": "Test vehicle",
            "enabled": True,
        },
    )

    assert watchlist_response.status_code == 201

    event_response = client.post(
        "/api/v1/events",
        json={
            "camera_id": 1,
            "event_type": "PLATE_DETECTED",
            "timestamp": "2026-09-05T10:00:00Z",
            "confidence": 0.98,
            "severity": "LOW",
            "plate_number": plate_number,
        },
        headers={
            "X-AI-API-Key": "ibvap-ai-secret-2026"
        },
    )

    assert event_response.status_code == 201