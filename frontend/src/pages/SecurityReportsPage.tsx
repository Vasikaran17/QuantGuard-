import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

export const SecurityReportsPage: React.FC = () => {
  const { dashboardStats, history, settings } = useVerification();
  const [reportGeneratedTime, setReportGeneratedTime] = useState<string | null>(null);

  const threatDetectionRate = dashboardStats.totalRequests > 0
    ? Number(((dashboardStats.threatsCount / dashboardStats.totalRequests) * 100).toFixed(1))
    : 0;

  const handleGenerateReport = () => {
    const now = new Date().toLocaleString();
    setReportGeneratedTime(now);

    const reportData = {
      reportTitle: "QuantGuard Quantum Digital Signature Security Analysis Report",
      generatedAt: now,
      summary: {
        totalRequests: dashboardStats.totalRequests,
        verifiedRequests: dashboardStats.verifiedCount,
        threatsDetected: dashboardStats.threatsCount,
        threatDetectionRate: `${threatDetectionRate}%`,
        averageConfidence: `${dashboardStats.avgConfidence}%`,
        averageMismatchRate: `${dashboardStats.avgMismatchRate}%`,
        quantumThreatScore: dashboardStats.quantumThreatScore,
        riskLevel: dashboardStats.threatRiskLevel,
      },
      decisionGate: {
        statisticalThreshold: `${settings.statisticalThreshold}%`,
        confidenceThreshold: `${settings.confidenceThreshold}%`,
        replayWindowSeconds: `${settings.replayWindowSeconds}s`,
      },
      threatBreakdown: dashboardStats.attackBreakdown,
      detectionMethods: [
        "1. Quantum measurement analysis (Pauli basis wave-function collapse)",
        "2. Statistical threshold comparison (5-sigma calibrated boundary)",
        "3. Identity consistency verification (Sender vs Claimed public basis key)",
        "4. Nonce replay validation (Temporal Vault collision detection)",
        "5. Authorization validation (Cryptographic clearance Level-5 check)",
        "6. Attack probability estimation (Bayesian noise divergence modeling)"
      ],
      recentIncidents: history.slice(0, 10).map((h) => ({
        requestId: h.requestId,
        timestamp: h.timestamp,
        threatType: h.threatType,
        mismatchRate: `${h.mismatchRate}%`,
        status: h.status
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `QuantGuard_Security_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FileText className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Security Analysis & Compliance Report
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive threat assessment certificate generated from active verification telemetry
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-600/25 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>GENERATE SECURITY REPORT</span>
        </button>
      </div>

      {reportGeneratedTime && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Evidentiary Security Report generated and downloaded successfully at {reportGeneratedTime}!
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
            CERTIFIED COMPLIANT
          </span>
        </div>
      )}

      {/* EXECUTIVE REPORT PREVIEW CARD */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-2">
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 block">
              OFFICIAL PROTOCOL ASSESSMENT
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              QuantGuard Teleportation-QDS Defense Summary
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 block">Clearance Level: Top-Secret-QDS-Level-5</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">SHA-256 State Anchored</span>
          </div>
        </div>

        {/* 6 Core Statistical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Total Requests</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {dashboardStats.totalRequests}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Verified Requests</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {dashboardStats.verifiedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Threats Detected</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
              {dashboardStats.threatsCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Detection Rate</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              {threatDetectionRate}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Avg Confidence</span>
            <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
              {dashboardStats.avgConfidence}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Avg Mismatch Rate</span>
            <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">
              {dashboardStats.avgMismatchRate}%
            </span>
          </div>
        </div>

        {/* Threat Breakdown Grid */}
        <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
            Adversarial Threat Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <span className="text-slate-400">Signature Forgery:</span>
              <span className="font-mono font-bold text-rose-400">{dashboardStats.attackBreakdown.SIGNATURE_FORGERY}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <span className="text-slate-400">Signer Impersonation:</span>
              <span className="font-mono font-bold text-amber-400">{dashboardStats.attackBreakdown.IMPERSONATION}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <span className="text-slate-400">Replay Attack:</span>
              <span className="font-mono font-bold text-purple-400">{dashboardStats.attackBreakdown.REPLAY_ATTACK}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <span className="text-slate-400">Unauthorized Verifier:</span>
              <span className="font-mono font-bold text-sky-400">{dashboardStats.attackBreakdown.UNAUTHORIZED_VERIFIER}</span>
            </div>
          </div>
        </div>

        {/* 6 Formal Detection Methods */}
        <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
            Approved Quantum-Inspired Detection Methods
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
              <strong className="text-white">1. Quantum Measurement Analysis</strong>
              <p className="text-[11px] text-slate-400">
                Pauli basis ($X, Z$) tomography detecting wave-function collapse induced by adversarial eavesdropping.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
              <strong className="text-white">2. Statistical Threshold Comparison</strong>
              <p className="text-[11px] text-slate-400">
                Calibrated decision boundary ({settings.statisticalThreshold}%) separating nominal teleportation channel noise from attack disturbances.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
              <strong className="text-white">3. Identity Consistency Verification</strong>
              <p className="text-[11px] text-slate-400">
                Cryptographic basis alignment verifying that sender identity matches claimed entity with registered public keys.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
              <strong className="text-white">4. Nonce Replay Validation</strong>
              <p className="text-[11px] text-slate-400">
                Temporal Nonce Vault tracking used session tokens to prevent re-transmission of previously verified quantum states.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
              <strong className="text-white">5. Authorization Status Validation</strong>
              <p className="text-[11px] text-slate-400">
                Clearance token inspection rejecting unauthorized rogue gateways before quantum measurement projection.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
              <strong className="text-white">6. Attack Probability Estimation</strong>
              <p className="text-[11px] text-slate-400">
                Multi-parameter Bayesian probability estimation combining mismatch rate, identity alignment, and nonce uniqueness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
