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
    <div className="p-4 md:p-6 font-sans bg-[#f8fafc] text-slate-900 min-h-screen">
      <div className="max-w-[1920px] mx-auto space-y-4">
        {/* Header */}
        <div className="light-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Watchlist & Biometric Database
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage flagged vehicle license plates and suspect facial recognition watchlists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search POI ID or Plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 w-60"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'persons' ? 'POI Profile' : 'Flagged Plate'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('persons')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'persons'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Biometric Face Watchlist ({persons.length})
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ANPR Vehicle Watchlist ({vehicles.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'persons' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map((p) => (
              <div key={p.id} className="light-card p-4 flex gap-4 relative">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0">
                  <img src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'} alt={p.full_name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1.5 text-xs font-medium">
                  <div className="flex items-start justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.threat_level === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                      p.threat_level === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.threat_level || 'HIGH'}
                    </span>
                    <button onClick={() => onDeletePerson(p.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{p.full_name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">POI ID: {p.suspect_id}</p>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">{p.notes || 'Flagged for surveillance'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((v) => (
              <div key={v.id} className="light-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 font-mono">
                    {v.plate_number}
                  </span>
                  <button onClick={() => onDeleteVehicle(v.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs font-medium text-slate-700">
                  <p className="font-semibold">{v.vehicle_type || 'Vehicle'} • {v.color || 'Dark'}</p>
                  <p className="text-slate-500 text-[11px]">{v.notes || 'Flagged for ANPR surveillance'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Add {activeTab === 'persons' ? 'Biometric Suspect Profile' : 'Flagged Vehicle Plate'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 font-bold cursor-pointer">✕</button>
              </div>

              {activeTab === 'persons' ? (
                <form onSubmit={handleSavePerson} className="space-y-3.5 text-xs font-medium">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={personForm.full_name}
                      onChange={(e) => setPersonForm({...personForm, full_name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                      placeholder="e.g. Vikram Singh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Suspect POI Token</label>
                    <input
                      type="text"
                      required
                      value={personForm.suspect_id}
                      onChange={(e) => setPersonForm({...personForm, suspect_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                      placeholder="e.g. POI-2026-9041"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Threat Level</label>
                    <select
                      value={personForm.threat_level}
                      onChange={(e) => setPersonForm({...personForm, threat_level: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold cursor-pointer"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer shadow-xs mt-2">
                    Save to Biometric Watchlist
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSaveVehicle} className="space-y-3.5 text-xs font-medium">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">License Plate Number</label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.plate_number}
                      onChange={(e) => setVehicleForm({...vehicleForm, plate_number: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold uppercase"
                      placeholder="e.g. MH-12-PQ-9001"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer shadow-xs mt-2">
                    Flag Plate in ANPR Database
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
