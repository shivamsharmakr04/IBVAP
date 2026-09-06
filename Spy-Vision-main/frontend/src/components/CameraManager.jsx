import React, { useState } from 'react';
import { Server, Plus, Video, Trash2, Edit3, Activity, CheckCircle, Radio, ShieldCheck } from 'lucide-react';

export default function CameraManager({ cameras, onCreateCamera, onUpdateCamera, onDeleteCamera, onHeartbeat }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCam, setEditingCam] = useState(null);

  const [form, setForm] = useState({
    name: '',
    location: '',
    stream_url: '',
    status: 'ONLINE',
    ai_models_enabled: ['PERSON_DETECTION', 'INTRUSION_DETECTION']
  });

  const handleOpenAdd = () => {
    setEditingCam(null);
    setForm({
      name: '',
      location: '',
      stream_url: '',
      status: 'ONLINE',
      ai_models_enabled: ['PERSON_DETECTION', 'INTRUSION_DETECTION']
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.stream_url) {
      alert('Please enter Camera Name and Stream URL');
      return;
    }
    if (editingCam) {
      onUpdateCamera(editingCam.id, form);
    } else {
      onCreateCamera(form);
    }
    setShowModal(false);
  };

  const toggleModel = (modelKey) => {
    const exists = form.ai_models_enabled.includes(modelKey);
    if (exists) {
      setForm({
        ...form,
        ai_models_enabled: form.ai_models_enabled.filter(m => m !== modelKey)
      });
    } else {
      setForm({
        ...form,
        ai_models_enabled: [...form.ai_models_enabled, modelKey]
      });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="font-tactical text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            Border Outpost CCTV Stream Registry & Edge Nodes
          </h2>
          <p className="text-xs text-slate-400">
            Register RTSP/HTTP CCTV streams across BOP sectors and configure active AI analytics pipelines.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Register New CCTV Camera
        </button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-tactical text-base font-bold text-slate-100">{cam.name}</h3>
                  <p className="text-xs text-slate-400">{cam.location || 'Border Outpost Sector'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  cam.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-rose-950 text-rose-400 border-rose-500/40'
                }`}>
                  {cam.status}
                </span>

                <button
                  onClick={() => onDeleteCamera(cam.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                  title="Delete Camera"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stream URL */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400 truncate">
              URL: {cam.stream_url}
            </div>

            {/* AI Models Badges */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Active AI Pipelines:</span>
              <div className="flex flex-wrap gap-1.5">
                {(cam.ai_models_enabled || ['PERSON_DETECTION', 'INTRUSION_DETECTION']).map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Heartbeat Test */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">ID #{cam.id}</span>
              <button
                onClick={() => onHeartbeat(cam.id)}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 rounded flex items-center gap-1 text-[11px]"
              >
                <Activity className="w-3.5 h-3.5" />
                Ping Heartbeat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Camera Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-lg w-full rounded-2xl p-6 space-y-4 border border-cyan-500/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-tactical text-lg font-bold text-cyan-400 uppercase">
                {editingCam ? 'Edit Camera Configuration' : 'Register New CCTV Camera'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Camera Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 font-tactical font-bold text-sm"
                  placeholder="e.g. BOP Sector 4 - Main Fence"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Stream URL (RTSP / HTTP / MP4 Video)</label>
                <input
                  type="text"
                  required
                  value={form.stream_url}
                  onChange={(e) => setForm({...form, stream_url: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-400 font-mono"
                  placeholder="rtsp://192.168.1.100:554/live or http://..."
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Location / Border Outpost (BOP)</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                  placeholder="e.g. BOP Alpha Gate 4"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-2">Enable AI Model Pipelines:</label>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {[
                    'PERSON_DETECTION',
                    'VEHICLE_DETECTION',
                    'INTRUSION_DETECTION',
                    'ANPR',
                    'FACE_RECOGNITION',
                    'NIGHT_MOVEMENT'
                  ].map(modelKey => (
                    <label key={modelKey} className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.ai_models_enabled.includes(modelKey)}
                        onChange={() => toggleModel(modelKey)}
                        className="accent-cyan-500"
                      />
                      <span className="text-slate-300">{modelKey}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold font-tactical rounded-lg">
                Save Camera Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
