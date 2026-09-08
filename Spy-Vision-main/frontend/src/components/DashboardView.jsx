import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Video, 
  CheckCircle, 
  AlertTriangle, 
  Car, 
  User, 
  Eye, 
  Zap, 
  Camera, 
  Smile, 
  Package,
  Radio,
  Sliders,
  Crosshair,
  Maximize2,
  Lock,
  Search,
  BellRing,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Volume2,
  RotateCcw,
  Bookmark,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function DashboardView({ 
  stats, 
  cameras, 
  alerts, 
  onAcknowledgeAlert, 
  onResolveAlert, 
  onSelectCameraForZone,
  onOpenSimulation,
  onTriggerWebcamAlert
}) {
  const [activeCamIndex, setActiveCamIndex] = useState(1); // CAM-02 (Breach)
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [useWebcamOnCam1, setUseWebcamOnCam1] = useState(false);
  const [commandInput, setCommandInput] = useState('');

  // Overlays toggle state
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showAnprPlates, setShowAnprPlates] = useState(true);
  const [showEmotionMeters, setShowEmotionMeters] = useState(true);
  const [showFencePolygons, setShowFencePolygons] = useState(true);

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  return (
    <div className="p-3 font-mono bg-[#f1f5f9] text-slate-900 min-h-screen">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: TACTICAL SECTORS & AI PIPELINES (3 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 space-y-3">
          {/* Sector Status List */}
          <div className="tactical-card p-3 rounded-md space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                TACTICAL SECTORS
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">ONLINE</span>
            </div>

            <div className="space-y-1.5 text-[10px] font-bold">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-slate-800">SECTOR 4A - NORTH GATE</p>
                </div>
                <span className="text-emerald-600">4 CAMS</span>
              </div>

              <div className="p-2 bg-rose-50 rounded border border-rose-200 flex items-center justify-between text-rose-700">
                <div>
                  <p className="font-bold">SECTOR 4B - PERIMETER WEST</p>
                </div>
                <span className="text-rose-600 font-extrabold">3 CAMS</span>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-slate-800">SECTOR 4C - BUFFER ZONE</p>
                </div>
                <span className="text-amber-600">3 CAMS</span>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-slate-800">SECTOR 4D - SATELLITE RADAR</p>
                </div>
                <span className="text-emerald-600">2 CAMS</span>
              </div>
            </div>
          </div>

          {/* AI Model Pipelines */}
          <div className="tactical-card p-3 rounded-md space-y-2">
            <div className="pb-1 border-b border-slate-300">
              <span className="text-[10px] font-bold text-slate-600 uppercase">AI MODEL PIPELINES</span>
            </div>

            <div className="space-y-1.5 text-[10px] font-bold">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  YOLOv9-BORDER-DET
                </span>
                <span className="text-slate-500 font-mono">99.4%</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  DEEP-STRESS-VOX
                </span>
                <span className="text-slate-500 font-mono">98.1%</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ANPR-IND-OCR-V4
                </span>
                <span className="text-slate-500 font-mono">99.8%</span>
              </div>
            </div>
          </div>

          {/* Hardware Compute Node Status */}
          <div className="tactical-card p-3 rounded-md space-y-2 text-[10px] bg-slate-50">
            <div className="flex items-center justify-between text-slate-600 border-b border-slate-200 pb-1 font-bold">
              <span>HARDWARE COMPUTE</span>
              <span className="text-cyan-700">4x A100 GPU</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>VRAM: 48GB / 88GB</span>
              <span>FPS: 144Hz</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: METRICS + STREAMS + TOOLBAR (7 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Top 4 Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            
            {/* Card 1: Targets Tracked */}
            <div className="tactical-card p-3 rounded-md space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>TOTAL TARGETS TRACKED</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300 font-mono text-[9px]">BYTETRACK</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">142</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑+18/min</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold border-t border-slate-200 pt-1">
                <span>VECTORS: 88 PEDESTRIAN</span>
                <span>54 VEHICULAR</span>
              </div>
            </div>

            {/* Card 2: Perimeter Breach Status */}
            <div className="tactical-card p-3 rounded-md space-y-1.5 border-rose-300 bg-rose-50/40">
              <div className="flex items-center justify-between text-[10px] font-bold text-rose-700 uppercase">
                <span>PERIMETER STATUS</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold animate-pulse">BREACH ACTIVE</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight">01</span>
                <div className="text-[9px] text-rose-700 font-bold">
                  <p>SECTOR 07-W</p>
                  <p>GRID: 43.19°N</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-rose-600 font-bold border-t border-rose-200 pt-1">
                <span>VIRTUAL TRIPWIRE OVERRUN</span>
                <span>12ms</span>
              </div>
            </div>

            {/* Card 3: ANPR Passes */}
            <div className="tactical-card p-3 rounded-md space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>ANPR VEHICLE PASSES</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[9px]">OCR 99.4%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">1,289</span>
                <div className="text-[9px] text-slate-500 font-bold">
                  <p>SHIFT TOTAL</p>
                  <p className="text-amber-600">1 FLAG WATCHLIST</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold border-t border-slate-200 pt-1">
                <span>INBOUND: 742</span>
                <span>OUTBOUND: 547</span>
              </div>
            </div>

            {/* Card 4: Emotion Anomalies */}
            <div className="tactical-card p-3 rounded-md space-y-1.5 border-amber-300 bg-amber-50/40">
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 uppercase">
                <span>EMOTION ANOMALIES</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[9px]">DEEP-STRESS AI</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-amber-700 font-mono tracking-tight">04</span>
                  <span className="text-[10px] text-amber-700 font-bold ml-1">AGITATED / SUSP</span>
                </div>
                <div className="w-6 h-6 rounded bg-amber-200 text-amber-800 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-amber-800 font-bold border-t border-amber-200 pt-1">
                <span>MAX GSR COEFF: 0.88</span>
                <span className="text-rose-600">BOOTH 03 HOLD</span>
              </div>
            </div>

          </div>

          {/* Stream Sub-Toolbar */}
          <div className="bg-white p-2 rounded-md border border-slate-300 flex flex-wrap items-center justify-between text-[10px] font-bold gap-2">
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 bg-cyan-600 text-white rounded font-bold border border-cyan-700 cursor-pointer">2x2</button>
              <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-300 hover:bg-slate-200 cursor-pointer">3x3</button>
              <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-300 hover:bg-slate-200 cursor-pointer">1+5 SPOTLIGHT</button>
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300">● RTSP EDGE NODES</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`px-2 py-1 rounded border cursor-pointer ${showBoundingBoxes ? 'bg-cyan-50 text-cyan-800 border-cyan-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
              >
                [ ] BOUNDING BOXES
              </button>
              <button 
                onClick={() => setShowAnprPlates(!showAnprPlates)}
                className={`px-2 py-1 rounded border cursor-pointer ${showAnprPlates ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
              >
                🪪 ANPR PLATES
              </button>
              <button 
                onClick={() => setShowEmotionMeters(!showEmotionMeters)}
                className={`px-2 py-1 rounded border cursor-pointer ${showEmotionMeters ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
              >
                😊 EMOTION METERS
              </button>
              <button 
                onClick={() => setShowFencePolygons(!showFencePolygons)}
                className={`px-2 py-1 rounded border cursor-pointer ${showFencePolygons ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
              >
                ⬡ FENCE POLYGONS
              </button>
            </div>
          </div>

          {/* 4 Video Feeds in 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            
            {/* Feed 1: CAM-01 [NORTH MAIN] */}
            <div className="relative aspect-video bg-slate-950 rounded border-2 border-slate-800 overflow-hidden font-mono text-[10px]">
              {/* Header bar overlay */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 text-cyan-400 px-2 py-1 border-b border-cyan-500/30 flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  CAM-01 [NORTH MAIN 1080P @ 29.8FPS]
                </span>
                <span className="text-cyan-300 font-mono">4.2 Mbps</span>
              </div>
              <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Feed 1" className="w-full h-full object-cover opacity-80" />
              
              {/* Target Bounding Box Reticle */}
              {showBoundingBoxes && (
                <div className="absolute top-1/3 left-1/4 w-36 h-28 border-2 border-cyan-400 bg-cyan-400/10 p-1 flex flex-col justify-between">
                  <div className="bg-cyan-500 text-slate-950 font-bold px-1 text-[9px] w-max">
                    ID: #8492 [HUMAN - 98%]
                  </div>
                  <div className="bg-black/80 text-cyan-300 px-1 text-[8px]">
                    STATUS: CLEAR // VERIFIED CONF: 99.4%
                  </div>
                </div>
              )}

              <div className="absolute bottom-1 left-2 text-[9px] text-slate-300 bg-black/80 px-1.5 py-0.5 rounded border border-slate-800">
                ENC: H.265 / CBR | SHUTTER: 1/250s
              </div>
            </div>

            {/* Feed 2: CAM-02 [PERIMETER FENCE WEST] - CRITICAL BREACH */}
            <div className="relative aspect-video bg-slate-950 rounded border-2 border-rose-600 overflow-hidden font-mono text-[10px] shadow-lg shadow-rose-600/20">
              {/* Header bar overlay */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-rose-600 text-white px-2 py-1 flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  CAM-02 [PERIMETER FENCE WEST] // ALERT: BREACH
                </span>
                <span className="bg-rose-950 text-rose-300 px-1.5 rounded text-[9px]">LIVE TRIPWIRE HIT</span>
              </div>
              <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80" alt="Feed 2 Breach" className="w-full h-full object-cover opacity-75" />

              {/* Red Breach Bounding Overlay */}
              <div className="absolute inset-0 border-2 border-rose-500 flex flex-col items-center justify-center p-4">
                <div className="bg-white/95 border-2 border-rose-600 text-rose-700 px-3 py-1.5 rounded text-center shadow-md">
                  <p className="font-extrabold text-xs">🔔 VIRTUAL FENCE BREACH // 14:22:08 UTC</p>
                </div>
              </div>

              <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-bold">
                <span className="bg-slate-950/90 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/50">
                  AI INFERENCE: YOLOv9-BORDER-DET (0.94 CONF)
                </span>
                <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded">
                  LIVE ESCALATION
                </span>
              </div>
            </div>

            {/* Feed 3: CAM-03 [CHECKPOINT CHARLIE] - EMOTION AI */}
            <div className="relative aspect-video bg-slate-950 rounded border-2 border-slate-800 overflow-hidden font-mono text-[10px]">
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 text-amber-400 px-2 py-1 border-b border-amber-500/30 flex items-center justify-between">
                <span className="font-bold text-white">CAM-03 [CHECKPOINT CHARLIE - BOOTH 3]</span>
                <span className="text-amber-400 font-bold">AI EMOTION ACTIVE FPS: 60.0</span>
              </div>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" alt="Feed 3" className="w-full h-full object-cover opacity-80" />

              {/* Emotion Bounding Reticle */}
              {showEmotionMeters && (
                <div className="absolute top-1/4 left-1/4 w-36 h-32 border-2 border-amber-400 bg-amber-400/10 p-1 flex flex-col justify-between">
                  <div className="bg-amber-500 text-slate-950 font-bold px-1 text-[8px]">
                    POI MATCH: 89% | ID: #99410
                  </div>
                  <div className="bg-black/90 text-amber-300 p-1 text-[8px] space-y-0.5 border border-amber-500/40">
                    <p className="font-bold">STATE: . STRESS: AGITATED 88%</p>
                    <p>MICRO-EXPR: FROWN PULSE: 104 BPM</p>
                  </div>
                </div>
              )}
            </div>

            {/* Feed 4: CAM-04 [BUFFER ZONE] */}
            <div className="relative aspect-video bg-slate-950 rounded border-2 border-slate-800 overflow-hidden font-mono text-[10px]">
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 text-emerald-400 px-2 py-1 border-b border-emerald-500/30 flex items-center justify-between">
                <span className="font-bold text-white">CAM-04 [BUFFER ZONE - RADAR OUTPOST]</span>
                <span className="text-emerald-400 font-bold">IR MONOCHROME SENS: 0.001 LUX</span>
              </div>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" alt="Feed 4" className="w-full h-full object-cover opacity-70 grayscale" />

              <div className="absolute top-1/3 left-1/3 border border-emerald-400 bg-emerald-950/60 text-emerald-300 p-1.5 text-[8px] font-bold">
                UNATTENDED VEHICLE // TIME: 08m 14s
              </div>

              <div className="absolute bottom-1 left-2 text-[8px] text-emerald-400 bg-black/90 px-1.5 py-0.5 rounded border border-emerald-500/40">
                RADAR INTEGRATION: SEC-04D GPS: 28°36'11"N 77°12'44"E
              </div>
            </div>

          </div>

          {/* Active Cam Toolbar Bar */}
          <div className="tactical-card p-2 rounded-md flex flex-wrap items-center justify-between text-[10px] font-bold gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-cyan-100 text-cyan-900 border border-cyan-300 rounded font-extrabold">
                ACTIVE CAM: CAM-02 (BREACH FOCUS)
              </span>
              <div className="flex items-center gap-0.5 bg-slate-100 border border-slate-300 rounded p-0.5">
                <button className="px-1.5 py-0.5 hover:bg-slate-200 text-slate-700">◄</button>
                <button className="px-1.5 py-0.5 hover:bg-slate-200 text-slate-700">▲</button>
                <button className="px-1.5 py-0.5 hover:bg-slate-200 text-slate-700">▼</button>
                <button className="px-1.5 py-0.5 hover:bg-slate-200 text-slate-700">►</button>
              </div>
              <button className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-slate-700 hover:bg-slate-200 cursor-pointer">
                🔍 ZOOM +
              </button>
              <button className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-slate-700 hover:bg-slate-200 cursor-pointer">
                🔍 ZOOM -
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 hover:bg-slate-200 cursor-pointer">📷 SNAPSHOT</button>
              <button className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 hover:bg-slate-200 cursor-pointer">📣 AUDIO BROADCAST</button>
              <button className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 hover:bg-slate-200 cursor-pointer">🔄 REWIND 30s</button>
              <button className="px-2.5 py-1 bg-cyan-600 text-white rounded font-bold border border-cyan-700 hover:bg-cyan-500 cursor-pointer">💾 BOOKMARK INCIDENT</button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REAL-TIME INCIDENTS STREAM & LOCKDOWN DOCK (3 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-3">
          
          {/* Incidents Feed Panel */}
          <div className="tactical-card p-3 rounded-md space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h3 className="font-bold text-xs text-slate-900 uppercase flex items-center gap-1.5">
                REAL-TIME INCIDENTS
              </h3>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                3 UNRESOLVED
              </span>
            </div>

            {/* Incidents Items */}
            <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              
              {/* Incident 1: Critical Breach */}
              <div className="p-3 rounded-md border-2 border-rose-500 bg-rose-50/50 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-rose-700 font-bold border-b border-rose-200 pb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    💥 CRITICAL // BREACH
                  </span>
                  <span className="text-[10px]">JUST NOW</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs">Virtual Fence Overrun</h4>
                <p className="text-slate-600 leading-relaxed text-[10px]">
                  Camera 02 [Sector 07-West]. Unauthorized perimeter vector breach by unidentified subject #039.
                </p>
                <div className="p-1.5 bg-rose-100 rounded border border-rose-200 text-[9px] font-bold text-rose-800 flex justify-between">
                  <span>COORDS: LAT 43.19°N LON 71.02°E</span>
                  <span>SECTOR AUTO-LOCKED</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={() => onAcknowledgeAlert(alerts[0]?.id || 1)}
                    className="flex-1 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-bold text-[10px] cursor-pointer"
                  >
                    ACKNOWLEDGE
                  </button>
                  <button 
                    onClick={() => alert('QRF Rapid Response Force Dispatched to Sector 07-West!')}
                    className="flex-1 py-1 bg-rose-600 text-white hover:bg-rose-500 rounded font-bold text-[10px] cursor-pointer shadow-xs"
                  >
                    🚀 DISPATCH QRF
                  </button>
                </div>
              </div>

              {/* Incident 2: High Stress Anomaly */}
              <div className="p-3 rounded-md border border-amber-300 bg-amber-50/40 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-amber-800 font-bold border-b border-amber-200 pb-1">
                  <span>💡 HIGH // STRESS ANOMALY</span>
                  <span className="text-[10px]">2 MIN AGO</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Agitated Subject Detected</h4>
                <p className="text-slate-600 leading-relaxed text-[10px]">
                  Camera 03 [Booth 03]. 88% micro-tremor stress spike matching biometric watchlist POI #99410.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-1 bg-white border border-slate-300 text-cyan-800 hover:bg-slate-100 rounded font-bold text-[10px] cursor-pointer">
                    👁 INSPECT FACE
                  </button>
                  <button className="flex-1 py-1 bg-amber-600 text-white hover:bg-amber-500 rounded font-bold text-[10px] cursor-pointer">
                    📝 FLAG INTERVIEW
                  </button>
                </div>
              </div>

              {/* Incident 3: ANPR Match */}
              <div className="p-3 rounded-md border border-cyan-300 bg-cyan-50/40 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-cyan-800 font-bold border-b border-cyan-200 pb-1">
                  <span>🪪 MEDIUM // ANPR MATCH</span>
                  <span className="text-[10px]">6 MIN AGO</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">Plate Match: MH-12-PQ-9001</h4>
                <p className="text-slate-600 leading-relaxed text-[10px]">
                  Camera 01 [North Gate]. Tagged as reported stolen commercial carrier. Driver unverified.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-1 bg-cyan-600 text-white hover:bg-cyan-500 rounded font-bold text-[10px] cursor-pointer">
                    🚧 NOTIFY BARRIER
                  </button>
                  <button className="flex-1 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-bold text-[10px] cursor-pointer">
                    DETAILS
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Lockout Command Dock */}
          <div className="tactical-card p-3 rounded-md space-y-2 text-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 border-b border-slate-200 pb-1">
              <span>COMMAND DOCK PROTOCOLS</span>
              <span className="text-rose-600 font-bold">DEFCON 3</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">OPERATOR LOG DISPATCH NOTE</label>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500"
                placeholder="Type tactical command or dispatch note..."
              />
            </div>

            <button
              onClick={() => alert('CRITICAL PROTOCOL EXECUTION: Entire Sector Lockdown & Automated Barrier Protocol Engaged!')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded border border-rose-700 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Lock className="w-4 h-4 fill-current" />
              TRIGGER SECTOR LOCKDOWN
            </button>

            <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold pt-1">
              <span>SEC-CODE: #MHA-0941-X</span>
              <span className="text-emerald-600">AUTHORIZATION: VERIFIED</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
