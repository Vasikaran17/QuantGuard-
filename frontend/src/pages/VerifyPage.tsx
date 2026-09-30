import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCheck2, 
  UploadCloud, 
  Copy, 
  Download, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Fingerprint, 
  Cpu, 
  RotateCcw, 
  Layers, 
  Sliders, 
  FileText,
  AlertCircle,
  Sparkles,
  Info,
  Clock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { useVerification } from '../context/VerificationContext';
import { 
  VerificationInput, 
  DetailedVerificationResult, 
  QuantumStateSymbol, 
  MeasurementBasisType, 
  AuthorizationStatusType 
} from '../types';
import { generateDemoScenario } from '../services/quantumEngine';

export const VerifyPage: React.FC = () => {
  const { isDemoMode } = useMode();
  const { 
    settings, 
    updateSettings, 
    runVerificationAction, 
    latestResult, 
    history 
  } = useVerification();

  // Form State
  const [requestId, setRequestId] = useState('');
  const [senderIdentity, setSenderIdentity] = useState('');
  const [claimedIdentity, setClaimedIdentity] = useState('');
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatusType>('AUTHORIZED');
  const [quantumState, setQuantumState] = useState<QuantumStateSymbol>('|0⟩');
  const [measurementBasis, setMeasurementBasis] = useState<MeasurementBasisType>('Z');
  const [nonce, setNonce] = useState('');
  const [measurementSamples, setMeasurementSamples] = useState(16);
  const [expectedPattern, setExpectedPattern] = useState('0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 0');
  const [observedPattern, setObservedPattern] = useState('0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 0');
  const [statisticalThreshold, setStatisticalThreshold] = useState(settings.statisticalThreshold || 20);
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidenceThreshold || 85);

  // File Upload State
  const [fileName, setFileName] = useState('MOD_Tactical_Order_904.sig');
  const [fileType, setFileType] = useState('application/octet-stream');
  const [fileSize, setFileSize] = useState(1450);
  const [uploadTime, setUploadTime] = useState(new Date().toLocaleTimeString());
  const [fileContent, setFileContent] = useState('');
  const [fileStatus, setFileStatus] = useState<'READY FOR ANALYSIS' | 'ANALYSIS COMPLETE'>('READY FOR ANALYSIS');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string>('NORMAL');
  const [isVerifying, setIsVerifying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync settings when changed in Settings tab
  useEffect(() => {
    setStatisticalThreshold(settings.statisticalThreshold);
    setConfidenceThreshold(settings.confidenceThreshold);
  }, [settings]);

  // When DEMO MODE changes:
  useEffect(() => {
    if (isDemoMode) {
      loadScenario('NORMAL');
    } else {
      // In Live Mode, fields are empty by default
      resetToLiveMode();
    }
  }, [isDemoMode]);

  const resetToLiveMode = () => {
    setRequestId('');
    setSenderIdentity('');
    setClaimedIdentity('');
    setAuthorizationStatus('AUTHORIZED');
    setQuantumState('|0⟩');
    setMeasurementBasis('Z');
    setNonce('');
    setMeasurementSamples(16);
    setExpectedPattern('');
    setObservedPattern('');
    setFileName('');
    setFileContent('');
    setFileSize(0);
    setFileType('');
    setFileStatus('READY FOR ANALYSIS');
  };

  const loadScenario = (scenario: 'NORMAL' | 'FORGERY' | 'IMPERSONATION' | 'REPLAY' | 'UNAUTHORIZED') => {
    setActiveScenario(scenario);
    const demoData = generateDemoScenario(scenario, history);
    
    setRequestId(demoData.requestId);
    setSenderIdentity(demoData.senderIdentity);
    setClaimedIdentity(demoData.claimedIdentity);
    setAuthorizationStatus(demoData.authorizationStatus);
    setQuantumState(demoData.quantumState);
    setMeasurementBasis(demoData.measurementBasis);
    setNonce(demoData.nonce);
    setMeasurementSamples(demoData.measurementSamples);
    setExpectedPattern(demoData.expectedPattern);
    setObservedPattern(demoData.observedPattern);
    setFileName(demoData.fileName || 'quantum_signature.sig');
    setFileContent(demoData.fileContent || '');
    setFileSize(demoData.fileSize || 1200);
    setFileType(demoData.fileType || 'application/json');
    setUploadTime(demoData.uploadTime || new Date().toLocaleTimeString());
    setFileStatus('READY FOR ANALYSIS');
  };

  // Handle Drag & Drop / File Upload
  const handleFileSelect = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type || 'text/plain');
    setUploadTime(new Date().toLocaleTimeString());
    setFileStatus('READY FOR ANALYSIS');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);

      // Attempt parsing if JSON to auto-populate fields
      try {
        const parsed = JSON.parse(content);
        if (parsed.requestId) setRequestId(parsed.requestId);
        if (parsed.senderIdentity) setSenderIdentity(parsed.senderIdentity);
        if (parsed.claimedIdentity) setClaimedIdentity(parsed.claimedIdentity);
        if (parsed.nonce) setNonce(parsed.nonce);
        if (parsed.expectedPattern) setExpectedPattern(parsed.expectedPattern);
        if (parsed.observedPattern) setObservedPattern(parsed.observedPattern);
        if (parsed.quantumState) setQuantumState(parsed.quantumState);
        if (parsed.authorizationStatus) setAuthorizationStatus(parsed.authorizationStatus);
      } catch (err) {
        // Plain text fallback - keep raw content preview
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Run Verification
  const handleRunVerification = () => {
    setIsVerifying(true);

    const inputData: VerificationInput = {
      requestId: requestId || `REQ-LIVE-${Date.now().toString().slice(-6)}`,
      senderIdentity: senderIdentity || 'ANONYMOUS-NODE',
      claimedIdentity: claimedIdentity || senderIdentity || 'ANONYMOUS-NODE',
      authorizationStatus,
      quantumState,
      measurementBasis,
      nonce: nonce || `NONCE-AUTO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      measurementSamples: measurementSamples || 16,
      expectedPattern: expectedPattern || '0 1 0 1 0 1 0 1',
      observedPattern: observedPattern || expectedPattern || '0 1 0 1 0 1 0 1',
      statisticalThreshold,
      confidenceThreshold,
      fileName: fileName || 'quantum_signature.sig',
      fileContent,
      fileSize,
      fileType,
      uploadTime
    };

    setTimeout(() => {
      runVerificationAction(inputData);
      setFileStatus('ANALYSIS COMPLETE');
      setIsVerifying(false);
    }, 280);
  };

  const copyContentToClipboard = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSignatureFile = () => {
    if (!fileContent) return;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'quantum_signature.sig';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner based on Global Demo Mode state */}
      {isDemoMode ? (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-center justify-between text-xs text-cyan-200 shadow-sm shadow-cyan-950/20">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <strong className="font-semibold text-white">Demo Mode Active</strong> — Test values are being generated for demonstration.
              <span className="block text-[11px] text-cyan-300/80">Select any scenario below to populate realistic test telemetry and modify them freely.</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-semibold shrink-0">
            DEMO / TEST DATA
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between text-xs text-slate-300 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded bg-slate-800 text-slate-300">
              <Info className="w-4 h-4" />
            </span>
            <div>
              <strong className="font-semibold text-white">Live Verification Mode</strong> — Enter verification data manually or upload an authentic signature payload.
              <span className="block text-[11px] text-slate-400">Local prototype verification workflow. Fields are unpopulated by default.</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-semibold shrink-0">
            MANUAL / LIVE INGEST
          </span>
        </div>
      )}

      {/* DEMO SCENARIO SELECTOR (Visible when DEMO MODE = ON) */}
      {isDemoMode && (
        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              TEST SCENARIOS (DEMO DATA GENERATOR)
            </span>
            <span className="text-[11px] text-slate-400">
              Click any scenario to simulate dynamic quantum attacks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {[
              { id: 'NORMAL', label: 'Normal Verification', desc: 'Valid State, Nominal Noise', color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
              { id: 'FORGERY', label: 'Signature Forgery', desc: 'Adversary Eve, High QBER', color: 'hover:border-rose-500/50 hover:bg-rose-500/10' },
              { id: 'IMPERSONATION', label: 'Impersonation', desc: 'Identity Misalignment', color: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
              { id: 'REPLAY', label: 'Replay Attack', desc: 'Duplicate Nonce Collision', color: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
              { id: 'UNAUTHORIZED', label: 'Unauthorized Request', desc: 'Invalid Clearance Token', color: 'hover:border-sky-500/50 hover:bg-sky-500/10' },
            ].map((sc) => {
              const isActive = activeScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => loadScenario(sc.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm shadow-cyan-500/20' 
                      : `bg-[#0A0E17] border-[#1E293B] text-slate-300 ${sc.color}`
                  }`}
                >
                  <div className="font-semibold text-xs leading-snug">{sc.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{sc.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================
            LEFT COLUMN — VERIFICATION INPUT & CONTROLS (5 cols)
            ======================================================== */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Quantum Signature Verification</h2>
                  <p className="text-[11px] text-slate-400">Teleportation QDS protocol inspection gate</p>
                </div>
              </div>
              {isDemoMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Demo/Test Data
                </span>
              )}
            </div>

            {/* SECTION 1: REQUEST INFORMATION */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3" />
                REQUEST INFORMATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Request ID</label>
                  <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    placeholder="REQ-2026-XXXX"
                    className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Authorization Status</label>
                  <select
                    value={authorizationStatus}
                    onChange={(e) => setAuthorizationStatus(e.target.value as AuthorizationStatusType)}
                    className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="AUTHORIZED">AUTHORIZED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="UNAUTHORIZED">UNAUTHORIZED</option>
                    <option value="REVOKED">REVOKED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Sender Identity</label>
                  <input
                    type="text"
                    value={senderIdentity}
                    onChange={(e) => setSenderIdentity(e.target.value)}
                    placeholder="ALICE-QDS-NODE-01"
                    className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Claimed Identity</label>
                  <input
                    type="text"
                    value={claimedIdentity}
                    onChange={(e) => setClaimedIdentity(e.target.value)}
                    placeholder="ALICE-QDS-NODE-01"
                    className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: QUANTUM SIGNATURE DATA */}
            <div className="space-y-3 pt-2 border-t border-[#1E293B]">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3" />
                QUANTUM SIGNATURE DATA
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Quantum State</label>
                  <select
                    value={quantumState}
                    onChange={(e) => setQuantumState(e.target.value as QuantumStateSymbol)}
                    className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="|0⟩">|0⟩ (Computational 0)</option>
                    <option value="|1⟩">|1⟩ (Computational 1)</option>
                    <option value="|+⟩">|+⟩ (Hadamard +)</option>
                    <option value="|−⟩">|−⟩ (Hadamard -)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Measurement Basis</label>
                  <select
                    value={measurementBasis}
                    onChange={(e) => setMeasurementBasis(e.target.value as MeasurementBasisType)}
                    className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Z">Z Basis (Computational)</option>
                    <option value="X">X Basis (Hadamard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Nonce (Freshness / Replay Token)
                </label>
                <input
                  type="text"
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  placeholder="NONCE-QDS-XXXX"
                  className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Expected Measurement Pattern (Binary Stream)
                </label>
                <input
                  type="text"
                  value={expectedPattern}
                  onChange={(e) => setExpectedPattern(e.target.value)}
                  placeholder="0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 0"
                  className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Observed Measurement Pattern (Receiver Tomography)
                </label>
                <input
                  type="text"
                  value={observedPattern}
                  onChange={(e) => setObservedPattern(e.target.value)}
                  placeholder="0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 0"
                  className="w-full px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 tracking-wider"
                />
              </div>
            </div>

            {/* SECTION 3: VERIFICATION SETTINGS */}
            <div className="space-y-3 pt-2 border-t border-[#1E293B]">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <Sliders className="w-3 h-3" />
                VERIFICATION SETTINGS
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                    <span>Statistical Threshold:</span>
                    <span className="font-mono text-amber-400 font-bold">{statisticalThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={statisticalThreshold}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStatisticalThreshold(val);
                      updateSettings({ statisticalThreshold: val });
                    }}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Default: 20% (Cutoff for Forgery)</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                    <span>Confidence Cutoff:</span>
                    <span className="font-mono text-cyan-400 font-bold">{confidenceThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    step="1"
                    value={confidenceThreshold}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setConfidenceThreshold(val);
                      updateSettings({ confidenceThreshold: val });
                    }}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Target confidence level</span>
                </div>
              </div>
            </div>

            {/* RUN BUTTON */}
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileCheck2 className="w-4 h-4" />
              )}
              <span>RUN QUANTUM VERIFICATION</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN — SIGNATURE FILE + EVIDENCE + RESULT (7 cols)
            Occupies significant screen space as strictly required!
            ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. SIGNATURE FILE UPLOAD & METADATA SECTION */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Upload Digital Signature
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Formats: .json, .txt, .sig, .dat
              </span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-[#1E293B] hover:border-cyan-500/50 hover:bg-[#0A0E17]/80 bg-[#0A0E17]/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,.sig,.dat"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-8 h-8 mx-auto mb-2 text-cyan-400/80" />
              <div className="text-xs font-semibold text-slate-200">
                Upload Signature File
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Drag & Drop or <span className="text-cyan-400 underline font-medium">Browse from Computer</span>
              </p>
            </div>

            {/* Metadata Bar */}
            {fileName && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">File Name</span>
                  <span className="font-mono text-slate-200 font-semibold truncate block" title={fileName}>
                    {fileName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">File Size</span>
                  <span className="font-mono text-slate-200">{(fileSize / 1024).toFixed(2)} KB</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Upload Time</span>
                  <span className="font-mono text-slate-200">{uploadTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">File Status</span>
                  <span className={`font-mono font-bold text-[11px] ${fileStatus === 'ANALYSIS COMPLETE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {fileStatus}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. FULL FILE PREVIEW / EVIDENCE PANEL */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  SIGNATURE FILE CONTENT & FULL PREVIEW
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyContentToClipboard}
                  disabled={!fileContent}
                  className="px-2.5 py-1 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Copy full content"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={downloadSignatureFile}
                  disabled={!fileContent}
                  className="px-2.5 py-1 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Download signature file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Scrollable code viewer with line numbers */}
            <div className="relative rounded-xl bg-[#070A12] border border-[#1E293B] overflow-hidden">
              <div className="max-h-72 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
                {fileContent ? (
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-cyan-200/90">
                    {fileContent}
                  </pre>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No signature file loaded yet.</p>
                    <p className="text-[11px] mt-0.5">Select a Demo scenario or upload a file above to inspect raw contents.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. SIGNATURE EVIDENCE PANEL */}
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  SIGNATURE EVIDENCE
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Live State Assessment
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">File</span>
                <span className="font-mono text-white font-semibold truncate block">
                  {latestResult?.fileName || fileName || 'quantum_signature.sig'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Integrity</span>
                <span className={`font-mono font-bold ${
                  latestResult?.integrityStatus === 'VALID' ? 'text-emerald-400' :
                  latestResult?.integrityStatus === 'INVALID' ? 'text-rose-400' : 'text-slate-400'
                }`}>
                  {latestResult?.integrityStatus || 'NOT CHECKED'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Identity</span>
                <span className={`font-mono font-bold ${
                  latestResult?.identityConsistency === 'MATCH' ? 'text-emerald-400' :
                  latestResult?.identityConsistency === 'MISMATCH' ? 'text-rose-400' : 'text-slate-400'
                }`}>
                  {latestResult?.identityConsistency || (senderIdentity === claimedIdentity && senderIdentity ? 'MATCH' : 'MISMATCH')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Quantum State</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {latestResult?.quantumState || quantumState}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Measurement Basis</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {latestResult?.measurementBasis || measurementBasis} Basis
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Nonce Validity</span>
                <span className={`font-mono font-bold ${
                  latestResult?.nonceValidity === 'Unique' ? 'text-emerald-400' :
                  latestResult?.nonceValidity === 'Reused' ? 'text-purple-400' : 'text-slate-400'
                }`}>
                  {latestResult?.nonceValidity || 'Unique'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Measurement</span>
                <span className={`font-mono font-bold ${
                  latestResult?.measurementConsistency === 'PASS' ? 'text-emerald-400' :
                  latestResult?.measurementConsistency === 'FAIL' ? 'text-rose-400' : 'text-slate-400'
                }`}>
                  {latestResult?.measurementConsistency || 'PASS'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Decision Boundary</span>
                <span className="font-mono text-amber-400 font-bold">
                  {latestResult?.statisticalThreshold || statisticalThreshold}%
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B]">
              <span className="text-xs text-slate-300 font-medium">Threat Assessment:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                latestResult?.threatAssessment === 'SAFE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                latestResult?.threatAssessment === 'SUSPICIOUS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {latestResult?.threatAssessment || 'SAFE'}
              </span>
            </div>
          </div>

          {/* 4. VERIFICATION RESULT PANEL (Prominent Detailed Card) */}
          {latestResult && (
            <div className={`p-6 rounded-2xl border shadow-2xl space-y-5 transition-all ${
              latestResult.status === 'VERIFIED'
                ? 'bg-gradient-to-b from-[#0F172A] to-[#0A1628] border-emerald-500/40'
                : 'bg-gradient-to-b from-[#1A1016] to-[#0F172A] border-rose-500/40'
            }`}>
              {/* Verdict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    latestResult.status === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {latestResult.status === 'VERIFIED' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                      VERIFICATION DECISION
                    </span>
                    <h2 className={`text-xl font-bold tracking-tight font-mono ${
                      latestResult.status === 'VERIFIED' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {latestResult.status}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Classified Threat:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    latestResult.threatType === 'None'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : 'bg-rose-950/60 text-rose-300 border-rose-800'
                  }`}>
                    {latestResult.threatType.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0A0E17]/80 border border-[#1E293B]">
                  <span className="text-[10px] text-slate-400 uppercase block">Measurement Mismatch</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={`text-base font-mono font-bold ${
                      latestResult.mismatchRate > latestResult.statisticalThreshold ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {latestResult.mismatchRate}%
                    </span>
                    <span className="text-[10px] text-slate-400">/ {latestResult.statisticalThreshold}% Cutoff</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0E17]/80 border border-[#1E293B]">
                  <span className="text-[10px] text-slate-400 uppercase block">Attack Probability</span>
                  <span className={`text-base font-mono font-bold mt-0.5 block ${
                    latestResult.attackProbability > 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {latestResult.attackProbability}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0E17]/80 border border-[#1E293B]">
                  <span className="text-[10px] text-slate-400 uppercase block">Detection Confidence</span>
                  <span className="text-base font-mono font-bold text-cyan-400 mt-0.5 block">
                    {latestResult.attackConfidence}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0E17]/80 border border-[#1E293B]">
                  <span className="text-[10px] text-slate-400 uppercase block">Quantum Threat Score</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-base font-mono font-bold text-white">
                      {latestResult.quantumThreatScore}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      latestResult.threatRiskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                      latestResult.threatRiskLevel === 'HIGH' ? 'bg-amber-950 text-amber-300' :
                      latestResult.threatRiskLevel === 'MEDIUM' ? 'bg-yellow-950 text-yellow-300' :
                      'bg-emerald-950 text-emerald-300'
                    }`}>
                      {latestResult.threatRiskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantum Pattern Comparison with Visual Mismatch Highlighting */}
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Pauli Bitstream Tomography & Mismatch Inspection</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Mismatches: <strong className="text-rose-400">{latestResult.mismatchCount}</strong> / {latestResult.totalMeasurements} bits
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {/* Expected row */}
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[10px] text-slate-400 shrink-0">Expected:</span>
                    <div className="flex flex-wrap gap-1">
                      {latestResult.patternComparison.map((bit) => (
                        <span
                          key={`exp-${bit.index}`}
                          className="w-5 h-6 rounded flex items-center justify-center bg-[#1E293B] text-slate-300 font-bold text-[11px]"
                        >
                          {bit.expected}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Observed row with highlights */}
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[10px] text-slate-400 shrink-0">Observed:</span>
                    <div className="flex flex-wrap gap-1">
                      {latestResult.patternComparison.map((bit) => (
                        <span
                          key={`obs-${bit.index}`}
                          className={`w-5 h-6 rounded flex items-center justify-center font-bold text-[11px] transition-transform ${
                            bit.isMismatch
                              ? 'bg-rose-600 text-white shadow-xs shadow-rose-500 scale-105 ring-1 ring-rose-400'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                          }`}
                          title={`Position ${bit.index}: Expected ${bit.expected}, Observed ${bit.observed}`}
                        >
                          {bit.observed}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-900 border border-emerald-600"></span>
                    Matching Basis Measurement
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600"></span>
                    Observed Mismatch / Quantum Disturbance
                  </span>
                </div>
              </div>

              {/* WHY THIS DECISION? Dynamic Explanation Box */}
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E293B] space-y-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  WHY THIS DECISION?
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {latestResult.whyDecision}
                </p>
              </div>

              {/* PAULI / QUANTUM REPRESENTATION CARD */}
              <div className="p-4 rounded-xl bg-[#0A0E17]/80 border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Cpu className="w-3.5 h-3.5" />
                    Pauli Complementarity State Representation
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Conceptual Quantum Layer</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B]">
                    <span className="text-cyan-400 font-bold">|0⟩</span> → Z-basis eigenstate
                  </div>
                  <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B]">
                    <span className="text-cyan-400 font-bold">|1⟩</span> → Z-basis eigenstate
                  </div>
                  <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B]">
                    <span className="text-cyan-400 font-bold">|+⟩</span> → X-basis eigenstate
                  </div>
                  <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B]">
                    <span className="text-cyan-400 font-bold">|−⟩</span> → X-basis eigenstate
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  * Quantum-inspired mathematical model executing locally; represents teleportation channel collapse under unauthorized measurement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
