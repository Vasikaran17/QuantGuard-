import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { 
  ShieldCheck, 
  LogOut, 
  UserCheck, 
  Menu,
  Activity,
  Zap,
  Sparkles
} from 'lucide-react';

interface TopBarProps {
  currentTab?: string;
  onToggleMobileNav?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab = 'dashboard', onToggleMobileNav }) => {
  const { user, logout } = useAuth();
  const { isDemoMode, toggleDemoMode } = useMode();

  return (
    <header className="h-16 border-b border-[#1E293B] bg-[#0A0E17]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left branding & System Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10 shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wider text-white font-mono uppercase">
                QUANTGUARD
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                v2.6-QDS
              </span>
            </div>
            <div className="hidden md:block text-[11px] text-slate-400 tracking-tight">
              Quantum-Inspired Cyber Threat Detection
            </div>
          </div>
        </div>

        {/* System Status: ACTIVE */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#1E293B]">
          <span className="text-[11px] text-slate-400 uppercase font-medium">System Status:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ACTIVE
          </span>
        </div>
      </div>

      {/* Right Controls: Global Demo Mode Toggle + User Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* GLOBAL DEMO MODE TOGGLE SWITCH */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-inner">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
              DEMO MODE
            </span>
            <span className={`text-[10px] font-mono font-bold ${isDemoMode ? 'text-cyan-400' : 'text-slate-400'}`}>
              {isDemoMode ? '[ ON ]' : '[ OFF ]'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleDemoMode}
            role="switch"
            aria-checked={isDemoMode}
            className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              isDemoMode ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span className="sr-only">Toggle Demo Mode</span>
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
                isDemoMode ? 'translate-x-6 text-cyan-600' : 'translate-x-0 text-slate-600'
              }`}
            >
              {isDemoMode ? 'I' : 'O'}
            </span>
          </button>
        </div>

        {/* User Identity Chip */}
        {user && (
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#1E293B]">
            <div className="w-8 h-8 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center text-slate-300">
              <UserCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-left">
              <div className="text-slate-200 text-xs font-semibold leading-tight">{user.name || user.username}</div>
              <div className="text-[10px] text-cyan-400/80 font-mono">{user.clearance}</div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign out of console"
          className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-rose-400 hover:border-rose-800/40 hover:bg-rose-950/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
