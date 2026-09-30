import React from 'react';
import { 
  Atom, 
  Cpu, 
  Layers, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  ReferenceLine 
} from 'recharts';
import { useVerification } from '../context/VerificationContext';

export const QuantumAnalysisPage: React.FC = () => {
  const { settings, latestResult } = useVerification();

  const basisTomographyData = [
    { basis: 'Z (Computational)', expectedNoise: 4.2, observedLegit: 4.4, observedAttack: 34.9, threshold: settings.statisticalThreshold },
    { basis: 'X (Hadamard)', expectedNoise: 4.2, observedLegit: 3.9, observedAttack: 35.8, threshold: settings.statisticalThreshold },
    { basis: 'Y (Circular)', expectedNoise: 4.2, observedLegit: 4.6, observedAttack: 36.2, threshold: settings.statisticalThreshold },
  ];

  const distributionCurve = [
    { qber: '0%', legit: 5, attack: 0 },
    { qber: '2%', legit: 40, attack: 0 },
    { qber: '4%', legit: 95, attack: 0 },
    { qber: '6%', legit: 48, attack: 1 },
    { qber: '8%', legit: 14, attack: 2 },
    { qber: '10%', legit: 3, attack: 5 },
    { qber: '15%', legit: 0, attack: 15 },
    { qber: '20%', legit: 0, attack: 40 },
    { qber: '25%', legit: 0, attack: 75 },
    { qber: '30%', legit: 0, attack: 98 },
    { qber: '35%', legit: 0, attack: 70 },
    { qber: '40%', legit: 0, attack: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Atom className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Pauli Eigenstate Tomography & Quantum Analysis
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantum complementarity representation, Pauli basis projections, and wave-function collapse telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Decision Cutoff:</span>
          <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-1 rounded bg-[#0A0E17] border border-[#1E293B]">
            {settings.statisticalThreshold}% Mismatch Threshold
          </span>
        </div>
      </div>

      {/* Conceptual Quantum Layer Alert */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3 text-xs text-cyan-200">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold">Quantum-Inspired Mathematical Model</strong>
          <p className="text-cyan-300/80 text-[11px] mt-0.5">
            This module represents quantum states using Pauli eigenbasis projections ($X, Y, Z$). Security is rooted in the Quantum No-Cloning Theorem: eavesdropping on unknown states irreversibly collapses wave-functions, inducing detectable mismatch errors. (Local prototype simulation; no real quantum hardware claimed).
          </p>
        </div>
      </div>

      {/* Pauli Eigenstate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400">|0⟩</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">Z-Basis</span>
          </div>
          <div className="text-xs font-bold text-white">Computational Ground State</div>
          <p className="text-[11px] text-slate-400">Eigenstate with eigenvalue +1 along the Z-axis: [1.0, 0.0]ᵀ</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400">|1⟩</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">Z-Basis</span>
          </div>
          <div className="text-xs font-bold text-white">Computational Excited State</div>
          <p className="text-[11px] text-slate-400">Eigenstate with eigenvalue -1 along the Z-axis: [0.0, 1.0]ᵀ</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400">|+⟩</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">X-Basis</span>
          </div>
          <div className="text-xs font-bold text-white">Hadamard Symmetric Superposition</div>
          <p className="text-[11px] text-slate-400">Superposition (|0⟩ + |1⟩)/√2; collapses upon Z-measurement</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400">|−⟩</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">X-Basis</span>
          </div>
          <div className="text-xs font-bold text-white">Hadamard Anti-Symmetric State</div>
          <p className="text-[11px] text-slate-400">Superposition (|0⟩ - |1⟩)/√2; collapses upon Z-measurement</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pauli Basis Mismatch Bar Chart */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Pauli Basis Mismatch Rate Comparison
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Cutoff: {settings.statisticalThreshold}%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={basisTomographyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="basis" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E17', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="expectedNoise" fill="#64748B" name="Channel Noise" />
                <Bar dataKey="observedLegit" fill="#10B981" name="Legitimate Signal" />
                <Bar dataKey="observedAttack" fill="#F43F5E" name="Adversary Eavesdropping" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistical Distribution Curve */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Probability Density & Decision Threshold
            </h2>
            <span className="text-[11px] font-mono text-amber-400">
              Separation &gt; 5σ
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="qber" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E17', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="legit" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Legitimate States" />
                <Area type="monotone" dataKey="attack" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.2} name="Adversarial Attack" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
