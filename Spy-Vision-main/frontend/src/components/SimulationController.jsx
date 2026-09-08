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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Detection Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trigger simulated surveillance alerts to test real-time notification feeds.
            </p>
          </div>
        </div>

        {lastTriggered && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simulated Event Triggered: <strong>{lastTriggered}</strong></span>
          </div>
        )}
      </div>

      {/* Camera Target Selector */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Camera Stream:</span>
        <select
          value={selectedCamId}
          onChange={(e) => setSelectedCamId(Number(e.target.value))}
          className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-1.5 font-medium cursor-pointer"
        >
          {cameras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.location || 'Gate'})
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.title}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
              </div>

              <button
                onClick={() => handleTrigger(p)}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs ${p.color}`}
              >
                <Zap className="w-4 h-4 fill-current" />
                Trigger {p.title}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
