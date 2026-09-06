// Default data for IBVAP Border Surveillance Prototype

export const DEFAULT_CAMERAS = [
  {
    id: 1,
    name: "BOP Sector 4 - Main Fence Line",
    location: "Border Outpost Alpha - Fence Gate 4",
    stream_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    status: "ONLINE",
    ai_models_enabled: ["PERSON_DETECTION", "VEHICLE_DETECTION", "INTRUSION_DETECTION", "NIGHT_MOVEMENT"],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    name: "Checkpost Bravo - ANPR Scanner",
    location: "National Highway Border Checkpoint",
    stream_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ONLINE",
    ai_models_enabled: ["ANPR", "VEHICLE_DETECTION", "FACE_RECOGNITION"],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 3,
    name: "Sector Charlie - Night IR Perimeter",
    location: "High Altitude Surveillance Post 12",
    stream_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    status: "ONLINE",
    ai_models_enabled: ["NIGHT_MOVEMENT", "LOITERING_DETECTION", "PERSON_DETECTION"],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 4,
    name: "BOP Delta - Riverine Patrol Point",
    location: "Sector South - Creek Crossing",
    stream_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    status: "ONLINE",
    ai_models_enabled: ["INTRUSION_DETECTION", "PERSON_DETECTION"],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const DEFAULT_ZONES = [
  {
    id: 101,
    camera_id: 1,
    name: "Restricted Fence Line Alpha",
    zone_type: "INTRUSION_ZONE",
    coordinates: [[0.1, 0.4], [0.9, 0.4], [0.95, 0.85], [0.05, 0.85]],
    sensitivity: 0.85,
    is_active: true
  },
  {
    id: 102,
    camera_id: 2,
    name: "ANPR Capture Buffer Zone",
    zone_type: "RESTRICTED_AREA",
    coordinates: [[0.2, 0.2], [0.8, 0.2], [0.8, 0.7], [0.2, 0.7]],
    sensitivity: 0.90,
    is_active: true
  }
];

export const DEFAULT_WATCHLIST_PERSONS = [
  {
    id: 1,
    full_name: "Vikram Singh",
    suspect_id: "POI-2026-9041",
    threat_level: "HIGH",
    status: "WANTED",
    notes: "Flagged for repeated border fence recon activities. Sector 4 watch.",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 2,
    full_name: "Tariq Mahmood",
    suspect_id: "POI-2026-4412",
    threat_level: "CRITICAL",
    status: "WANTED",
    notes: "High risk unauthorized entry suspect. Cross-reference with BSF alert ledger.",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export const DEFAULT_WATCHLIST_VEHICLES = [
  {
    id: 1,
    plate_number: "JK-02-AB-9981",
    vehicle_type: "SUV / Off-Road",
    color: "Dark Grey",
    threat_level: "HIGH",
    notes: "Unregistered vehicle spotted near BOP Sector 4 perimeter at 02:00 AM.",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 2,
    plate_number: "PB-08-CZ-3310",
    vehicle_type: "Heavy Cargo Truck",
    color: "White",
    threat_level: "MEDIUM",
    notes: "Flagged for anomalous transit patterns at Checkpost Bravo.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

export const DEFAULT_ALERTS = [
  {
    id: 501,
    event_id: 1001,
    camera_id: 1,
    camera_name: "BOP Sector 4 - Main Fence Line",
    event_type: "INTRUSION",
    severity: "CRITICAL",
    status: "ACTIVE",
    message: "Critical Perimeter Intrusion detected at Fence Gate 4! 2 individuals crossing virtual fence.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    snapshot_path: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 502,
    event_id: 1002,
    camera_id: 2,
    camera_name: "Checkpost Bravo - ANPR Scanner",
    event_type: "ANPR_MATCH",
    severity: "HIGH",
    status: "ACTIVE",
    message: "Watchlist Plate Match: JK-02-AB-9981 detected entering Checkpost Bravo.",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    snapshot_path: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 503,
    event_id: 1003,
    camera_id: 3,
    camera_name: "Sector Charlie - Night IR Perimeter",
    event_type: "NIGHT_MOVEMENT",
    severity: "MEDIUM",
    status: "ACKNOWLEDGED",
    message: "Suspicious night movement detected in restricted zone (IR Sensor 12).",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    snapshot_path: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80"
  }
];

export const DEFAULT_EVENTS = [
  ...DEFAULT_ALERTS.map(a => ({
    id: a.event_id,
    camera_id: a.camera_id,
    event_type: a.event_type,
    severity: a.severity,
    timestamp: a.timestamp,
    plate_number: a.event_type === "ANPR_MATCH" ? "JK-02-AB-9981" : null,
    person_name: a.event_type === "FACE_MATCH" ? "Vikram Singh" : null,
    confidence: 0.94,
    bounding_box: { x: 120, y: 80, width: 200, height: 180 },
    snapshot_path: a.snapshot_path
  })),
  {
    id: 1004,
    camera_id: 2,
    event_type: "VEHICLE_DETECTED",
    severity: "LOW",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    plate_number: "DL-01-XY-1234",
    confidence: 0.98,
    snapshot_path: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 1005,
    camera_id: 1,
    event_type: "PERSON_DETECTED",
    severity: "LOW",
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    confidence: 0.91,
    snapshot_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
  }
];
