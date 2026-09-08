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
    { id: 'dashboard', label: 'LIVE MATRIX', icon: Video },
    { id: 'zones', label: 'FACIAL & EMOTION AI', icon: Sparkles },
    { id: 'watchlist', label: 'VIRTUAL FENCE & PERIMETER', icon: Layers },
    { id: 'events', label: 'WATCHLIST & BIOMETRICS', icon: Users },
    { id: 'cameras', label: 'EVENT AUDIT LOG', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 shadow-xs font-mono">
      {/* Top Bar */}
      <div className="max-w-[1920px] mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-xs border border-cyan-400">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-wider text-slate-900 dark:text-white uppercase flex items-center gap-2">
                IBVAP <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-400 tracking-normal font-bold">SEC-NODE-04</span>
              </h1>
            </div>
            <p className="text-[9px] tracking-widest text-slate-500 dark:text-slate-400 uppercase font-bold">
              BORDER COMMAND & CONTROL // MHA SECTOR 4-ALPHA
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00a896] text-white shadow-sm border border-cyan-600'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3 font-mono">
          {/* Critical Alerts Banner */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#e11d48] text-white text-xs font-bold uppercase tracking-wider animate-pulse shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>3 CRITICAL ALERTS</span>
          </div>

          {/* Alert Audio Chime Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-1.5 rounded-md border text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
              audioEnabled
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[10px]">{audioEnabled ? 'CHIME ACTIVE' : 'CHIME MUTED'}</span>
          </button>

          {/* Theme Light / Dark Switcher */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* UTC Clock */}
          <div className="hidden sm:block text-right text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700">
            {timeStr}
          </div>
        </div>
      </div>
    </header>
  );
}



