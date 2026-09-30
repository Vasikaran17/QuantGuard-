import React from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CopyX, 
  UserX, 
  RotateCcw, 
  Lock, 
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

export const AttackAnalysisPage: React.FC = () => {
  const { dashboardStats, history } = useVerification();

  // Filter only malicious / threat events from history
  const attackItems = history.filter((item) => item.status === 'THREAT DETECTED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Flame className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Adversarial Attack Analysis & Forensic Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Deep-dive telemetry into intercepted forgery attempts, identity spoofing, and nonce replay vectors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Intercepts:</span>
          <span className="font-mono text-sm font-bold text-rose-400 px-3 py-1 rounded bg-[#0A0E17] border border-[#1E293B]">
            {dashboardStats.threatsCount} Threats
          </span>
        </div>
      </div>

      {/* Top 5 Attack Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Threats</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {dashboardStats.threatsCount}
          </div>
          <span className="text-[10px] text-slate-400 block">All vectors combined</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Forgery</span>
            <CopyX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {dashboardStats.attackBreakdown.SIGNATURE_FORGERY}
          </div>
          <span className="text-[10px] text-slate-400 block">QBER threshold breaches</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Impersonation</span>
            <UserX className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {dashboardStats.attackBreakdown.IMPERSONATION}
          </div>
          <span className="text-[10px] text-slate-400 block">Basis key mismatches</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Replay Attempts</span>
            <RotateCcw className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {dashboardStats.attackBreakdown.REPLAY_ATTACK}
          </div>
          <span className="text-[10px] text-slate-400 block">Nonce vault collisions</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Unauthorized</span>
            <Lock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            {dashboardStats.attackBreakdown.UNAUTHORIZED_VERIFIER}
          </div>
          <span className="text-[10px] text-slate-400 block">Clearance token failures</span>
        </div>
      </div>

      {/* DETAILED ATTACK TABLE */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            DETAILED ADVERSARIAL ATTACK LEDGER
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Filtered: {attackItems.length} Blocked Intrusion Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Attack ID</th>
                <th className="py-2.5 px-3">Attack Type</th>
                <th className="py-2.5 px-3">Detection Signal</th>
                <th className="py-2.5 px-3 text-right">Mismatch Rate</th>
                <th className="py-2.5 px-3 text-right">Attack Probability</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
              {attackItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No threat events recorded in current session. Run a demo attack or upload forged payload to test.
                  </td>
                </tr>
              ) : (
                attackItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-cyan-400">{item.requestId}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-rose-400">{item.threatType}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate" title={item.result?.whyDecision}>
                      {item.threatType === 'Signature Forgery' ? `Mismatch Rate (${item.mismatchRate}%) > Cutoff (20%)` :
                       item.threatType === 'Impersonation' ? `Identity mismatch ('${item.sender}' != '${item.claimedIdentity}')` :
                       item.threatType === 'Replay Attack' ? `Reused Nonce (${item.nonce}) in Temporal Vault` :
                       'Unauthorized Verifier Clearance Flag'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-rose-400">
                      {item.mismatchRate}%
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-400">
                      {item.attackProbability}%
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-400">
                      {item.confidence}%
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
