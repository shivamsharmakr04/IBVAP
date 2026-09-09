# IBVAP - Intelligent Border Video Analytics Platform

**Ministry of Home Affairs | Enterprise Border Command & Control Platform**

IBVAP is an advanced AI-powered video analytics software platform designed to transform standard CCTV and RTSP camera streams into an intelligent border surveillance command hub. It delivers real-time automated detection of personnel, vehicles, facial recognition suspects, license plates (ANPR), virtual fence breaches, and facial emotion/reaction analysis without requiring expensive proprietary hardware.

---

## 🚀 Key Features

- **Live Multi-View Command Matrix**: Multi-camera grid with real-time video simulation and laptop/RTSP camera streaming support.
- **Real-Time AI Canvas Overlays**: Dynamic bounding boxes for human/vehicle tracking, ANPR plate scans, facial emotion badges, and virtual perimeter line breaches.
- **Real-Time Facial Reaction & Emotion Analysis**: Deep facial stress and expression analytics (`SUSPICIOUS`, `AGITATED`, `NERVOUS`, `CALM`) in real time.
- **Multi-Object Identification & Classification**: Automated detection of non-person objects (unattended packages, vehicles, hazards) with confidence scoring and threat level grading.
- **Interactive Virtual Fence Configurator**: Visual interactive canvas tool for operators to draw virtual boundary lines and intrusion polygons directly over camera feeds.
- **Watchlist & Biometric Database**: Complete management system for Persons of Interest (POI) face recognition and ANPR license plate hotlists.
- **Searchable Event Audit Log**: Comprehensive historical event search (filtered by camera, severity, plate number, POI, date/time) with visual snapshot inspection.
- **Real-Time WebSocket Alerts**: Low-latency alert broadcasting (`/ws/alerts`) with audio chimes and operator workflow triggers (**Acknowledge**, **Resolve**, **Dispatch**).

---

## 🛠️ Technology Stack

### **Frontend Infrastructure**
| Technology | Version / Tooling | Purpose |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Core UI Framework with Hooks & Component Architecture |
| **Vite** | `6.1.0` | Fast Next-Gen Frontend Tooling & Dev Server (`@vitejs/plugin-react` `4.3.4`) |
| **Tailwind CSS** | `v4.0.7` | Utility-first styling with modern Engine v4 (`@tailwindcss/vite`) |
| **Icons & UI** | `lucide-react` `v0.475.0` | Tactical Command & Control Icon Suite |
| **Styling Concept** | Tactical Glassmorphism | Dark cybernetic UI theme optimized for 24/7 Control Room Monitoring |

### **Backend Infrastructure**
| Technology | Version / Tooling | Purpose |
| :--- | :--- | :--- |
| **FastAPI** | `0.141.1` | High-performance Python Async Web & REST API Framework |
| **Uvicorn** | `0.52.4` | Lightning-fast ASGI Server with `watchfiles` Hot-Reloading |
| **SQLAlchemy** | `2.0.52` | Modern Async/Sync ORM & Database Abstraction Layer |
| **Alembic** | `1.19.2` | Database Schema Migrations & Versioning |
| **Pydantic** | `2.13.5` / `pydantic-settings` | Strict Type Validation, Serialization, and Environment Settings |
| **Database** | SQLite (`ibvap.db`) / PostgreSQL 16 | Relational Storage for Events, Alerts, Watchlists & Cameras |
| **Real-Time Comms** | `websockets` `17.1` / Starlette | Full-duplex WebSocket Server (`/ws/alerts`) for instant alerts |
| **Testing & HTTP** | Pytest `9.1.1` / HTTPX `0.28.1` | Automated Testing & Async HTTP Client Requests |

### **AI & Vision Pipeline**
| Component | Engine / Model | Capabilities |
| :--- | :--- | :--- |
| **Video Engine** | OpenCV (`cv2`) | RTSP Frame Extraction, Frame Processing & Rendering |
| **Object Detection** | YOLOv8 / YOLOv11 | Multi-class Detection (Humans, Vehicles, Packages, Threats) |
| **Target Tracking** | ByteTrack / Kalman Filter | Multi-Target ID Tracking across Video Frames |
| **ANPR Engine** | Optical Character Recognition | License Plate Text Extraction & Watchlist Matching |
| **Face Analytics** | Deep Face Recognition | POI Biometric Matching & Emotion/Stress Assessment |
| **Spatial Analytics** | Convex Polygon Geo-Fencing | Virtual Fence Breach & Perimeter Intrusion Geometry |

### **DevOps & Containerization**
| Tool | Configuration | Usage |
| :--- | :--- | :--- |
| **Docker** | Multi-Stage Container Build | Containerized Backend Runtime Environment |
| **Docker Compose** | Services Orchestration | Orchestrates FastAPI Backend + PostgreSQL 16 DB |

---

## 📁 Repository Structure

```
IBVAP/
├── Spy-Vision-main/
│   ├── backend/
│   │   ├── alembic/              # Database migration scripts
│   │   ├── app/
│   │   │   ├── models/           # SQLAlchemy Data Models (User, Camera, Zone, Alert, Event, etc.)
│   │   │   ├── routers/          # FastAPI API Endpoints (Cameras, Zones, Events, Watchlist, etc.)
│   │   │   ├── schemas/          # Pydantic Schemas & Data Transfer Objects
│   │   │   ├── services/         # Business Logic & Media Services
│   │   │   ├── utils/            # Authentication & Logging Utilities
│   │   │   ├── websocket/        # Real-time WebSocket Connection Manager
│   │   │   ├── main.py           # Application Entrypoint & Middleware
│   │   │   └── config.py         # System Configuration & Settings
│   │   ├── media/                # Saved Snapshots & Camera Media Storage
│   │   ├── requirements.txt      # Python Backend Dependencies
│   │   ├── Dockerfile            # Backend Docker Build Blueprint
│   │   └── docker-compose.yml    # Full-Stack Container Service Definition
│   └── frontend/
│       ├── src/
│       │   ├── api/              # API Client (Axios/Fetch Wrapper & WS Client)
│       │   ├── components/       # UI Components (Command Matrix, Zone Editor, Watchlist, etc.)
│       │   ├── App.jsx           # Main Dashboard Layout & Route Orchestration
│       │   └── main.jsx          # React DOM Root Entrypoint
│       ├── index.html            # Application HTML Entry
│       ├── vite.config.js        # Vite 6 + Tailwind v4 Configuration
│       └── package.json          # Frontend Dependencies & Scripts
└── README.md
```

---

## ⚡ Quick Start Guide

### Option A: Local Development

#### 1. Backend Setup
```bash
cd Spy-Vision-main/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc API Spec**: `http://localhost:8000/redoc`

#### 2. Frontend Setup
```bash
cd Spy-Vision-main/frontend
npm install
npm run dev
```
- **Frontend Command Center**: `http://localhost:3000`

---

### Option B: Docker Container Deployment

Run the complete backend stack with PostgreSQL 16:
```bash
cd Spy-Vision-main/backend
docker-compose up --build -d
```

---

## 🔒 Security & Compliance

- **Role-Based Access Control (RBAC)**: Secure operator and supervisor API access.
- **Audit Logging**: Immutable event log recording all detection events and operator interventions.
- **CORS Middleware Configured**: Enforced origin validation on backend routers.

