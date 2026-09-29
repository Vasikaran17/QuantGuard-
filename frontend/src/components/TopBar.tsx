import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { 
  ShieldCheck, 
  UploadCloud, 
  PlayCircle, 
  LogOut, 
  UserCheck, 
  Radio,
  SlidersHorizontal,
  CircleDot
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDemoMode, toggleDemoMode } = useMode();

  return (
    <header className="h-15 border-b border-slate-800 bg-[#0C121E]/95 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-wide text-white">QuantGuard</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                QDS Platform
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              Quantum Teleportation & Pauli Basis Tomography Defense
            </span>
          </div>
        </div>

        {/* Live Network Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Relay Online</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-[11px] text-slate-400">5σ Gate: 0.1120</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Environment Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#0F172A] border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            Mode:
          </span>
          
          <button
            type="button"
            onClick={toggleDemoMode}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded transition-all cursor-pointer ${
              isDemoMode 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-3 h-3" />
            <span>Interactive Demo</span>
          </button>

          <button
            type="button"
            onClick={toggleDemoMode}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded transition-all cursor-pointer ${
              !isDemoMode 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Live File Upload</span>
          </button>
        </div>

        {/* User Identity Chip */}
        {user && (
          <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-slate-200 text-xs font-medium leading-tight">{user.name || user.username}</div>
              <div className="text-[10px] text-slate-400 font-mono">{user.clearance}</div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign out of console"
          className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-800/40 hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
