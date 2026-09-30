import React, { createContext, useContext, useState, useEffect } from 'react';

interface ModeContextType {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('quantguard_demo_mode');
    return saved !== null ? saved === 'true' : true; // Default ON so app works immediately
  });

  useEffect(() => {
    localStorage.setItem('quantguard_demo_mode', String(isDemoMode));
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  return (
    <ModeContext.Provider value={{ isDemoMode, setDemoMode: setIsDemoMode, toggleDemoMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within a ModeProvider');
  return ctx;
}
