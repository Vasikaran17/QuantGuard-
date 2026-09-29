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
  Lock,
  Layers,
  Info
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Registry & Statistical Calibration
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-600/15 text-blue-300 border border-blue-500/30">
              Active Parameters
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantum channel calibration bounds, enrolled signature hashes, and authorized verifier clearances
          </p>
        </div>
      </div>

      {/* Quantum Channel Calibration Mathematical Model */}
      <div className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" /> Statistical Threshold Calibration Engine (5σ Rule)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Baseline Noise (μ)</span>
            <span className="text-xl font-bold font-mono text-white">0.0420</span>
            <span className="text-[11px] text-slate-400 block mt-1">Mean depolarizing channel noise</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Standard Deviation (σ)</span>
            <span className="text-xl font-bold font-mono text-white">0.0140</span>
            <span className="text-[11px] text-slate-400 block mt-1">Channel fluctuation variance</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Statistical Cutoff Factor (k)</span>
            <span className="text-xl font-bold font-mono text-amber-400">5.0 σ</span>
            <span className="text-[11px] text-slate-400 block mt-1">Five-sigma high-confidence bound</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">Decision Threshold (T)</span>
            <span className="text-xl font-bold font-mono text-emerald-400">0.1120 QBER</span>
            <span className="text-[11px] text-slate-400 block mt-1 font-mono">T = μ + 5σ = 0.042 + 0.070</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-medium">Mathematical Decision Boundary: </strong>
            <span>Any measured mismatch rate exceeding <code className="font-mono text-amber-400">0.1120</code> indicates quantum wave-function collapse from eavesdropping measurement or forged basis states. Interceptions are rejected deterministically with &gt; 99.999% theoretical confidence.</span>
          </div>
        </div>
      </div>

      {/* Registered Legitimate Signatures Table */}
      <div className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Enrolled Legitimate Signatures Repository
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {registeredSigs.length} Registered Reference Payloads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                <th className="pb-3">Doc ID</th>
                <th className="pb-3">File Name</th>
                <th className="pb-3">Signer Identifier</th>
                <th className="pb-3">Protocol Scheme</th>
                <th className="pb-3">SHA-256 Digest</th>
                <th className="pb-3">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {registeredSigs.map((sig) => (
                <tr key={sig.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 text-blue-400 font-semibold">{sig.doc_id}</td>
                  <td className="py-2.5 text-white font-sans font-medium">{sig.file_name}</td>
                  <td className="py-2.5 text-slate-300">{sig.signer_id}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{sig.algorithm}</td>
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
      <div className="bg-[#0F172A] rounded-xl p-5 border border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" /> Authorized Verifier Node Gateways
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {verifiers.map((v) => (
            <div key={v.verifier_id} className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white font-mono">{v.verifier_id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  v.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {v.active ? 'Active Node' : 'Quarantined'}
                </span>
              </div>
              <p className="text-slate-300 text-xs">{v.name}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 font-mono">
                <span>Clearance: <strong className="text-slate-200">{v.clearance_level}</strong></span>
                <span>Rate: {v.max_rate_per_min}/min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
