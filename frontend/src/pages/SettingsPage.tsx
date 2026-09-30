import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Check, 
  RotateCcw, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Info 
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { DEFAULT_SETTINGS } from '../services/quantumEngine';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useVerification();

  const [threshold, setThreshold] = useState(settings.statisticalThreshold);
  const [confidence, setConfidence] = useState(settings.confidenceThreshold);
  const [maxFailed, setMaxFailed] = useState(settings.maxFailedAttempts);
  const [replayWindow, setReplayWindow] = useState(settings.replayWindowSeconds);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      statisticalThreshold: Number(threshold),
      confidenceThreshold: Number(confidence),
      maxFailedAttempts: Number(maxFailed),
      replayWindowSeconds: Number(replayWindow),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setThreshold(DEFAULT_SETTINGS.statisticalThreshold);
    setConfidence(DEFAULT_SETTINGS.confidenceThreshold);
    setMaxFailed(DEFAULT_SETTINGS.maxFailedAttempts);
    setReplayWindow(DEFAULT_SETTINGS.replayWindowSeconds);
    updateSettings(DEFAULT_SETTINGS);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Engine Settings & Quantum Calibration
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tune statistical decision boundaries, confidence cutoffs, and temporal replay windows
            </p>
          </div>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-3.5 py-2 rounded-xl bg-[#0A0E17] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            Settings saved successfully! The verification engine has adopted the updated decision boundaries.
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
            ACTIVE IN RUNTIME
          </span>
        </div>
      )}

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-6">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            STATISTICAL THRESHOLDS & BOUNDARIES
          </span>

          {/* 1. Statistical Threshold */}
          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-white block">
                  Statistical Mismatch Threshold (%)
                </label>
                <p className="text-[11px] text-slate-400">
                  Decision boundary for flagging digital signature forgeries. Teleportation noise above this cutoff triggers wave-function collapse alert.
                </p>
              </div>
              <span className="text-base font-bold font-mono text-amber-400 px-3 py-1 rounded bg-[#0F172A] border border-[#1E293B]">
                {threshold}%
              </span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5% (Strict Defense)</span>
              <span>20% (Calibrated 5σ Default)</span>
              <span>50% (Permissive)</span>
            </div>
          </div>

          {/* 2. Confidence Threshold */}
          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-white block">
                  Security Confidence Threshold (%)
                </label>
                <p className="text-[11px] text-slate-400">
                  Target statistical confidence required before issuing a conclusive verification verdict.
                </p>
              </div>
              <span className="text-base font-bold font-mono text-cyan-400 px-3 py-1 rounded bg-[#0F172A] border border-[#1E293B]">
                {confidence}%
              </span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <input
                type="range"
                min="50"
                max="99"
                step="1"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50% Minimum</span>
              <span>85% Default</span>
              <span>99% Maximum Strictness</span>
            </div>
          </div>

          {/* 3. Maximum Failed Attempts */}
          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-white block">
                  Maximum Failed Verification Attempts
                </label>
                <p className="text-[11px] text-slate-400">
                  Threshold of consecutive mismatches before a terminal is quarantined in the unauthorized verifier registry.
                </p>
              </div>
              <input
                type="number"
                min="1"
                max="10"
                value={maxFailed}
                onChange={(e) => setMaxFailed(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-white text-center focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* 4. Replay Detection Window */}
          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-white block">
                  Temporal Replay Detection Window (Seconds)
                </label>
                <p className="text-[11px] text-slate-400">
                  Time-to-live (TTL) window during which duplicate nonces are flagged as replay attacks.
                </p>
              </div>
              <input
                type="number"
                min="30"
                max="3600"
                step="30"
                value={replayWindow}
                onChange={(e) => setReplayWindow(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-white text-center focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 border-t border-[#1E293B] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE ENGINE SETTINGS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
