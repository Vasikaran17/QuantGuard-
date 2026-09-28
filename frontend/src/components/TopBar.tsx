import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { Shield, Radio, UploadCloud, PlayCircle, LogOut, UserCheck } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDemoMode, toggleDemoMode } = useMode();

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-white">QUANTGUARD</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                QDS-TELEPORT
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">
              PAULI EIGENSTATE TOMOGRAPHY // SIH 2026
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-[11px] font-mono text-slate-400">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>RELAY STATUS: <span className="text-emerald-400 font-semibold">ACTIVE</span></span>
        </div>
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-4">
        {/* Global Demo Mode Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-lg">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase leading-none">
              EXECUTION MODE
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isDemoMode ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-cyan-400">
                  <PlayCircle className="w-3 h-3 text-cyan-400" /> Demo Data
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400">
                  <UploadCloud className="w-3 h-3 text-emerald-400" /> Live Upload
                </span>
              )}
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={toggleDemoMode}
            title={isDemoMode ? "Switch to Live File Upload" : "Switch to Preloaded Demo Mode"}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDemoMode ? 'bg-cyan-600' : 'bg-emerald-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isDemoMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* User Identity Chip */}
        {user && (
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-left font-mono">
              <div className="text-slate-200 text-xs font-semibold leading-tight">{user.username}</div>
              <div className="text-[10px] text-slate-400">{user.role}</div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign out of console"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
