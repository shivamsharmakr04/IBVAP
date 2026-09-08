import React, { useState } from 'react';
import { FileText, Search, Filter, Calendar, Eye, Download, ShieldAlert, Car, User, Layers, RefreshCw } from 'lucide-react';

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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="font-tactical text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Historical Surveillance Event Log & Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Query past intrusions, ANPR plate scans, face watchlist hits, and AI event logs.
          </p>
        </div>

        <button
          onClick={onRefreshEvents}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-cyan-700 dark:text-cyan-400 text-xs font-mono rounded-lg hover:border-cyan-500/50 flex items-center gap-1.5 self-start md:self-auto cursor-pointer font-semibold shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Logs
        </button>
      </div>

      {/* Query Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs shadow-xs">
        {/* Filter 1: Camera */}
        <div>
          <label className="block font-mono text-slate-600 dark:text-slate-400 mb-1 font-semibold">CCTV Camera / BOP</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-cyan-700 dark:text-cyan-400 font-mono font-semibold focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Cameras ({cameras.length})</option>
            {cameras.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Filter 2: Event Type */}
        <div>
          <label className="block font-mono text-slate-600 dark:text-slate-400 mb-1 font-semibold">AI Event Classification</label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Event Types</option>
            <option value="INTRUSION">INTRUSION (Border Breach)</option>
            <option value="ANPR_MATCH">ANPR_MATCH (Plate Hit)</option>
            <option value="FACE_MATCH">FACE_MATCH (Watchlist Person)</option>
            <option value="NIGHT_MOVEMENT">NIGHT_MOVEMENT (IR Motion)</option>
            <option value="PERSON_DETECTED">PERSON_DETECTED</option>
            <option value="VEHICLE_DETECTED">VEHICLE_DETECTED</option>
          </select>
        </div>

        {/* Filter 3: Severity */}
        <div>
          <label className="block font-mono text-slate-600 dark:text-slate-400 mb-1 font-semibold">Severity Level</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        {/* Filter 4: Plate Number */}
        <div>
          <label className="block font-mono text-slate-600 dark:text-slate-400 mb-1 font-semibold">ANPR Plate Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="e.g. JK-02-AB-9981"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-8 pr-3 py-2 text-amber-700 dark:text-amber-400 font-mono font-bold focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Camera / Location</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Detected Details</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No surveillance events match the query criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-tactical font-bold text-slate-900 dark:text-slate-100">
                      {getCameraName(evt.camera_id)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-cyan-700 dark:text-cyan-400 font-bold">
                        {evt.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        evt.severity === 'CRITICAL' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/40' :
                        evt.severity === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40' :
                        'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}>
                        {evt.severity || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {evt.plate_number ? (
                        <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                          PLATE: {evt.plate_number}
                        </span>
                      ) : evt.person_name ? (
                        <span className="text-rose-700 dark:text-rose-300 font-bold">
                          FACE: {evt.person_name}
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">BBox: (x: {evt.bounding_box?.x || 120}, y: {evt.bounding_box?.y || 80})</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      {((evt.confidence || 0.94) * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEventModal(evt)}
                        className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-900 rounded font-tactical font-bold text-xs cursor-pointer"
                      >
                        View Snapshot
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot / Detail Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-2xl w-full rounded-2xl p-6 space-y-4 border border-cyan-400 dark:border-cyan-500/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-tactical text-lg font-bold text-cyan-700 dark:text-cyan-400 uppercase">
                  Surveillance Event #{selectedEventModal.id} Detail
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Camera: {getCameraName(selectedEventModal.camera_id)}
                </p>
              </div>
              <button onClick={() => setSelectedEventModal(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono text-sm cursor-pointer">✕</button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-64 flex items-center justify-center">
              <img
                src={selectedEventModal.snapshot_path || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'}
                alt="Event Snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-950/90 p-2 rounded border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
                AI CONFIDENCE: {((selectedEventModal.confidence || 0.95) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 dark:text-slate-500">EVENT TYPE:</span>
                <p className="text-slate-900 dark:text-slate-200 font-bold">{selectedEventModal.event_type}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500">TIMESTAMP:</span>
                <p className="text-slate-900 dark:text-slate-200">{new Date(selectedEventModal.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
