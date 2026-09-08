import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  UserPlus, 
  RefreshCw,
  StickyNote,
  Paperclip,
  Wallet,
  GitFork,
  PowerOff
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { MonoText } from '../components/common/MonoText';
import { RiskAnalysisModal } from '../components/common/RiskAnalysisModal';
import { CaseItem } from '../types';

type SavedView = 'ALL' | 'MY' | 'HIGH_RISK' | 'MONITORING' | 'CLOSED';

const VIEW_TABS: { id: SavedView; label: string }[] = [
  { id: 'ALL', label: 'All Cases' },
  { id: 'MY', label: 'My Cases' },
  { id: 'HIGH_RISK', label: 'High Risk' },
  { id: 'MONITORING', label: 'Monitoring' },
  { id: 'CLOSED', label: 'Closed' }
];

export const Cases: React.FC = () => {
  const { cases, navigateTo, showToast, addMonitoredWallet, currentRole } = useInvestigation();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [investigatorFilter, setInvestigatorFilter] = useState('ALL');
  const [savedView, setSavedView] = useState<SavedView>('ALL');
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [riskCase, setRiskCase] = useState<CaseItem | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenFor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const investigators = Array.from(new Set(cases.map(c => c.leadInvestigator)));

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.primaryWallet.toLowerCase().includes(q) ||
      c.leadInvestigator.toLowerCase().includes(q);

    const matchRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    const matchInv = investigatorFilter === 'ALL' || c.leadInvestigator === investigatorFilter;

    let matchView = true;
    switch (savedView) {
      case 'MY': matchView = c.leadInvestigator === 'A. Mehta'; break;
      case 'HIGH_RISK': matchView = c.riskLevel === 'HIGH'; break;
      case 'MONITORING': matchView = c.status === 'Monitoring'; break;
      case 'CLOSED': matchView = c.status === 'Closed'; break;
      default: matchView = true;
    }

    return matchSearch && matchRisk && matchInv && matchView;
  });

  const runRowAction = (action: string, c: CaseItem) => {
    setMenuOpenFor(null);
    switch (action) {
      case 'assign':
        showToast('Assign Investigator', `Assignment roster opened for ${c.id}.`, 'info');
        break;
      case 'status':
        showToast('Change Status', `Status update panel opened for ${c.id}.`, 'info');
        break;
      case 'note':
        showToast('Add Note', `Note composer opened for ${c.id}.`, 'info');
        break;
      case 'evidence':
        showToast('Attach Evidence', `Evidence upload opened for ${c.id}.`, 'info');
        break;
      case 'wallet': {
        addMonitoredWallet(c.primaryWallet, `Primary wallet — ${c.id}`);
        break;
      }
      case 'transaction':
        showToast('Add Transaction', `Transaction intake opened for ${c.id}.`, 'info');
        break;
      case 'stop-monitoring':
        showToast('Monitoring Stopped', `Surveillance paused for ${c.id} scope.`, 'warning');
        break;
    }
  };

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

        {currentRole !== 'Analyst' && (
          <button
            onClick={() => navigateTo('create-case')}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New Investigation</span>
          </button>
        )}
      </div>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {VIEW_TABS.map((tab) => {
          const isActive = savedView === tab.id;
          const count = cases.filter(c => {
            switch (tab.id) {
              case 'MY': return c.leadInvestigator === 'A. Mehta';
              case 'HIGH_RISK': return c.riskLevel === 'HIGH';
              case 'MONITORING': return c.status === 'Monitoring';
              case 'CLOSED': return c.status === 'Closed';
              default: return true;
            }
          }).length;
          return (
            <button
              key={tab.id}
              onClick={() => setSavedView(tab.id)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono rounded-full px-1.5 ${isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
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
              value={investigatorFilter}
              onChange={(e) => setInvestigatorFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Investigators</option>
              {investigators.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
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
                  <div className="text-slate-500 text-[11px] truncate max-w-xs">{c.blockchain} Network · <span className="font-mono">{c.leadInvestigator}</span></div>
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
                  {c.tracedAmount === 'Pending analysis'
                    ? <span className="text-amber-600">Pending analysis</span>
                    : c.tracedAmount}
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

                <td className="py-3.5 px-4">
                  <StatusBadge status={c.status} size="sm" />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <span
                      onClick={() => navigateTo('case-detail', { caseId: c.id })}
                      className="text-orange-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <div ref={menuRef} className="relative">
                      <button
                        onClick={() => setMenuOpenFor(menuOpenFor === c.id ? null : c.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Row actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpenFor === c.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-left animate-in fade-in duration-100">
                          {currentRole === 'Supervisor' && (
                            <button
                              onClick={() => runRowAction('assign', c)}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                              Assign / reassign investigator
                            </button>
                          )}
                          <button
                            onClick={() => runRowAction('status', c)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                            Change status
                          </button>
                          <button
                            onClick={() => runRowAction('note', c)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <StickyNote className="w-3.5 h-3.5 text-slate-500" />
                            Add note
                          </button>
                          <button
                            onClick={() => runRowAction('evidence', c)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                            Attach evidence
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => runRowAction('wallet', c)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Wallet className="w-3.5 h-3.5 text-slate-500" />
                            Add another wallet to trace
                          </button>
                          <button
                            onClick={() => runRowAction('transaction', c)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <GitFork className="w-3.5 h-3.5 text-slate-500" />
                            Add another transaction
                          </button>
                          {c.status === 'Monitoring' && (
                            <div className="my-1 border-t border-slate-100" />
                          )}
                          <button
                            onClick={() => runRowAction('stop-monitoring', c)}
                            disabled={c.status !== 'Monitoring'}
                            className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs transition-colors ${
                              c.status !== 'Monitoring'
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50 cursor-pointer'
                            }`}
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                            Stop monitoring
                          </button>
                    </div>
                    )}
                  </div>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 shadow-2xs">
          No cases match the current view/filters.
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