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
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Watchlist Database
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage face recognition profiles and ANPR license plate watchlist entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search suspect or plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none w-60 font-medium"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === 'persons' ? 'Suspect' : 'Vehicle'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('persons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'persons'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Face Watchlist ({persons.length})
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'vehicles'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Car className="w-4 h-4" />
          Vehicle Watchlist ({vehicles.length})
        </button>
      </div>

      {/* Grid Content */}
      {activeTab === 'persons' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersons.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex gap-4 relative group shadow-xs">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 border border-slate-200 dark:border-slate-600">
                <img src={p.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'} alt={p.full_name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    p.threat_level === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    p.threat_level === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {p.threat_level || 'HIGH'}
                  </span>
                  <button
                    onClick={() => onDeletePerson(p.id)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.full_name}</h3>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">ID: {p.suspect_id}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{p.notes}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-700 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                  {v.plate_number}
                </span>
                <button
                  onClick={() => onDeleteVehicle(v.id)}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{v.vehicle_type || 'Vehicle'} • {v.color || 'Dark'}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">{v.notes || 'Surveillance watchlist flag'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add {activeTab === 'persons' ? 'Suspect Profile' : 'Flagged Vehicle'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            {activeTab === 'persons' ? (
              <form onSubmit={handleSavePerson} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={personForm.full_name}
                    onChange={(e) => setPersonForm({...personForm, full_name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="e.g. Vikram Singh"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Suspect ID</label>
                  <input
                    type="text"
                    required
                    value={personForm.suspect_id}
                    onChange={(e) => setPersonForm({...personForm, suspect_id: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="e.g. POI-9041"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Threat Level</label>
                  <select
                    value={personForm.threat_level}
                    onChange={(e) => setPersonForm({...personForm, threat_level: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={personForm.notes}
                    onChange={(e) => setPersonForm({...personForm, notes: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="Notes..."
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg cursor-pointer">
                  Save Suspect
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">License Plate Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.plate_number}
                    onChange={(e) => setVehicleForm({...vehicleForm, plate_number: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-bold"
                    placeholder="e.g. JK-02-AB-9981"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={vehicleForm.vehicle_type}
                    onChange={(e) => setVehicleForm({...vehicleForm, vehicle_type: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="e.g. SUV"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={vehicleForm.notes}
                    onChange={(e) => setVehicleForm({...vehicleForm, notes: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="Notes..."
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg cursor-pointer">
                  Save Vehicle
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
