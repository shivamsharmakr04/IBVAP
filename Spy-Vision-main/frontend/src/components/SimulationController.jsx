import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Car, Zap, CheckCircle2, Smile, Package } from 'lucide-react';

export default function SimulationController({ cameras, onTriggerEvent }) {
  const [selectedCamId, setSelectedCamId] = useState(cameras[0]?.id || 1);
  const [lastTriggered, setLastTriggered] = useState(null);

  const presets = [
    {
      id: 'INTRUSION',
      title: 'Perimeter Intrusion Event',
      icon: ShieldAlert,
      color: 'bg-rose-600 hover:bg-rose-500 text-white',
      description: 'Simulates 2 unauthorized targets crossing virtual fence boundary.',
      data: {
        camera_id: selectedCamId,
        event_type: 'INTRUSION',
        severity: 'CRITICAL',
        confidence: 0.96,
        snapshot_path: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
        message: 'Critical Perimeter Intrusion detected at Gate 4! 2 targets crossing virtual fence.'
      }
    },
    {
      id: 'ANPR_MATCH',
      title: 'Plate Watchlist Hit',
      icon: Car,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      description: 'Simulates ANPR reading plate "JK-02-AB-9981" matching vehicle watchlist.',
      data: {
        camera_id: selectedCamId,
        event_type: 'ANPR_MATCH',
        severity: 'HIGH',
        plate_number: 'JK-02-AB-9981',
        confidence: 0.98,
        snapshot_path: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
        message: 'Watchlist Plate Match: JK-02-AB-9981 detected entering checkpost.'
      }
    },
    {
      id: 'OBJECT_DETECTED',
      title: 'Unattended Object Detection',
      icon: Package,
      color: 'bg-amber-600 hover:bg-amber-500 text-white',
      description: 'Simulates unattended bag or parcel detected in restricted zone.',
      data: {
        camera_id: selectedCamId,
        event_type: 'OBJECT_DETECTED',
        severity: 'HIGH',
        confidence: 0.94,
        snapshot_path: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        message: 'Object Alert: Unattended Backpack detected inside Restricted Zone Alpha.'
      }
    },
    {
      id: 'REACTION_ANALYSIS',
      title: 'Target Suspicious Behavior',
      icon: Smile,
      color: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      description: 'Simulates suspicious behavior pattern detected near perimeter.',
      data: {
        camera_id: selectedCamId,
        event_type: 'REACTION_ANALYSIS',
        severity: 'CRITICAL',
        confidence: 0.97,
        person_name: 'Target #101',
        snapshot_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        message: 'Reaction Alert: Target exhibiting suspicious behavior near fence.'
      }
    }
  ];

  const handleTrigger = (preset) => {
    const eventPayload = {
      ...preset.data,
      camera_id: selectedCamId,
      timestamp: new Date().toISOString()
    };
    onTriggerEvent(eventPayload);
    setLastTriggered(preset.title + ' at ' + new Date().toLocaleTimeString());
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono text-slate-900 select-none">
      {/* Header */}
      <div className="tactical-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[#00a896]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00a896] animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                AI DETECTION INTRUSION SIMULATOR // DRILL CONTROLLER
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Trigger synthetic surveillance alert events to test real-time perimeter feeds and lockouts.
            </p>
          </div>
        </div>

        {lastTriggered && (
          <div className="p-2.5 bg-emerald-50 rounded border border-emerald-300 text-[11px] font-bold text-[#10b981] flex items-center gap-2 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            <span>EVENT INJECTED: <strong>{lastTriggered}</strong></span>
          </div>
        )}
      </div>

      {/* Camera Target Selector */}
      <div className="tactical-card p-3 flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">TARGET CAMERA NODE:</span>
        <select
          value={selectedCamId}
          onChange={(e) => setSelectedCamId(Number(e.target.value))}
          className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-3 py-1.5 font-mono font-bold focus:outline-none focus:border-[#00a896] cursor-pointer"
        >
          {cameras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toUpperCase()} ({c.location ? c.location.toUpperCase() : 'GATE'})
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="tactical-card p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{p.title}</h3>
                </div>
                <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{p.description}</p>
              </div>

              <button
                onClick={() => handleTrigger(p)}
                className={`w-full py-2 rounded font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  p.id === 'INTRUSION' ? 'bg-[#e11d48] hover:bg-[#be123c]' :
                  p.id === 'ANPR_MATCH' ? 'bg-[#00a896] hover:bg-[#009282]' :
                  p.id === 'OBJECT_DETECTED' ? 'bg-[#f59e0b] hover:bg-[#d97706]' :
                  'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                TRIGGER {p.id} DRILL
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
