import React, { useState, useEffect, useRef } from 'react';
import { Layers, Plus, Trash2, CheckCircle, Sliders, AlertTriangle, MousePointer, RefreshCw, Save } from 'lucide-react';

export default function ZoneEditor({ cameras, selectedCameraId, onSaveZone, onDeleteZone, existingZones }) {
  const [activeCamId, setActiveCamId] = useState(selectedCameraId || (cameras[0]?.id || 1));
  const [points, setPoints] = useState([]);
  const [zoneName, setZoneName] = useState('Fence Intrusion Zone Alpha');
  const [zoneType, setZoneType] = useState('INTRUSION_ZONE');
  const [sensitivity, setSensitivity] = useState(0.85);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const activeCamera = cameras.find(c => c.id === activeCamId) || cameras[0];

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing saved zones first in semi-transparent cyan
    if (existingZones && existingZones.length > 0) {
      existingZones.forEach((z, idx) => {
        if (!z.coordinates || z.coordinates.length < 2) return;
        ctx.beginPath();
        const firstPt = z.coordinates[0];
        ctx.moveTo(firstPt[0] * canvas.width, firstPt[1] * canvas.height);
        
        for (let i = 1; i < z.coordinates.length; i++) {
          const pt = z.coordinates[i];
          ctx.lineTo(pt[0] * canvas.width, pt[1] * canvas.height);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Zone label
        ctx.fillStyle = '#06b6d4';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`[SAVED] ${z.name}`, z.coordinates[0][0] * canvas.width + 5, z.coordinates[0][1] * canvas.height + 15);
      });
    }

    // Draw current active drawing points
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (points.length >= 3) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();
      }

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw point handles
      points.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#00ffcc' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  }, [points, existingZones, activeCamId]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add point normalized coordinates
    setPoints([...points, { x, y }]);
    setIsDrawing(true);
  };

  const handleClearPoints = () => {
    setPoints([]);
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (points.length < 3) {
      alert('Please click at least 3 points on the video stream to form a virtual fence zone.');
      return;
    }

    const canvas = canvasRef.current;
    const normalizedCoords = points.map(p => [
      Number((p.x / canvas.width).toFixed(3)),
      Number((p.y / canvas.height).toFixed(3))
    ]);

    const zoneData = {
      camera_id: activeCamId,
      name: zoneName,
      zone_type: zoneType,
      coordinates: normalizedCoords,
      sensitivity: Number(sensitivity),
      is_active: true
    };

    onSaveZone(zoneData);
    setPoints([]);
    setIsDrawing(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="font-tactical text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Virtual Fence & Intrusion Zone Configurator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click directly on the camera view to draw virtual lines and intrusion detection polygons.
          </p>
        </div>

        {/* Camera Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">SELECT CCTV:</label>
          <select
            value={activeCamId}
            onChange={(e) => {
              setActiveCamId(Number(e.target.value));
              setPoints([]);
            }}
            className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-cyan-700 dark:text-cyan-400 text-xs rounded-lg px-3 py-2 font-mono font-bold focus:outline-none focus:border-cyan-500 cursor-pointer shadow-2xs"
          >
            {cameras.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.location || 'Border Outpost'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Drawing Canvas & Zone Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Canvas Drawing View */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl">
            {activeCamera?.stream_url ? (
              <video
                src={activeCamera.stream_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80 pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-xs">
                CAMERA STREAM OFFLINE
              </div>
            )}

            {/* Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />

            {/* Instruction Overlay Tag */}
            <div className="absolute top-3 left-3 bg-slate-950/90 text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-cyan-500/40 flex items-center gap-2 pointer-events-none">
              <MousePointer className="w-4 h-4 text-cyan-400 animate-bounce" />
              {points.length === 0 
                ? "Click on feed to add boundary vertices" 
                : `Points placed: ${points.length} (Click 3+ to complete boundary)`}
            </div>

            {/* Reset Button */}
            {points.length > 0 && (
              <button
                onClick={handleClearPoints}
                className="absolute top-3 right-3 px-3 py-1 bg-rose-950/90 text-rose-300 border border-rose-500/40 text-xs font-mono rounded-lg hover:bg-rose-900 cursor-pointer"
              >
                Clear Draw
              </button>
            )}
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-white/90 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
            <span>TIP: Click perimeter boundary corners to draw polygon zone. Coordinates normalize automatically.</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{points.length} Vertices</span>
          </div>
        </div>

        {/* Right 1 Column: Zone Configuration Form & List */}
        <div className="space-y-4">
          {/* Create Zone Card */}
          <div className="glass-panel rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="font-tactical text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Define New Zone Rule
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-mono mb-1 font-semibold">Zone Name</label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none shadow-2xs"
                  placeholder="e.g. Fence Line Sector 4"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-mono mb-1 font-semibold">Detection Event Type</label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-cyan-700 dark:text-cyan-400 font-mono font-semibold focus:border-cyan-500 focus:outline-none shadow-2xs cursor-pointer"
                >
                  <option value="INTRUSION_ZONE">INTRUSION_ZONE (Border Breach Alert)</option>
                  <option value="RESTRICTED_AREA">RESTRICTED_AREA (No Access Allowed)</option>
                  <option value="FENCE_LINE">FENCE_LINE (Approach Warning)</option>
                  <option value="NIGHT_WATCH">NIGHT_WATCH (Night-Time Movement)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono mb-1">
                  <span className="font-semibold">AI Sensitivity Threshold:</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">{(sensitivity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.05"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={points.length < 3}
                className={`w-full py-2.5 rounded-lg font-bold font-tactical tracking-wider text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  points.length >= 3
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white dark:text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                Save Virtual Zone Rule
              </button>
            </div>
          </div>

          {/* Active Zones List for Selected Camera */}
          <div className="glass-panel rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="font-tactical text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              Configured Zones on Camera ({existingZones?.length || 0})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {!existingZones || existingZones.length === 0 ? (
                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                  No active virtual zones for this camera stream.
                </div>
              ) : (
                existingZones.map((z) => (
                  <div
                    key={z.id}
                    className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-cyan-700 dark:text-cyan-400 font-tactical">{z.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {z.zone_type} | Sens: {((z.sensitivity || 0.8) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteZone(z.id)}
                      className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 rounded border border-rose-200 dark:border-rose-500/30 cursor-pointer"
                      title="Delete Zone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
