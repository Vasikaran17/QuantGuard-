import React, { useState, useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';
import { 
  FileCheck2, 
  UploadCloud, 
  PlayCircle, 
  ShieldCheck, 
  ShieldAlert, 
  FilePlus, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Hash,
  Lock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { DemoScenario, VerificationResult } from '../types';
import { 
  getDemoScenariosApi, 
  verifyDemoApi, 
  verifyFileApi, 
  registerSignatureApi,
  getVerifiersApi 
} from '../services/api';

interface VerifyPageProps {
  onOpenDrawer: (result: VerificationResult) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ onOpenDrawer }) => {
  const { isDemoMode, toggleDemoMode } = useMode();
  
  // Demo Mode state
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('LEGITIMATE');
  const [verifiers, setVerifiers] = useState<any[]>([]);
  const [selectedVerifier, setSelectedVerifier] = useState<string>('VERIFIER-BOB-DEF-01');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Mode state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signerId, setSignerId] = useState<string>('ALICE-QDS-ROOT-01');
  const [customNonce, setCustomNonce] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Register signature tab
  const [activeTab, setActiveTab] = useState<'VERIFY' | 'REGISTER'>('VERIFY');
  const [regFile, setRegFile] = useState<File | null>(null);
  const [regSignerId, setRegSignerId] = useState<string>('ALICE-QDS-ROOT-01');
  const [regDescription, setRegDescription] = useState<string>('Enrolled reference contract');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const regFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [scRes, verRes] = await Promise.all([
          getDemoScenariosApi(),
          getVerifiersApi(),
        ]);
        setScenarios(scRes.scenarios);
        setVerifiers(verRes.verifiers);
      } catch (err) {
        console.error('Failed to load verify configuration:', err);
      }
    }
    loadConfig();
  }, []);

  const currentScenarioObj = scenarios.find((s) => s.id === selectedScenario);

  // Handle Demo Verification
  const handleRunDemoVerification = async () => {
    setErrorMsg(null);
    setIsVerifying(true);
    try {
      const res = await verifyDemoApi(selectedScenario, selectedVerifier);
      onOpenDrawer(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo verification execution failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Live File Verification
  const handleRunLiveVerification = async () => {
    if (!uploadedFile) {
      setErrorMsg('Please select or drop a signature file to verify.');
      return;
    }
    setErrorMsg(null);
    setIsVerifying(true);
    try {
      const res = await verifyFileApi(uploadedFile, selectedVerifier, signerId, customNonce || undefined);
      onOpenDrawer(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'File verification execution failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle File Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Register Signature
  const handleRegisterSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFile) {
      setErrorMsg('Please provide a file to register as legitimate signature.');
      return;
    }
    setErrorMsg(null);
    setRegSuccess(null);
    setIsRegistering(true);
    try {
      const res = await registerSignatureApi(regFile, regSignerId, regDescription);
      setRegSuccess(`Successfully enrolled "${res.file_name}" into quantum registry (Doc ID: ${res.doc_id})`);
      setRegFile(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Quantum Signature Verification
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-600/15 text-blue-300 border border-blue-500/30">
              Tomography Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Conduct Pauli basis state reconstruction and evaluate against the 5σ statistical threshold
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs bg-[#0F172A] border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-slate-400">Mode:</span>
            {isDemoMode ? (
              <span className="text-blue-400 font-medium flex items-center gap-1">
                <PlayCircle className="w-3.5 h-3.5" /> Interactive Scenarios
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" /> Direct File Ingest
              </span>
            )}
          </div>

          <button
            onClick={toggleDemoMode}
            className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Switch to {isDemoMode ? 'Live File Ingest' : 'Demo Scenarios'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('VERIFY')}
          className={`pb-2.5 px-4 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'VERIFY'
              ? 'border-blue-500 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <span>Verification Workbench</span>
        </button>

        <button
          onClick={() => setActiveTab('REGISTER')}
          className={`pb-2.5 px-4 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'REGISTER'
              ? 'border-blue-500 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-blue-400" />
          <span>Enroll Reference Signature</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {regSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-2.5 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <span>{regSuccess}</span>
        </div>
      )}

      {activeTab === 'VERIFY' && (
        <>
          {/* DEMO MODE VIEW */}
          {isDemoMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Config (7 cols) */}
              <div className="lg:col-span-7 bg-[#0F172A] rounded-xl p-6 border border-slate-800 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <PlayCircle className="w-4 h-4 text-blue-400" />
                    <span>Select Test Scenario</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Preloaded Vectors
                  </span>
                </div>

                {/* Scenario Cards Grid */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2.5">
                    Operational Vector
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {scenarios.map((sc) => {
                      const isSelected = selectedScenario === sc.id;
                      const isLegit = sc.expected_verdict === 'LEGITIMATE';
                      return (
                        <div
                          key={sc.id}
                          onClick={() => setSelectedScenario(sc.id)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500/50 shadow-xs'
                              : 'bg-[#0B1120] border-slate-800 hover:border-slate-700 hover:bg-[#0E1528]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-white">
                              {sc.label}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              isLegit ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                            }`}>
                              {sc.expected_verdict}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {sc.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verifier Node Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Verifier Node
                  </label>
                  <select
                    value={selectedVerifier}
                    onChange={(e) => setSelectedVerifier(e.target.value)}
                    className="w-full p-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {verifiers.map((v) => (
                      <option key={v.verifier_id} value={v.verifier_id}>
                        {v.verifier_id} ({v.name}) — {v.clearance_level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scenario Details Preview */}
                {currentScenarioObj && (
                  <div className="p-4 rounded-lg bg-[#0B1120] border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                      <span>Selected Payload Information</span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        Target: {currentScenarioObj.sample_file}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {currentScenarioObj.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 font-mono">
                      <span>Signer: <strong className="text-blue-400">{currentScenarioObj.signer_id}</strong></span>
                      <span>Expected Outcome: <strong className={currentScenarioObj.expected_verdict === 'LEGITIMATE' ? 'text-emerald-400' : 'text-rose-400'}>{currentScenarioObj.expected_verdict}</strong></span>
                    </div>
                  </div>
                )}

                {/* Verification CTA */}
                <button
                  onClick={handleRunDemoVerification}
                  disabled={isVerifying}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Execute Quantum Verification</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Protocol Overview (5 cols) */}
              <div className="lg:col-span-5 bg-[#0F172A] rounded-xl p-6 border border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                  <Hash className="w-4 h-4 text-blue-400" /> Quantum Protocol Specifications
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Verification Standard</span>
                    <span className="text-white font-medium">Teleportation-Based QDS (Pauli X, Y, Z)</span>
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                      Eigenstate measurement across orthogonal and non-orthogonal bases to detect disturbance.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Calibrated 5σ Boundary</span>
                    <span className="text-amber-400 font-mono font-medium">0.1120 QBER</span>
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                      Mismatch rates above 0.1120 indicate quantum state collapse caused by measurement or interception.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Quantum No-Cloning Theorem</span>
                    <span className="text-emerald-400 font-medium">Information-Theoretic Security</span>
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                      An adversary cannot duplicate unknown quantum signature states without creating minimum 25% disturbance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LIVE FILE UPLOAD VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Upload Form (7 cols) */}
              <div className="lg:col-span-7 bg-[#0F172A] rounded-xl p-6 border border-slate-800 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>Ingest Signature File</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
                    Direct File Ingestion
                  </span>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-950/20'
                      : uploadedFile
                      ? 'border-emerald-500/60 bg-emerald-950/10'
                      : 'border-slate-700 hover:border-slate-600 bg-[#0B1120]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-medium text-white font-mono">
                        {uploadedFile.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'Signature payload'}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-xs text-rose-400 hover:underline cursor-pointer"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mx-auto">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-medium text-slate-200">
                        Drop signature payload or browse files
                      </div>
                      <p className="text-xs text-slate-400">
                        Accepts .sig, .txt, .pdf, .bin, .json, or encrypted quantum state tokens
                      </p>
                    </div>
                  )}
                </div>

                {/* Signer ID */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Claimed Signer Identity
                  </label>
                  <input
                    type="text"
                    value={signerId}
                    onChange={(e) => setSignerId(e.target.value)}
                    placeholder="ALICE-QDS-ROOT-01"
                    className="w-full p-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Verifier Terminal */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Verifier Terminal
                  </label>
                  <select
                    value={selectedVerifier}
                    onChange={(e) => setSelectedVerifier(e.target.value)}
                    className="w-full p-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {verifiers.map((v) => (
                      <option key={v.verifier_id} value={v.verifier_id}>
                        {v.verifier_id} ({v.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Custom Nonce */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Quantum Nonce (Optional)
                  </label>
                  <input
                    type="text"
                    value={customNonce}
                    onChange={(e) => setCustomNonce(e.target.value)}
                    placeholder="Leave empty for fresh cryptographic nonce generation"
                    className="w-full p-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  onClick={handleRunLiveVerification}
                  disabled={isVerifying || !uploadedFile}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Verify File Signature</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Ingestion Logic Info */}
              <div className="lg:col-span-5 bg-[#0F172A] rounded-xl p-6 border border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Teleportation Verification Pipeline
                </h3>

                <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800 space-y-1">
                    <strong className="text-slate-200">1. SHA-256 Digest Extraction</strong>
                    <p className="text-[11px]">
                      File bytes are hashed to derive the deterministic quantum seed binding document to signature state.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800 space-y-1">
                    <strong className="text-slate-200">2. Registry Benchmark</strong>
                    <p className="text-[11px]">
                      If the file has been enrolled via the "Enroll" tab, the signer basis aligns and verification passes with nominal noise (&lt; 0.05).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800 space-y-1">
                    <strong className="text-slate-200">3. Tamper & Forgery Detection</strong>
                    <p className="text-[11px]">
                      Modified payloads or forged states collapse into random basis measurements, tripping the 5σ threshold (&gt; 0.1120).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1120] border border-slate-800 space-y-1">
                    <strong className="text-slate-200">4. Nonce Freshness Check</strong>
                    <p className="text-[11px]">
                      Replayed nonces or unauthorized verifier terminals are rejected immediately prior to quantum measurement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ENROLL SIGNATURE REFERENCE TAB */}
      {activeTab === 'REGISTER' && (
        <div className="max-w-2xl mx-auto bg-[#0F172A] rounded-xl p-6 border border-slate-800 space-y-5 shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" /> Enroll Legitimate Signature Reference
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Store a document's SHA-256 hash and Pauli public basis seed into the legitimate registry for future baseline verification.
            </p>
          </div>

          <form onSubmit={handleRegisterSignature} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Reference Document
              </label>
              <input
                ref={regFileInputRef}
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setRegFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                required
              />
              {regFile && (
                <div className="text-xs text-blue-400 font-mono mt-1.5">
                  Selected: {regFile.name} ({(regFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Authoritative Signer Identifier
              </label>
              <input
                type="text"
                value={regSignerId}
                onChange={(e) => setRegSignerId(e.target.value)}
                placeholder="ALICE-QDS-ROOT-01"
                className="w-full p-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Operational Description / Notes
              </label>
              <textarea
                value={regDescription}
                onChange={(e) => setRegDescription(e.target.value)}
                placeholder="E.g. Tactical order or settlement batch signed via entangled teleportation state."
                rows={3}
                className="w-full p-2.5 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering || !regFile}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isRegistering ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FilePlus className="w-4 h-4" />
                  <span>Enroll in Legitimate Registry</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
