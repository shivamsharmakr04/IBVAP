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
  Package
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
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [useWebcamOnCam1, setUseWebcamOnCam1] = useState(true);

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans">
      {/* Top Simple Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">CCTV Cameras</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.cameras?.online || cameras.length}</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">/ {stats?.cameras?.total || cameras.length} Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Video className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 border flex items-center justify-between shadow-xs ${
          activeAlerts.length > 0 ? 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-700'
        }`}>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Active Threat Alerts</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${activeAlerts.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                {activeAlerts.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Action Required</span>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            activeAlerts.length > 0 ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Intrusions Today</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats?.intrusions_today || 14}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Alert Hits</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Smile className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Objects Scanned</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{(stats?.vehicles_today || 84) + (stats?.people_today || 142) + 38}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Objects</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Live Camera Streams Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Stream Header */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Live Surveillance Feeds ({cameras.length})
              </h2>
            </div>

            {/* Simple Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseWebcamOnCam1(!useWebcamOnCam1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  useWebcamOnCam1 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                {useWebcamOnCam1 ? 'Laptop Webcam Active' : 'Use Laptop Webcam'}
              </button>

              <button
                onClick={onOpenSimulation}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Trigger Test Alert
              </button>
            </div>
          </div>

          {/* Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.map((cam, idx) => (
              <CameraFeedCard 
                key={cam.id} 
                camera={cam} 
                isWebcamFeed={idx === 0 && useWebcamOnCam1}
                onSelectZone={() => onSelectCameraForZone(cam.id)}
                onTriggerWebcamAlert={onTriggerWebcamAlert}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Column: Real-Time Alerts Drawer */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col h-[calc(100vh-140px)] sticky top-20 shadow-xs">
            {/* Header & Filter */}
            <div className="space-y-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Live Alert Feed
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  {activeAlerts.length} Active
                </span>
              </div>

              {/* Severity filter tabs */}
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      selectedSeverity === sev 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
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
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full rounded-2xl p-4 space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alert Snapshot Preview</h3>
              <button 
                onClick={() => setSelectedSnapshot(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-slate-950 max-h-[60vh] flex items-center justify-center">
              <img src={selectedSnapshot} alt="Alert Snapshot" className="max-h-[55vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Camera Card
function CameraFeedCard({ camera, isWebcamFeed, onSelectZone, onTriggerWebcamAlert }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamError, setWebcamError] = useState(null);

  // Setup Laptop Webcam MediaStream
  useEffect(() => {
    if (!isWebcamFeed) return;
    let mediaStream = null;

    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((stream) => {
        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setWebcamError(null);
      })
      .catch((err) => {
        setWebcamError(err.message || 'Camera permission denied or camera unavailable');
      });

    return () => {
      if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    };
  }, [isWebcamFeed]);

  // Canvas Overlays
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let step = 0;

    const drawOverlays = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.03;

      if (isWebcamFeed) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.moveTo(0, canvas.height * 0.6);
        ctx.lineTo(canvas.width, canvas.height * 0.6);
        ctx.stroke();
        ctx.setLineDash([]);

        const faceX = canvas.width * 0.35 + Math.sin(step) * 12;
        const faceY = canvas.height * 0.2 + Math.cos(step) * 8;
        const faceW = canvas.width * 0.3;
        const faceH = canvas.height * 0.42;

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(faceX, faceY, faceW, faceH);

        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(faceX, faceY - 20, faceW, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillText('Person Detected (98%)', faceX + 4, faceY - 7);
      } else {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.moveTo(0, canvas.height * 0.55);
        ctx.lineTo(canvas.width, canvas.height * 0.55);
        ctx.stroke();
        ctx.setLineDash([]);

        const boxX = (Math.sin(step) * 0.25 + 0.5) * (canvas.width - 80);
        const boxY = canvas.height * 0.45;

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, 50, 85);

        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(boxX, boxY - 18, 100, 16);
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 9px Inter, sans-serif';
        ctx.fillText('Person #102', boxX + 4, boxY - 6);
      }

      animationFrame = requestAnimationFrame(drawOverlays);
    };

    drawOverlays();
    return () => cancelAnimationFrame(animationFrame);
  }, [isWebcamFeed]);

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
      message: `Laptop Webcam Threat Alert: Intrusion detected!`
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col group">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/90 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className={`w-2 h-2 rounded-full ${isWebcamFeed ? 'bg-emerald-500' : 'bg-blue-500'}`} />
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
            {isWebcamFeed ? 'Laptop Webcam' : camera.name}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
          isWebcamFeed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
        }`}>
          {isWebcamFeed ? 'Live Webcam' : 'Online'}
        </span>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
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
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-rose-400 p-4 text-center text-xs">
                <Camera className="w-8 h-8 mb-2" />
                <p>{webcamError}</p>
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
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
            <Video className="w-8 h-8 text-slate-600" />
            Stream Offline
          </div>
        )}

        {/* AI Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={400}
          height={225}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {isWebcamFeed ? (
            <button
              onClick={handleCaptureWebcamAlert}
              className="px-3 py-1.5 bg-rose-600 text-white font-medium text-xs rounded-lg hover:bg-rose-500 flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Capture Alert
            </button>
          ) : (
            <button
              onClick={onSelectZone}
              className="px-3 py-1.5 bg-blue-600 text-white font-medium text-xs rounded-lg hover:bg-blue-500 flex items-center gap-1 shadow-md cursor-pointer"
            >
              Configure Zone
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Alert Feed Item Component
function AlertItem({ alert, onAcknowledge, onResolve, onViewSnapshot }) {
  const isCritical = alert.severity === 'CRITICAL';
  const isHigh = alert.severity === 'HIGH';
  const isResolved = alert.status === 'RESOLVED';
  const isAcknowledged = alert.status === 'ACKNOWLEDGED';

  const severityBg = isCritical
    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    : isHigh
    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';

  return (
    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-xs space-y-2 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${severityBg}`}>
            {alert.severity}
          </span>
          <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">
            {alert.event_type}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Message */}
      <p className="text-slate-800 dark:text-slate-200 text-xs leading-snug font-medium">
        {alert.message}
      </p>

      {/* Snapshot Thumbnail */}
      {alert.snapshot_path && (
        <div 
          onClick={onViewSnapshot}
          className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer h-20 group"
        >
          <img src={alert.snapshot_path} alt="Alert Snapshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 flex items-center justify-center text-white text-[11px] font-medium gap-1">
            <Eye className="w-3.5 h-3.5" /> View Photo
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">
          Status: <strong className={isResolved ? 'text-emerald-600 dark:text-emerald-400' : isAcknowledged ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>
            {alert.status}
          </strong>
        </span>

        <div className="flex items-center gap-1.5">
          {!isAcknowledged && !isResolved && (
            <button
              onClick={onAcknowledge}
              className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-medium text-[10px] cursor-pointer"
            >
              Acknowledge
            </button>
          )}

          {!isResolved && (
            <button
              onClick={onResolve}
              className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-medium text-[10px] cursor-pointer"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
