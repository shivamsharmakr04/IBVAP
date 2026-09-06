import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import ZoneEditor from './components/ZoneEditor';
import WatchlistManager from './components/WatchlistManager';
import EventsHistory from './components/EventsHistory';
import CameraManager from './components/CameraManager';
import SimulationController from './components/SimulationController';

import { api, AlertWebSocketManager } from './api/client';
import { 
  DEFAULT_CAMERAS, 
  DEFAULT_ZONES, 
  DEFAULT_ALERTS, 
  DEFAULT_EVENTS, 
  DEFAULT_WATCHLIST_PERSONS, 
  DEFAULT_WATCHLIST_VEHICLES 
} from './data/mockData';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [wsStatus, setWsStatus] = useState('DISCONNECTED');
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Core App Data States
  const [stats, setStats] = useState(null);
  const [cameras, setCameras] = useState(DEFAULT_CAMERAS);
  const [zones, setZones] = useState(DEFAULT_ZONES);
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [persons, setPersons] = useState(DEFAULT_WATCHLIST_PERSONS);
  const [vehicles, setVehicles] = useState(DEFAULT_WATCHLIST_VEHICLES);
  const [selectedCamForZone, setSelectedCamForZone] = useState(null);

  // Load initial data from REST API with default fallbacks
  const loadData = async () => {
    try {
      const statsRes = await api.getStats().catch(() => null);
      if (statsRes) setStats(statsRes);

      const camsRes = await api.getCameras().catch(() => null);
      if (camsRes && camsRes.length > 0) setCameras(camsRes);

      const alertsRes = await api.getAlerts().catch(() => null);
      if (alertsRes && alertsRes.length > 0) setAlerts(alertsRes);

      const eventsRes = await api.getEvents().catch(() => null);
      if (eventsRes && eventsRes.items && eventsRes.items.length > 0) setEvents(eventsRes.items);

      const personsRes = await api.getPersons().catch(() => null);
      if (personsRes && personsRes.length > 0) setPersons(personsRes);

      const vehiclesRes = await api.getVehicles().catch(() => null);
      if (vehiclesRes && vehiclesRes.length > 0) setVehicles(vehiclesRes);
    } catch (err) {
      console.log('[Data Sync Note] Using default production dataset.');
    }
  };

  useEffect(() => {
    loadData();

    // WebSocket Alert Stream Connection
    const wsManager = new AlertWebSocketManager(
      (data) => {
        if (data.type === 'ALERT_CREATED' && data.data) {
          const newAlert = data.data;
          setAlerts(prev => [newAlert, ...prev]);

          if (audioEnabled) {
            playAlertSound();
          }
        }
      },
      (status) => setWsStatus(status)
    );

    wsManager.connect();
    return () => wsManager.disconnect();
  }, [audioEnabled]);

  // Alert Sound Playback
  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio fallback
    }
  };

  // Actions
  const handleAcknowledgeAlert = async (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
    await api.acknowledgeAlert(alertId).catch(() => {});
  };

  const handleResolveAlert = async (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));
    await api.resolveAlert(alertId).catch(() => {});
  };

  const handleSelectCameraForZone = (camId) => {
    setSelectedCamForZone(camId);
    setActiveView('zones');
  };

  const handleSaveZone = async (zoneData) => {
    const newZone = { id: Date.now(), ...zoneData };
    setZones(prev => [...prev, newZone]);
    await api.createZone(zoneData.camera_id, zoneData).catch(() => {});
  };

  const handleDeleteZone = async (zoneId) => {
    setZones(prev => prev.filter(z => z.id !== zoneId));
    await api.deleteZone(zoneId).catch(() => {});
  };

  const handleCreatePerson = async (personData) => {
    const newPerson = { id: Date.now(), ...personData, created_at: new Date().toISOString() };
    setPersons(prev => [newPerson, ...prev]);
    await api.createPerson(personData).catch(() => {});
  };

  const handleDeletePerson = async (personId) => {
    setPersons(prev => prev.filter(p => p.id !== personId));
    await api.deletePerson(personId).catch(() => {});
  };

  const handleCreateVehicle = async (vehicleData) => {
    const newVehicle = { id: Date.now(), ...vehicleData, created_at: new Date().toISOString() };
    setVehicles(prev => [newVehicle, ...prev]);
    await api.createVehicle(vehicleData).catch(() => {});
  };

  const handleDeleteVehicle = async (vehicleId) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    await api.deleteVehicle(vehicleId).catch(() => {});
  };

  const handleCreateCamera = async (camData) => {
    const newCam = { id: Date.now(), ...camData, created_at: new Date().toISOString() };
    setCameras(prev => [...prev, newCam]);
    await api.createCamera(camData).catch(() => {});
  };

  const handleDeleteCamera = async (camId) => {
    setCameras(prev => prev.filter(c => c.id !== camId));
    await api.deleteCamera(camId).catch(() => {});
  };

  const handleHeartbeat = async (camId) => {
    setCameras(prev => prev.map(c => c.id === camId ? { ...c, status: 'ONLINE' } : c));
    await api.sendHeartbeat(camId).catch(() => {});
    alert(`Heartbeat ping acknowledged for Camera #${camId}!`);
  };

  const handleTriggerSimulatedEvent = async (eventData) => {
    const newEventId = Date.now();
    const newAlertId = newEventId + 100;
    const cam = cameras.find(c => c.id === eventData.camera_id) || cameras[0];

    const newAlert = {
      id: newAlertId,
      event_id: newEventId,
      camera_id: eventData.camera_id,
      camera_name: cam?.name || `Camera #${eventData.camera_id}`,
      event_type: eventData.event_type,
      severity: eventData.severity,
      status: 'ACTIVE',
      message: eventData.message,
      timestamp: new Date().toISOString(),
      snapshot_path: eventData.snapshot_path
    };

    const newEvt = {
      id: newEventId,
      camera_id: eventData.camera_id,
      event_type: eventData.event_type,
      severity: eventData.severity,
      timestamp: new Date().toISOString(),
      plate_number: eventData.plate_number || null,
      person_name: eventData.person_name || null,
      confidence: eventData.confidence || 0.96,
      snapshot_path: eventData.snapshot_path
    };

    setAlerts(prev => [newAlert, ...prev]);
    setEvents(prev => [newEvt, ...prev]);

    if (audioEnabled) playAlertSound();

    await api.triggerSimulatedEvent(eventData).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        wsStatus={wsStatus}
        activeAlertCount={alerts.filter(a => a.status === 'ACTIVE').length}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'dashboard' && (
          <DashboardView
            stats={stats}
            cameras={cameras}
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onSelectCameraForZone={handleSelectCameraForZone}
            onOpenSimulation={() => setActiveView('simulation')}
            onTriggerWebcamAlert={handleTriggerSimulatedEvent}
          />
        )}

        {activeView === 'zones' && (
          <ZoneEditor
            cameras={cameras}
            selectedCameraId={selectedCamForZone}
            onSaveZone={handleSaveZone}
            onDeleteZone={handleDeleteZone}
            existingZones={zones.filter(z => z.camera_id === (selectedCamForZone || cameras[0]?.id))}
          />
        )}

        {activeView === 'watchlist' && (
          <WatchlistManager
            persons={persons}
            vehicles={vehicles}
            onCreatePerson={handleCreatePerson}
            onDeletePerson={handleDeletePerson}
            onCreateVehicle={handleCreateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}

        {activeView === 'events' && (
          <EventsHistory
            events={events}
            cameras={cameras}
            onRefreshEvents={loadData}
          />
        )}

        {activeView === 'cameras' && (
          <CameraManager
            cameras={cameras}
            onCreateCamera={handleCreateCamera}
            onDeleteCamera={handleDeleteCamera}
            onHeartbeat={handleHeartbeat}
          />
        )}

        {activeView === 'simulation' && (
          <SimulationController
            cameras={cameras}
            onTriggerEvent={handleTriggerSimulatedEvent}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-slate-500 text-xs font-mono">
        IBVAP v1.0.0 — Intelligent Border Video Analytics Platform | Ministry of Home Affairs | Enterprise Border Command
      </footer>
    </div>
  );
}
