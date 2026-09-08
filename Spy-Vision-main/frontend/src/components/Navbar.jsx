import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Video, 
  Layers, 
  Users, 
  FileText, 
  Settings, 
  Activity, 
  Volume2, 
  VolumeX, 
  Radio,
  Sparkles,
  Server,
  Camera,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ activeView, setActiveView, wsStatus, activeAlertCount, audioEnabled, setAudioEnabled, theme, setTheme }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST | ' + now.toISOString().split('T')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Command Matrix', icon: Video },
    { id: 'zones', label: 'Virtual Fences', icon: Layers },
    { id: 'watchlist', label: 'Watchlist DB', icon: Users },
    { id: 'events', label: 'Event Logs', icon: FileText },
    { id: 'cameras', label: 'Camera Registry', icon: Server },
    { id: 'simulation', label: 'AI Event Engine', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-2xl transition-colors duration-300">
      {/* Top Banner */}
      <div className="max-w-[1920px] mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <ShieldAlert className="w-6 h-6 text-white dark:text-slate-950 stroke-[2.5]" />
            </div>
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tactical text-xl font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100 flex items-center gap-2">
                IBVAP <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-400 font-mono tracking-normal font-semibold">MHA BORDER COMMAND v1.0</span>
              </h1>
            </div>
            <p className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono">
              Intelligent Border Video Analytics Platform | Real-Time Surveillance
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white dark:text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : item.highlight
                    ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-slate-950' : item.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* WebSocket Status */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
            <Radio className={`w-3.5 h-3.5 ${
              wsStatus === 'CONNECTED' ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-amber-600 dark:text-amber-400'
            }`} />
            <span className={wsStatus === 'CONNECTED' ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-amber-700 dark:text-amber-400'}>
              {wsStatus === 'CONNECTED' ? 'LIVE BACKEND WS CONNECTED' : 'WS CONNECTING...'}
            </span>
          </div>

          {/* Theme Light / Dark Switcher */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Alert Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              audioEnabled
                ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/60'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={audioEnabled ? "Alert Chime Enabled" : "Alert Chime Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clock Ticker */}
          <div className="hidden sm:block text-right font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {timeStr}
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-between px-2 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                isActive ? 'bg-cyan-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

