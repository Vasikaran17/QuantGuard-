import React from 'react';
import { 
  ShieldAlert, 
  CopyX, 
  UserX, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Atom,
  Cpu,
  Fingerprint,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AttackAnalysisPage: React.FC = () => {
  const attackVectors = [
    {
      id: 'SIGNATURE_FORGERY',
      name: 'Signature Forgery (Adversary Eve)',
      threatLevel: 'Critical',
      color: 'rose',
      icon: CopyX,
      quantumMechanism: 'Quantum No-Cloning Theorem & Pauli Disturbance',
      description: 'An attacker attempts to forge a valid quantum signature state without possession of Alice\'s private basis sequence. When Eve intercepts and measures states, quantum complementarity forces wave function collapse.',
      detectionMetric: 'Measurement Mismatch Rate (QBER) jumps from baseline ~0.04 to > 0.32 across X, Y, Z bases, decisively tripping the 5σ threshold (0.1120).',
      mitigation: 'Automated rejection of verification session; quantum state token instantly invalidated; security operations alert triggered.',
      thresholdStatus: 'Observed: 0.342 vs Cutoff: 0.112'
    },
    {
      id: 'IMPERSONATION',
      name: 'Signer Impersonation Attack (Mallory)',
      threatLevel: 'High',
      color: 'amber',
      icon: UserX,
      quantumMechanism: 'Entangled Basis Alignment & Identity Proof',
      description: 'A malicious entity Mallory attempts to impersonate legitimate signer Alice by submitting forged public parameters or an altered identity vector.',
      detectionMetric: 'Systematic basis key mismatch (> 40% error) when receiver decrypts quantum states with Alice\'s registered public basis seed.',
      mitigation: 'Identity certificate verification failure; signer public key blacklisted; immediate telemetry logging for audit.',
      thresholdStatus: 'Observed: 0.414 vs Cutoff: 0.112'
    },
    {
      id: 'REPLAY_ATTACK',
      name: 'Quantum Replay Attack (Nonce Collision)',
      threatLevel: 'High',
      color: 'amber',
      icon: RotateCcw,
      quantumMechanism: 'Temporal Nonce Vault & State Expiration',
      description: 'An adversary intercepts a previously verified quantum signature and attempts to re-transmit it to authorize an unauthorized action or replay a financial settlement transaction.',
      detectionMetric: 'Instant collision lookup in SQLite used_nonces table; quantum state expiration token exceeds maximum validity window.',
      mitigation: 'Deterministic pre-measurement denial; immediate drop of channel teleportation packet.',
      thresholdStatus: 'Instant rejection via Nonce Vault'
    },
    {
      id: 'UNAUTHORIZED_VERIFIER',
      name: 'Unauthorized Rogue Verifier Node',
      threatLevel: 'High',
      color: 'violet',
      icon: Lock,
      quantumMechanism: 'Clearance-Enforced Channel Access Control',
      description: 'An unverified gateway or blacklisted node requests verification of classified quantum states without holding Level-5 quantum decryption clearance.',
      detectionMetric: 'Verifier ID check against authorized_verifiers database table; failure of active authorization handshake.',
      mitigation: 'Channel cut-off; zero-knowledge audit trail record added; telemetry flagged as unauthorized verifier.',
      thresholdStatus: 'Clearance Access Denied'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Threat Intelligence & Attack Modeling
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
              Eavesdropping Defense
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical analysis of adversarial vectors mitigated by teleportation-based QDS protocols
          </p>
        </div>
      </div>

      {/* Physics vs Classical Comparison Callout */}
      <div className="bg-[#0F172A] rounded-xl p-5 border border-blue-500/30 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Atom className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              Information-Theoretic Security vs Classical Computational Hardness
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike classical asymmetric schemes (RSA, DSA, ECDSA) which are mathematically broken by Shor’s algorithm on quantum computers, 
              <strong> Quantum Digital Signatures (QDS)</strong> derive their security directly from the fundamental laws of quantum physics: the 
              <em> Quantum No-Cloning Theorem</em> and <em>Heisenberg’s Complementarity Principle</em>. Any adversary attempting to intercept or copy the signature states 
              irreversibly collapses the Pauli basis measurements, driving the Quantum Bit Error Rate (QBER) far beyond the calibrated 5-sigma decision boundary.
            </p>
          </div>
        </div>
      </div>

      {/* Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {attackVectors.map((atk) => {
          const Icon = atk.icon;
          return (
            <div key={atk.id} className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0B1120] border border-slate-700 flex items-center justify-center text-rose-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white">{atk.name}</h3>
                      <span className="text-[11px] text-blue-400">{atk.quantumMechanism}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    atk.threatLevel === 'Critical' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {atk.threatLevel}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    {atk.description}
                  </p>
                  
                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase block">Detection Mechanism:</span>
                    <p className="text-slate-200 text-xs leading-relaxed">{atk.detectionMetric}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Operational Mitigation:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Intercepted & Quarantined
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
