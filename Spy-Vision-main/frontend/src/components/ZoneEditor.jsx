import React, { useState, useEffect, useRef } from 'react';
import { Layers, Plus, Trash2, CheckCircle, Sliders, AlertTriangle, MousePointer, Save } from 'lucide-react';

export default function ZoneEditor({ cameras, selectedCameraId, onSaveZone, onDeleteZone, existingZones }) {
  const [activeCamId, setActiveCamId] = useState(selectedCameraId || (cameras[0]?.id || 1));
  const [points, setPoints] = useState([]);
  const [zoneName, setZoneName] = useState('Intrusion Zone Sector A');
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

    if (existingZones && existingZones.length > 0) {
      existingZones.forEach((z) => {
        if (!z.coordinates || z.coordinates.length < 2) return;
        ctx.beginPath();
        const firstPt = z.coordinates[0];
        ctx.moveTo(firstPt[0] * canvas.width, firstPt[1] * canvas.height);
        
        for (let i = 1; i < z.coordinates.length; i++) {
          const pt = z.coordinates[i];
          ctx.lineTo(pt[0] * canvas.width, pt[1] * canvas.height);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#3b82f6';
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillText(z.name, z.coordinates[0][0] * canvas.width + 5, z.coordinates[0][1] * canvas.height + 15);
      });
    }

    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (points.length >= 3) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fill();
      }

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      points.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#3b82f6' : '#ef4444';
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

    setPoints([...points, { x, y }]);
    setIsDrawing(true);
  };

  const handleClearPoints = () => {
    setPoints([]);
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (points.length < 3) {
      alert('Please click at least 3 points on the stream to create a zone.');
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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Virtual Fence & Zone Configuration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click directly on the camera view to draw virtual boundary lines and detection areas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Select Camera:</label>
          <select
            value={activeCamId}
            onChange={(e) => {
              setActiveCamId(Number(e.target.value));
              setPoints([]);
            }}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-1.5 font-medium cursor-pointer"
          >
            {cameras.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.location || 'Gate'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drawing Area */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            {activeCamera?.stream_url ? (
              <video
                src={activeCamera.stream_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90 pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-medium">
                Stream Offline
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />

            <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-none">
              <MousePointer className="w-4 h-4 text-blue-400" />
              {points.length === 0 
                ? "Click on camera view to add zone points" 
                : `Points placed: ${points.length} (Need 3+ for boundary)`}
            </div>

            {points.length > 0 && (
              <button
                onClick={handleClearPoints}
                className="absolute top-3 right-3 px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-500 cursor-pointer"
              >
                Clear Points
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Form & List */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Add Virtual Zone
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Zone Name</label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium"
                  placeholder="e.g. Sector A Perimeter"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Zone Type</label>
                <select
                  value={zoneType}
                  onChange={(e) => setZoneType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="INTRUSION_ZONE">Intrusion Zone (Boundary Breach)</option>
                  <option value="RESTRICTED_AREA">Restricted Area (No Access)</option>
                  <option value="FENCE_LINE">Fence Approach Line</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  <span>Sensitivity Threshold:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{(sensitivity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.05"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={points.length < 3}
                className={`w-full py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  points.length >= 3
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                Save Zone Rule
              </button>
            </div>
          </div>

          {/* Configured Zones */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Configured Zones ({existingZones?.length || 0})
            </h3>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {!existingZones || existingZones.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No active virtual zones for this camera stream.
                </div>
              ) : (
                existingZones.map((z) => (
                  <div
                    key={z.id}
                    className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{z.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {z.zone_type} • Sens: {((z.sensitivity || 0.8) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteZone(z.id)}
                      className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded cursor-pointer"
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
