import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Video, 
  Layers, 
  Users, 
  FileText, 
  Volume2, 
  VolumeX, 
  Radio,
  Sparkles,
  Server,
  Sun,
  Moon,
  UserCheck
} from 'lucide-react';

export default function Navbar({ activeView, setActiveView, wsStatus, activeAlertCount, audioEnabled, setAudioEnabled, theme, setTheme }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeMs = String(now.getMilliseconds()).padStart(3, '0');
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + timeMs + ' UTC+05:30 IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Video },
    { id: 'zones', label: 'Detection Zones', icon: Layers },
    { id: 'watchlist', label: 'Watchlist Manager', icon: Users },
    { id: 'events', label: 'Surveillance Logs', icon: FileText },
    { id: 'cameras', label: 'Camera Registry', icon: Server },
    { id: 'simulation', label: 'AI Simulator', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs font-sans">
      {/* Top Bar */}
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                SPY-VISION <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">Node 04-Alpha</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Border Surveillance & Video Analytics Control Center
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3 font-sans">
          {/* Critical Alerts Banner */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>3 Active Alerts</span>
          </div>

          {/* Alert Audio Chime Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              audioEnabled
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-xs">{audioEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Clock */}
          <div className="hidden xl:block text-right text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
            {timeStr}
          </div>
        </div>
      </div>
    </header>
  );
}



