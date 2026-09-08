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
    <div className="p-4 md:p-6 font-sans bg-[#f8fafc] text-slate-900 min-h-screen">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: SECTOR PANELS & AI PIPELINES (3 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sector Overview List */}
          <div className="light-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                Sector Overview
              </span>
              <span className="text-xs text-emerald-600 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">Online</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">Sector 4A - North Gate</p>
                  <p className="text-[11px] text-slate-500">Main Entry Checkpoint</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">4 Cams</span>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between text-rose-800">
                <div>
                  <p className="font-bold">Sector 4B - West Perimeter</p>
                  <p className="text-[11px] text-rose-600">Virtual Fence Breach</p>
                </div>
                <span className="text-xs font-bold text-white bg-rose-600 px-2.5 py-1 rounded-lg shadow-xs">3 Cams</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">Sector 4C - Buffer Zone</p>
                  <p className="text-[11px] text-slate-500">Secondary Security Belt</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">3 Cams</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">Sector 4D - Radar Outpost</p>
                  <p className="text-[11px] text-slate-500">Long Range Telemetry</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">2 Cams</span>
              </div>
            </div>
          </div>

          {/* AI Model Pipelines */}
          <div className="light-card p-5 space-y-3">
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                AI Model Models
              </span>
              <span className="text-xs text-slate-400 font-medium">v4.2 Active</span>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  YOLOv9 Target Detector
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">99.4%</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Deep-Stress Biometric AI
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">98.1%</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ANPR License Plate OCR
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">99.8%</span>
              </div>
            </div>
          </div>

          {/* Hardware Compute Node Status */}
          <div className="light-card p-4 space-y-2 bg-slate-50/80">
            <div className="flex items-center justify-between text-xs text-slate-700 border-b border-slate-200/60 pb-1.5 font-bold">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Hardware Node
              </span>
              <span className="text-blue-600">4x NVIDIA A100</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>VRAM Usage: 48 GB / 88 GB</span>
              <span className="font-mono text-slate-700 font-bold">144 FPS</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: METRICS + STREAMS + TOOLBAR (6 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Top 4 Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Card 1: Targets Tracked */}
            <div className="light-card p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Targets Tracked</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">Active</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-sans">142</span>
                <span className="text-xs text-emerald-600 font-bold">↑ +18/m</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">88 Pedestrian • 54 Vehicles</p>
            </div>

            {/* Card 2: Perimeter Breach Status */}
            <div className="light-card p-4 space-y-1.5 border-rose-200 bg-rose-50/30">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                <span>Perimeter Status</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">Breach</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-rose-600 font-sans">01</span>
                <span className="text-[11px] text-rose-700 font-semibold">Sector 07-West</span>
              </div>
              <p className="text-[11px] text-rose-600 font-medium">Virtual tripwire hit (12ms)</p>
            </div>

            {/* Card 3: ANPR Passes */}
            <div className="light-card p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Vehicle Passes</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">99% OCR</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-sans">1,289</span>
                <span className="text-[11px] text-amber-600 font-bold">1 Watchlist</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">742 Inbound • 547 Outbound</p>
            </div>

            {/* Card 4: Emotion Anomalies */}
            <div className="light-card p-4 space-y-1.5 border-amber-200 bg-amber-50/30">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Anomalies</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Biometric</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-700 font-sans">04</span>
                <span className="text-[11px] text-amber-700 font-semibold">Agitated</span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium">Booth 03 Under Inspection</p>
            </div>

          </div>

          {/* Stream Sub-Toolbar */}
          <div className="light-card p-3 flex flex-wrap items-center justify-between text-xs font-medium gap-2">
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold cursor-pointer shadow-xs">2x2 Grid</button>
              <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer">3x3 Grid</button>
              <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer">Spotlight Mode</button>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all ${showBoundingBoxes ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
              >
                Boxes
              </button>
              <button 
                onClick={() => setShowAnprPlates(!showAnprPlates)}
                className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all ${showAnprPlates ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
              >
                Plates
              </button>
              <button 
                onClick={() => setShowEmotionMeters(!showEmotionMeters)}
                className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all ${showEmotionMeters ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
              >
                Emotions
              </button>
              <button 
                onClick={() => setShowFencePolygons(!showFencePolygons)}
                className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all ${showFencePolygons ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
              >
                Virtual Fence
              </button>
            </div>
          </div>

          {/* 4 Video Feeds in 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Feed 1: CAM-01 [NORTH MAIN] */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-300 overflow-hidden text-xs">
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Cam 01: Main Gate Entry
                </span>
                <span className="text-slate-300 font-mono text-[11px]">1080p • 30fps</span>
              </div>
              <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Feed 1" className="w-full h-full object-cover" />
              
              {showBoundingBoxes && (
                <div className="absolute top-1/3 left-1/4 w-36 h-28 border-2 border-blue-400 bg-blue-500/10 rounded p-1.5 flex flex-col justify-between">
                  <div className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] w-max">
                    Vehicle Detected 98%
                  </div>
                  <div className="bg-slate-900/90 text-blue-300 px-1.5 py-0.5 rounded text-[9px]">
                    Plate: JK-02-AB-9981
                  </div>
                </div>
              )}
            </div>

            {/* Feed 2: CAM-02 [PERIMETER FENCE WEST] - CRITICAL BREACH */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl border-2 border-rose-500 overflow-hidden text-xs shadow-md">
              <div className="absolute top-0 left-0 right-0 z-10 bg-rose-600 text-white px-3 py-1.5 flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Cam 02: West Perimeter Fence
                </span>
                <span className="bg-rose-800 text-white px-2 py-0.5 rounded text-[10px]">Virtual Tripwire Breach</span>
              </div>
              <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80" alt="Feed 2 Breach" className="w-full h-full object-cover" />

              <div className="absolute inset-0 border-2 border-rose-400/80 flex flex-col items-center justify-center p-4">
                <div className="bg-white/95 border border-rose-300 text-rose-700 px-4 py-2 rounded-xl text-center shadow-lg">
                  <p className="font-extrabold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Intrusion Alert Detected at 14:22:08
                  </p>
                </div>
              </div>
            </div>

            {/* Feed 3: CAM-03 [CHECKPOINT CHARLIE] - EMOTION AI */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-300 overflow-hidden text-xs">
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Cam 03: Checkpoint Booth 3
                </span>
                <span className="text-amber-300 font-mono text-[11px]">Emotion AI Active</span>
              </div>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" alt="Feed 3" className="w-full h-full object-cover" />

              {showEmotionMeters && (
                <div className="absolute top-1/4 left-1/4 w-36 h-28 border-2 border-amber-400 bg-amber-500/10 rounded p-1.5 flex flex-col justify-between">
                  <div className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] w-max">
                    POI Match: 89%
                  </div>
                  <div className="bg-slate-900/90 text-amber-300 p-1.5 rounded text-[9px] space-y-0.5">
                    <p className="font-bold">Agitated (88% Stress)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Feed 4: CAM-04 [BUFFER ZONE] */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-300 overflow-hidden text-xs">
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Cam 04: Buffer Zone Outpost
                </span>
                <span className="text-emerald-300 font-mono text-[11px]">IR Monochrome</span>
              </div>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" alt="Feed 4" className="w-full h-full object-cover grayscale" />
            </div>

          </div>

          {/* Active Cam Control Bar */}
          <div className="light-card p-3 flex flex-wrap items-center justify-between text-xs font-medium gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
                Focus: Cam 02 (West Perimeter)
              </span>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                🔍 Zoom In
              </button>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                🔍 Zoom Out
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg cursor-pointer">📷 Snapshot</button>
              <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg cursor-pointer">📣 Broadcast</button>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer shadow-xs">💾 Bookmark Event</button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REAL-TIME INCIDENTS & EMERGENCY CONTROLS (3 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Incidents Feed Panel */}
          <div className="light-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BellRing className="w-4 h-4 text-rose-600 animate-bounce" />
                Real-Time Alerts
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs">
                3 Active
              </span>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              
              {/* Alert 1: Critical Breach */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-rose-700 font-bold pb-1 border-b border-rose-200/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    Critical Intrusion
                  </span>
                  <span className="text-[11px] text-rose-500">Just now</span>
                </div>
                <h4 className="font-bold text-slate-900">Virtual Fence Overrun</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Cam 02 [West Perimeter]. Unauthorized target crossing virtual fence boundary.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={() => onAcknowledgeAlert(alerts[0]?.id || 1)}
                    className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold text-xs cursor-pointer"
                  >
                    Acknowledge
                  </button>
                  <button 
                    onClick={() => alert('Dispatched Quick Response Unit to Sector 4B West Perimeter!')}
                    className="flex-1 py-1.5 bg-rose-600 text-white hover:bg-rose-500 rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Dispatch QRF
                  </button>
                </div>
              </div>

              {/* Alert 2: High Stress Anomaly */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-amber-800 font-bold pb-1 border-b border-amber-200/60">
                  <span>High Stress Anomaly</span>
                  <span className="text-[11px] text-amber-600">2m ago</span>
                </div>
                <h4 className="font-bold text-slate-900">Agitated Subject Detected</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Cam 03 [Booth 3]. Micro-tremor stress spike matching watchlist POI #99410.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold text-xs cursor-pointer">
                    Inspect Face
                  </button>
                  <button className="flex-1 py-1.5 bg-amber-600 text-white hover:bg-amber-500 rounded-lg font-bold text-xs cursor-pointer">
                    Flag Interview
                  </button>
                </div>
              </div>

              {/* Alert 3: ANPR Match */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-blue-800 font-bold pb-1 border-b border-blue-200/60">
                  <span>ANPR Plate Hit</span>
                  <span className="text-[11px] text-blue-600">6m ago</span>
                </div>
                <h4 className="font-bold text-slate-900">Plate Match: JK-02-AB-9981</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Cam 01 [North Gate]. Tagged as reported stolen commercial carrier.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg font-bold text-xs cursor-pointer">
                    Notify Barrier
                  </button>
                  <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold text-xs cursor-pointer">
                    View Logs
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Lockout Command Dock */}
          <div className="light-card p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-600" />
                Emergency Lockdown
              </span>
              <span className="text-rose-600 font-bold">DEFCON 3</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Dispatch Log Note</label>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-sans focus:outline-none focus:border-rose-500"
                placeholder="Enter dispatch notes..."
              />
            </div>

            <button
              onClick={() => alert('Sector Lockout Triggered!')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Lock className="w-4 h-4" />
              TRIGGER SECTOR LOCKDOWN
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
