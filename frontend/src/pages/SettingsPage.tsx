import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Database, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Server, 
  Key, 
  FileText,
  Lock
} from 'lucide-react';
import { getRegisteredSignaturesApi, getVerifiersApi } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [registeredSigs, setRegisteredSigs] = useState<any[]>([]);
  const [verifiers, setVerifiers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [sigRes, verRes] = await Promise.all([
          getRegisteredSignaturesApi(),
          getVerifiersApi(),
        ]);
        setRegisteredSigs(sigRes.registered_signatures);
        setVerifiers(verRes.verifiers);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-white tracking-wide font-sans">
            SYSTEM REGISTRY & QUANTUM CONFIGURATION
          </h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            ACTIVE CALIBRATION
          </span>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Review quantum channel calibration bounds, registered legitimate signatures, and authorized verifier nodes
        </p>
      </div>

      {/* Quantum Channel Calibration Mathematical Model */}
      <div className="soc-card rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> Statistical Threshold Calibration Engine
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">BASELINE NOISE (μ)</span>
            <span className="text-base font-bold text-cyan-400">0.0420</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Mean teleportation depolarizing noise</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">STANDARD DEVIATION (σ)</span>
            <span className="text-base font-bold text-slate-200">0.0140</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Channel fluctuation variance</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">STATISTICAL BOUND (k)</span>
            <span className="text-base font-bold text-amber-400">5.0 σ</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Five-sigma high-assurance cutoff</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">DECISION THRESHOLD (T)</span>
            <span className="text-base font-bold text-emerald-400">0.1120 QBER</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">T = μ + 5σ = 0.042 + 0.070</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-400">
          <strong className="text-cyan-300">Decision Rule: </strong>
          <span>If observed measurement mismatch rate &gt; 0.1120, quantum state has experienced wave-function collapse from measurement / forgery. State is rejected and threat logged.</span>
        </div>
      </div>

      {/* Registered Legitimate Signatures Table */}
      <div className="soc-card rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Registered Signature Repository
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            {registeredSigs.length} Registered Reference Documents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="pb-2">DOC ID</th>
                <th className="pb-2">FILE NAME</th>
                <th className="pb-2">SIGNER ID</th>
                <th className="pb-2">ALGORITHM</th>
                <th className="pb-2">SHA-256 HASH DIGEST</th>
                <th className="pb-2">ENROLLED DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {registeredSigs.map((sig) => (
                <tr key={sig.id} className="hover:bg-slate-800/20">
                  <td className="py-2.5 text-cyan-400 font-semibold">{sig.doc_id}</td>
                  <td className="py-2.5 text-white">{sig.file_name}</td>
                  <td className="py-2.5 text-slate-300">{sig.signer_id}</td>
                  <td className="py-2.5 text-slate-400">{sig.algorithm}</td>
                  <td className="py-2.5 text-slate-400 truncate max-w-xs" title={sig.file_hash}>
                    {sig.file_hash.substring(0, 16)}...{sig.file_hash.substring(48)}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {new Date(sig.registered_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authorized Verifier Nodes */}
      <div className="soc-card rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Authorized Verifier Node Clearances
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {verifiers.map((v) => (
            <div key={v.verifier_id} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{v.verifier_id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  v.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {v.active ? 'ACTIVE' : 'BLOCKED'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">{v.name}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
                <span>CLEARANCE: <strong className="text-cyan-300">{v.clearance_level}</strong></span>
                <span>MAX RATE: {v.max_rate_per_min}/min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
