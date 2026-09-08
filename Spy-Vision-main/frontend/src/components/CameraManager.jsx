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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            CCTV Camera Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Register surveillance video streams and active AI detection models.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Register Camera
        </button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cam.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cam.location || 'Location'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  cam.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
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

            <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
              URL: {cam.stream_url}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-400">ID #{cam.id}</span>
              <button
                onClick={() => onHeartbeat(cam.id)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-emerald-700 dark:text-emerald-400 rounded flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                Ping Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register Camera</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Camera Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-bold"
                  placeholder="e.g. Main Gate Camera"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Stream URL</label>
                <input
                  type="text"
                  required
                  value={form.stream_url}
                  onChange={(e) => setForm({...form, stream_url: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  placeholder="rtsp://192.168.1.100/live or http://..."
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  placeholder="e.g. Sector Gate 4"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg cursor-pointer">
                Save Camera
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
