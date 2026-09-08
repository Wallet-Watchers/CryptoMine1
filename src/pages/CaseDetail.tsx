import React, { useState } from 'react';
import { 
  GitFork, 
  Layers, 
  Network, 
  Building2, 
  Radio, 
  FileText, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Info,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  FileDown,
  Printer,
  UserCheck
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { MonoText } from '../components/common/MonoText';
import { RiskAnalysisModal } from '../components/common/RiskAnalysisModal';
import { TransactionGraph } from '../components/graph/TransactionGraph';
import { VASPAttribution } from '../components/case/VASPAttribution';
import { CaseTab } from '../types';
import { CURRENT_INVESTIGATOR } from '../data/mockData';

export const CaseDetail: React.FC = () => {
  const { 
    selectedCase, 
    activeCaseTab, 
    setActiveCaseTab, 
    navigateTo,
    cases,
    selectedCampaign,
    selectedVasp,
    caseAlerts,
    caseWallets,
    showToast
  } = useInvestigation();
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const isPending = selectedCase.tracedAmount === 'Pending analysis';
  const linkedCases = selectedCampaign
    ? cases.filter(caseItem => caseItem.id !== selectedCase.id && selectedCampaign.connectedCases.includes(caseItem.id))
    : [];
  const monitoredCaseWallets = caseWallets.length > 0 ? caseWallets : [{
    address: selectedCase.primaryWallet,
    shortAddress: `${selectedCase.primaryWallet.slice(0, 6)}...${selectedCase.primaryWallet.slice(-4)}`,
    label: 'Primary Suspect Wallet',
    lastActivity: selectedCase.updatedAt,
    riskLevel: selectedCase.riskLevel
  }];

  const tabs: { id: CaseTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'fund-flow', label: 'Fund Flow', icon: <GitFork className="w-3.5 h-3.5" /> },
    { id: 'connections', label: 'Connections', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'vasp', label: 'VASP', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'report', label: 'Report', icon: <FileText className="w-3.5 h-3.5" /> }
  ];
  const activeStage = tabs.findIndex(tab => tab.id === activeCaseTab) + 1;

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const csv = "data:text/csv;charset=utf-8," + 
      "Case ID,Title,Fraud Type,Reported,Traced,Suspect Wallet,Risk,Campaign,Candidate VASP\n" +
      `${selectedCase.id},${selectedCase.title},${selectedCase.fraudType},${selectedCase.reportedAmount},${selectedCase.tracedAmount},${selectedCase.primaryWallet},${selectedCase.riskScore},${selectedCampaign?.id || 'None'},${selectedVasp?.name || 'None'}\n`;
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `CryptoMine_${selectedCase.id}_Export.csv`;
    link.click();
    showToast('Export Ready', `Downloaded ${selectedCase.id} evidence table.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Case Master Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {selectedCase.id}
              </span>
              <StatusBadge status={selectedCase.status} />
              <button
                onClick={() => selectedCase.riskScore > 0 && setRiskModalOpen(true)}
                title="View risk score breakdown"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <RiskBadge level={selectedCase.riskLevel} score={selectedCase.riskScore} />
              </button>
              <span className="text-xs text-slate-400 font-mono">· {selectedCase.blockchain} · {selectedCase.asset}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {selectedCase.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Investigator: <strong className="text-slate-800 font-medium">{selectedCase.leadInvestigator}</strong></span>
              <span>·</span>
              <span>Unit: {selectedCase.unit}</span>
              <span>·</span>
              <span>Updated: {selectedCase.updatedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setActiveCaseTab('fund-flow')}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Open Fund Flow</span>
            </button>
            <button
              onClick={() => setActiveCaseTab('report')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dossier Report</span>
            </button>
          </div>
        </div>

        {/* Case Navigation Tabs */}
        <div className="flex items-center justify-between pt-1">
          <span className="micro-label text-slate-500">CASE WORKFLOW</span>
          <span className="text-[10px] font-mono text-slate-500">Stage {activeStage} of {tabs.length}</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeCaseTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCaseTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeCaseTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 Core Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
              <span className="micro-label text-slate-500">REPORTED AMOUNT</span>
              <div className="font-mono text-xl font-bold text-slate-900 mt-1">
                {selectedCase.reportedAmount}
              </div>
              <span className="text-[11px] text-slate-500">Victim transfer</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
              <span className="micro-label text-slate-500">TRACED FUNDS</span>
              <div className="font-mono text-xl font-bold text-orange-700 mt-1">
                {isPending ? <span className="text-amber-600">Pending analysis</span> : selectedCase.tracedAmount}
              </div>
              <span className="text-[11px] text-slate-500">Case evidence path</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
              <span className="micro-label text-slate-500">INTERMEDIARIES</span>
              <div className="font-mono text-xl font-bold text-slate-900 mt-1">
                {isPending ? <span className="text-amber-600">Pending analysis</span> : `${selectedCase.intermediaryCount} wallets`}
              </div>
              <span className="text-[11px] text-slate-500">Layered hops</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
              <span className="micro-label text-slate-500">TRANSACTIONS</span>
              <div className="font-mono text-xl font-bold text-slate-900 mt-1">
                {isPending ? <span className="text-amber-600">Pending analysis</span> : `${selectedCase.transactionsCount} transfers`}
              </div>
              <span className="text-[11px] text-slate-500">Analyzed ledger</span>
            </div>

            <div 
              onClick={() => setActiveCaseTab('connections')}
              className="bg-white border border-slate-200 hover:border-purple-300 rounded-lg p-3.5 shadow-2xs cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="micro-label text-purple-700">CONNECTED CASES</span>
                <Network className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="font-mono text-xl font-bold text-purple-900 mt-1">
                {selectedCase.connectedCasesCount} cases
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-purple-700 group-hover:underline">
                  {selectedCampaign ? `${selectedCampaign.id} · ${selectedCampaign.confidence}% match` : 'No campaign match recorded'}
                </span>
                {selectedCampaign && <EvidenceBadge classification="DERIVED" size="sm" />}
              </div>
            </div>
          </div>

          {/* Data Flow Relationship Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <span className="micro-label text-slate-500">FUND DISPERSAL RECONCILIATION</span>
            {isPending ? (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-slate-700 space-y-1">
                <p className="font-bold text-amber-900">On-chain analysis pending</p>
                <p className="leading-relaxed">
                  {selectedCase.reportedAmount} was reported sent to suspect wallet <code className="font-mono">{selectedCase.primaryWallet}</code>. No downstream dispersal, intermediary hops, or traced amounts have been confirmed yet.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
                <span className="text-slate-500 font-mono text-[10px]">1. Received by Suspect</span>
                <div className="font-mono text-base font-bold text-slate-900">{selectedCase.reportedAmount}</div>
                <span className="text-[11px] text-slate-500">Direct from victim wallet</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
                <span className="text-slate-500 font-mono text-[10px]">2. Moved Onward</span>
                <div className="font-mono text-base font-bold text-slate-900">{selectedCase.sentAmount}</div>
                <span className="text-[11px] text-slate-500">Forwarded within 8.4 mins</span>
              </div>
              <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-lg space-y-0.5">
                <span className="text-orange-800 font-mono text-[10px] font-bold">3. Traced Downstream</span>
                <div className="font-mono text-base font-bold text-orange-700">{selectedCase.tracedAmount}</div>
                <span className="text-[11px] text-orange-800">Linked to identified collector</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-0.5">
                <span className="text-slate-500 font-mono text-[10px]">4. Retained / Unlinked Splits</span>
                <div className="font-mono text-base font-bold text-slate-600">{selectedCase.retainedAmount}</div>
                <span className="text-[11px] text-slate-500">Gas & unindexed dust splits</span>
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-0.5">
                <span className="text-amber-800 font-mono text-[10px] font-bold">5. Unconfirmed Balance</span>
                <div className="font-mono text-base font-bold text-amber-700">
                  {Number(selectedCase.sentAmount.replace(/[^0-9.]/g, '')) > 0 && Number(selectedCase.tracedAmount.replace(/[^0-9.]/g, '')) > 0
                    ? `${(Number(selectedCase.sentAmount.replace(/[^0-9.]/g, '')) - Number(selectedCase.tracedAmount.replace(/[^0-9.]/g, ''))).toLocaleString()} USDT`
                    : 'Pending analysis'}
                </div>
                <span className="text-[11px] text-amber-800">Unconfirmed / awaiting on-chain confirmation</span>
              </div>
            </div>
            )}
          </div>

          {/* Suspect Wallet Analysis Card & Investigation Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Investigation Timeline (2 cols) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="micro-label text-slate-500">CHRONOLOGICAL EVIDENCE RECORD</span>
                <h3 className="text-sm font-bold text-slate-900">Investigation Timeline</h3>
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedCase.timeline.map((item) => (
                  <div key={item.id} className="relative group text-xs">
                    <div className="absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-800 ring-2 ring-slate-200 group-hover:ring-orange-500 transition-colors" />
                    <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{item.title}</span>
                          <span className="text-slate-400 font-mono text-[10px]">{item.date} {item.time && `· ${item.time}`}</span>
                        </div>
                        <EvidenceBadge classification={item.classification} size="sm" />
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Suspect Wallet & Key Indicators (1 col) */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="micro-label text-orange-700 font-bold">SUSPECT WALLET ANALYSIS</span>
                  <h3 className="text-sm font-bold text-slate-900">Wallet Behaviour</h3>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{selectedCase.primaryWallet.slice(0, 6)}...{selectedCase.primaryWallet.slice(-4)}</span>
                    <RiskBadge level={selectedCase.riskLevel} score={selectedCase.riskScore} size="sm" />
                  </div>
                  <MonoText value={selectedCase.primaryWallet} />
                </div>

                <div className="space-y-2.5 text-xs">
                  {isPending ? (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                      <span className="font-bold text-amber-900">Awaiting on-chain analysis</span>
                      <p className="text-slate-600 text-[11px] leading-snug pt-1">
                        The suspect wallet has been recorded. On-chain fund movement, intermediary layering, and transaction activity are pending trace analysis.
                      </p>
                    </div>
                  ) : (
                    <>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900">Rapid fund movement</span>
                    <p className="text-slate-600 text-[11px] leading-snug">
                      {selectedCase.sentAmount} moved onward from the reported transfer path.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900">Multiple intermediary wallets</span>
                    <p className="text-slate-600 text-[11px] leading-snug">
                      {selectedCase.intermediaryCount} intermediary wallet{selectedCase.intermediaryCount === 1 ? '' : 's'} identified in the case path.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900">High transaction frequency</span>
                    <p className="text-slate-600 text-[11px] leading-snug">
                      {selectedCase.transactionsCount} transactions observed during the active analysis window.
                    </p>
                  </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setActiveCaseTab('fund-flow')}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Trace Fund Flow Graph</span>
                </button>
              </div>

              {/* Source Complaint */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
                <span className="micro-label text-slate-500">ORIGINAL COMPLAINT STATEMENT</span>
                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border-l-2 border-orange-500 leading-relaxed">
                  "{selectedCase.complaintText}"
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Contact: <strong className="text-slate-800">{selectedCase.contactMethod}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FUND FLOW (The Visual Hero) */}
      {/* ========================================================================= */}
      {activeCaseTab === 'fund-flow' && (selectedCase.id === 'CM-2026-0017' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="micro-label text-orange-700 font-bold">TOPOLOGICAL FUND FLOW ANALYSIS</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Multi-Hop Money Movement Path
                </h3>
                <p className="text-xs text-slate-500">
                  Follow illicit fund movement from source complaint through layering intermediaries to shared destination.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <EvidenceBadge classification="FACT" size="sm" />
                <EvidenceBadge classification="OBSERVATION" size="sm" />
                <EvidenceBadge classification="POSSIBLE" size="sm" />
              </div>
            </div>

            {/* Clean, Readable Graph Flow */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 overflow-x-auto text-slate-100 select-none">
              <div className="min-w-[840px] flex items-center justify-between relative py-6">
                {/* Node 1: Victim Source */}
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-2 text-center shadow-lg">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">VICTIM</span>
                    <span className="text-xs font-mono font-bold text-slate-200 mt-0.5">Source</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-200 block">Complainant</span>
                    <span className="text-[10px] font-mono text-emerald-400">50,000 USDT</span>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <span className="font-mono text-[11px] font-bold text-orange-400 mb-1">50,000 USDT</span>
                  <div className="w-full h-0.5 bg-orange-500 relative flex items-center justify-end">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-orange-500 rotate-45 -mr-1" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">25 Aug · Deposit</span>
                </div>

                {/* Node 2: Primary Suspect */}
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className="w-20 h-20 rounded-xl bg-red-950/80 border-2 border-red-500 flex flex-col items-center justify-center p-2 text-center shadow-xl">
                    <span className="text-[9px] font-mono text-red-300 font-bold uppercase">SUSPECT</span>
                    <span className="text-xs font-mono font-bold text-white mt-0.5">TX9f...7Kp2</span>
                    <span className="text-[9px] font-mono text-red-300 font-bold">87/100</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Primary Suspect</span>
                    <span className="text-[10px] text-slate-400 font-mono">TRON Network</span>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <span className="font-mono text-[11px] font-bold text-orange-400 mb-1">12,400 USDT</span>
                  <div className="w-full h-0.5 bg-orange-500 relative flex items-center justify-end">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-orange-500 rotate-45 -mr-1" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Hop 1 · 8.4 mins</span>
                </div>

                {/* Node 3: Intermediary A */}
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-2 text-center shadow-lg">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">HOP 1</span>
                    <span className="text-xs font-mono font-bold text-slate-200 mt-0.5">TB7x...29Lm</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-200 block">Intermediary A</span>
                    <span className="text-[10px] text-slate-400 font-mono">Relay Node</span>
                  </div>
                </div>

                {/* Arrow 3 */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <span className="font-mono text-[11px] font-bold text-orange-400 mb-1">8,200 USDT</span>
                  <div className="w-full h-0.5 bg-orange-500 relative flex items-center justify-end">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-orange-500 rotate-45 -mr-1" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Hop 2 · Transit</span>
                </div>

                {/* Node 4: Intermediary B */}
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-2 text-center shadow-lg">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">HOP 2</span>
                    <span className="text-xs font-mono font-bold text-slate-200 mt-0.5">TC8m...81Qa</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-200 block">Intermediary B</span>
                    <span className="text-[10px] text-slate-400 font-mono">Aggregator</span>
                  </div>
                </div>

                {/* Arrow 4 */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <span className="font-mono text-[11px] font-bold text-purple-400 mb-1">15,900 USDT</span>
                  <div className="w-full h-0.5 bg-purple-500 relative flex items-center justify-end">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-purple-500 rotate-45 -mr-1" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Hop 3 · Aggregation</span>
                </div>

                {/* Node 5: Shared Collector (Nexus) */}
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className="w-18 h-18 rounded-xl bg-purple-950/80 border-2 border-purple-500 flex flex-col items-center justify-center p-2 text-center shadow-xl">
                    <span className="text-[9px] font-mono text-purple-300 font-bold uppercase">COLLECTOR</span>
                    <span className="text-xs font-mono font-bold text-white mt-0.5">TE5r...18Nz</span>
                    <span className="text-[9px] font-mono text-purple-300 font-bold">CMP-004</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Shared Collector</span>
                    <span className="text-[10px] text-purple-400 font-mono">3 Linked Cases</span>
                  </div>
                </div>

                {/* Arrow 5 */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <span className="font-mono text-[11px] font-bold text-emerald-400 mb-1">Batch Sweep</span>
                  <div className="w-full h-0.5 bg-emerald-500 relative flex items-center justify-end">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-emerald-500 rotate-45 -mr-1" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">VASP Sweep</span>
                </div>

                {/* Node 6: Candidate VASP */}
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 flex flex-col items-center justify-center p-2 text-center shadow-xl">
                    <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase">VASP</span>
                    <span className="text-xs font-bold text-white mt-0.5">Binance</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">Cluster V-018</span>
                    <span className="text-[10px] text-emerald-400 font-mono">89% Candidate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concise Evidence Summary Matrix Beside/Below Graph */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">1. Fund Velocity</span>
                <div className="font-bold text-slate-900">Rapid Movement</div>
                <div className="pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">High Risk</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">2. Layering Structure</span>
                <div className="font-bold text-slate-900">Layered Routing</div>
                <div className="pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">High Risk</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">3. Infrastructure</span>
                <div className="font-bold text-slate-900">Wallet Overlap</div>
                <div className="pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">High Risk</span>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-lg space-y-1">
                <span className="text-purple-700 text-[10px] font-mono uppercase font-bold">4. Syndicate Link</span>
                <div className="font-bold text-purple-950">Campaign Connection</div>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-mono">91% Conf</span>
                  <EvidenceBadge classification="DERIVED" size="sm" />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-1">
                <span className="text-emerald-700 text-[10px] font-mono uppercase font-bold">5. Destination</span>
                <div className="font-bold text-emerald-950">Possible VASP: Binance</div>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">89% Prob</span>
                  <EvidenceBadge classification="POSSIBLE" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="micro-label text-orange-700 font-bold">TOPOLOGICAL FUND FLOW ANALYSIS</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Multi-Hop Money Movement Path</h3>
              <p className="text-xs text-slate-500">Case-specific path based on the complaint and currently indexed on-chain evidence.</p>
            </div>
            <TransactionGraph key={selectedCase.id} caseData={selectedCase} initialSelectedNodeId={selectedCase.primaryWallet} height="h-[600px]" showCampaignBranches={Boolean(selectedCampaign)} />
          </div>
        </div>
      ))}

      {/* ========================================================================= */}
      {/* TAB 3: CONNECTIONS (Campaign / Fraud Network) */}
      {/* ========================================================================= */}
      {activeCaseTab === 'connections' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="micro-label text-purple-700 font-bold">CORRELATED FRAUD SYNDICATE</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Possible Coordinated Fraud Campaign · {selectedCampaign?.name || 'No campaign correlation recorded'}
                </h3>
                <p className="text-xs text-slate-500">
                  Graph correlation detected overlapping wallet infrastructure across independent fraud complaints.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-lg">
                <span className="font-mono text-xl font-bold text-purple-900">{selectedCampaign ? `${selectedCampaign.confidence}%` : '—'}</span>
                <span className="text-xs font-mono text-purple-700 font-medium">Confidence</span>
                {selectedCampaign && <EvidenceBadge classification="DERIVED" size="sm" />}
              </div>
            </div>

            {/* Why These Cases Appear Connected */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Why These Cases Appear Connected:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">1. Shared wallet infrastructure</span>
                    <EvidenceBadge classification="FACT" size="sm" />
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {selectedCampaign ? <>The shared infrastructure wallet (<code className="font-mono font-bold text-slate-800">{selectedCampaign.primaryInfrastructure}</code>) links the recorded campaign cases.</> : 'No shared wallet infrastructure has been recorded for this case.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">2. Similar routing behaviour</span>
                    <EvidenceBadge classification="OBSERVATION" size="sm" />
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {selectedCampaign ? 'Funds follow a similar transit schema before consolidation and sweeping.' : 'No routing comparison is recorded for this case.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">3. Similar timing patterns</span>
                    <EvidenceBadge classification="OBSERVATION" size="sm" />
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {selectedCampaign ? 'Transaction timing is consistent with the recorded campaign pattern.' : 'No timing correlation is recorded for this case.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2 Connected Cases Roster */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Connected Cases in Syndicate ({linkedCases.length}):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedCases.map((linkedCase) => (
                  <div
                    key={linkedCase.id}
                    onClick={() => navigateTo('case-detail', { caseId: linkedCase.id })}
                    className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-orange-600">{linkedCase.id}</span>
                      <RiskBadge level={linkedCase.riskLevel} score={linkedCase.riskScore} size="sm" />
                    </div>
                    <h5 className="text-xs font-semibold text-slate-900">{linkedCase.title}</h5>
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                      <span>{linkedCase.fraudType}</span>
                      <span className="font-bold text-slate-900">{linkedCase.reportedAmount}</span>
                    </div>
                  </div>
                ))}
                {linkedCases.length === 0 && <p className="text-xs text-slate-500">No related cases are recorded for this case.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VASP ATTRIBUTION (Dedicated page) */}
      {/* ========================================================================= */}
      {activeCaseTab === 'vasp' && (
        <VASPAttribution />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MONITORING */}
      {/* ========================================================================= */}
      {activeCaseTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="micro-label text-slate-500">ACTIVE SURVEILLANCE ROSTER</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Monitored Wallets for Case {selectedCase.id}
              </h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {monitoredCaseWallets.map((wallet) => (
                <div key={wallet.address} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-slate-900">{wallet.shortAddress}</div>
                    <span className="text-[11px] text-slate-500">{wallet.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">Active · {wallet.lastActivity}</span>
                    <RiskBadge level={wallet.riskLevel} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* Case Alerts */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Case Alerts:
              </h4>

              <div className="space-y-2.5">
                {caseAlerts.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          a.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {a.priority}
                        </span>
                        <span className="font-bold text-slate-900">{a.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{a.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{a.description}</p>
                  </div>
                ))}
                {caseAlerts.length === 0 && <p className="text-xs text-slate-500">No surveillance alerts recorded for this case.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: REPORT */}
      {/* ========================================================================= */}
      {activeCaseTab === 'report' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <span className="text-xs text-slate-500">{selectedCase.tracedAmount === 'Pending analysis' ? 'On-chain analysis is pending. This dossier will be populated once fund tracing is complete.' : 'Formal Evidence Package ready for judicial submission or law-enforcement export.'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Clean Printable Dossier */}
          <div className="bg-white border border-slate-300 rounded-xl p-8 lg:p-10 shadow-sm text-slate-900 space-y-8 report-page">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-extrabold tracking-widest uppercase block text-slate-900">
                    CRYPTOMINE
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                    Financial Crime & Crypto Fraud Intelligence Platform
                  </span>
                </div>
                <div className="text-right font-mono text-xs text-slate-600">
                  <div>Date: <strong>{selectedCase.updatedAt}</strong></div>
                  <div>Case Ref: <strong className="text-slate-900">{selectedCase.id}</strong></div>
                </div>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedCase.title}</h2>
                  <span className="text-xs text-slate-500 font-mono">{selectedCase.blockchain} Network · {selectedCase.reportedAmount}</span>
                </div>
                <RiskBadge level={selectedCase.riskLevel} score={selectedCase.riskScore} />
              </div>
            </div>

            {/* Section 1: Complaint Intelligence */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                1. Complaint Intelligence
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Official statement filed detailing <strong>{selectedCase.reportedAmount}</strong> in a {selectedCase.fraudType.toLowerCase()} case initiated through {selectedCase.contactMethod}. Reported suspect address: <code className="font-mono">{selectedCase.primaryWallet}</code>.
              </p>
            </div>

            {/* Section 2: Suspect Wallet & Fund Flow */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                2. Suspect Wallet & Fund Flow
              </h3>
              {selectedCase.transactionsCount === 0 && selectedCase.tracedAmount === 'Pending analysis' ? (
                <p className="text-slate-500 leading-relaxed italic">
                  On-chain fund flow analysis has not yet been performed for this case. Suspect wallet <code className="font-mono text-slate-600">{selectedCase.primaryWallet}</code> has been recorded; no transfers or intermediary nodes have been identified.
                </p>
              ) : (
                <p className="text-slate-700 leading-relaxed">
                  Suspect wallet received the reported funds and moved <strong>{selectedCase.sentAmount}</strong> across {selectedCase.intermediaryCount} identified intermediary {selectedCase.intermediaryCount === 1 ? 'node' : 'nodes'}. <strong>{selectedCase.tracedAmount}</strong> has been traced in this case.
                </p>
              )}
            </div>

            {/* Section 3: Network / Campaign Findings */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                3. Network & Campaign Findings
              </h3>
              <p className="text-slate-700 leading-relaxed flex items-center gap-2">
                {selectedCampaign ? <>This case is linked to <strong className="text-slate-900">{selectedCampaign.name} ({selectedCampaign.id} · {selectedCampaign.confidence}% confidence)</strong>, with {linkedCases.length} other recorded case{linkedCases.length === 1 ? '' : 's'} sharing the campaign infrastructure.</> : 'No campaign correlation has been recorded for this case.'}
                {selectedCampaign && <EvidenceBadge classification="DERIVED" size="sm" />}
              </p>
            </div>

            {/* Section 4: Possible VASP Attribution */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                4. Possible VASP Attribution
              </h3>
              <p className="text-slate-700 leading-relaxed flex items-center gap-2">
                {selectedVasp ? <>Destination analysis identifies <strong className="text-slate-900">{selectedVasp.name} (Cluster {selectedVasp.clusterId} · {selectedVasp.confidence}% confidence)</strong>. Attribution is probabilistic and requires formal law-enforcement information request (LEIR) for verification.</> : 'No VASP attribution has been recorded for this case.'}
                {selectedVasp && <EvidenceBadge classification="POSSIBLE" size="sm" />}
              </p>
            </div>

            {/* Section 5: Recommended Investigative Actions */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                5. Recommended Investigative Actions
              </h3>
              {selectedCase.transactionsCount === 0 && selectedCase.tracedAmount === 'Pending analysis' ? (
                <ol className="list-decimal list-inside text-slate-700 space-y-1 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <li>Initiate on-chain trace of suspect wallet <code className="font-mono">{selectedCase.primaryWallet}</code> to identify fund movement and intermediary nodes.</li>
                  <li>Monitor suspect wallet for outgoing transfers and downstream wallet activity.</li>
                  <li>Once transfers are identified, preserve blockchain transaction evidence across all discovered paths.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside text-slate-700 space-y-1 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <li>Preserve on-chain blockchain transaction evidence across all {selectedCase.transactionsCount} identified transfers.</li>
                  <li>Maintain surveillance on the {monitoredCaseWallets.length} wallet{monitoredCaseWallets.length === 1 ? '' : 's'} in this case scope.</li>
                  {linkedCases.length > 0 && <li>Coordinate with task force investigators on the {linkedCases.length} connected case{linkedCases.length === 1 ? '' : 's'}.</li>}
                  {selectedVasp && <li>Submit an official LEIR to {selectedVasp.name} Compliance regarding the candidate cluster.</li>}
                </ol>
              )}
            </div>

            {/* Footer Sign-off */}
            <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between text-xs text-slate-600 font-mono">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span>Investigator: <strong>{CURRENT_INVESTIGATOR.name}</strong> ({CURRENT_INVESTIGATOR.unit})</span>
              </div>
              <div>Status: <strong>{selectedCase.tracedAmount === 'Pending analysis' ? 'PENDING ON-CHAIN ANALYSIS' : 'EVIDENCE REPORT GENERATED'}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Score Drill-Down Modal */}
      <RiskAnalysisModal
        isOpen={riskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        score={selectedCase.riskScore}
        level={selectedCase.riskLevel}
        entityLabel={`Case ${selectedCase.id} · ${selectedCase.title}`}
        contributors={selectedCase.riskContributors}
        summary={isPending
          ? `Composite risk is pending on-chain analysis. No transfers have been analyzed yet; a risk score will be computed once tracing is complete.`
          : `Composite risk computed from ${selectedCase.riskContributors.length || 5} behavioural contributors observed across ${selectedCase.transactionsCount} analyzed transfers.`}
      />
    </div>
  );
};
