import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { CyberBackground } from './CyberBackground';
import { VerificationDrawer } from './VerificationDrawer';
import { VerificationResult } from '../types';

interface LayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeDrawerResult: VerificationResult | null;
  onCloseDrawer: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onSelectTab,
  activeDrawerResult,
  onCloseDrawer,
  children,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSelectTab = (tab: string) => {
    onSelectTab(tab);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0C1017] text-slate-100 flex flex-col font-sans selection:bg-sky-500/25 selection:text-sky-200">
      {/* Precision grid background */}
      <CyberBackground />

      {/* Top Header */}
      <TopBar 
        currentTab={currentTab} 
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} 
      />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={handleSelectTab}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>

          {/* Technical Protocol Footer */}
          <footer className="mt-14 pt-5 border-t border-[#1F2B3D] text-center max-w-7xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                <strong className="text-slate-400 font-medium">QuantGuard Defense Platform:</strong> Teleportation-based QDS modeling Pauli eigenstate tomography (X, Y, Z) and 5σ statistical thresholding under the Quantum No-Cloning Theorem.
              </p>
              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-slate-500">
                <span>FIPS 140-3 Compliant</span>
                <span>·</span>
                <span>SIH 2026</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Right-Side Forensic Telemetry Drawer */}
      <VerificationDrawer
        isOpen={Boolean(activeDrawerResult)}
        onClose={onCloseDrawer}
        result={activeDrawerResult}
      />
    </div>
  );
};
