import React, { useState } from 'react';
import { FileText, Search, RefreshCw, Eye } from 'lucide-react';

export default function EventsHistory({ events, cameras, onRefreshEvents }) {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [searchPlate, setSearchPlate] = useState('');
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  const filteredEvents = events.filter((evt) => {
    if (selectedCamera && String(evt.camera_id) !== String(selectedCamera)) return false;
    if (selectedEventType && evt.event_type !== selectedEventType) return false;
    if (selectedSeverity && evt.severity !== selectedSeverity) return false;
    if (searchPlate && !evt.plate_number?.toLowerCase().includes(searchPlate.toLowerCase())) return false;
    return true;
  });

  const getCameraName = (camId) => {
    const cam = cameras.find(c => String(c.id) === String(camId));
    return cam ? cam.name : `Camera #${camId}`;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans text-slate-900 select-none">
      {/* Header */}
      <div className="light-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Surveillance Event Audit Logs
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Filter past perimeter intrusions, plate recognition hits, and biometric surveillance event logs.
          </p>
        </div>

        <button
          onClick={onRefreshEvents}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Logs
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="light-card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Target Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Cameras ({cameras.length})</option>
            {cameras.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Event Category</label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Event Categories</option>
            <option value="INTRUSION">Intrusion Breach</option>
            <option value="ANPR_MATCH">ANPR Plate Hit</option>
            <option value="FACE_MATCH">Biometric Face Watchlist</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Alert Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">ANPR Plate Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search plate..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="light-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Camera Node</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs font-medium">
                    No surveillance events match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-xs font-mono">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {getCameraName(evt.camera_id)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs">
                        {evt.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                        evt.severity === 'CRITICAL' ? 'bg-rose-600' :
                        evt.severity === 'HIGH' ? 'bg-amber-500' :
                        'bg-slate-600'
                      }`}>
                        {evt.severity || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {evt.plate_number ? (
                        <span className="text-blue-600 font-bold font-mono">
                          Plate: {evt.plate_number}
                        </span>
                      ) : evt.person_name ? (
                        <span className="text-rose-600 font-bold">
                          Face: {evt.person_name}
                        </span>
                      ) : (
                        <span className="text-slate-500">Target Detected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-bold font-mono">
                      {((evt.confidence || 0.94) * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEventModal(evt)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                      >
                        View Photo
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-xl w-full rounded-2xl p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Event #{selectedEventModal.id} Snapshot Record
              </h3>
              <button onClick={() => setSelectedEventModal(null)} className="text-slate-400 hover:text-slate-900 font-bold cursor-pointer">✕</button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 h-64 flex items-center justify-center border border-slate-200">
              <img
                src={selectedEventModal.snapshot_path || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'}
                alt="Snapshot"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
