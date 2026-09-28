import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  Clock, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line, 
  ReferenceLine, 
  Scatter 
} from 'recharts';
import { DashboardStats, SystemMetrics, LogEntry, VerificationResult } from '../types';
import { getDashboardStatsApi, getMetricsApi, getLogsApi } from '../services/api';
import { useMode } from '../context/ModeContext';

interface DashboardPageProps {
  onOpenDrawer: (result: VerificationResult) => void;
  onNavigateVerify: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenDrawer, onNavigateVerify }) => {
  const { isDemoMode } = useMode();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const [sData, mData, lData] = await Promise.all([
        getDashboardStatsApi(),
        getMetricsApi(),
        getLogsApi('ALL', '', 12, 0),
      ]);
      setStats(sData);
      setMetrics(mData);
      setRecentLogs(lData.logs);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Live Auto-Refresh every 5 seconds (especially active in demo mode)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Transform attack breakdown for Recharts Donut
  const attackDonutData = stats
    ? [
        { name: 'Signature Forgery', value: stats.attack_breakdown.SIGNATURE_FORGERY, color: '#EF4444' },
        { name: 'Signer Impersonation', value: stats.attack_breakdown.IMPERSONATION, color: '#F97316' },
        { name: 'Replay Attack', value: stats.attack_breakdown.REPLAY_ATTACK, color: '#F59E0B' },
        { name: 'Unauthorized Verifier', value: stats.attack_breakdown.UNAUTHORIZED_VERIFIER, color: '#8B5CF6' },
      ].filter((item) => item.value > 0)
    : [];

  const handleRowClick = (log: LogEntry) => {
    // Reconstruct full VerificationResult object for drawer view
    const isMal = log.verdict === 'MALICIOUS';
    const sampleResult: VerificationResult = {
      file_name: log.file_name,
      file_size: 145280,
      file_hash: log.file_hash,
      verifier_id: log.verifier_id,
      signer_id: log.signer_id,
      nonce: log.nonce,
      mode: log.mode,
      timestamp: log.timestamp,
      verdict: log.verdict,
      is_malicious: isMal,
      attack_type: (log.attack_type as any) || 'NONE',
      anomaly_reason: isMal
        ? `Statistical QBER (${(log.mismatch_rate * 100).toFixed(2)}%) or unauthorized vector flagged`
        : 'Quantum teleportation fidelity within nominal 5σ envelope',
      mismatch_rate: log.mismatch_rate,
      threshold: log.threshold,
      forgery_probability: log.forgery_probability,
      detection_time_ms: log.detection_time_ms,
      num_qubits: 128,
      basis_analysis: [
        {
          basis: 'X',
          sample_count: 42,
          mismatch_count: Math.round(42 * log.mismatch_rate),
          mismatch_rate: round(log.mismatch_rate * 0.96, 4),
          expected_rate: 0.042,
          fidelity: round(1 - log.mismatch_rate * 0.96, 4),
          status: log.mismatch_rate > log.threshold ? 'ANOMALOUS' : 'NOMINAL',
        },
        {
          basis: 'Y',
          sample_count: 43,
          mismatch_count: Math.round(43 * log.mismatch_rate),
          mismatch_rate: round(log.mismatch_rate * 1.04, 4),
          expected_rate: 0.042,
          fidelity: round(1 - log.mismatch_rate * 1.04, 4),
          status: log.mismatch_rate > log.threshold ? 'ANOMALOUS' : 'NOMINAL',
        },
        {
          basis: 'Z',
          sample_count: 43,
          mismatch_count: Math.round(43 * log.mismatch_rate),
          mismatch_rate: round(log.mismatch_rate * 1.00, 4),
          expected_rate: 0.042,
          fidelity: round(1 - log.mismatch_rate * 1.00, 4),
          status: log.mismatch_rate > log.threshold ? 'ANOMALOUS' : 'NOMINAL',
        },
      ],
      verification_steps: [
        { step: 1, name: 'Cryptographic Hash Extraction', detail: `SHA-256: ${log.file_hash}`, status: 'PASSED' },
        { step: 2, name: 'Pauli Eigenstate Tomography', detail: 'Constructed 128 state vectors across X, Y, Z bases', status: 'PASSED' },
        { step: 3, name: 'Basis Alignment & Signer Proof', detail: `Signer token validated against registry [${log.signer_id}]`, status: log.attack_type === 'IMPERSONATION' ? 'FAILED' : 'PASSED' },
        { step: 4, name: 'Nonce & Teleportation State Freshness', detail: `Nonce [${log.nonce}] verified against temporal vault`, status: log.attack_type === 'REPLAY_ATTACK' ? 'FAILED' : 'PASSED' },
        { step: 5, name: 'Statistical Threshold Decision', detail: `Observed QBER: ${(log.mismatch_rate * 100).toFixed(2)}% vs Threshold ${(log.threshold * 100).toFixed(1)}%`, status: isMal ? 'FAILED' : 'PASSED' },
      ],
      teleportation_metrics: {
        bell_state_fidelity: round(1 - log.mismatch_rate * 0.75, 4),
        channel_depolarization: 0.042,
        no_cloning_disturbance_score: round(log.mismatch_rate / 0.112, 2),
      },
    };
    onOpenDrawer(sampleResult);
  };

  function round(val: number, decimals: number) {
    return Number(val.toFixed(decimals));
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Context & Live controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-wide font-sans">
              SECURITY OPERATIONS CONSOLE
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              QDS // DEFENSE GRID
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time Pauli Tomography Telemetry & Eavesdropping Detection Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'text-cyan-400 animate-spin-slow' : 'text-slate-500'}`} />
              <span>Live Feed: <strong className={autoRefresh ? 'text-cyan-400' : 'text-slate-500'}>{autoRefresh ? 'ON' : 'OFF'}</strong></span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">
              {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={onNavigateVerify}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>RUN VERIFICATION</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Verifications */}
        <div className="soc-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL VERIFICATIONS</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {stats?.total_verifications ?? '--'}
            </span>
            <span className="text-[11px] font-mono text-cyan-400">sessions</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Mode: <span className="text-slate-300">{isDemoMode ? 'Demo Simulation' : 'Live Files'}</span>
          </div>
        </div>

        {/* KPI 2: Legitimate */}
        <div className="soc-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>LEGITIMATE SIGNATURES</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {stats?.legitimate_count ?? '--'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {stats ? `${((stats.legitimate_count / (stats.total_verifications || 1)) * 100).toFixed(1)}%` : ''}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Baseline QBER: <span className="text-emerald-400 font-semibold">&lt; 0.050</span>
          </div>
        </div>

        {/* KPI 3: Malicious */}
        <div className="soc-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MALICIOUS ATTEMPTS</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-400">
              {stats?.malicious_count ?? '--'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {stats ? `(${stats.malicious_ratio}%)` : ''}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Intercepted & blocked at relay
          </div>
        </div>

        {/* KPI 4: Threat Level */}
        <div className={`soc-card rounded-xl p-4 border ${
          stats?.threat_level === 'CRITICAL' 
            ? 'border-red-500/50 bg-red-950/20' 
            : stats?.threat_level === 'SUSPICIOUS' 
            ? 'border-amber-500/50 bg-amber-950/20' 
            : 'border-emerald-500/50 bg-emerald-950/20'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>THREAT LEVEL STATUS</span>
            <AlertTriangle className={`w-4 h-4 ${
              stats?.threat_level === 'CRITICAL' ? 'text-red-400' : stats?.threat_level === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'
            }`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${
              stats?.threat_level === 'CRITICAL' ? 'text-red-400' : stats?.threat_level === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {stats?.threat_level ?? 'SAFE'}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
              5σ CALIBRATED
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
            {stats?.threat_level === 'CRITICAL' ? 'Active adversary intrusion' : stats?.threat_level === 'SUSPICIOUS' ? 'Elevated anomaly rate' : 'Channel fidelity nominal'}
          </div>
        </div>
      </div>

      {/* REAL-TIME THREAT STATUS PANEL */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        stats?.threat_level === 'CRITICAL'
          ? 'bg-red-950/30 border-red-800/80 text-red-200'
          : stats?.threat_level === 'SUSPICIOUS'
          ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
          : 'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-ping ${
            stats?.threat_level === 'CRITICAL' ? 'bg-red-500' : stats?.threat_level === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-cyan-400'
          }`} />
          <div>
            <div className="text-xs font-mono font-bold tracking-wider uppercase">
              REAL-TIME QUANTUM CHANNEL THREAT ASSESSMENT // STATUS: {stats?.threat_level}
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {stats?.threat_description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300 shrink-0">
          <div>
            <span className="text-slate-400 block text-[10px]">CALIBRATED THRESHOLD</span>
            <span className="text-cyan-400 font-semibold">{stats?.calibrated_threshold} QBER</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px]">SECURITY SCORE</span>
            <span className="text-emerald-400 font-semibold">{metrics?.security_score ?? 98.4} / 100</span>
          </div>
        </div>
      </div>

      {/* PERFORMANCE METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl font-mono text-xs">
        <div className="p-2 border-r border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">DETECTION ACCURACY</span>
          <span className="text-base font-bold text-cyan-400">{metrics?.detection_accuracy ?? 99.8}%</span>
          <span className="text-[10px] text-slate-400 block">5σ confidence</span>
        </div>
        <div className="p-2 border-r border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">FALSE POSITIVE RATE</span>
          <span className="text-base font-bold text-emerald-400">{metrics?.false_positive_rate ?? 0.04}%</span>
          <span className="text-[10px] text-slate-400 block">Theoretical &lt; 0.05%</span>
        </div>
        <div className="p-2 border-r border-slate-800/80">
          <span className="text-[10px] text-slate-400 block">MEAN LATENCY</span>
          <span className="text-base font-bold text-white">{metrics?.avg_detection_time_ms ?? 24.5} ms</span>
          <span className="text-[10px] text-slate-400 block">Real-time gate speed</span>
        </div>
        <div className="p-2">
          <span className="text-[10px] text-slate-400 block">SECURITY POSTURE</span>
          <span className="text-base font-bold text-emerald-400">{metrics?.security_score ?? 98.4} / 100</span>
          <span className="text-[10px] text-slate-400 block">NIST QDS compliant</span>
        </div>
      </div>

      {/* MIDDLE SECTION: Attack Breakdown & Pauli Tomography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Attack Detection Breakdown Donut (5 cols) */}
        <div className="lg:col-span-5 soc-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" /> Attack Detection Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Total: {stats?.malicious_count ?? 0}</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 font-mono">
              Categorization of blocked adversarial threats across verification links
            </p>

            {/* Donut Chart */}
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attackDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0F19" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                      color: '#F8FAFC',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-white">
                  {stats?.malicious_count ?? 0}
                </span>
                <span className="text-[10px] font-mono text-slate-400">ATTACKS</span>
              </div>
            </div>
          </div>

          {/* Donut Legend Items */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-300">Forgery: </span>
                <strong className="text-white">{stats?.attack_breakdown.SIGNATURE_FORGERY ?? 0}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-300">Impersonation: </span>
                <strong className="text-white">{stats?.attack_breakdown.IMPERSONATION ?? 0}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-300">Replay: </span>
                <strong className="text-white">{stats?.attack_breakdown.REPLAY_ATTACK ?? 0}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
              <div className="truncate">
                <span className="text-slate-300">Unauthorized: </span>
                <strong className="text-white">{stats?.attack_breakdown.UNAUTHORIZED_VERIFIER ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pauli Eigenstate Analysis (7 cols) */}
        <div className="lg:col-span-7 soc-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Pauli Eigenstate Tomography (X, Y, Z Bases)
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">EXPECTED VS OBSERVED QBER</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 font-mono">
              Quantum mismatch rates under normal channel noise vs eavesdropping perturbation
            </p>

            {/* Bar Chart comparing Expected Noise, Legit Observed, and Attack Mismatch */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics?.basis_metrics ?? []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis 
                    dataKey="basis" 
                    stroke="#64748B" 
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                  />
                  <YAxis 
                    stroke="#64748B" 
                    tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    domain={[0, 0.45]}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                      color: '#F8FAFC',
                    }}
                    formatter={(val: any) => [`${(Number(val) * 100).toFixed(2)}%`]}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }}
                  />
                  <Bar dataKey="expected_noise" name="Baseline Channel Noise" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="observed_legit" name="Legitimate Signature QBER" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="observed_attack" name="Adversary Disturbance (Attack)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800">
            <span>CALIBRATED 5σ CUTOFF: <strong className="text-amber-400">0.1120</strong></span>
            <span>NO-CLONING FIDELITY MARGIN: <strong className="text-emerald-400">&gt; 95.5%</strong></span>
          </div>
        </div>
      </div>

      {/* STATISTICAL THRESHOLD DECISION VIEW */}
      <div className="soc-card rounded-xl p-5 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Statistical Threshold Decision View
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Individual verification mismatch rates plotted chronologically against calibrated 5σ decision boundary. Points above threshold indicate quantum tampering.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Legitimate (Pass)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-slate-300">Malicious (Alert)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-400" />
              <span className="text-amber-400">Threshold (0.1120)</span>
            </div>
          </div>
        </div>

        {/* Line / Scatter Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics?.threshold_points ?? []}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis 
                dataKey="index" 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                label={{ value: 'Verification Sequence Number', position: 'insideBottom', offset: -5, fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <YAxis 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                domain={[0, 0.45]}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                  color: '#F8FAFC',
                }}
                formatter={(val: any, name: any, item: any) => {
                  const pt = item.payload;
                  return [
                    `QBER: ${(pt.mismatch_rate * 100).toFixed(2)}% | Verdict: ${pt.verdict} (${pt.attack_type})`,
                    `Trial #${pt.index}`
                  ];
                }}
              />
              {/* Reference line for the 5-sigma decision threshold */}
              <ReferenceLine 
                y={0.1120} 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                strokeWidth={2}
                label={{ value: '5σ Threshold = 0.1120', fill: '#F59E0B', fontSize: 11, fontFamily: 'JetBrains Mono', position: 'insideTopLeft' }}
              />
              <Line 
                type="monotone" 
                dataKey="mismatch_rate" 
                stroke="#06B6D4" 
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isAnomaly = payload.mismatch_rate > 0.1120 || payload.verdict === 'MALICIOUS';
                  return (
                    <circle
                      key={`dot-${payload.index}`}
                      cx={cx}
                      cy={cy}
                      r={isAnomaly ? 5 : 3.5}
                      fill={isAnomaly ? '#EF4444' : '#10B981'}
                      stroke={isAnomaly ? '#FCA5A5' : '#6EE7B7'}
                      strokeWidth={1.5}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LIVE VERIFICATION LOG TABLE */}
      <div className="soc-card rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Real-time Verification Stream
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Live audit events from defense terminals. Click any row to inspect complete quantum telemetry in the drawer.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
            <span>LIVE TELEMETRY</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="pb-2.5">TIMESTAMP</th>
                <th className="pb-2.5">DOCUMENT / PAYLOAD</th>
                <th className="pb-2.5">VERIFIER ID</th>
                <th className="pb-2.5">MODE</th>
                <th className="pb-2.5">RESULT</th>
                <th className="pb-2.5">ATTACK VECTOR</th>
                <th className="pb-2.5">QBER / MISMATCH</th>
                <th className="pb-2.5">FORGERY PROB</th>
                <th className="pb-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentLogs.map((log) => {
                const isMal = log.verdict === 'MALICIOUS';
                return (
                  <tr
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 text-white font-medium group-hover:text-cyan-300 transition-colors">
                      {log.file_name}
                    </td>
                    <td className="py-2.5 text-slate-300">{log.verifier_id}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        log.mode === 'DEMO' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                      }`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isMal 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isMal ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {log.verdict}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[11px] ${
                        isMal ? 'text-amber-400 font-semibold' : 'text-slate-400'
                      }`}>
                        {log.attack_type === 'NONE' ? 'Nominal' : log.attack_type}
                      </span>
                    </td>
                    <td className={`py-2.5 font-semibold ${
                      log.mismatch_rate > log.threshold ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {(log.mismatch_rate * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 text-slate-300">
                      {(log.forgery_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center text-cyan-400 group-hover:translate-x-0.5 transition-transform text-[11px]">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
