import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Flame,
  FileCheck2,
  Lock,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useVerification } from '../context/VerificationContext';
import { useMode } from '../context/ModeContext';

interface DashboardPageProps {
  onNavigateVerify?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateVerify }) => {
  const { dashboardStats, history, latestResult } = useVerification();
  const { isDemoMode } = useMode();

  // Attack Breakdown for Donut Chart
  const attackDonutData = [
    { name: 'Normal / Verified', value: dashboardStats.verifiedCount, color: '#10B981' },
    { name: 'Signature Forgery', value: dashboardStats.attackBreakdown.SIGNATURE_FORGERY, color: '#F43F5E' },
    { name: 'Signer Impersonation', value: dashboardStats.attackBreakdown.IMPERSONATION, color: '#FB923C' },
    { name: 'Replay Attack', value: dashboardStats.attackBreakdown.REPLAY_ATTACK, color: '#A855F7' },
    { name: 'Unauthorized Verifier', value: dashboardStats.attackBreakdown.UNAUTHORIZED_VERIFIER, color: '#0EA5E9' },
  ].filter((item) => item.value > 0);

  // Basis Tomography Bar Chart Data
  const tomographyData = [
    { basis: 'Z (Computational)', nominal: 4.2, observed: latestResult?.measurementBasis === 'Z' ? latestResult.mismatchRate : 5.1, threshold: 20 },
    { basis: 'X (Hadamard)', nominal: 3.8, observed: latestResult?.measurementBasis === 'X' ? latestResult.mismatchRate : 4.4, threshold: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Security Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Security Operations Center (SOC) Console
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                QUANTUM PROTOCOL ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time quantum threat detection for Teleportation-based Quantum Digital Signatures (QDS)
            </p>
          </div>
        </div>

        {onNavigateVerify && (
          <button
            onClick={onNavigateVerify}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Launch Verification</span>
          </button>
        )}
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Verification Requests */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Requests</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {dashboardStats.totalRequests}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-medium font-mono">100%</span> inspected via Pauli Gate
          </div>
        </div>

        {/* Verified Signatures */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Verified Signatures</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {dashboardStats.verifiedCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Noise &lt; calibrated statistical threshold
          </div>
        </div>

        {/* Threats Detected */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Threats Detected</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {dashboardStats.threatsCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Blocked by No-Cloning & Nonce Vault
          </div>
        </div>

        {/* Average Security Confidence */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Avg Security Confidence</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {dashboardStats.avgConfidence}%
          </div>
          <div className="text-[11px] text-slate-400">
            Statistical significance boundary
          </div>
        </div>
      </div>

      {/* PROMINENT QUANTUM THREAT SCORE GAUGE & THREAT ASSESSMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* QUANTUM THREAT SCORE CARD (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                QUANTUM THREAT SCORE
              </h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              dashboardStats.threatRiskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              dashboardStats.threatRiskLevel === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              dashboardStats.threatRiskLevel === 'MEDIUM' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
              'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {dashboardStats.threatRiskLevel} RISK
            </span>
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-4 border-[#1E293B] bg-[#0A0E17]">
              <div className="text-center">
                <span className="text-4xl font-extrabold font-mono text-white block">
                  {dashboardStats.quantumThreatScore}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  / 100 INDEX
                </span>
              </div>
            </div>
          </div>

          {/* Risk Level Tiers */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono pt-1">
            <div className={`p-1.5 rounded border ${dashboardStats.quantumThreatScore <= 30 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-[#0A0E17] border-[#1E293B] text-slate-500'}`}>
              0-30 LOW
            </div>
            <div className={`p-1.5 rounded border ${dashboardStats.quantumThreatScore > 30 && dashboardStats.quantumThreatScore <= 60 ? 'bg-yellow-950/80 border-yellow-500 text-yellow-300 font-bold' : 'bg-[#0A0E17] border-[#1E293B] text-slate-500'}`}>
              31-60 MED
            </div>
            <div className={`p-1.5 rounded border ${dashboardStats.quantumThreatScore > 60 && dashboardStats.quantumThreatScore <= 80 ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold' : 'bg-[#0A0E17] border-[#1E293B] text-slate-500'}`}>
              61-80 HIGH
            </div>
            <div className={`p-1.5 rounded border ${dashboardStats.quantumThreatScore > 80 ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold' : 'bg-[#0A0E17] border-[#1E293B] text-slate-500'}`}>
              81-100 CRIT
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed text-center">
            Composite index synthesizing measurement mismatch, identity alignment, nonce freshness, and authorization clearance.
          </p>
        </div>

        {/* THREAT DISTRIBUTION DONUT CHART (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                THREAT DISTRIBUTION & CATEGORIZATION
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Total Recorded: {dashboardStats.totalRequests}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {attackDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0A0E17', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend breakdown list */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0E17] border border-[#1E293B]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Verified Normal
                </span>
                <span className="font-mono font-bold text-white">{dashboardStats.verifiedCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0E17] border border-[#1E293B]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Signature Forgery
                </span>
                <span className="font-mono font-bold text-white">{dashboardStats.attackBreakdown.SIGNATURE_FORGERY}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0E17] border border-[#1E293B]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                  Impersonation
                </span>
                <span className="font-mono font-bold text-white">{dashboardStats.attackBreakdown.IMPERSONATION}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0E17] border border-[#1E293B]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  Replay Attack
                </span>
                <span className="font-mono font-bold text-white">{dashboardStats.attackBreakdown.REPLAY_ATTACK}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0A0E17] border border-[#1E293B]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  Unauthorized
                </span>
                <span className="font-mono font-bold text-white">{dashboardStats.attackBreakdown.UNAUTHORIZED_VERIFIER}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SECURITY EVENTS TABLE */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              RECENT SECURITY EVENTS & TELEMETRY LEDGER
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Auto-Updated from Live Verification Engine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Request ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Sender Identity</th>
                <th className="py-2.5 px-3">Threat Classification</th>
                <th className="py-2.5 px-3 text-right">Mismatch Rate</th>
                <th className="py-2.5 px-3 text-right">Threat Score</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
              {history.slice(0, 7).map((item) => (
                <tr key={item.id} className="hover:bg-[#1E293B]/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-cyan-400">{item.requestId}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{item.sender}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-300">{item.threatType}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={item.mismatchRate > 20 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {item.mismatchRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">{item.quantumThreatScore}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
