import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VerificationSettings,
  DetailedVerificationResult,
  VerificationHistoryItem,
  VerificationInput,
  DashboardStats
} from '../types';
import {
  DEFAULT_SETTINGS,
  calculateVerification,
  getInitialHistorySeed
} from '../services/quantumEngine';

interface VerificationContextType {
  history: VerificationHistoryItem[];
  settings: VerificationSettings;
  latestResult: DetailedVerificationResult | null;
  setLatestResult: (res: DetailedVerificationResult | null) => void;
  updateSettings: (newSettings: Partial<VerificationSettings>) => void;
  runVerificationAction: (input: VerificationInput) => DetailedVerificationResult;
  clearHistory: () => void;
  resetHistorySeed: () => void;
  dashboardStats: {
    totalRequests: number;
    verifiedCount: number;
    threatsCount: number;
    avgConfidence: number;
    avgMismatchRate: number;
    quantumThreatScore: number;
    threatRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    attackBreakdown: {
      SIGNATURE_FORGERY: number;
      IMPERSONATION: number;
      REPLAY_ATTACK: number;
      UNAUTHORIZED_VERIFIER: number;
      MULTI_VECTOR: number;
    };
  };
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings state
  const [settings, setSettings] = useState<VerificationSettings>(() => {
    try {
      const saved = localStorage.getItem('quantguard_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // 2. History state
  const [history, setHistory] = useState<VerificationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('quantguard_verification_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading history from localStorage', e);
    }
    const initial = getInitialHistorySeed();
    localStorage.setItem('quantguard_verification_history', JSON.stringify(initial));
    return initial;
  });

  // 3. Latest Result state (for instant display in preview/evidence panels)
  const [latestResult, setLatestResult] = useState<DetailedVerificationResult | null>(() => {
    return history.length > 0 ? history[0].result : null;
  });

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('quantguard_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('quantguard_verification_history', JSON.stringify(history));
  }, [history]);

  const updateSettings = (newSettings: Partial<VerificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const runVerificationAction = (input: VerificationInput): DetailedVerificationResult => {
    // Inject current global threshold from settings if not manually specified
    const mergedInput: VerificationInput = {
      ...input,
      statisticalThreshold: input.statisticalThreshold ?? settings.statisticalThreshold,
      confidenceThreshold: input.confidenceThreshold ?? settings.confidenceThreshold,
    };

    const result = calculateVerification(mergedInput, history);
    setLatestResult(result);

    const historyItem: VerificationHistoryItem = {
      id: result.id,
      requestId: result.requestId,
      timestamp: result.timestamp,
      sender: result.senderIdentity,
      claimedIdentity: result.claimedIdentity,
      verificationType: input.fileName?.includes('demo') ? 'Demo Simulation' : (input.fileName ? 'Live Upload' : 'Manual Input'),
      threatType: result.threatType,
      mismatchRate: result.mismatchRate,
      attackProbability: result.attackProbability,
      confidence: result.attackConfidence,
      quantumThreatScore: result.quantumThreatScore,
      status: result.status,
      fileName: result.fileName || 'quantum_signature.sig',
      nonce: result.nonce,
      result
    };

    setHistory((prev) => [historyItem, ...prev]);
    return result;
  };

  const clearHistory = () => {
    setHistory([]);
    setLatestResult(null);
    localStorage.removeItem('quantguard_verification_history');
  };

  const resetHistorySeed = () => {
    const seed = getInitialHistorySeed();
    setHistory(seed);
    setLatestResult(seed[0].result);
    localStorage.setItem('quantguard_verification_history', JSON.stringify(seed));
  };

  // Compute live dashboard metrics from history
  const totalRequests = history.length;
  const verifiedCount = history.filter((h) => h.status === 'VERIFIED').length;
  const threatsCount = history.filter((h) => h.status === 'THREAT DETECTED').length;

  const avgConfidence = totalRequests > 0
    ? Number((history.reduce((acc, h) => acc + h.confidence, 0) / totalRequests).toFixed(1))
    : 92.4;

  const avgMismatchRate = totalRequests > 0
    ? Number((history.reduce((acc, h) => acc + h.mismatchRate, 0) / totalRequests).toFixed(1))
    : 14.2;

  // Quantum Threat score calculation
  const latestThreatScore = latestResult ? latestResult.quantumThreatScore : 18;
  let threatRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (latestThreatScore > 80) threatRiskLevel = 'CRITICAL';
  else if (latestThreatScore > 60) threatRiskLevel = 'HIGH';
  else if (latestThreatScore > 30) threatRiskLevel = 'MEDIUM';

  const attackBreakdown = {
    SIGNATURE_FORGERY: history.filter((h) => h.threatType === 'Signature Forgery').length,
    IMPERSONATION: history.filter((h) => h.threatType === 'Impersonation').length,
    REPLAY_ATTACK: history.filter((h) => h.threatType === 'Replay Attack').length,
    UNAUTHORIZED_VERIFIER: history.filter((h) => h.threatType === 'Unauthorized Verification').length,
    MULTI_VECTOR: history.filter((h) => h.threatType === 'Multi-Vector Attack').length,
  };

  return (
    <VerificationContext.Provider
      value={{
        history,
        settings,
        latestResult,
        setLatestResult,
        updateSettings,
        runVerificationAction,
        clearHistory,
        resetHistorySeed,
        dashboardStats: {
          totalRequests,
          verifiedCount,
          threatsCount,
          avgConfidence,
          avgMismatchRate,
          quantumThreatScore: latestThreatScore,
          threatRiskLevel,
          attackBreakdown,
        },
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export function useVerification() {
  const ctx = useContext(VerificationContext);
  if (!ctx) throw new Error('useVerification must be used within a VerificationProvider');
  return ctx;
}
