import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  ShieldAlert, 
  Activity, 
  ScrollText, 
  Sliders,
  Cpu,
  Binary
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'verify', label: 'Verify Signature', icon: FileCheck2, badge: 'REALTIME' },
    { id: 'attacks', label: 'Attack Analysis', icon: ShieldAlert, badge: null },
    { id: 'metrics', label: 'Performance Metrics', icon: Activity, badge: null },
    { id: 'logs', label: 'Audit Logs', icon: ScrollText, badge: null },
    { id: 'settings', label: 'Registry & Config', icon: Sliders, badge: null },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            DEFENSE OPERATIONS
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quantum Protocol Telemetry Card */}
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>QDS PROTOCOL ENGINE</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Teleportation entanglement link with Pauli basis tomography (<span className="text-cyan-400 font-mono">X, Y, Z</span>) and 5σ statistical thresholding.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
            <span>CUTOFF THRESHOLD:</span>
            <span className="text-amber-400">0.1120 QBER</span>
          </div>
        </div>
      </div>

      {/* Footer System Status Note */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Binary className="w-3.5 h-3.5 text-cyan-400" />
          <span>QUANTUM SIMULATION</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-normal">
          Physics model simulates quantum no-cloning disturbance under eavesdropping.
        </p>
      </div>
    </aside>
  );
};
