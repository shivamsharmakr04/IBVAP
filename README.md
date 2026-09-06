# IBVAP - Intelligent Border Video Analytics Platform

**Ministry of Home Affairs | Enterprise Border Command & Control Platform**

IBVAP is an AI software layer that transforms standard CCTV camera infrastructure into an intelligent border surveillance hub. It delivers real-time automated detection of people, vehicles, faces, license plates (ANPR), virtual fence breaches, and facial emotion/reaction analysis without requiring expensive proprietary hardware.

---

## Key Features

- **Live Multi-View Command Matrix**: Multi-camera grid with real-time video simulation and laptop webcam streaming support.
- **Real-Time AI Canvas Overlays**: Bounding boxes for human/vehicle tracking, ANPR plate scans, facial emotion badges, and virtual perimeter lines.
- **Real-Time Facial Reaction & Emotion Analysis**: Analyzes facial stress levels and expressions (`SUSPICIOUS`, `AGITATED`, `NERVOUS`, `CALM`) in real time.
- **Multi-Object Identification & Classification**: Detects non-person objects (unattended packages, vehicles, hazards) with confidence scores and threat levels.
- **Interactive Virtual Fence Configurator**: Visual canvas tool to draw virtual lines and intrusion detection polygons on camera feeds.
- **Watchlist & Biometric Database**: Full management for face recognition suspects (Persons of Interest) and ANPR license plate flags.
- **Searchable Event Audit Log**: Multi-filter historical event search (by camera, severity, plate number, date/time) with snapshot inspection.
- **Real-Time WebSocket Alerts**: Instant alert broadcasting (`/ws/alerts`) with audio chime and operator actions (**Acknowledge**, **Resolve**, **Dispatch**).

---

## Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide Icons, Custom Tactical Glassmorphism Styling.
- **Backend**: FastAPI, SQLAlchemy, SQLite (`ibvap.db`), WebSockets (`/ws/alerts`).
- **Processing**: OpenCV, YOLOv8/v11, ByteTrack, ANPR, Face Recognition.

---

## Getting Started

### 1. Backend Setup
```bash
cd Spy-Vision-main/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Backend server will run at `http://localhost:8000` (API documentation available at `http://localhost:8000/docs`).

### 2. Frontend Setup
```bash
cd Spy-Vision-main/frontend
npm install
npm run dev
```
Frontend server will run at `http://localhost:3000`.

---

## Repository Structure

```
IBVAP/
├── Spy-Vision-main/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── models/
│   │   │   ├── routers/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── websocket/
│   │   │   ├── main.py
│   │   │   └── config.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
└── README.md
```
