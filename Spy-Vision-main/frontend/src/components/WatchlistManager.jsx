import React, { useState } from 'react';
import { Users, Car, Plus, Trash2, Search } from 'lucide-react';

export default function WatchlistManager({ 
  persons, 
  vehicles, 
  onCreatePerson, 
  onDeletePerson,
  onCreateVehicle,
  onDeleteVehicle
}) {
  const [activeTab, setActiveTab] = useState('persons');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

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
    vehicle_type: 'SUV / OFF-ROAD',
    color: 'DARK GREY',
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
      alert('Please enter Full Name and Suspect ID');
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
    setVehicleForm({ plate_number: '', vehicle_type: 'SUV / OFF-ROAD', color: 'DARK GREY', threat_level: 'HIGH', notes: '' });
  };

  return (
    <div className="p-3 font-mono bg-[#f1f5f9] text-slate-900 min-h-screen">
      <div className="max-w-[1920px] mx-auto space-y-3">
        {/* Header */}
        <div className="tactical-card p-3 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-600" />
              WATCHLIST & BIOMETRIC DATABASE
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              // BIOMETRIC FACE PROFILES & ANPR LICENSE PLATE WATCHLIST // SECTOR MHA-04
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="SEARCH POI ID OR PLATE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1 text-[11px] text-slate-900 font-bold focus:outline-none w-56"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded uppercase tracking-wider cursor-pointer shadow-xs"
            >
              + ADD {activeTab === 'persons' ? 'POI PROFILE' : 'FLAGGED PLATE'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-300 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('persons')}
            className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'persons'
                ? 'bg-[#00a896] text-white border border-cyan-600 shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            BIOMETRIC FACE WATCHLIST ({persons.length})
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-[#00a896] text-white border border-cyan-600 shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            ANPR VEHICLE WATCHLIST ({vehicles.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'persons' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPersons.map((p) => (
              <div key={p.id} className="tactical-card p-3 rounded-md flex gap-3 relative group">
                <div className="w-20 h-24 rounded overflow-hidden bg-slate-950 border border-slate-300 flex-shrink-0">
                  <img src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'} alt={p.full_name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-start justify-between">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                      p.threat_level === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-300' :
                      p.threat_level === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-cyan-100 text-cyan-800 border-cyan-300'
                    }`}>
                      {p.threat_level || 'HIGH'}
                    </span>
                    <button onClick={() => onDeletePerson(p.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm uppercase">{p.full_name}</h3>
                  <p className="text-[11px] text-cyan-700 font-bold">POI ID: {p.suspect_id}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{p.notes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVehicles.map((v) => (
              <div key={v.id} className="tactical-card p-3 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                    {v.plate_number}
                  </span>
                  <button onClick={() => onDeleteVehicle(v.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs font-bold text-slate-700">
                  <p>{v.vehicle_type || 'VEHICLE'} • {v.color || 'DARK'}</p>
                  <p className="text-slate-500 font-normal text-[10px]">{v.notes || 'Flagged for surveillance'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="tactical-card max-w-md w-full rounded-md p-5 space-y-4 border-2 border-cyan-600 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                <h3 className="text-xs font-bold text-slate-900 uppercase">
                  ADD {activeTab === 'persons' ? 'BIOMETRIC SUSPECT PROFILE' : 'FLAGGED VEHICLE PLATE'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900 cursor-pointer">✕</button>
              </div>

              {activeTab === 'persons' ? (
                <form onSubmit={handleSavePerson} className="space-y-3 text-xs font-bold">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={personForm.full_name}
                      onChange={(e) => setPersonForm({...personForm, full_name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900"
                      placeholder="e.g. Vikram Singh"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">SUSPECT ID TOKEN</label>
                    <input
                      type="text"
                      required
                      value={personForm.suspect_id}
                      onChange={(e) => setPersonForm({...personForm, suspect_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900"
                      placeholder="e.g. POI-2026-9041"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">THREAT LEVEL</label>
                    <select
                      value={personForm.threat_level}
                      onChange={(e) => setPersonForm({...personForm, threat_level: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-rose-700 font-bold cursor-pointer"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase rounded cursor-pointer">
                    SAVE TO BIOMETRIC WATCHLIST
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs font-bold">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">LICENSE PLATE NUMBER</label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.plate_number}
                      onChange={(e) => setVehicleForm({...vehicleForm, plate_number: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-amber-800 font-bold"
                      placeholder="e.g. MH-12-PQ-9001"
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase rounded cursor-pointer">
                    FLAG PLATE IN ANPR
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
