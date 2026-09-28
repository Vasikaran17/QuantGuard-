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
  Fingerprint
} from 'lucide-react';

export const AttackAnalysisPage: React.FC = () => {
  const attackVectors = [
    {
      id: 'SIGNATURE_FORGERY',
      name: 'Signature Forgery (Adversary Eve)',
      threatLevel: 'CRITICAL',
      color: 'red',
      icon: CopyX,
      quantumMechanism: 'Quantum No-Cloning Theorem & Pauli Disturbance',
      description: 'An attacker attempts to forge a valid quantum signature state without possession of Alice\'s private basis sequence. When Eve measures or reconstructs states, quantum complementarity forces measurement collapse.',
      detectionMetric: 'Measurement Mismatch Rate (QBER) jumps from baseline ~0.04 to > 0.32 across X, Y, Z bases, tripping the 5σ threshold.',
      mitigation: 'Automated rejection of verification session; quantum state token instantly invalidated; security operations alert triggered.',
      thresholdStatus: 'Observed: 0.342 vs Cutoff: 0.112'
    },
    {
      id: 'IMPERSONATION',
      name: 'Signer Impersonation Attack (Mallory)',
      threatLevel: 'HIGH',
      color: 'orange',
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
      threatLevel: 'HIGH',
      color: 'amber',
      icon: RotateCcw,
      quantumMechanism: 'Temporal Nonce Vault & State Expiration',
      description: 'An adversary intercepts a previously verified quantum signature and attempts to re-transmit it to authorize an unauthorized action or replay a financial transaction.',
      detectionMetric: 'Instant collision lookup in SQLite used_nonces table; quantum state expiration token exceeds maximum validity window.',
      mitigation: 'Deterministic pre-measurement denial; immediate drop of channel teleportation packet.',
      thresholdStatus: 'Instant rejection via Nonce Vault'
    },
    {
      id: 'UNAUTHORIZED_VERIFIER',
      name: 'Unauthorized Rogue Verifier',
      threatLevel: 'HIGH',
      color: 'purple',
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
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-white tracking-wide font-sans">
            QUANTUM ATTACK VECTOR ANALYSIS
          </h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
            EAVESDROPPING TRIAGE
          </span>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Theoretical & empirical analysis of attacks mitigated by teleportation-based QDS protocols
        </p>
      </div>

      {/* Physics vs Classical Comparison Callout */}
      <div className="soc-card rounded-xl p-5 border border-cyan-500/30 bg-cyan-950/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Atom className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-cyan-300">
              WHY TELEPORTATION-BASED QDS IS INFORMATION-THEORETICALLY SECURE
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Unlike classical digital signatures (RSA, DSA, ECDSA) which are vulnerable to Shor’s algorithm on quantum computers, 
              <strong> Quantum Digital Signatures (QDS)</strong> rely on the fundamental laws of quantum physics: the 
              <em> Quantum No-Cloning Theorem</em> and <em>Heisenberg’s Uncertainty Principle</em>. Any adversary measuring the signature states 
              during transmission irreversibly perturbs the Pauli eigenstate outcomes, causing a mathematically provable jump in the Quantum Bit Error Rate (QBER).
            </p>
          </div>
        </div>
      </div>

      {/* Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {attackVectors.map((atk) => {
          const Icon = atk.icon;
          return (
            <div key={atk.id} className="soc-card rounded-xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-red-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white">{atk.name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400">{atk.quantumMechanism}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    atk.threatLevel === 'CRITICAL' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {atk.threatLevel}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {atk.description}
                  </p>
                  
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase block">DETECTION CRITERIA:</span>
                    <p className="text-slate-200 text-[11px]">{atk.detectionMetric}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">MITIGATION STATUS:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Blocked & Logged
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
