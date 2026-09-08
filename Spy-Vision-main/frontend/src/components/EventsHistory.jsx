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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Surveillance Event Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit past intrusions, plate recognition matches, and surveillance logs.
          </p>
        </div>

        <button
          onClick={onRefreshEvents}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs shadow-xs font-medium">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="">All Cameras ({cameras.length})</option>
            {cameras.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">Event Type</label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="">All Event Types</option>
            <option value="INTRUSION">INTRUSION (Breach)</option>
            <option value="ANPR_MATCH">ANPR_MATCH (Plate Hit)</option>
            <option value="FACE_MATCH">FACE_MATCH (Watchlist)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1">Plate Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="e.g. JK-02-AB-9981"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-8 pr-3 py-1.5 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Camera</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-800 dark:text-slate-200 font-medium">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No surveillance events match your filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {getCameraName(evt.camera_id)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                        {evt.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        evt.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                        evt.severity === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {evt.severity || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {evt.plate_number ? (
                        <span className="text-amber-700 dark:text-amber-400 font-bold">
                          PLATE: {evt.plate_number}
                        </span>
                      ) : evt.person_name ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          FACE: {evt.person_name}
                        </span>
                      ) : (
                        <span className="text-slate-500">Target Detected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      {((evt.confidence || 0.94) * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEventModal(evt)}
                        className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded font-semibold text-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-xl w-full rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Event #{selectedEventModal.id} Snapshot
              </h3>
              <button onClick={() => setSelectedEventModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-900 h-60 flex items-center justify-center">
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
