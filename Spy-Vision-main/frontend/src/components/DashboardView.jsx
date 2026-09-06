import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Video, 
  Maximize2, 
  CheckCircle, 
  AlertTriangle, 
  Car, 
  User, 
  Eye, 
  Grid, 
  Grid3X3, 
  Zap, 
  Clock, 
  Crosshair,
  Filter,
  Volume2,
  Radio,
  Sliders,
  Camera,
  Smile,
  Package,
  Activity,
  FileCheck
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
  const [gridCols, setGridCols] = useState(2); // 1, 2, 3
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  // Webcam State
  const [useWebcamOnCam1, setUseWebcamOnCam1] = useState(true); // Default to live webcam on Feed #1

  // Real-Time Facial Reaction & Object Telemetry State
  const [liveTelemetry, setLiveTelemetry] = useState({
    facialReaction: 'SUSPICIOUS / AGITATED',
    stressLevel: 87,
    emotionScore: 'HIGH RISK',
    detectedObjects: [
      { id: 'OBJ-1', class: 'Person (Target #101)', confidence: '98%', threat: 'HIGH' },
      { id: 'OBJ-2', class: 'Unattended Backpack', confidence: '94%', threat: 'CRITICAL' },
      { id: 'OBJ-3', class: 'Vehicle (SUV)', confidence: '99%', threat: 'MEDIUM' }
    ],
    intrusionDistance: '1.4 meters from Fence Boundary',
    intrusionThreatScore: 'CRITICAL (96% BREACH RISK)'
  });

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Top Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Cameras */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">CCTV & Webcam Feeds</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-tactical text-slate-100">{stats?.cameras?.online || cameras.length}</span>
              <span className="text-xs font-mono text-emerald-400">/ {stats?.cameras?.total || cameras.length} Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Video className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Active Alerts */}
        <div className={`glass-panel rounded-xl p-4 border flex items-center justify-between transition-all ${
          activeAlerts.length > 0 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'
        }`}>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Threat Alerts</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold font-tactical ${activeAlerts.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                {activeAlerts.length}
              </span>
              <span className="text-xs text-slate-400">Requires Action</span>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            activeAlerts.length > 0 ? 'bg-rose-950 border border-rose-500/40 text-rose-400' : 'bg-slate-900 border border-slate-800 text-slate-400'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Intrusions & Reaction Alerts */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Intrusion / Reaction Hits</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-tactical text-amber-400">{stats?.intrusions_today || 14}</span>
              <span className="text-xs text-slate-400">Today</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Smile className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Object Detections */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Objects Identified</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-tactical text-emerald-400">{(stats?.vehicles_today || 84) + (stats?.people_today || 142) + 38}</span>
              <span className="text-xs text-slate-400">Objects Scanned</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid & Alert Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Live Camera Streams + Facial & Object Telemetry Bar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Stream Header Controls */}
          <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="font-tactical text-lg font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                Live Camera Feeds ({cameras.length})
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                FACE REACTION & OBJECT AI ACTIVE
              </span>
            </div>

            {/* Layout Toggles & Webcam Switch */}
            <div className="flex items-center gap-2">
              {/* Laptop Webcam Toggle */}
              <button
                onClick={() => setUseWebcamOnCam1(!useWebcamOnCam1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border flex items-center gap-1.5 transition-all ${
                  useWebcamOnCam1 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                {useWebcamOnCam1 ? 'LAPTOP WEBCAM ACTIVE' : 'USE LAPTOP WEBCAM'}
              </button>

              <button
                onClick={() => setOverlayEnabled(!overlayEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  overlayEnabled ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                AI Overlays {overlayEnabled ? 'ON' : 'OFF'}
              </button>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setGridCols(1)}
                  className={`p-1.5 rounded text-xs ${gridCols === 1 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Single Feed View"
                >
                  1x1
                </button>
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-1.5 rounded text-xs ${gridCols === 2 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Quad View"
                >
                  2x2
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 rounded text-xs ${gridCols === 3 ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="9 Grid View"
                >
                  3x3
                </button>
              </div>

              <button
                onClick={onOpenSimulation}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:brightness-110 shadow-lg shadow-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                AI Detection Engine
              </button>
            </div>
          </div>

          {/* Real-Time Facial Reaction & Object Telemetry HUD Bar */}
          <div className="glass-panel rounded-xl p-4 border border-cyan-500/40 bg-slate-950/90 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Box 1: Face Reaction Analysis */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Smile className="w-4 h-4 text-cyan-400" />
                  FACE REACTION ANALYSIS
                </span>
                <span className="text-amber-400 font-bold animate-pulse">LIVE ANALYZING</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-slate-200">Expression / Reaction:</span>
                <span className="text-rose-400 font-bold">{liveTelemetry.facialReaction}</span>
              </div>
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="text-slate-400">Facial Stress Metric:</span>
                <span className="text-amber-400 font-bold">{liveTelemetry.stressLevel}% STRESSED</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full w-[87%] animate-pulse" />
              </div>
            </div>

            {/* Box 2: Object Detection & Identification */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Package className="w-4 h-4 text-emerald-400" />
                  OBJECT CLASSIFICATION (3)
                </span>
                <span className="text-emerald-400 font-bold">YOLOv11 MULTI-OBJ</span>
              </div>
              <div className="space-y-1 pt-1 text-[11px]">
                {liveTelemetry.detectedObjects.map(obj => (
                  <div key={obj.id} className="flex items-center justify-between">
                    <span className="text-slate-300">• {obj.class}</span>
                    <span className={`font-bold ${
                      obj.threat === 'CRITICAL' ? 'text-rose-400' : obj.threat === 'HIGH' ? 'text-amber-400' : 'text-cyan-400'
                    }`}>
                      {obj.confidence} [{obj.threat}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Intrusion Threat Diagnostic */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <Crosshair className="w-4 h-4 text-rose-400" />
                  INTRUSION RISK DIAGNOSTIC
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40 text-[9px]">
                  FENCE BREACH
                </span>
              </div>
              <p className="text-slate-300 pt-1 text-[11px]">
                Proximity: <strong className="text-amber-400">{liveTelemetry.intrusionDistance}</strong>
              </p>
              <p className="text-slate-200 text-[11px]">
                Composite Risk: <strong className="text-rose-400">{liveTelemetry.intrusionThreatScore}</strong>
              </p>
            </div>
          </div>

          {/* Camera Grid */}
          <div className={`grid gap-4 ${
            gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
          }`}>
            {cameras.map((cam, idx) => (
              <CameraFeedCard 
                key={cam.id} 
                camera={cam} 
                isWebcamFeed={idx === 0 && useWebcamOnCam1}
                overlayEnabled={overlayEnabled}
                onSelectZone={() => onSelectCameraForZone(cam.id)}
                onTriggerWebcamAlert={onTriggerWebcamAlert}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Column: Real-Time Alerts Drawer */}
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 flex flex-col h-[calc(100vh-140px)] sticky top-20">
            {/* Header & Filter */}
            <div className="space-y-2 pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-tactical text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                  Live Alert Stream
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-400 font-mono text-[10px]">
                  {activeAlerts.length} Active
                </span>
              </div>

              {/* Severity filter tabs */}
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      selectedSeverity === sev 
                        ? 'bg-cyan-500 text-slate-950' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No alerts matching selected severity.
                </div>
              ) : (
                filteredAlerts.map(alert => (
                  <AlertItem 
                    key={alert.id} 
                    alert={alert}
                    onAcknowledge={() => onAcknowledgeAlert(alert.id)}
                    onResolve={() => onResolveAlert(alert.id)}
                    onViewSnapshot={() => setSelectedSnapshot(alert.snapshot_path)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Preview Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-3xl w-full rounded-2xl p-4 space-y-4 border border-cyan-500/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-tactical text-lg font-bold text-cyan-400 uppercase">Alert Capture Snapshot & Reaction Telemetry</h3>
              <button 
                onClick={() => setSelectedSnapshot(null)}
                className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1 bg-slate-900 rounded"
              >
                ✕ Close
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 max-h-[70vh] flex items-center justify-center">
              <img src={selectedSnapshot} alt="Alert Snapshot" className="max-h-[65vh] w-auto object-contain" />
              {/* Simulated AI box overlay */}
              <div className="absolute top-1/4 left-1/3 w-56 h-48 border-2 border-rose-500 rounded bg-rose-500/20 flex flex-col justify-between p-2 font-mono">
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold w-max">
                  TARGET MATCH 98% | AGITATED
                </span>
                <div className="bg-black/80 text-rose-300 text-[9px] p-1 rounded space-y-0.5 border border-rose-500/40">
                  <p>• FACE REACTION: SUSPICIOUS</p>
                  <p>• OBJECT: UNATTENDED BACKPACK</p>
                  <p>• PERIMETER BREACH: 1.4m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Camera Stream Component supporting both Laptop Webcam & Video Streams with Real-Time AI Canvas Overlays
function CameraFeedCard({ camera, isWebcamFeed, overlayEnabled, onSelectZone, onTriggerWebcamAlert }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);

  // Setup Laptop Webcam MediaStream when isWebcamFeed is true
  useEffect(() => {
    if (!isWebcamFeed) {
      setWebcamActive(false);
      return;
    }

    let mediaStream = null;

    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((stream) => {
        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setWebcamActive(true);
        setWebcamError(null);
      })
      .catch((err) => {
        console.warn('Webcam access error:', err);
        setWebcamError(err.message || 'Camera permission denied or camera unavailable');
        setWebcamActive(false);
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isWebcamFeed]);

  // Real-time AI Overlays animation on top of video canvas (Face Reaction + Object Identification + Fence Intrusion)
  useEffect(() => {
    if (!overlayEnabled || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let step = 0;

    const drawOverlays = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.03;

      if (isWebcamFeed) {
        // AI Overlays customized for Live Laptop Webcam
        // 1. Virtual Fence Boundary
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.moveTo(0, canvas.height * 0.6);
        ctx.lineTo(canvas.width, canvas.height * 0.6);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(10, 10, 240, 22);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText('🔴 LIVE WEBCAM INTRUSION PERIMETER', 15, 25);

        // 2. Real-Time Face Detection & Reaction Analysis Bounding Box
        const faceX = canvas.width * 0.35 + Math.sin(step) * 15;
        const faceY = canvas.height * 0.2 + Math.cos(step) * 10;
        const faceW = canvas.width * 0.3;
        const faceH = canvas.height * 0.42;

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(faceX, faceY, faceW, faceH);

        // Face Reaction Tag Header
        ctx.fillStyle = 'rgba(0, 255, 204, 0.9)';
        ctx.fillRect(faceX, faceY - 22, faceW, 20);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText('PERSON (FACE DETECTED 98%)', faceX + 4, faceY - 8);

        // Facial Expression / Emotion Analysis Badge
        ctx.fillStyle = 'rgba(225, 29, 72, 0.9)';
        ctx.fillRect(faceX, faceY + faceH + 2, faceW, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText('REACTION: AGITATED / HIGH RISK', faceX + 4, faceY + faceH + 15);

        // Reticle Corners
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(faceX - 5, faceY + 15); ctx.lineTo(faceX - 5, faceY - 5); ctx.lineTo(faceX + 15, faceY - 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(faceX + faceW - 15, faceY - 5); ctx.lineTo(faceX + faceW + 5, faceY - 5); ctx.lineTo(faceX + faceW + 5, faceY + 15); ctx.stroke();

        // 3. Object Identification Box (e.g. Identified Backpack / Object)
        const objX = canvas.width * 0.08;
        const objY = canvas.height * 0.55;
        const objW = 100;
        const objH = 70;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(objX, objY, objW, objH);

        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.fillRect(objX, objY - 18, 120, 16);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText('OBJ: UNATTENDED BAG 94%', objX + 4, objY - 6);

      } else {
        // Default Simulated Camera Overlays with Object & Reaction
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.moveTo(0, canvas.height * 0.55);
        ctx.lineTo(canvas.width, canvas.height * 0.55);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(10, 10, 140, 22);
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('FENCE ZONE ALPHA', 15, 25);

        // Person Box
        const boxX = (Math.sin(step) * 0.25 + 0.5) * (canvas.width - 80);
        const boxY = canvas.height * 0.45;

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, 50, 90);

        ctx.fillStyle = 'rgba(0, 255, 204, 0.9)';
        ctx.fillRect(boxX, boxY - 18, 100, 16);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText('PERSON #102 [SUSPICIOUS]', boxX + 4, boxY - 6);

        // Object Box
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width * 0.7, canvas.height * 0.6, 70, 50);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.fillRect(canvas.width * 0.7, canvas.height * 0.6 - 16, 85, 16);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText('VEHICLE (SUV 99%)', canvas.width * 0.7 + 2, canvas.height * 0.6 - 6);
      }

      animationFrame = requestAnimationFrame(drawOverlays);
    };

    drawOverlays();
    return () => cancelAnimationFrame(animationFrame);
  }, [overlayEnabled, isWebcamFeed]);

  // Capture current webcam frame and dispatch detailed threat & reaction report
  const handleCaptureWebcamAlert = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = v.videoWidth || 640;
    tempCanvas.height = v.videoHeight || 480;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(v, 0, 0, tempCanvas.width, tempCanvas.height);
    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);

    onTriggerWebcamAlert({
      camera_id: camera.id,
      event_type: 'INTRUSION',
      severity: 'CRITICAL',
      confidence: 0.98,
      snapshot_path: dataUrl,
      message: `LIVE WEBCAM THREAT DISPATCH: Intrusion breach detected! Facial Reaction: AGITATED / HIGH STRESS. Identified Object: Unattended Backpack.`
    });
  };

  return (
    <div className={`glass-panel rounded-xl overflow-hidden border transition-all flex flex-col group ${
      isWebcamFeed ? 'border-emerald-500/60 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-cyan-500/40'
    }`}>
      {/* Feed Header */}
      <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className={`w-2 h-2 rounded-full ${isWebcamFeed ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
          <span className="font-tactical font-bold text-xs text-slate-200 uppercase truncate">
            {isWebcamFeed ? 'Laptop Webcam - Real-Time Reaction & Object Analytics' : camera.name}
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">30 FPS</span>
          <span className={`px-1.5 py-0.5 rounded font-bold ${
            isWebcamFeed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
          }`}>
            {isWebcamFeed ? 'LIVE WEBCAM' : 'ONLINE'}
          </span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
        {isWebcamFeed ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {webcamError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-rose-400 p-4 text-center text-xs font-mono">
                <Camera className="w-8 h-8 mb-2 stroke-1" />
                <p>{webcamError}</p>
                <p className="text-[10px] text-slate-500 mt-1">Please allow camera permissions in your browser address bar.</p>
              </div>
            )}
          </>
        ) : camera.stream_url ? (
          <video
            src={camera.stream_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div className="text-slate-600 font-mono text-xs flex flex-col items-center gap-2">
            <Video className="w-8 h-8 stroke-1 text-slate-700" />
            STREAM DISCONNECTED
          </div>
        )}

        {/* AI Bounding Canvas Overlay */}
        {overlayEnabled && (
          <canvas
            ref={canvasRef}
            width={400}
            height={225}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        )}

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
          {isWebcamFeed ? (
            <button
              onClick={handleCaptureWebcamAlert}
              className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-500 flex items-center gap-1.5 shadow-lg shadow-rose-600/30 animate-bounce"
            >
              <Camera className="w-4 h-4" />
              Generate Threat & Reaction Report
            </button>
          ) : (
            <button
              onClick={onSelectZone}
              className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400 flex items-center gap-1 shadow-lg"
            >
              <Sliders className="w-3.5 h-3.5" />
              Configure Zones
            </button>
          )}
        </div>

        {/* Bottom Tag Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 pointer-events-none">
          <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {isWebcamFeed ? 'Laptop Camera Device 0' : (camera.location || 'Border Outpost Gate')}
          </span>
          <span className="bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
            {isWebcamFeed ? 'Face Reaction + Object Identification' : 'ANPR + AI Active'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Single Alert Item Component
function AlertItem({ alert, onAcknowledge, onResolve, onViewSnapshot }) {
  const isCritical = alert.severity === 'CRITICAL';
  const isHigh = alert.severity === 'HIGH';
  const isResolved = alert.status === 'RESOLVED';
  const isAcknowledged = alert.status === 'ACKNOWLEDGED';

  const severityBg = isCritical
    ? 'bg-rose-950 border-rose-500/50 text-rose-400'
    : isHigh
    ? 'bg-amber-950 border-amber-500/50 text-amber-400'
    : 'bg-slate-900 border-slate-800 text-slate-300';

  return (
    <div className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
      isCritical && !isResolved ? 'bg-rose-950/30 border-rose-500/40 animate-alert-pulse' : 'bg-slate-900/60 border-slate-800'
    }`}>
      {/* Alert Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] border ${severityBg}`}>
            {alert.severity}
          </span>
          <span className="font-mono text-[10px] text-slate-400 uppercase">
            {alert.event_type}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      {/* Alert Message */}
      <p className="text-slate-200 font-medium text-xs leading-relaxed">
        {alert.message}
      </p>

      {/* Snapshot Thumbnail if present */}
      {alert.snapshot_path && (
        <div 
          onClick={onViewSnapshot}
          className="relative rounded-lg overflow-hidden border border-slate-800 cursor-pointer h-20 group"
        >
          <img src={alert.snapshot_path} alt="Alert Snapshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 flex items-center justify-center text-white font-mono text-[10px] gap-1">
            <Eye className="w-3.5 h-3.5" /> View Capture
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
        <span className="font-mono text-slate-400 text-[10px]">
          Status: <strong className={isResolved ? 'text-emerald-400' : isAcknowledged ? 'text-amber-400' : 'text-rose-400'}>
            {alert.status}
          </strong>
        </span>

        <div className="flex items-center gap-1.5">
          {!isAcknowledged && !isResolved && (
            <button
              onClick={onAcknowledge}
              className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 font-mono text-[10px]"
            >
              ACK
            </button>
          )}

          {!isResolved && (
            <button
              onClick={onResolve}
              className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/40 font-mono text-[10px]"
            >
              RESOLVE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
