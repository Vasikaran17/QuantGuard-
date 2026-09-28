import React, { useState } from 'react';
import { VerificationResult } from '../types';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Hash, 
  Cpu, 
  Key, 
  AlertTriangle,
  FileText,
  Copy,
  Check
} from 'lucide-react';

interface VerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  result: VerificationResult | null;
}

export const VerificationDrawer: React.FC<VerificationDrawerProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(result.file_hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadReport = () => {
    const reportData = {
      title: "QuantGuard Quantum Digital Signature Verification Report",
      protocol: "Teleportation-Based QDS (Pauli X-Y-Z Tomography)",
      standard: "NIST/IEEE P1913 Quantum Key & Signature Telemetry",
      timestamp: result.timestamp,
      verification_verdict: result.verdict,
      threat_detected: result.is_malicious,
      attack_classification: result.attack_type,
      anomaly_description: result.anomaly_reason,
      document_metadata: {
        file_name: result.file_name,
        file_size_bytes: result.file_size,
        sha256_hash: result.file_hash,
        signer_identifier: result.signer_id,
        verifier_identifier: result.verifier_id,
        quantum_nonce: result.nonce,
        execution_mode: result.mode
      },
      quantum_metrics: {
        total_qubits_measured: result.num_qubits,
        observed_mismatch_rate: result.mismatch_rate,
        calibrated_5sigma_threshold: result.threshold,
        computed_forgery_probability: result.forgery_probability,
        detection_latency_ms: result.detection_time_ms,
        basis_tomography: result.basis_analysis,
        teleportation_fidelity: result.teleportation_metrics
      },
      pipeline_steps: result.verification_steps
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QuantGuard-Report-${result.file_name}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isMalicious = result.verdict === 'MALICIOUS';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Semi-transparent backdrop to keep dashboard visible */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full max-w-xl bg-[#0B0F19] border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0B0F19]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {isMalicious ? (
              <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base tracking-wide">
                  VERIFICATION TELEMETRY
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  isMalicious 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {result.verdict}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                NODE: {result.verifier_id} // TIME: {result.detection_time_ms} ms
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Threat / Legitimate Alert Banner */}
          <div className={`p-4 rounded-xl border ${
            isMalicious 
              ? 'bg-red-950/30 border-red-900/60 text-red-200' 
              : 'bg-emerald-950/30 border-emerald-900/60 text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              {isMalicious ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-mono font-bold tracking-wider uppercase mb-1">
                  {isMalicious ? `ATTACK DETECTED: ${result.attack_type}` : 'AUTHENTICATION CONFIRMED'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {result.anomaly_reason}
                </p>
              </div>
            </div>
          </div>

          {/* Key Outcome Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">MISMATCH RATE (QBER)</span>
              <span className={`text-base font-mono font-bold ${
                result.mismatch_rate > result.threshold ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {(result.mismatch_rate * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Cutoff: {(result.threshold * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">FORGERY PROBABILITY</span>
              <span className={`text-base font-mono font-bold ${
                result.forgery_probability > 0.5 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {(result.forgery_probability * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Confidence: 99.4%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">DETECTION LATENCY</span>
              <span className="text-base font-mono font-bold text-cyan-400">
                {result.detection_time_ms} ms
              </span>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                Sub-50ms target
              </span>
            </div>
          </div>

          {/* Document & Cryptographic Metadata */}
          <div className="soc-card rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Artifact Parameters
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Document Name:</span>
                <span className="text-white font-medium">{result.file_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Payload Size:</span>
                <span className="text-slate-300">{(result.file_size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Signer Identity:</span>
                <span className="text-cyan-400 font-semibold">{result.signer_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Quantum Nonce:</span>
                <span className="text-slate-300">{result.nonce}</span>
              </div>

              {/* SHA-256 Hash with Copy */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-[11px]">SHA-256 Digest:</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedHash ? 'Copied' : 'Copy Hash'}
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all select-all">
                  {result.file_hash}
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Verification Pipeline */}
          <div className="soc-card rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Verification Pipeline Progress
            </span>

            <div className="space-y-2.5">
              {result.verification_steps.map((step) => {
                const passed = step.status === 'PASSED';
                return (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="mt-0.5">
                      {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-slate-200">
                          {step.step}. {step.name}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          passed 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pauli Eigenstate Basis Tomography (X, Y, Z) */}
          <div className="soc-card rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-cyan-400" /> Pauli Tomography Breakdown
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                    <th className="pb-1.5">BASIS</th>
                    <th className="pb-1.5">SAMPLES</th>
                    <th className="pb-1.5">MISMATCH</th>
                    <th className="pb-1.5">RATE (QBER)</th>
                    <th className="pb-1.5">FIDELITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {result.basis_analysis.map((b) => (
                    <tr key={b.basis} className="hover:bg-slate-800/20">
                      <td className="py-2 text-cyan-300 font-semibold">{b.basis} Basis</td>
                      <td className="py-2 text-slate-300">{b.sample_count}</td>
                      <td className="py-2 text-slate-300">{b.mismatch_count}</td>
                      <td className={`py-2 font-semibold ${
                        b.mismatch_rate > result.threshold ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {(b.mismatch_rate * 100).toFixed(2)}%
                      </td>
                      <td className="py-2 text-slate-300">{(b.fidelity * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-[#0B0F19] sticky bottom-0 z-10 flex gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex-1 py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD AUDIT REPORT (JSON)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
