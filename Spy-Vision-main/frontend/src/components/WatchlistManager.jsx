import React, { useState } from 'react';
import { Users, Car, Plus, Trash2, Edit3, ShieldAlert, CheckCircle, Search, AlertOctagon } from 'lucide-react';

export default function WatchlistManager({ 
  persons, 
  vehicles, 
  onCreatePerson, 
  onUpdatePerson, 
  onDeletePerson,
  onCreateVehicle,
  onUpdateVehicle,
  onDeleteVehicle
}) {
  const [activeTab, setActiveTab] = useState('persons'); // 'persons' | 'vehicles'
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states for modal
  const [personForm, setPersonForm] = useState({
    full_name: '',
    suspect_id: '',
    threat_level: 'HIGH',
    status: 'WANTED',
    notes: '',
    photo_url: ''
  });

  const [vehicleForm, setVehicleForm] = useState({
    plate_number: '',
    vehicle_type: 'SUV / Off-Road',
    color: 'Dark Grey',
    threat_level: 'HIGH',
    notes: ''
  });

  const filteredPersons = persons.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.suspect_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(v => 
    v.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePerson = (e) => {
    e.preventDefault();
    if (!personForm.full_name || !personForm.suspect_id) {
      alert('Please fill in Full Name and Suspect ID');
      return;
    }
    onCreatePerson({
      ...personForm,
      photo_url: personForm.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    });
    setShowModal(false);
    setPersonForm({ full_name: '', suspect_id: '', threat_level: 'HIGH', status: 'WANTED', notes: '', photo_url: '' });
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!vehicleForm.plate_number) {
      alert('Please enter a License Plate Number');
      return;
    }
    onCreateVehicle(vehicleForm);
    setShowModal(false);
    setVehicleForm({ plate_number: '', vehicle_type: 'SUV / Off-Road', color: 'Dark Grey', threat_level: 'HIGH', notes: '' });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="font-tactical text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Watchlist & Persons of Interest Database
          </h2>
          <p className="text-xs text-slate-400">
            Manage biometric face recognition profiles and ANPR license plate watchlist flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search suspect ID or plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none w-64"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add {activeTab === 'persons' ? 'Suspect Profile' : 'Flagged Vehicle'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('persons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-tactical tracking-wider transition-all ${
            activeTab === 'persons'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Face Watchlist ({persons.length})
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-tactical tracking-wider transition-all ${
            activeTab === 'vehicles'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          ANPR Vehicle Watchlist ({vehicles.length})
        </button>
      </div>

      {/* Content Grid */}
      {activeTab === 'persons' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersons.map((p) => (
            <div key={p.id} className="glass-panel rounded-xl p-4 border border-slate-800 flex gap-4 relative group hover:border-cyan-500/40 transition-all">
              {/* Photo */}
              <div className="w-24 h-28 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                <img src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'} alt={p.full_name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-start justify-between">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                    p.threat_level === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border-rose-500/40' :
                    p.threat_level === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-500/40' : 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                  }`}>
                    {p.threat_level || 'HIGH'}
                  </span>
                  <button
                    onClick={() => onDeletePerson(p.id)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-tactical text-base font-bold text-slate-100">{p.full_name}</h3>
                <p className="font-mono text-[11px] text-cyan-400">ID: {p.suspect_id}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{p.notes}</p>

                <div className="pt-2 text-[10px] font-mono text-slate-500">
                  Status: <strong className="text-amber-400">{p.status || 'WANTED'}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3 relative group hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-amber-400 bg-slate-950 px-3 py-1 rounded border border-amber-500/40">
                  {v.plate_number}
                </span>
                <button
                  onClick={() => onDeleteVehicle(v.id)}
                  className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span>{v.vehicle_type || 'Vehicle'} • {v.color || 'Dark'}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{v.notes || 'Flagged for surveillance'}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Threat: <strong className="text-rose-400">{v.threat_level || 'HIGH'}</strong></span>
                <span className="text-emerald-400">ANPR ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-md w-full rounded-2xl p-6 space-y-4 border border-cyan-500/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-tactical text-lg font-bold text-cyan-400 uppercase">
                Add New {activeTab === 'persons' ? 'Suspect Profile' : 'Flagged Vehicle'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {activeTab === 'persons' ? (
              <form onSubmit={handleSavePerson} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={personForm.full_name}
                    onChange={(e) => setPersonForm({...personForm, full_name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                    placeholder="e.g. Vikram Singh"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Suspect ID / Token</label>
                  <input
                    type="text"
                    required
                    value={personForm.suspect_id}
                    onChange={(e) => setPersonForm({...personForm, suspect_id: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 font-mono"
                    placeholder="e.g. POI-2026-9041"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Threat Level</label>
                    <select
                      value={personForm.threat_level}
                      onChange={(e) => setPersonForm({...personForm, threat_level: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-2 text-rose-400 font-mono font-bold"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Status</label>
                    <select
                      value={personForm.status}
                      onChange={(e) => setPersonForm({...personForm, status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-2 text-amber-400 font-mono"
                    >
                      <option value="WANTED">WANTED</option>
                      <option value="SUSPECT">SUSPECT</option>
                      <option value="PERSON_OF_INTEREST">POI</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Notes / Intelligence</label>
                  <textarea
                    rows={2}
                    value={personForm.notes}
                    onChange={(e) => setPersonForm({...personForm, notes: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                    placeholder="Brief description..."
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold font-tactical rounded-lg">
                  Save Suspect to Watchlist
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">License Plate Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.plate_number}
                    onChange={(e) => setVehicleForm({...vehicleForm, plate_number: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-amber-400 font-mono font-bold"
                    placeholder="e.g. JK-02-AB-9981"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Vehicle Type</label>
                    <input
                      type="text"
                      value={vehicleForm.vehicle_type}
                      onChange={(e) => setVehicleForm({...vehicleForm, vehicle_type: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                      placeholder="e.g. SUV"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Color</label>
                    <input
                      type="text"
                      value={vehicleForm.color}
                      onChange={(e) => setVehicleForm({...vehicleForm, color: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                      placeholder="e.g. Dark Grey"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={vehicleForm.notes}
                    onChange={(e) => setVehicleForm({...vehicleForm, notes: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
                    placeholder="Flag reason..."
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold font-tactical rounded-lg">
                  Flag License Plate in ANPR
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
