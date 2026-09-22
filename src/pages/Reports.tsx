import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowRight,
  Lock,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskAnalysisModal } from '../components/common/RiskAnalysisModal';
import { ReportStatus } from '../types';

const STATUS_STYLES: Record<ReportStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-300',
  Finalized: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Submitted: 'bg-blue-50 text-blue-800 border-blue-200'
};

export const Reports: React.FC = () => {
  const { cases, navigateTo, showToast } = useInvestigation();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [invFilter, setInvFilter] = useState('ALL');
  const [riskCase, setRiskCase] = useState<typeof cases[0] | null>(null);

  const investigators = Array.from(new Set(cases.map(c => c.leadInvestigator)));

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.primaryWallet.toLowerCase().includes(q);
    const matchRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    const matchInv = invFilter === 'ALL' || c.leadInvestigator === invFilter;
    return matchSearch && matchRisk && matchInv;
  });

  const isPending = (c: typeof cases[0]) => c.tracedAmount === 'Pending analysis';
  const canExport = (c: typeof cases[0]) => !isPending(c) && (c.reportStatus === 'Finalized' || c.reportStatus === 'Submitted');

  const handleExport = (c: typeof cases[0]) => {
    if (!canExport(c)) {
      showToast('Export Blocked', `${c.id} is not finalized. Complete tracing & finalize the report before export.`, 'warning');
      return;
    }
    const csv =
      "Case ID,Title,Fraud Type,Reported,Traced,Suspect Wallet,Risk,Status\n" +
      `${c.id},${c.title},${c.fraudType},${c.reportedAmount},${c.tracedAmount},${c.primaryWallet},${c.riskScore},${c.reportStatus}\n`;
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = `CryptoMine_${c.id}_Report.csv`;
    link.click();
    showToast('Export Ready', `Downloaded ${c.id} report (${c.reportStatus}).`, 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <span className="micro-label text-slate-500">INVESTIGATION REPORTS</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          Reports
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Generate, preview and export formal evidence dossiers for legal proceedings and partner intelligence sharing.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case ID, title or wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-orange-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Investigator:</span>
            <select
              value={invFilter}
              onChange={(e) => setInvFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Investigators</option>
              {investigators.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Roster */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="responsive-table">
        <table className="w-full text-left text-xs border-collapse min-w-[52rem]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
              <th className="py-3 px-4">Case Ref</th>
              <th className="py-3 px-4">Investigation Title</th>
              <th className="py-3 px-4">Fraud Type</th>
              <th className="py-3 px-4">Reported Loss</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Lead Investigator</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => {
              const pending = isPending(c);
              const exportable = canExport(c);
              return (
              <tr
                key={c.id}
                onClick={() => navigateTo('case-detail', { caseId: c.id, tab: 'report' })}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-orange-600">
                  {c.id}
                </td>

                <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-orange-600">
                  {c.title}
                </td>

                <td className="py-3.5 px-4 text-slate-700">
                  {c.fraudType}
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                  {c.reportedAmount}
                </td>

                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <RiskBadge
                    level={c.riskLevel}
                    score={c.riskScore}
                    size="sm"
                    showScore={c.riskScore > 0}
                    onClick={() => setRiskCase(c)}
                  />
                </td>

                <td className="py-3.5 px-4 text-slate-600">
                  {c.leadInvestigator}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full text-[10px] border ${STATUS_STYLES[c.reportStatus ?? 'Draft']}`}>
                      {c.reportStatus ?? 'Draft'}
                    </span>
                    {pending && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Pending analysis
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {!exportable && <Lock className="w-3 h-3 text-slate-300" />}
                    <button
                      onClick={() => handleExport(c)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                        exportable
                          ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={exportable ? 'Export CSV' : 'Finalize report before export'}
                    >
                      <FileSpreadsheet className="w-3 h-3" />
                      Export
                    </button>
                    <span
                      onClick={() => navigateTo('case-detail', { caseId: c.id, tab: 'report' })}
                      className={`text-orange-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${
                        pending ? 'opacity-50' : ''
                      }`}
                      title={pending ? 'Analysis pending — dossier limited' : 'View dossier'}
                    >
                      {pending ? (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </span>
                      ) : (
                        <>
                          <span>View Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 shadow-2xs">
          No reports match the current filters.
        </div>
      )}

      {riskCase && (
        <RiskAnalysisModal
          isOpen={!!riskCase}
          onClose={() => setRiskCase(null)}
          score={riskCase.riskScore}
          level={riskCase.riskLevel}
          entityLabel={`Case ${riskCase.id}`}
          contributors={riskCase.riskContributors}
        />
      )}
    </div>
  );
};