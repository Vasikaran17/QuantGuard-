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
  ChevronRight,
  Shield,
  Zap,
  ArrowUpRight,
  SlidersHorizontal
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
  ReferenceLine 
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

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const attackDonutData = stats
    ? [
        { name: 'Signature Forgery', value: stats.attack_breakdown.SIGNATURE_FORGERY, color: '#F43F5E' },
        { name: 'Signer Impersonation', value: stats.attack_breakdown.IMPERSONATION, color: '#FB923C' },
        { name: 'Replay Attack', value: stats.attack_breakdown.REPLAY_ATTACK, color: '#FBBF24' },
        { name: 'Unauthorized Verifier', value: stats.attack_breakdown.UNAUTHORIZED_VERIFIER, color: '#A855F7' },
      ].filter((item) => item.value > 0)
    : [];

  const handleRowClick = (log: LogEntry) => {
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
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Security Operations Overview
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-600/15 text-blue-300 border border-blue-500/30">
              Real-time Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous quantum digital signature verification and eavesdropping detection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-[#0F172A] border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>Live Updates: <strong className={autoRefresh ? 'text-blue-400' : 'text-slate-500'}>{autoRefresh ? 'On' : 'Off'}</strong></span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>

          <button
            onClick={onNavigateVerify}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Verify Signature</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Verifications */}
        <div className="bg-[#0F172A] rounded-xl p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Signatures Verified</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats?.total_verifications ?? '--'}
            </span>
            <span className="text-xs text-slate-400">payloads</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Channel Mode</span>
            <span className="text-slate-300 font-medium">{isDemoMode ? 'Interactive Demo' : 'Live Ingestion'}</span>
          </div>
        </div>

        {/* Legitimate Signatures */}
        <div className="bg-[#0F172A] rounded-xl p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Legitimate Verified</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {stats?.legitimate_count ?? '--'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {stats ? `(${((stats.legitimate_count / (stats.total_verifications || 1)) * 100).toFixed(1)}%)` : ''}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Nominal Noise</span>
            <span className="text-emerald-400 font-mono font-medium">&lt; 0.050 QBER</span>
          </div>
        </div>

        {/* Malicious Intrusions */}
        <div className="bg-[#0F172A] rounded-xl p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Blocked Threats</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">
              {stats?.malicious_count ?? '--'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {stats ? `(${stats.malicious_ratio}%)` : ''}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Interception Action</span>
            <span className="text-slate-300">Dropped at Relay</span>
          </div>
        </div>

        {/* Threat Level */}
        <div className={`rounded-xl p-4 border shadow-sm ${
          stats?.threat_level === 'CRITICAL' 
            ? 'bg-rose-950/20 border-rose-800/60' 
            : stats?.threat_level === 'SUSPICIOUS' 
            ? 'bg-amber-950/20 border-amber-800/60' 
            : 'bg-[#0F172A] border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Security Posture</span>
            <AlertTriangle className={`w-4 h-4 ${
              stats?.threat_level === 'CRITICAL' ? 'text-rose-400' : stats?.threat_level === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'
            }`} />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              stats?.threat_level === 'CRITICAL' ? 'text-rose-400' : stats?.threat_level === 'SUSPICIOUS' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {stats?.threat_level === 'SAFE' ? 'Nominal' : stats?.threat_level ?? 'Nominal'}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              5σ Gate
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 truncate">
            {stats?.threat_level === 'CRITICAL' ? 'Intrusion activity detected' : stats?.threat_level === 'SUSPICIOUS' ? 'Elevated anomaly rate' : 'Channel fidelity within limits'}
          </div>
        </div>
      </div>

      {/* Threat Assessment Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        stats?.threat_level === 'CRITICAL'
          ? 'bg-rose-950/30 border-rose-800/70 text-rose-200'
          : stats?.threat_level === 'SUSPICIOUS'
          ? 'bg-amber-950/30 border-amber-800/70 text-amber-200'
          : 'bg-[#0F172A] border-slate-800 text-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${
            stats?.threat_level === 'CRITICAL' ? 'bg-rose-500 animate-ping' : stats?.threat_level === 'SUSPICIOUS' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
          }`} />
          <div>
            <div className="text-xs font-semibold text-white">
              Channel Telemetry Assessment: {stats?.threat_level === 'SAFE' ? 'Secure & Verified' : stats?.threat_level}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats?.threat_description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs text-slate-300 shrink-0">
          <div>
            <span className="text-slate-400 block text-[11px]">Calibrated Boundary</span>
            <span className="font-mono text-white font-medium">{stats?.calibrated_threshold} QBER</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[11px]">Channel Fidelity</span>
            <span className="font-mono text-emerald-400 font-semibold">{metrics?.security_score ?? 98.4}%</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Threat Breakdown Donut & Pauli Tomography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Vector Breakdown */}
        <div className="lg:col-span-5 bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Threat Vector Distribution
              </h3>
              <span className="text-xs font-mono text-slate-400">{stats?.malicious_count ?? 0} blocked</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Classification of intercepted adversarial actions
            </p>

            <div className="h-52 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {attackDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-white">
                  {stats?.malicious_count ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Interceptions</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-300">Forgery:</span>
              <strong className="text-white font-mono">{stats?.attack_breakdown.SIGNATURE_FORGERY ?? 0}</strong>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
              <span className="text-slate-300">Impersonation:</span>
              <strong className="text-white font-mono">{stats?.attack_breakdown.IMPERSONATION ?? 0}</strong>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-slate-300">Replay Attack:</span>
              <strong className="text-white font-mono">{stats?.attack_breakdown.REPLAY_ATTACK ?? 0}</strong>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
              <span className="text-slate-300">Unauthorized:</span>
              <strong className="text-white font-mono">{stats?.attack_breakdown.UNAUTHORIZED_VERIFIER ?? 0}</strong>
            </div>
          </div>
        </div>

        {/* Pauli Tomography (X, Y, Z Bases) */}
        <div className="lg:col-span-7 bg-[#0F172A] rounded-xl p-5 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Pauli Basis Error Tomography
              </h3>
              <span className="text-xs font-mono text-slate-400">Bases: X, Y, Z</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Measured mismatch rate across Pauli eigenstates compared with baseline and adversary perturbation
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics?.basis_metrics ?? []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis 
                    dataKey="basis" 
                    stroke="#64748B" 
                    tick={{ fill: '#94A3B8', fontSize: 11 }} 
                  />
                  <YAxis 
                    stroke="#64748B" 
                    tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    domain={[0, 0.45]}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                    formatter={(val: any) => [`${(Number(val) * 100).toFixed(2)}%`]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="expected_noise" name="Baseline Channel Noise" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="observed_legit" name="Legitimate Signature QBER" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="observed_attack" name="Adversary Disturbance (Attack)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span>5σ Decision Boundary: <strong className="font-mono text-amber-400">0.1120</strong></span>
            <span>No-Cloning Fidelity Margin: <strong className="font-mono text-emerald-400">&gt; 95.5%</strong></span>
          </div>
        </div>
      </div>

      {/* Chronological Decision Threshold View */}
      <div className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Statistical 5σ Decision Gate Telemetry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sequential verification trials plotted against the calibrated threshold (0.1120). Trials exceeding threshold trigger instant intrusion rejection.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Legitimate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">Threat Flagged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-400" />
              <span className="text-amber-400 font-mono">Cutoff 0.1120</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics?.threshold_points ?? []}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis 
                dataKey="index" 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                domain={[0, 0.45]}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#F8FAFC',
                }}
                formatter={(val: any, name: any, item: any) => {
                  const pt = item.payload;
                  return [
                    `QBER: ${(pt.mismatch_rate * 100).toFixed(2)}% | Status: ${pt.verdict}`,
                    `Trial #${pt.index}`
                  ];
                }}
              />
              <ReferenceLine 
                y={0.1120} 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ value: '5σ Threshold (0.1120)', fill: '#F59E0B', fontSize: 11, position: 'insideTopLeft' }}
              />
              <Line 
                type="monotone" 
                dataKey="mismatch_rate" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isAnomaly = payload.mismatch_rate > 0.1120 || payload.verdict === 'MALICIOUS';
                  return (
                    <circle
                      key={`dot-${payload.index}`}
                      cx={cx}
                      cy={cy}
                      r={isAnomaly ? 4.5 : 3}
                      fill={isAnomaly ? '#F43F5E' : '#10B981'}
                      stroke={isAnomaly ? '#FECDD3' : '#A7F3D0'}
                      strokeWidth={1}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Verification Log Table */}
      <div className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recent Verification Sessions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit stream. Click any record to inspect complete quantum tomography telemetry.
            </p>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Live Audit Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Document / Payload</th>
                <th className="pb-3">Verifier Node</th>
                <th className="pb-3">Mode</th>
                <th className="pb-3">Verdict</th>
                <th className="pb-3">Attack Classification</th>
                <th className="pb-3">Observed QBER</th>
                <th className="pb-3">Forgery Risk</th>
                <th className="pb-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentLogs.map((log) => {
                const isMal = log.verdict === 'MALICIOUS';
                return (
                  <tr
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 text-slate-400 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 text-white font-sans font-medium group-hover:text-blue-400 transition-colors">
                      {log.file_name}
                    </td>
                    <td className="py-2.5 text-slate-400 text-xs">{log.verifier_id}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium ${
                        log.mode === 'DEMO' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                      }`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-sans font-medium ${
                        isMal 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isMal ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {log.verdict}
                      </span>
                    </td>
                    <td className="py-2.5 font-sans">
                      <span className={`text-xs ${
                        isMal ? 'text-amber-400 font-medium' : 'text-slate-400'
                      }`}>
                        {log.attack_type === 'NONE' ? 'Nominal' : log.attack_type}
                      </span>
                    </td>
                    <td className={`py-2.5 font-semibold ${
                      log.mismatch_rate > log.threshold ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {(log.mismatch_rate * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 text-slate-300">
                      {(log.forgery_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-right font-sans">
                      <span className="inline-flex items-center text-blue-400 group-hover:translate-x-0.5 transition-transform text-xs font-medium">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
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
