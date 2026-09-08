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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono text-slate-900 select-none">
      {/* Header */}
      <div className="tactical-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00a896] animate-pulse" />
            <h2 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-slate-900">
              <FileText className="w-4 h-4 text-[#00a896]" />
              SURVEILLANCE EVENT LOGS // ARCHIVE MATRIX
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            Audit past intrusions, plate recognition matches, and surveillance log history.
          </p>
        </div>

        <button
          onClick={onRefreshEvents}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold tracking-wider uppercase rounded border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH LOGS
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="tactical-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Target Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#00a896] cursor-pointer"
          >
            <option value="">ALL CAMERAS ({cameras.length})</option>
            {cameras.map(c => (
              <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Event Category</label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#00a896] cursor-pointer"
          >
            <option value="">ALL EVENT TYPES</option>
            <option value="INTRUSION">INTRUSION (BREACH)</option>
            <option value="ANPR_MATCH">ANPR_MATCH (PLATE HIT)</option>
            <option value="FACE_MATCH">FACE_MATCH (WATCHLIST)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Alert Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-[#00a896] cursor-pointer"
          >
            <option value="">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">ANPR Plate Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="SEARCH PLATE..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 font-mono uppercase font-bold focus:outline-none focus:border-[#00a896]"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="tactical-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-4">TIMESTAMP (UTC)</th>
                <th className="py-2.5 px-4">CAM NODE</th>
                <th className="py-2.5 px-4">EVENT TYPE</th>
                <th className="py-2.5 px-4">SEVERITY</th>
                <th className="py-2.5 px-4">DETAILS</th>
                <th className="py-2.5 px-4">CONFIDENCE</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
                    NO SURVEILLANCE EVENTS MATCH FILTER CRITERIA
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 uppercase">
                      {getCameraName(evt.camera_id)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px] tracking-wider uppercase">
                        {evt.event_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white ${
                        evt.severity === 'CRITICAL' ? 'bg-[#e11d48]' :
                        evt.severity === 'HIGH' ? 'bg-[#f59e0b]' :
                        'bg-slate-600'
                      }`}>
                        {evt.severity || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {evt.plate_number ? (
                        <span className="text-[#00a896] font-bold">
                          PLATE: {evt.plate_number}
                        </span>
                      ) : evt.person_name ? (
                        <span className="text-[#e11d48] font-bold">
                          FACE: {evt.person_name}
                        </span>
                      ) : (
                        <span className="text-slate-500">TARGET DETECTED</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-[#10b981] font-bold">
                      {((evt.confidence || 0.94) * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEventModal(evt)}
                        className="px-2.5 py-1 bg-[#00a896] text-white hover:bg-[#009282] rounded font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                      >
                        VIEW SNAPSHOT
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
          <div className="bg-white max-w-xl w-full rounded p-5 space-y-4 border border-slate-300 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                EVENT #{selectedEventModal.id} SNAPSHOT RECORD
              </h3>
              <button onClick={() => setSelectedEventModal(null)} className="text-slate-400 hover:text-slate-900 font-bold cursor-pointer">✕</button>
            </div>

            <div className="relative rounded overflow-hidden bg-slate-900 h-64 flex items-center justify-center border border-slate-300">
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
