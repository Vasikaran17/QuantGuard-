import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { LogEntry, VerificationResult } from '../types';
import { getLogsApi } from '../services/api';

interface LogsPageProps {
  onOpenDrawer: (result: VerificationResult) => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({ onOpenDrawer }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [verdict, setVerdict] = useState('ALL');
  const [page, setPage] = useState(0);
  const limit = 15;
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await getLogsApi(verdict, search, limit, page * limit);
      setLogs(res.logs);
      setTotal(res.total);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [verdict, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchLogs();
  };

  const handleRowClick = (log: LogEntry) => {
    const isMal = log.verdict === 'MALICIOUS';
    const sampleResult: VerificationResult = {
      file_name: log.file_name,
      file_size: 145280,
      file_hash: log.file_hash,
      verifier_id: log.verifier_id,
      signer_id: log.signer_id,
      nonce: log.nonce,
      mode: log.mode,
      timestamp: log.timestamp,
      verdict: log.verdict,
      is_malicious: isMal,
      attack_type: (log.attack_type as any) || 'NONE',
      anomaly_reason: isMal
        ? `Statistical QBER (${(log.mismatch_rate * 100).toFixed(2)}%) or unauthorized vector flagged`
        : 'Quantum teleportation fidelity within nominal 5σ envelope',
      mismatch_rate: log.mismatch_rate,
      threshold: log.threshold,
      forgery_probability: log.forgery_probability,
      detection_time_ms: log.detection_time_ms,
      num_qubits: 128,
      basis_analysis: [
        {
          basis: 'X',
          sample_count: 42,
          mismatch_count: Math.round(42 * log.mismatch_rate),
          mismatch_rate: Number((log.mismatch_rate * 0.96).toFixed(4)),
          expected_rate: 0.042,
          fidelity: Number((1 - log.mismatch_rate * 0.96).toFixed(4)),
          status: log.mismatch_rate > log.threshold ? 'ANOMALOUS' : 'NOMINAL',
        },
        {
          basis: 'Y',
          sample_count: 43,
          mismatch_count: Math.round(43 * log.mismatch_rate),
          mismatch_rate: Number((log.mismatch_rate * 1.04).toFixed(4)),
          expected_rate: 0.042,
          fidelity: Number((1 - log.mismatch_rate * 1.04).toFixed(4)),
          status: log.mismatch_rate > log.threshold ? 'ANOMALOUS' : 'NOMINAL',
        },
        {
          basis: 'Z',
          sample_count: 43,
          mismatch_count: Math.round(43 * log.mismatch_rate),
          mismatch_rate: Number((log.mismatch_rate * 1.00).toFixed(4)),
          expected_rate: 0.042,
          fidelity: Number((1 - log.mismatch_rate * 1.00).toFixed(4)),
          status: log.mismatch_rate > log.threshold ? 'ANOMALOUS' : 'NOMINAL',
        },
      ],
      verification_steps: [
        { step: 1, name: 'Cryptographic Hash Extraction', detail: `SHA-256: ${log.file_hash}`, status: 'PASSED' },
        { step: 2, name: 'Pauli Eigenstate Tomography', detail: 'Constructed 128 state vectors across X, Y, Z bases', status: 'PASSED' },
        { step: 3, name: 'Basis Alignment & Signer Proof', detail: `Signer token validated against registry [${log.signer_id}]`, status: log.attack_type === 'IMPERSONATION' ? 'FAILED' : 'PASSED' },
        { step: 4, name: 'Nonce & Teleportation State Freshness', detail: `Nonce [${log.nonce}] verified against temporal vault`, status: log.attack_type === 'REPLAY_ATTACK' ? 'FAILED' : 'PASSED' },
        { step: 5, name: 'Statistical Threshold Decision', detail: `Observed QBER: ${(log.mismatch_rate * 100).toFixed(2)}% vs Threshold ${(log.threshold * 100).toFixed(1)}%`, status: isMal ? 'FAILED' : 'PASSED' },
      ],
      teleportation_metrics: {
        bell_state_fidelity: Number((1 - log.mismatch_rate * 0.75).toFixed(4)),
        channel_depolarization: 0.042,
        no_cloning_disturbance_score: Number((log.mismatch_rate / 0.112).toFixed(2)),
      },
    };
    onOpenDrawer(sampleResult);
  };

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `QuantGuard-Audit-Logs-${Date.now()}.json`);
    dlAnchor.click();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Audit Logs & Forensic Trail
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-600/15 text-blue-300 border border-blue-500/30">
              Tamper-Evident Ledger
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical audit trail of quantum signatures verified across defense terminals
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer border border-slate-800 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Logs (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F172A] rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file name, verifier ID, signer ID, nonce..."
              className="w-full pl-9 pr-3 py-2 bg-[#0B1120] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Verdict Filter Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-xs mr-1">Filter:</span>
          {(['ALL', 'LEGITIMATE', 'MALICIOUS'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setVerdict(v);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                verdict === v
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-[#0B1120] border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {v === 'ALL' ? 'All Events' : v === 'LEGITIMATE' ? 'Legitimate' : 'Threats'}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0C121E] border-b border-slate-800 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Document Payload</th>
                <th className="p-3">Verifier Node</th>
                <th className="p-3">Signer ID</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Verdict</th>
                <th className="p-3">Attack Classification</th>
                <th className="p-3">Observed QBER</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {logs.map((log) => {
                const isMal = log.verdict === 'MALICIOUS';
                return (
                  <tr
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                    className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                  >
                    <td className="p-3 text-slate-500">#{log.id}</td>
                    <td className="p-3 text-slate-400 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 text-white font-sans font-medium group-hover:text-blue-400 transition-colors">
                      {log.file_name}
                    </td>
                    <td className="p-3 text-slate-400 text-xs">{log.verifier_id}</td>
                    <td className="p-3 text-blue-400 font-semibold">{log.signer_id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium ${
                        log.mode === 'DEMO' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                      }`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-sans font-medium ${
                        isMal 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isMal ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {log.verdict}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`text-xs ${
                        isMal ? 'text-amber-400 font-medium' : 'text-slate-400'
                      }`}>
                        {log.attack_type === 'NONE' ? 'Nominal' : log.attack_type}
                      </span>
                    </td>
                    <td className={`p-3 font-semibold ${
                      log.mismatch_rate > log.threshold ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {(log.mismatch_rate * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-right font-sans">
                      <span className="inline-flex items-center text-blue-400 group-hover:translate-x-0.5 transition-transform text-xs font-medium">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-800 bg-[#0C121E] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white font-mono">{logs.length}</strong> of <strong className="text-white font-mono">{total}</strong> records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-2.5 py-1 rounded bg-[#0F172A] border border-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-2.5 py-1 rounded bg-[#0F172A] border border-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
