import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Car, User, Moon, Zap, Play, CheckCircle2, Smile, Package } from 'lucide-react';

export default function SimulationController({ cameras, onTriggerEvent }) {
  const [selectedCamId, setSelectedCamId] = useState(cameras[0]?.id || 1);
  const [lastTriggered, setLastTriggered] = useState(null);

  const presets = [
    {
      id: 'REACTION_ANALYSIS',
      title: 'Real-Time Facial Reaction & Emotion Analysis',
      icon: Smile,
      color: 'from-pink-600 to-rose-500',
      textColor: 'text-pink-400',
      description: 'Analyzes facial expressions and stress levels: Detects AGITATED / HIGH STRESS emotion on target near fence line.',
      data: {
        camera_id: selectedCamId,
        event_type: 'REACTION_ANALYSIS',
        severity: 'CRITICAL',
        confidence: 0.97,
        person_name: 'Unknown Target #101',
        snapshot_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        message: 'Facial Reaction Analysis Alert: Target exhibiting HIGH STRESS / AGITATED behavior (87% stress score) near perimeter.'
      }
    },
    {
      id: 'OBJECT_DETECTED',
      title: 'Object Classification & Threat Identification',
      icon: Package,
      color: 'from-amber-600 to-orange-500',
      textColor: 'text-amber-400',
      description: 'Identifies non-person objects: Unattended Backpack / Hazardous Parcel spotted inside Restricted Zone Alpha.',
      data: {
        camera_id: selectedCamId,
        event_type: 'OBJECT_DETECTED',
        severity: 'HIGH',
        confidence: 0.94,
        snapshot_path: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        message: 'Object Identification Alert: Unattended Backpack detected inside Restricted Zone Alpha (94% confidence).'
      }
    },
    {
      id: 'INTRUSION',
      title: 'Border Fence Breach Intrusion',
      icon: ShieldAlert,
      color: 'from-rose-600 to-red-500',
      textColor: 'text-rose-400',
      description: 'Simulates 2 unauthorized individuals breaching virtual fence zone at BOP Gate 4.',
      data: {
        camera_id: selectedCamId,
        event_type: 'INTRUSION',
        severity: 'CRITICAL',
        confidence: 0.96,
        snapshot_path: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
        message: 'Critical Perimeter Intrusion detected at Fence Gate 4! 2 individuals crossing virtual fence.'
      }
    },
    {
      id: 'ANPR_MATCH',
      title: 'ANPR Watchlist Plate Hit',
      icon: Car,
      color: 'from-cyan-600 to-blue-500',
      textColor: 'text-cyan-400',
      description: 'Simulates ANPR reading plate "JK-02-AB-9981" matching high-risk vehicle watchlist.',
      data: {
        camera_id: selectedCamId,
        event_type: 'ANPR_MATCH',
        severity: 'HIGH',
        plate_number: 'JK-02-AB-9981',
        confidence: 0.98,
        snapshot_path: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
        message: 'Watchlist Plate Match: JK-02-AB-9981 detected entering Checkpost Bravo.'
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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-tactical text-2xl font-bold text-cyan-400 uppercase tracking-wider">
              REAL-TIME AI DETECTION, OBJECT & FACIAL REACTION ENGINE
            </h2>
            <p className="text-xs text-slate-300">
              Trigger facial emotion analysis, object identification, and intrusion report events to test real-time WebSocket alert processing.
            </p>
          </div>
        </div>

        {lastTriggered && (
          <div className="p-2.5 bg-emerald-950/80 rounded-lg border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Event Broadcast Triggered: <strong>{lastTriggered}</strong></span>
          </div>
        )}
      </div>

      {/* Camera Target Selector */}
      <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <span className="text-xs font-mono text-slate-300 uppercase font-bold">Target CCTV Stream for AI Analysis:</span>
        <select
          value={selectedCamId}
          onChange={(e) => setSelectedCamId(Number(e.target.value))}
          className="bg-slate-950 border border-slate-700 text-cyan-400 font-mono text-xs rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-cyan-500"
        >
          {cameras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.location || 'BOP Sector'})
            </option>
          ))}
        </select>
      </div>

      {/* Trigger Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${p.textColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-tactical text-lg font-bold text-slate-100 uppercase">{p.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              </div>

              <button
                onClick={() => handleTrigger(p)}
                className={`w-full py-3 rounded-xl font-tactical font-bold text-slate-950 text-sm uppercase tracking-wider bg-gradient-to-r ${p.color} hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10`}
              >
                <Zap className="w-4 h-4 fill-current" />
                Trigger {p.id} AI Event
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
