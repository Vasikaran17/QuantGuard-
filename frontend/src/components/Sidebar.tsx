import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  ShieldAlert, 
  Activity, 
  ScrollText, 
  Sliders,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navSections = [
    {
      title: 'OPERATIONAL VERIFICATION',
      items: [
        { id: 'dashboard', label: 'Security Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'verify', label: 'Signature Verification', icon: FileCheck2, badge: 'Active' },
        { id: 'logs', label: 'Verification Audit Logs', icon: ScrollText, badge: null },
      ]
    },
    {
      title: 'THREAT INTELLIGENCE',
      items: [
        { id: 'attacks', label: 'Attack Vector Analysis', icon: ShieldAlert, badge: null },
        { id: 'metrics', label: 'Tomography Metrics', icon: Activity, badge: null },
      ]
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { id: 'settings', label: 'Registry & Calibration', icon: Sliders, badge: null },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0C121E] flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.75rem)]">
      <div className="p-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-2.5 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              {section.title}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-300 font-semibold border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Quantum Engine Parameters Card */}
        <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>QDS Engine State</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Teleportation entanglement link with Pauli basis tomography (<span className="text-slate-300 font-mono">X, Y, Z</span>) and 5σ statistical thresholding.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span>Decision Boundary:</span>
            <span className="font-mono text-amber-400 font-medium">0.1120 QBER</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#0A0F1A]">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Relay Channel</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Operational
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
          Quantum No-Cloning compliance monitored continuously.
        </p>
      </div>
    </aside>
  );
};
