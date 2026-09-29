import React from 'react';
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
  return (
    <div className="relative min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Precision grid background */}
      <CyberBackground />

      {/* Enterprise Top Bar */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
          <div>
            {children}
          </div>

          {/* Technical Protocol Footer */}
          <footer className="mt-12 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-slate-400 font-medium">Standard Protocol: </strong>
              Teleportation-based Quantum Digital Signature (QDS) modeling Pauli eigenstate tomography (X, Y, Z) and 5σ statistical thresholding under the Quantum No-Cloning Theorem. Built for Smart India Hackathon.
            </p>
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
