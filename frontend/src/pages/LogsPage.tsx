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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-wide font-sans">
              AUDIT LOGS & INCIDENT TRAIL
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              TAMPER-PROOF LEDGER
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Complete historical audit trail of quantum signatures verified across defense and banking gateways
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT LOGS (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="soc-card rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file name, verifier ID, signer ID, nonce..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            SEARCH
          </button>
        </form>

        {/* Verdict Filter Buttons */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 text-[11px] mr-1">FILTER:</span>
          {(['ALL', 'LEGITIMATE', 'MALICIOUS'] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setVerdict(v);
                setPage(0);
              }}
              className={`px-2.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                verdict === v
                  ? 'bg-cyan-600 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="soc-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="p-3">LOG ID</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">FILE / DOCUMENT</th>
                <th className="p-3">VERIFIER ID</th>
                <th className="p-3">SIGNER ID</th>
                <th className="p-3">MODE</th>
                <th className="p-3">VERDICT</th>
                <th className="p-3">ATTACK TYPE</th>
                <th className="p-3">QBER</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => {
                const isMal = log.verdict === 'MALICIOUS';
                return (
                  <tr
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-3 text-slate-500">#{log.id}</td>
                    <td className="p-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 text-white font-medium group-hover:text-cyan-300 transition-colors">
                      {log.file_name}
                    </td>
                    <td className="p-3 text-slate-300">{log.verifier_id}</td>
                    <td className="p-3 text-cyan-400 font-semibold">{log.signer_id}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        log.mode === 'DEMO' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                      }`}>
                        {log.mode}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isMal 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isMal ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {log.verdict}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={isMal ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                        {log.attack_type === 'NONE' ? 'Nominal' : log.attack_type}
                      </span>
                    </td>
                    <td className={`p-3 font-semibold ${
                      log.mismatch_rate > log.threshold ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {(log.mismatch_rate * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-cyan-400 group-hover:underline text-[11px]">
                        Details &rarr;
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Showing {logs.length} of {total} historical records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
