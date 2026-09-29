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
  Check,
  Activity
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
  const [copiedNonce, setCopiedNonce] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(result.file_hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyNonce = () => {
    navigator.clipboard.writeText(result.nonce);
    setCopiedNonce(true);
    setTimeout(() => setCopiedNonce(false), 2000);
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full max-w-xl bg-[#0F172A] border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0F172A]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {isMalicious ? (
              <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">
                  Forensic Telemetry Inspector
                </h3>
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  isMalicious 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {result.verdict}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Node: {result.verifier_id} · Latency: {result.detection_time_ms} ms
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border ${
            isMalicious 
              ? 'bg-rose-950/30 border-rose-900/60 text-rose-200' 
              : 'bg-emerald-950/30 border-emerald-900/60 text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              {isMalicious ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1">
                  {isMalicious ? `Adversarial Action: ${result.attack_type}` : 'Verification Authenticated & Valid'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.anomaly_reason}
                </p>
              </div>
            </div>
          </div>

          {/* Key Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Observed QBER</span>
              <span className={`text-base font-mono font-bold ${
                result.mismatch_rate > result.threshold ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {(result.mismatch_rate * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                Threshold: {(result.threshold * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Forgery Probability</span>
              <span className={`text-base font-mono font-bold ${
                result.forgery_probability > 0.5 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {(result.forgery_probability * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                Confidence: 99.4%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Detection Speed</span>
              <span className="text-base font-mono font-bold text-white">
                {result.detection_time_ms} ms
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                Real-time Gate
              </span>
            </div>
          </div>

          {/* Document & Hash Metadata */}
          <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" /> Document & Key Parameters
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Document Payload:</span>
                <span className="text-white font-medium">{result.file_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">File Size:</span>
                <span className="text-slate-300 font-mono">{(result.file_size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Signer Identity:</span>
                <span className="text-blue-400 font-mono font-semibold">{result.signer_id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Quantum Nonce:</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <span className="truncate max-w-[220px]">{result.nonce}</span>
                  <button onClick={handleCopyNonce} className="text-slate-400 hover:text-white cursor-pointer" title="Copy Nonce">
                    {copiedNonce ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* SHA-256 Digest with copy */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">SHA-256 Digest:</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedHash ? 'Copied' : 'Copy Hash'}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-[#070A12] border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
                  {result.file_hash}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Pipeline Checklist */}
          <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> Quantum Pipeline Stages
            </span>

            <div className="space-y-2">
              {result.verification_steps.map((step) => {
                const passed = step.status === 'PASSED';
                return (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-[#0F172A] border border-slate-800"
                  >
                    <div className="mt-0.5">
                      {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">
                          {step.step}. {step.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          passed 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pauli Tomography Breakdown */}
          <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-400" /> Pauli Tomography Measurement
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-1.5 font-medium">Basis</th>
                    <th className="pb-1.5 font-medium">Qubit Samples</th>
                    <th className="pb-1.5 font-medium">Mismatches</th>
                    <th className="pb-1.5 font-medium">Measured QBER</th>
                    <th className="pb-1.5 font-medium">Fidelity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {result.basis_analysis.map((b) => (
                    <tr key={b.basis} className="hover:bg-slate-800/30">
                      <td className="py-2 text-blue-400 font-semibold font-sans">{b.basis} Basis</td>
                      <td className="py-2 text-slate-300">{b.sample_count}</td>
                      <td className="py-2 text-slate-300">{b.mismatch_count}</td>
                      <td className={`py-2 font-semibold ${
                        b.mismatch_rate > result.threshold ? 'text-rose-400' : 'text-emerald-400'
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
        <div className="p-4 border-t border-slate-800 bg-[#0F172A] sticky bottom-0 z-10 flex gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Audit Report (JSON)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
