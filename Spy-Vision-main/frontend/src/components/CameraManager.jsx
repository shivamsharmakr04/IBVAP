import React, { useState } from 'react';
import { Server, Plus, Video, Trash2, Activity } from 'lucide-react';

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

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono text-slate-900 select-none">
      {/* Header */}
      <div className="tactical-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00a896] animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
              <Server className="w-4 h-4 text-[#00a896]" />
              CCTV CAMERA REGISTRY // HARDWARE FEEDS
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            Register surveillance video streams and active AI detection model pipelines.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 bg-[#00a896] hover:bg-[#009282] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          REGISTER CAMERA
        </button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="tactical-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[#00a896]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{cam.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{cam.location ? cam.location.toUpperCase() : 'SECTOR GATE'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${
                  cam.status === 'ONLINE' ? 'bg-[#10b981]' : 'bg-[#e11d48]'
                }`}>
                  {cam.status}
                </span>

                <button
                  onClick={() => onDeleteCamera(cam.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Camera"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-[#00a896] font-mono font-bold truncate">
              URL: {cam.stream_url}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 font-bold uppercase">CAM ID: #{cam.id}</span>
              <button
                onClick={() => onHeartbeat(cam.id)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-[#10b981]" />
                PING STATUS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
          <div className="bg-white max-w-md w-full rounded p-6 space-y-4 border border-slate-300 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">REGISTER NEW CAMERA NODE</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 tracking-wider">Camera Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#00a896]"
                  placeholder="E.G. CAM-05 MAIN SECTOR GATE"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 tracking-wider">Stream URL (RTSP / HTTP)</label>
                <input
                  type="text"
                  required
                  value={form.stream_url}
                  onChange={(e) => setForm({...form, stream_url: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#00a896]"
                  placeholder="rtsp://192.168.1.100/live"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 tracking-wider">Location / Sector Zone</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#00a896]"
                  placeholder="E.G. SECTOR 4 ALPHA"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#00a896] hover:bg-[#009282] text-white font-bold uppercase tracking-wider rounded cursor-pointer transition-colors mt-4">
                SAVE CAMERA NODE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
