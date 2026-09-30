import React from 'react';
import { 
  ShieldAlert, 
  CopyX, 
  UserX, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

export const ThreatDetectionPage: React.FC = () => {
  const { dashboardStats, settings, history } = useVerification();

  const threatVectors = [
    {
      id: 'FORGERY',
      name: 'Digital Signature Forgery',
      adversary: 'Attacker Eve',
      threatLevel: 'Critical',
      icon: CopyX,
      color: 'rose',
      quantumPrinciple: 'Quantum No-Cloning Theorem & Pauli Disturbance',
      mechanism: 'An adversary intercepts or fabricates quantum state pulses. Due to non-orthogonal basis complementarity, measurement collapses the quantum state, forcing mismatch rate (QBER) to > 32%, tripping the statistical threshold.',
      detectionStatus: `${dashboardStats.attackBreakdown.SIGNATURE_FORGERY} Attempt(s) Blocked`,
      statusColor: 'text-rose-400 bg-rose-950/80 border-rose-800'
    },
    {
      id: 'IMPERSONATION',
      name: 'Signer Impersonation Attack',
      adversary: 'Mallory (Corrupted Basis)',
      threatLevel: 'High',
      icon: UserX,
      color: 'amber',
      quantumPrinciple: 'Entangled Basis Alignment & Identity Proof',
      mechanism: 'An unauthorized entity Mallory attempts to impersonate Alice by substituting public parameters. Cryptographic basis verification fails due to misalignment with the registered sender identity.',
      detectionStatus: `${dashboardStats.attackBreakdown.IMPERSONATION} Attempt(s) Blocked`,
      statusColor: 'text-amber-400 bg-amber-950/80 border-amber-800'
    },
    {
      id: 'REPLAY',
      name: 'Quantum Replay Attack',
      adversary: 'Eavesdropper Intercept-Resend',
      threatLevel: 'High',
      icon: RotateCcw,
      color: 'purple',
      quantumPrinciple: 'Temporal Nonce Vault & Non-Cloning Freshness',
      mechanism: 'An adversary replays an intercepted signature state. The temporal Nonce Vault instantly detects state duplication; wave-function collapse prevents re-teleportation.',
      detectionStatus: `${dashboardStats.attackBreakdown.REPLAY_ATTACK} Attempt(s) Blocked`,
      statusColor: 'text-purple-400 bg-purple-950/80 border-purple-800'
    },
    {
      id: 'UNAUTHORIZED',
      name: 'Unauthorized Verification Attempt',
      adversary: 'Rogue Node / Gateway',
      threatLevel: 'High',
      icon: Lock,
      color: 'sky',
      quantumPrinciple: 'Cryptographic Clearance & Authorization Gate',
      mechanism: 'An untrusted gateway attempts to verify and decrypt quantum tokens. Clearance check fails prior to basis projection, preventing state leakage.',
      detectionStatus: `${dashboardStats.attackBreakdown.UNAUTHORIZED_VERIFIER} Attempt(s) Blocked`,
      statusColor: 'text-sky-400 bg-sky-950/80 border-sky-800'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Threat Detection & Quantum Attack Matrices
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous monitoring of quantum teleportation anomalies, eavesdropping disturbance, and identity violations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Decision Threshold:</span>
          <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-1 rounded bg-[#0A0E17] border border-[#1E293B]">
            {settings.statisticalThreshold}% Mismatch Cutoff
          </span>
        </div>
      </div>

      {/* Threat Level Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {threatVectors.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.id} className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0A0E17] border border-[#1E293B] text-slate-200">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{v.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400">Adversary Model: {v.adversary}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${v.statusColor}`}>
                  {v.detectionStatus}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-1">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Quantum Detection Mechanism
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {v.mechanism}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Physics Basis: <strong className="text-slate-200">{v.quantumPrinciple}</strong></span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Shield
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantum Attack Decision Matrix */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Quantum Threat Decision Matrix & Rule Engine
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Attack Vector</th>
                <th className="py-2.5 px-3">Telemetry Signal</th>
                <th className="py-2.5 px-3">Threshold Boundary</th>
                <th className="py-2.5 px-3">Decision Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
              <tr className="hover:bg-[#1E293B]/40">
                <td className="py-3 px-3 font-bold text-white">Signature Forgery</td>
                <td className="py-3 px-3 text-slate-400">Measurement Mismatch Rate &gt; {settings.statisticalThreshold}%</td>
                <td className="py-3 px-3 text-amber-400 font-bold">5σ Boundary ({settings.statisticalThreshold}%)</td>
                <td className="py-3 px-3"><span className="text-rose-400 font-bold">SIGNATURE FORGERY DETECTED</span></td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40">
                <td className="py-3 px-3 font-bold text-white">Signer Impersonation</td>
                <td className="py-3 px-3 text-slate-400">Sender Identity != Claimed Identity</td>
                <td className="py-3 px-3 text-cyan-400 font-bold">Identity Strict Equality</td>
                <td className="py-3 px-3"><span className="text-amber-400 font-bold">IMPERSONATION DETECTED</span></td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40">
                <td className="py-3 px-3 font-bold text-white">Replay Attack</td>
                <td className="py-3 px-3 text-slate-400">Nonce match in Verification History</td>
                <td className="py-3 px-3 text-purple-400 font-bold">Temporal Nonce Vault ({settings.replayWindowSeconds}s)</td>
                <td className="py-3 px-3"><span className="text-purple-400 font-bold">REPLAY ATTACK DETECTED</span></td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40">
                <td className="py-3 px-3 font-bold text-white">Unauthorized Verification</td>
                <td className="py-3 px-3 text-slate-400">Authorization != 'AUTHORIZED'</td>
                <td className="py-3 px-3 text-sky-400 font-bold">Cryptographic Clearance Level-5</td>
                <td className="py-3 px-3"><span className="text-sky-400 font-bold">UNAUTHORIZED VERIFICATION DETECTED</span></td>
              </tr>
              <tr className="hover:bg-[#1E293B]/40">
                <td className="py-3 px-3 font-bold text-white">Normal Legitimate Request</td>
                <td className="py-3 px-3 text-slate-400">All checks passed, Mismatch &lt; {settings.statisticalThreshold}%</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">Within Channel Noise (&lt; 6%)</td>
                <td className="py-3 px-3"><span className="text-emerald-400 font-bold">VERIFIED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
