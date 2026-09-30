import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  ShieldAlert, 
  Flame, 
  Atom, 
  History, 
  FileText, 
  Settings,
  X,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  isMobileOpen = false, 
  onCloseMobile 
}) => {
  const { dashboardStats, settings } = useVerification();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'verify', label: 'Signature Verification', icon: FileCheck2, badge: 'Core' },
    { id: 'threats', label: 'Threat Detection', icon: ShieldAlert, badge: dashboardStats.threatsCount > 0 ? `${dashboardStats.threatsCount}` : null, badgeColor: 'bg-rose-950 text-rose-300 border-rose-800/40' },
    { id: 'attacks', label: 'Attack Analysis', icon: Flame, badge: null },
    { id: 'quantum', label: 'Quantum Analysis', icon: Atom, badge: null },
    { id: 'history', label: 'Verification History', icon: History, badge: `${dashboardStats.totalRequests}` },
    { id: 'reports', label: 'Security Reports', icon: FileText, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6 overflow-y-auto">
      <div className="space-y-4">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3 mb-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          NAVIGATION MENU
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left font-medium ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-[#1E293B] text-slate-300 border-[#334155]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quantum Engine Parameters Card */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Statistical Decision Gate</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Quantum Teleportation QDS protocol evaluating Pauli Complementarity (<span className="text-cyan-300 font-mono">X, Z</span> bases) against calibrated statistical noise.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-[#1E293B]">
            <span>Decision Boundary:</span>
            <span className="font-mono text-amber-400 font-bold">{settings.statisticalThreshold}% Threshold</span>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3.5 rounded-xl border border-[#1E293B] bg-[#0F172A] space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Security Score
          </span>
          <span className="text-emerald-400 font-bold font-mono">
            {dashboardStats.totalRequests > 0
              ? `${Math.round(100 - (dashboardStats.threatsCount / dashboardStats.totalRequests) * 50)}%`
              : '98.5%'}
          </span>
        </div>
        <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${dashboardStats.totalRequests > 0 ? Math.round(100 - (dashboardStats.threatsCount / dashboardStats.totalRequests) * 50) : 98}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-[#1E293B] bg-[#0A0E17] flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#0A0E17] border-r border-[#1E293B] h-full z-10 shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
