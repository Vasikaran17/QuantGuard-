import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import { VerificationProvider } from './context/VerificationContext';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { VerifyPage } from './pages/VerifyPage';
import { ThreatDetectionPage } from './pages/ThreatDetectionPage';
import { AttackAnalysisPage } from './pages/AttackAnalysisPage';
import { QuantumAnalysisPage } from './pages/QuantumAnalysisPage';
import { HistoryPage } from './pages/HistoryPage';
import { SecurityReportsPage } from './pages/SecurityReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VerificationResult } from './types';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeDrawerResult, setActiveDrawerResult] = useState<VerificationResult | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center text-slate-300 text-xs font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-cyan-400">Initializing QuantGuard Prototype Console...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleOpenDrawer = (result: VerificationResult) => {
    setActiveDrawerResult(result);
  };

  const handleCloseDrawer = () => {
    setActiveDrawerResult(null);
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      activeDrawerResult={activeDrawerResult}
      onCloseDrawer={handleCloseDrawer}
    >
      {currentTab === 'dashboard' && (
        <DashboardPage onNavigateVerify={() => setCurrentTab('verify')} />
      )}
      {currentTab === 'verify' && <VerifyPage />}
      {currentTab === 'threats' && <ThreatDetectionPage />}
      {currentTab === 'attacks' && <AttackAnalysisPage />}
      {currentTab === 'quantum' && <QuantumAnalysisPage />}
      {(currentTab === 'history' || currentTab === 'logs') && <HistoryPage />}
      {currentTab === 'reports' && <SecurityReportsPage />}
      {currentTab === 'settings' && <SettingsPage />}
    </Layout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <VerificationProvider>
          <MainApp />
        </VerificationProvider>
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;
