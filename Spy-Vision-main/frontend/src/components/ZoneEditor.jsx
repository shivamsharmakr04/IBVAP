import React, { useState, useEffect, useRef } from 'react';
import { Layers, Plus, Trash2, MousePointer, Save } from 'lucide-react';

export default function ZoneEditor({ cameras, selectedCameraId, onSaveZone, onDeleteZone, existingZones }) {
  const [activeCamId, setActiveCamId] = useState(selectedCameraId || (cameras[0]?.id || 1));
  const [points, setPoints] = useState([]);
  const [zoneName, setZoneName] = useState('INTRUSION_ZONE_SECTOR_07W');
  const [zoneType, setZoneType] = useState('INTRUSION_ZONE');
  const [sensitivity, setSensitivity] = useState(0.85);
  const canvasRef = useRef(null);

  const activeCamera = cameras.find(c => c.id === activeCamId) || cameras[0];

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
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText(`[SAVED] ${z.name}`, z.coordinates[0][0] * canvas.width + 5, z.coordinates[0][1] * canvas.height + 15);
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
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();
      }

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      points.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#06b6d4' : '#ef4444';
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
  };

  const handleClearPoints = () => {
    setPoints([]);
  };

  const handleSave = () => {
    if (points.length < 3) {
      alert('Please click at least 3 points on the feed to define perimeter boundary.');
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
  };

  return (
    <div className="p-3 font-mono bg-[#f1f5f9] text-slate-900 min-h-screen">
      <div className="max-w-[1920px] mx-auto space-y-3">
        {/* Header */}
        <div className="tactical-card p-3 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              VIRTUAL FENCE & PERIMETER POLYGON CONFIGURATOR
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              // INTERACTIVE POLYNOMIAL BOUNDARY CALIBRATION // SECTOR MHA-04
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] font-bold text-slate-600">SELECT STREAM:</span>
            <select
              value={activeCamId}
              onChange={(e) => {
                setActiveCamId(Number(e.target.value));
                setPoints([]);
              }}
              className="bg-slate-50 border border-slate-300 text-cyan-700 text-xs rounded px-3 py-1.5 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {cameras.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.location || 'SECTOR'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Stream Canvas */}
          <div className="lg:col-span-2 space-y-2">
            <div className="relative aspect-video rounded border-2 border-slate-800 bg-slate-950 overflow-hidden">
              {activeCamera?.stream_url ? (
                <video
                  src={activeCamera.stream_url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                  STREAM OFFLINE
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                onClick={handleCanvasClick}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />

              <div className="absolute top-3 left-3 bg-black/90 text-cyan-300 font-mono text-[10px] px-3 py-1 rounded border border-cyan-500/40 flex items-center gap-2">
                <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
                {points.length === 0 
                  ? "Click feed to add boundary vertices" 
                  : `Vertices: ${points.length} (Need 3+ for boundary)`}
              </div>

              {points.length > 0 && (
                <button
                  onClick={handleClearPoints}
                  className="absolute top-3 right-3 px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold rounded cursor-pointer"
                >
                  CLEAR DRAW
                </button>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-3">
            <div className="tactical-card p-4 rounded-md space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-600" />
                DEFINE PERIMETER RULE
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">RULE ID / ZONE NAME</label>
                  <input
                    type="text"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">DETECTION EVENT TYPE</label>
                  <select
                    value={zoneType}
                    onChange={(e) => setZoneType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-cyan-800 font-mono font-bold cursor-pointer"
                  >
                    <option value="INTRUSION_ZONE">INTRUSION_ZONE (Border Breach)</option>
                    <option value="RESTRICTED_AREA">RESTRICTED_AREA (No Access)</option>
                    <option value="FENCE_LINE">FENCE_LINE (Approach Warning)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>SENSITIVITY THRESHOLD:</span>
                    <span className="text-cyan-700">{(sensitivity * 100).toFixed(0)}%</span>
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
                  className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                    points.length >= 3
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  SAVE PERIMETER RULE
                </button>
              </div>
            </div>

            {/* Saved List */}
            <div className="tactical-card p-3 rounded-md space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
                CONFIGURED ZONES ({existingZones?.length || 0})
              </h4>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {!existingZones || existingZones.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-[10px]">
                    NO ACTIVE ZONES ON THIS STREAM
                  </div>
                ) : (
                  existingZones.map((z) => (
                    <div key={z.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-[10px]">
                      <div>
                        <p className="font-bold text-cyan-800">{z.name}</p>
                        <p className="text-[9px] text-slate-500">{z.zone_type} | {((z.sensitivity || 0.8) * 100).toFixed(0)}% SENS</p>
                      </div>
                      <button onClick={() => onDeleteZone(z.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer">
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
    </div>
  );
}
