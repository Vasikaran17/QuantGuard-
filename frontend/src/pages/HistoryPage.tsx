import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  RotateCcw, 
  Trash2, 
  Download, 
  CheckCircle2, 
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';
import { ThreatClassification } from '../types';

export const HistoryPage: React.FC = () => {
  const { history, clearHistory, resetHistorySeed } = useVerification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredHistory = history.filter((item) => {
    // 1. Filter by category
    if (filterType === 'VERIFIED' && item.status !== 'VERIFIED') return false;
    if (filterType === 'FORGERY' && item.threatType !== 'Signature Forgery') return false;
    if (filterType === 'IMPERSONATION' && item.threatType !== 'Impersonation') return false;
    if (filterType === 'REPLAY' && item.threatType !== 'Replay Attack') return false;
    if (filterType === 'UNAUTHORIZED' && item.threatType !== 'Unauthorized Verification') return false;

    // 2. Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchReq = item.requestId.toLowerCase().includes(term);
      const matchSender = item.sender.toLowerCase().includes(term);
      const matchClaimed = item.claimedIdentity.toLowerCase().includes(term);
      const matchThreat = item.threatType.toLowerCase().includes(term);
      return matchReq || matchSender || matchClaimed || matchThreat;
    }

    return true;
  });

  const exportHistoryAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quantguard_audit_history_${Date.now()}.json`);
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
            <History className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Verification Audit Ledger & Session History
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Persistent verification records stored in local cryptographic state vault
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportHistoryAsJSON}
            className="px-3 py-2 rounded-xl bg-[#0A0E17] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export History JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={resetHistorySeed}
            className="px-3 py-2 rounded-xl bg-[#0A0E17] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default seed dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Seed</span>
          </button>

          <button
            onClick={clearHistory}
            className="px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 text-rose-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear all stored history"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Request ID, Sender..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0A0E17] border border-[#1E293B] text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'FORGERY', label: 'Forgery' },
            { id: 'IMPERSONATION', label: 'Impersonation' },
            { id: 'REPLAY', label: 'Replay' },
            { id: 'UNAUTHORIZED', label: 'Unauthorized' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterType === f.id
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-[#0A0E17] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* VERIFICATION HISTORY TABLE */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            VERIFICATION LEDGER ENTRIES ({filteredHistory.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Persistent local storage: quantguard_verification_history
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Request ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Sender</th>
                <th className="py-2.5 px-3">Claimed Identity</th>
                <th className="py-2.5 px-3">Verification Type</th>
                <th className="py-2.5 px-3">Threat Type</th>
                <th className="py-2.5 px-3 text-right">Mismatch Rate</th>
                <th className="py-2.5 px-3 text-right">Attack Prob</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No verification entries found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-cyan-400">{item.requestId}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-slate-200">{item.sender}</td>
                    <td className="py-3 px-3 text-slate-400">{item.claimedIdentity}</td>
                    <td className="py-3 px-3 text-slate-400">{item.verificationType}</td>
                    <td className="py-3 px-3 font-semibold text-slate-300">{item.threatType}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={item.mismatchRate > 20 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {item.mismatchRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400 font-semibold">{item.attackProbability}%</td>
                    <td className="py-3 px-3 text-right text-cyan-400">{item.confidence}%</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
