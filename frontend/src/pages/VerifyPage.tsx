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
  Sparkles,
  ArrowRight,
  Database,
  Hash
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-wide font-sans">
              QUANTUM SIGNATURE VERIFICATION
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              TELEPORTATION TOMOGRAPHY
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Execute entangled Pauli eigenstate tomography across receiver detector channels
          </p>
        </div>

        {/* Mode Switch Reminder */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">Current Mode:</span>
            {isDemoMode ? (
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <PlayCircle className="w-3.5 h-3.5" /> Demo Scenarios
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" /> Live File Upload
              </span>
            )}
          </div>

          <button
            onClick={toggleDemoMode}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
          >
            Switch to {isDemoMode ? 'Live Upload' : 'Demo Mode'}
          </button>
        </div>
      </div>

      {/* Tabs: Verify Signature vs Register New Signature Reference */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('VERIFY')}
          className={`pb-2.5 px-4 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'VERIFY'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>VERIFY SIGNATURE</span>
        </button>

        <button
          onClick={() => setActiveTab('REGISTER')}
          className={`pb-2.5 px-4 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'REGISTER'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>REGISTER LEGITIMATE SIGNATURE</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-red-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {regSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-2.5 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <span>{regSuccess}</span>
        </div>
      )}

      {activeTab === 'VERIFY' && (
        <>
          {/* DEMO MODE VIEW */}
          {isDemoMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Configuration (7 cols) */}
              <div className="lg:col-span-7 soc-card rounded-xl p-6 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <PlayCircle className="w-4 h-4" />
                    <span>PRELOADED DEMO SCENARIO RUNNER</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    NO FILE REQUIRED
                  </span>
                </div>

                {/* Scenario Dropdown */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    SELECT DEMO THREAT / BENCHMARK SCENARIO:
                  </label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {scenarios.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verifier Selection */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    RECEIVER / VERIFIER TERMINAL:
                  </label>
                  <select
                    value={selectedVerifier}
                    onChange={(e) => setSelectedVerifier(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {verifiers.map((v) => (
                      <option key={v.verifier_id} value={v.verifier_id}>
                        {v.verifier_id} ({v.name}) - {v.clearance_level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scenario Details Preview Card */}
                {currentScenarioObj && (
                  <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs font-mono">
                    <div className="text-slate-300 font-semibold flex items-center justify-between">
                      <span>SCENARIO PROFILE</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        currentScenarioObj.expected_verdict === 'MALICIOUS'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        EXPECTED: {currentScenarioObj.expected_verdict}
                      </span>
                    </div>
                    <p className="text-slate-400 font-sans leading-relaxed">
                      {currentScenarioObj.description}
                    </p>
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                      <div>
                        <span>Sample Payload: </span>
                        <strong className="text-slate-200">{currentScenarioObj.sample_file}</strong>
                      </div>
                      <div>
                        <span>Signer Node: </span>
                        <strong className="text-cyan-400">{currentScenarioObj.signer_id}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleRunDemoVerification}
                  disabled={isVerifying}
                  className="w-full py-3 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>EXECUTE QUANTUM TELEPORTATION VERIFICATION</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Technical Overview (5 cols) */}
              <div className="lg:col-span-5 soc-card rounded-xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-400" /> Protocol Parameters
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">QUANTUM PROTOCOL</span>
                    <span className="text-white font-semibold">Teleportation-Based QDS (Pauli X, Y, Z)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">EAVESDROPPING THRESHOLD</span>
                    <span className="text-amber-400 font-semibold">5σ Decision Cutoff = 0.1120 QBER</span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Mismatch rates exceeding 0.1120 indicate quantum state collapse caused by interception.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">NO-CLONING THEOREM PROTECTION</span>
                    <span className="text-cyan-400 font-semibold">Guaranteed by Quantum Mechanics</span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Adversary Eve cannot clone Alice's unknown quantum state without creating detectable error rate &ge; 25%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LIVE FILE UPLOAD VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Upload Form (7 cols) */}
              <div className="lg:col-span-7 soc-card rounded-xl p-6 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <UploadCloud className="w-4 h-4" />
                    <span>LIVE FILE SIGNATURE VERIFICATION</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    REAL FILE INGEST
                  </span>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/20'
                      : uploadedFile
                      ? 'border-emerald-500/60 bg-emerald-950/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
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
                      <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold font-mono text-white">
                        {uploadedFile.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'Custom signature binary'}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-xs text-red-400 hover:underline font-mono"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-slate-200">
                        Drop quantum signature payload or click to browse
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        Supports any file: .sig, .txt, .pdf, .bin, .json, .qsig
                      </p>
                    </div>
                  )}
                </div>

                {/* Signer ID input */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    CLAIMED SIGNER IDENTITY:
                  </label>
                  <input
                    type="text"
                    value={signerId}
                    onChange={(e) => setSignerId(e.target.value)}
                    placeholder="ALICE-QDS-ROOT-01"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Verifier Terminal */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    RECEIVER / VERIFIER TERMINAL:
                  </label>
                  <select
                    value={selectedVerifier}
                    onChange={(e) => setSelectedVerifier(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
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
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    CUSTOM QUANTUM NONCE (OPTIONAL):
                  </label>
                  <input
                    type="text"
                    value={customNonce}
                    onChange={(e) => setCustomNonce(e.target.value)}
                    placeholder="Leave blank for automatic fresh nonce"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleRunLiveVerification}
                  disabled={isVerifying || !uploadedFile}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>VERIFY LIVE SIGNATURE WITH QUANTUM TOMOGRAPHY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Info: Live Verification Flow */}
              <div className="lg:col-span-5 soc-card rounded-xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ingestion & Verification Logic
                </h3>

                <div className="space-y-3 text-xs font-mono text-slate-400 leading-relaxed">
                  <p>
                    1. <strong className="text-white">SHA-256 Digest Derivation:</strong> File bytes are hashed to derive the deterministic quantum seed binding document to signature state.
                  </p>
                  <p>
                    2. <strong className="text-white">Registry Matching:</strong> If the file has been enrolled via the "Register" tab, the signer basis aligns and verification passes with nominal noise (&lt; 0.05).
                  </p>
                  <p>
                    3. <strong className="text-white">Tamper Detection:</strong> Any modified file or forged signature collapses into random basis measurements, tripping the 5σ threshold (&gt; 0.1120).
                  </p>
                  <p>
                    4. <strong className="text-white">Replay & Authorization:</strong> Reused nonces or blacklisted terminals are rejected immediately before quantum state measurement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* REGISTER SIGNATURE REFERENCE TAB */}
      {activeTab === 'REGISTER' && (
        <div className="max-w-2xl mx-auto soc-card rounded-xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-mono font-bold text-cyan-400 flex items-center gap-2">
              <Database className="w-4 h-4" /> ENROLL NEW LEGITIMATE SIGNATURE REFERENCE
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Store a document's SHA-256 hash and Pauli public basis seed into the SQLite registry as legitimate baseline.
            </p>
          </div>

          <form onSubmit={handleRegisterSignature} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                SELECT REFERENCE DOCUMENT FILE:
              </label>
              <input
                ref={regFileInputRef}
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setRegFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs font-mono text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
                required
              />
              {regFile && (
                <div className="text-[11px] text-cyan-300 font-mono mt-1">
                  Selected: {regFile.name} ({(regFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                AUTHORITATIVE SIGNER ID:
              </label>
              <input
                type="text"
                value={regSignerId}
                onChange={(e) => setRegSignerId(e.target.value)}
                placeholder="ALICE-QDS-ROOT-01"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                METADATA / DESCRIPTION:
              </label>
              <textarea
                value={regDescription}
                onChange={(e) => setRegDescription(e.target.value)}
                placeholder="E.g. Tactical operational order signed with teleportation entanglement key."
                rows={3}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering || !regFile}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRegistering ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FilePlus className="w-4 h-4" />
                  <span>REGISTER SIGNATURE REFERENCE IN DATABASE</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
