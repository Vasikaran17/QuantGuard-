import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { VerifyPage } from './pages/VerifyPage';
import { AttackAnalysisPage } from './pages/AttackAnalysisPage';
import { MetricsPage } from './pages/MetricsPage';
import { LogsPage } from './pages/LogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VerificationResult } from './types';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeDrawerResult, setActiveDrawerResult] = useState<VerificationResult | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center text-cyan-400 font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>INITIALIZING QUANTGUARD CONSOLE...</span>
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
        <DashboardPage
          onOpenDrawer={handleOpenDrawer}
          onNavigateVerify={() => setCurrentTab('verify')}
        />
      )}
      {currentTab === 'verify' && (
        <VerifyPage onOpenDrawer={handleOpenDrawer} />
      )}
      {currentTab === 'attacks' && <AttackAnalysisPage />}
      {currentTab === 'metrics' && <MetricsPage />}
      {currentTab === 'logs' && <LogsPage onOpenDrawer={handleOpenDrawer} />}
      {currentTab === 'settings' && <SettingsPage />}
    </Layout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ModeProvider>
        <MainApp />
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;
