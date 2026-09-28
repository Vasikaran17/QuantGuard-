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
    <div className="relative min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 3D Cyber Background (rotating wireframe globe + particle grid) */}
      <CyberBackground />

      {/* Top Bar with Global Demo Mode Switch */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
          <div>
            {children}
          </div>

          {/* Mandatory Quantum Simulation Technical Disclaimer Footer */}
          <footer className="mt-12 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] font-mono text-slate-400 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-cyan-400">Notice: </strong>
              Quantum-inspired simulation modeling teleportation-based Quantum Digital Signature (QDS) protocol using 
              Pauli basis state tomography (X, Y, Z eigenstates) and 5σ statistical thresholding under the Quantum No-Cloning Theorem. 
              Built for Smart India Hackathon.
            </p>
          </footer>
        </main>
      </div>

      {/* Right-Side Slide-in Verification Telemetry Drawer */}
      <VerificationDrawer
        isOpen={Boolean(activeDrawerResult)}
        onClose={onCloseDrawer}
        result={activeDrawerResult}
      />
    </div>
  );
};
