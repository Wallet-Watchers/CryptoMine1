import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Briefcase, 
  ShieldAlert,
  GitFork,
  ChevronRight
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { MonoText } from '../components/common/MonoText';

export const Cases: React.FC = () => {
  const { cases, navigateTo } = useInvestigation();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.primaryWallet.toLowerCase().includes(q) ||
      c.leadInvestigator.toLowerCase().includes(q);

    const matchRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="micro-label text-slate-500">CASE REGISTRY</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Cases
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Active cryptocurrency fraud investigations and evidence states.
          </p>
        </div>

        <button
          onClick={() => navigateTo('create-case')}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case ID, title or wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-orange-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
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
      </div>

      {/* Cases List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Investigation Title</th>
              <th className="py-3 px-4">Fraud Type</th>
              <th className="py-3 px-4">Suspect Wallet</th>
              <th className="py-3 px-4">Reported</th>
              <th className="py-3 px-4">Traced</th>
              <th className="py-3 px-4">Risk</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigateTo('case-detail', { caseId: c.id })}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-orange-600">
                  {c.id}
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {c.title}
                  </div>
                  <div className="text-slate-500 text-[11px] truncate max-w-xs">{c.blockchain} Network</div>
                </td>

                <td className="py-3.5 px-4 text-slate-700 font-medium">
                  {c.fraudType}
                </td>

                <td className="py-3.5 px-4">
                  <MonoText value={c.primaryWallet} truncate />
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                  {c.reportedAmount}
                </td>

                <td className="py-3.5 px-4 font-mono font-semibold text-orange-700">
                  {c.tracedAmount}
                </td>

                <td className="py-3.5 px-4">
                  <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                </td>

                <td className="py-3.5 px-4">
                  <StatusBadge status={c.status} size="sm" />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="text-orange-600 font-semibold flex items-center justify-end gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Open</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
