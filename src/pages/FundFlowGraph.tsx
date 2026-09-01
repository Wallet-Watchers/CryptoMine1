import React from 'react';
import { 
  GitFork, 
  Network, 
  ArrowRight, 
  Layers, 
  Info,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { TransactionGraph } from '../components/graph/TransactionGraph';
import { RiskBadge } from '../components/common/RiskBadge';

export const FundFlowGraph: React.FC = () => {
  const { selectedCase, selectedCampaign, selectedVasp, navigateTo } = useInvestigation();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="micro-label text-slate-500">GLOBAL NETWORK INTELLIGENCE</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Network Map
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Multi-hop transaction graph connecting suspect wallets, intermediary transit nodes, and shared destination clusters.
          </p>
        </div>

        {selectedCampaign && (
        <button
          onClick={() => navigateTo('case-detail', { caseId: selectedCase.id, tab: 'connections' })}
          className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Network className="w-3.5 h-3.5 text-purple-600" />
          <span>View Syndicate Connections ({selectedCampaign.id})</span>
        </button>
        )}
      </div>

      {/* Main Interactive Graph */}
      <TransactionGraph
        key={selectedCase.id}
        caseData={selectedCase}
        initialSelectedNodeId={selectedCase.primaryWallet}
        height="h-[600px]"
        showCampaignBranches={true}
      />

      {/* 3 Step Explanation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900">1. Initial Inflow & Rapid Hop</span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Reported loss of {selectedCase.reportedAmount} entered suspect wallet {selectedCase.primaryWallet.slice(0, 6)}... The case contains {selectedCase.transactionsCount} analyzed transfers.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900">2. Layering Transit Chain</span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {selectedCase.intermediaryCount} intermediary {selectedCase.intermediaryCount === 1 ? 'node was' : 'nodes were'} identified in the recorded fund path for this case.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900">3. Multi-Case Convergence & VASP</span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {selectedCampaign ? `${selectedCampaign.name} links ${selectedCampaign.connectedCases.length} related cases.` : 'No campaign linkage is recorded for this case.'} {selectedVasp ? `${selectedVasp.name} is the recorded candidate VASP.` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
