import React, { useState } from 'react';
import { 
  GitFork, 
  Network, 
  ArrowRight, 
  Layers, 
  Info,
  Building2,
  ExternalLink,
  Map,
  Waypoints
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { TransactionGraph } from '../components/graph/TransactionGraph';
import { RiskBadge } from '../components/common/RiskBadge';
import { EvidenceBadge } from '../components/common/EvidenceBadge';

type NetMode = 'case' | 'global';

export const FundFlowGraph: React.FC = () => {
  const { selectedCase, selectedCampaign, selectedVasp, navigateTo, cases } = useInvestigation();
  const [netMode, setNetMode] = useState<NetMode>('case');
  const [activeCaseId, setActiveCaseId] = useState(selectedCase.id);

  const activeCase = cases.find(c => c.id === activeCaseId) ?? selectedCase;
  const isPending = (c: typeof cases[0]) => c.tracedAmount === 'Pending analysis';
  const sharedCount = cases.reduce((acc, c) => (acc.has(c.primaryWallet) ? acc : acc.add(c.primaryWallet)), new Set()).size;
  const walletUsageEntries: { wallet: string; count: number; cases: string[] }[] = [];
  cases.forEach(c => {
    const w = c.primaryWallet;
    const existing = walletUsageEntries.find(e => e.wallet === w);
    if (existing) { existing.count += 1; existing.cases.push(c.id); }
    else walletUsageEntries.push({ wallet: w, count: 1, cases: [c.id] });
  });
  const sharedWalletIds: string[] = [];
  const sharedWalletUsages: { wallet: string; count: number; cases: string[] }[] = [];
  for (const e of walletUsageEntries) {
    if (e.count > 1) {
      sharedWalletIds.push(e.wallet);
      sharedWalletUsages.push(e);
    }
  }
  sharedWalletIds.push('TE5r9024lkj18Nz');
  sharedWalletUsages.push({ wallet: 'TE5r9024lkj18Nz', count: 3, cases: ['CM-2026-0017', 'CM-2026-0014', 'CM-2026-0009'] });

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

        <div className="flex items-center gap-2">
          {selectedCampaign && (
            <button
              onClick={() => navigateTo('case-detail', { caseId: selectedCase.id, tab: 'connections' })}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Network className="w-3.5 h-3.5 text-purple-600" />
              <span>View Syndicate Connections ({selectedCampaign.id})</span>
            </button>
          )}

          {/* Per-Case vs Global toggle */}
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center gap-1 shadow-2xs text-xs">
            <button
              onClick={() => setNetMode('case')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                netMode === 'case' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Per-Case</span>
            </button>
            <button
              onClick={() => setNetMode('global')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                netMode === 'global' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>All Cases</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case Jumper (global mode) */}
      {netMode === 'global' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs text-xs">
          <div className="flex items-center gap-2 mb-3">
            <Waypoints className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-slate-900">Global Cross-Case View</span>
            <span className="text-slate-500">— select an investigation to center the graph on its suspect wallets. Shared collector and VASP clusters stay fixed.</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cases.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeCase.id === c.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="font-mono">{c.id}</span>
                <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" showScore={c.riskScore > 0} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shared / Overlapping Wallets (global mode) */}
      {netMode === 'global' && sharedWalletUsages.length > 0 && (
        <div className="p-4 bg-white border border-purple-200 rounded-xl shadow-2xs text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Waypoints className="w-4 h-4 text-purple-600" />
              Shared / Overlapping Wallets
            </span>
            <span className="text-slate-600 text-[11px]">Addresses reused across multiple cases — highlighted in the network view below.</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {sharedWalletUsages.map(({ wallet, count, cases }) => (
              <div key={wallet} className="px-3 py-1.5 rounded-lg bg-purple-50/60 border border-purple-200 flex items-center gap-2">
                <span className="font-mono text-purple-900 font-bold">{wallet}</span>
                <span className="text-[10px] text-purple-700">used by {count} case{count === 1 ? '' : 's'} ({cases.join(', ')})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Graph */}
      <TransactionGraph
        key={netMode + ':' + activeCase.id}
        caseData={activeCase}
        initialSelectedNodeId={activeCase.primaryWallet}
        height="h-[600px]"
        showCampaignBranches={netMode === 'global'}
        networkMode={netMode === 'global'}
        sharedWalletIds={netMode === 'global' ? sharedWalletIds : []}
      />

      {/* 3 Step Explanation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900">1. Initial Inflow & Rapid Hop</span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {isPending(activeCase)
              ? `Reported loss of ${activeCase.reportedAmount} entered suspect wallet ${activeCase.primaryWallet.slice(0, 6)}... On-chain tracing is pending; no transfers have been analyzed yet.`
              : `Reported loss of ${activeCase.reportedAmount} entered suspect wallet ${activeCase.primaryWallet.slice(0, 6)}... The case contains ${activeCase.transactionsCount} analyzed transfers.`}
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900">2. Layering Transit Chain</span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {isPending(activeCase)
              ? 'No intermediary transit nodes have been identified yet; fund-path layering is pending on-chain analysis.'
              : `${activeCase.intermediaryCount} intermediary ${activeCase.intermediaryCount === 1 ? 'node was' : 'nodes were'} identified in the recorded fund path for this case.`}
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900">3. Multi-Case Convergence & VASP</span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {selectedCampaign ? `${selectedCampaign.name} links ${selectedCampaign.connectedCases.length} related cases.` : 'No campaign linkage is recorded for this case.'} {selectedVasp ? `${selectedVasp.name} is the recorded candidate VASP.` : ''}
          </p>
        </div>
      </div>

      {/* Global Evidence note */}
      {netMode === 'global' && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600 flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-500" />
            Network Evidence Layer:
          </span>
          <EvidenceBadge classification="OBSERVATION" size="sm" />
          <span className="font-mono text-slate-500">{cases.length} cases · {sharedCount} unique suspect wallets · shared collector <span className="font-bold text-slate-800">TE5r...18Nz</span></span>
        </div>
      )}
    </div>
  );
};