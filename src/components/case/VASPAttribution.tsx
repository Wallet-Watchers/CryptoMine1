import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { MonoText } from '../common/MonoText';
import { ExplainabilityModal } from '../common/ExplainabilityModal';

const EVIDENCE_CHECKLIST = [
  { title: 'Wallet cluster similarity', description: 'Destination address patterns overlap known exchange router schema.', classification: 'OBSERVATION' as const },
  { title: 'Transaction behaviour', description: 'Batched deposit and sweep cadence matches exchange deposit windows.', classification: 'INFERENCE' as const },
  { title: 'Historical interaction', description: 'Cluster previously verified via LEIR responses in intelligence feeds.', classification: 'DERIVED' as const },
  { title: 'Deposit / sweep pattern', description: 'Threshold sweeping (> 10,000 USDT) aligns with candidate VASP policy.', classification: 'INFERENCE' as const }
];

const ALTERNATIVE_VASPS = [
  { name: 'KuCoin', confidence: 63, reason: 'Similar deposit sweeping intervals on TRON observed in 2 comparable clusters.' },
  { name: 'OKX', confidence: 41, reason: 'Occasional consolidated receipt batches but incomplete deposit-window match.' }
];

export const VASPAttribution: React.FC = () => {
  const { selectedCase, selectedVasp, navigateTo, showToast, campaign, exchangeAccountTraces } = useInvestigation();
  const [showExplainability, setShowExplainability] = useState(false);
  const [showAccountTrace, setShowAccountTrace] = useState(false);

  if (!selectedVasp) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-2xs text-center space-y-2">
        <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No VASP attribution recorded</h3>
        <p className="text-xs text-slate-500">Run fund-flow tracing to surface candidate destination clusters.</p>
        <button
          onClick={() => navigateTo('case-detail', { caseId: selectedCase.id, tab: 'fund-flow' })}
          className="px-4 py-2 mt-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          Open Fund Flow
        </button>
      </div>
    );
  }

  const campaignConfidence = selectedCase.campaignId === campaign.id ? campaign.confidence : undefined;
  const exchangeAccountTrace = exchangeAccountTraces.find(trace =>
    trace.caseId === selectedCase.id && trace.vaspClusterId === selectedVasp.clusterId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="micro-label text-emerald-700 font-bold">DOWNSTREAM DESTINATION ATTRIBUTION</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">VASP Attribution Analysis</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-2">
              <span className="font-semibold">Destination wallet under analysis:</span>
              <MonoText value={selectedCase.primaryWallet} />
            </div>
          </div>
          <button
            onClick={() => setShowExplainability(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start shrink-0"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Methodology Trace</span>
          </button>
        </div>

        {/* Likely VASP Hero Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIKELY DESTINATION VASP
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-2">
                <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">{selectedVasp.name}</h4>
                <span className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
                  {selectedVasp.confidence}% confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {selectedVasp.clusterId} · {selectedVasp.blockchain} · {selectedVasp.type}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <EvidenceBadge classification="POSSIBLE" size="sm" />
                <span className="text-[11px] text-slate-400">
                  Probabilistic attribution — not a confirmed ownership determination.
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Candidate exchange deposit address</span>
                <MonoText value={selectedVasp.candidateAddresses[0]} />
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-[11px] text-slate-300">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Deposit pattern</span>
                {selectedVasp.depositPatterns}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Account Trace */}
      {exchangeAccountTrace && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="micro-label text-emerald-700 font-bold">EXCHANGE ACCOUNT TRACE</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Continue tracing funds using exchange-side investigative records</h3>
              <p className="text-[11px] text-slate-500 mt-1">Extends the case trace beyond the candidate exchange deposit address when exchange-side evidence is available.</p>
            </div>
            {exchangeAccountTrace.isSyntheticDemoData && (
              <span className="self-start font-mono text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                SYNTHETIC DEMO DATA
              </span>
            )}
          </div>

          {/* Public blockchain path */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <span className="micro-label text-slate-600">On-Chain Trace</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Public blockchain data</p>
              </div>
              <EvidenceBadge classification="OBSERVATION" size="sm" />
            </div>

            <div className="space-y-0">
              <div className="relative pl-7 pb-3">
                <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">1</span>
                <span className="micro-label text-slate-500">Suspect Wallet</span>
                <div className="mt-1"><MonoText value={selectedCase.primaryWallet} truncate /></div>
              </div>
              <div className="ml-2.5 h-4 border-l border-slate-300" aria-hidden="true" />
              <div className="relative pl-7 pb-3">
                <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-slate-200 border border-slate-300 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center">2</span>
                <span className="micro-label text-slate-500">Intermediary Wallet</span>
                <div className="mt-1"><MonoText value={exchangeAccountTrace.onChain.intermediaryWallet} truncate /></div>
              </div>
              <div className="ml-2.5 h-4 border-l border-slate-300" aria-hidden="true" />
              <div className="relative pl-7 pb-3">
                <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center">3</span>
                <span className="micro-label text-emerald-700">Exchange Deposit Address</span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <MonoText value={exchangeAccountTrace.onChain.exchangeDepositAddress} truncate />
                  <span className="font-mono text-[10px] text-slate-500">{exchangeAccountTrace.onChain.amount} · {exchangeAccountTrace.onChain.timestamp}</span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 mt-1">Tx {exchangeAccountTrace.onChain.transactionHash}</p>
              </div>
              <div className="ml-2.5 h-4 border-l border-slate-300" aria-hidden="true" />
              <div className="relative pl-7">
                <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold flex items-center justify-center">4</span>
                <span className="micro-label text-emerald-700">Candidate VASP / Exchange</span>
                <p className="text-xs font-bold text-slate-900 mt-1">{selectedVasp.name} <span className="font-mono text-slate-500">· {selectedVasp.clusterId}</span></p>
              </div>
            </div>
          </div>

          {/* Evidentiary boundary */}
          <div className="flex flex-col items-center -my-1">
            <div className="h-4 w-px bg-slate-300" aria-hidden="true" />
            <div className="w-full border-y-2 border-slate-300 bg-white px-4 py-3 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <span className="micro-label text-slate-600">Public Blockchain Data</span>
                <span className="w-6 h-6 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 font-mono text-sm flex items-center justify-center" aria-hidden="true">↓</span>
                <span className="micro-label text-emerald-700">Exchange-Side Evidence</span>
              </div>
              <p className="text-[11px] text-slate-600 max-w-2xl mx-auto mt-2">
                Public blockchain data shows the transfer to the exchange deposit address. Internal exchange movements require exchange-side records or investigative evidence.
              </p>
            </div>
            <div className="h-4 w-px bg-emerald-300" aria-hidden="true" />
          </div>

          {!showAccountTrace ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-600">Load investigator-provided exchange records to continue the trace beyond the public blockchain endpoint.</p>
              <button
                onClick={() => {
                  setShowAccountTrace(true);
                  showToast('Exchange Account Trace Loaded', 'Synthetic exchange-side investigative records have extended the trace beyond the public blockchain.', 'info');
                }}
                className="shrink-0 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Trace Exchange Account</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Compact exchange-evidence summary */}
              <div className="rounded-lg border border-emerald-200 overflow-hidden bg-white">
                <div className="px-3.5 py-2.5 bg-emerald-50/60 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="micro-label text-emerald-700">Exchange-Side Evidence</span>
                    <p className="text-[11px] text-emerald-900 mt-0.5">Investigator-provided exchange evidence; not derived from public blockchain data.</p>
                  </div>
                  <EvidenceBadge classification="DERIVED" size="sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-[11px] divide-y sm:divide-y-0 sm:divide-x divide-x-0 divide-slate-100">
                  <div className="p-3 space-y-1">
                    <span className="micro-label text-slate-500">Exchange</span>
                    <p className="font-bold text-slate-900">{selectedVasp.name} / {selectedVasp.clusterId}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="micro-label text-slate-500">Account</span>
                    <p className="font-mono font-bold text-slate-900">{exchangeAccountTrace.exchangeSide.exchangeAccountId}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="micro-label text-slate-500">Deposit Reference</span>
                    <p className="font-mono font-bold text-slate-900">{exchangeAccountTrace.exchangeSide.depositReference}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="micro-label text-slate-500">Internal Transfer</span>
                    <p className="font-mono font-bold text-slate-900">{exchangeAccountTrace.exchangeSide.internalTransfer.reference}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="micro-label text-slate-500">Destination Account</span>
                    <p className="font-mono font-bold text-slate-900">{exchangeAccountTrace.exchangeSide.internalTransfer.destinationAccountId}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="micro-label text-slate-500">Withdrawal</span>
                    <p className="font-mono font-bold text-slate-900">{exchangeAccountTrace.exchangeSide.withdrawal.reference}</p>
                  </div>
                  <div className="col-span-2 p-3 space-y-1">
                    <span className="micro-label text-slate-500">Evidence Source</span>
                    <p className="font-medium text-slate-800">{exchangeAccountTrace.exchangeSide.evidenceSource}</p>
                  </div>
                </div>
              </div>

              {/* Exchange-side timeline */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="micro-label text-emerald-700">Exchange-Side Investigative Evidence</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">Internal account movement and withdrawal reconstructed from the loaded exchange record.</p>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded self-start">{exchangeAccountTrace.exchangeSide.depositAmount} deposited</span>
                </div>

                <div className="space-y-0">
                  <div className="relative pl-8 pb-3">
                    <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold flex items-center justify-center">1</span>
                    <span className="micro-label text-emerald-700">Exchange Account</span>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-1">{exchangeAccountTrace.exchangeSide.exchangeAccountId}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Original deposit {exchangeAccountTrace.exchangeSide.depositReference} · Asset {exchangeAccountTrace.onChain.asset} · {exchangeAccountTrace.exchangeSide.depositAmount} · {exchangeAccountTrace.exchangeSide.depositTimestamp}</p>
                    <p className="text-[11px] text-emerald-800 mt-1">Remaining balance in {exchangeAccountTrace.exchangeSide.exchangeAccountId} after the internal transfer: <strong>{exchangeAccountTrace.exchangeSide.remainingBalance}</strong></p>
                  </div>
                  <div className="ml-2.5 h-4 border-l border-emerald-300" aria-hidden="true" />
                  <div className="relative pl-8 pb-3">
                    <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center">2</span>
                    <span className="micro-label text-emerald-700">Internal Exchange Movement</span>
                    <p className="text-xs font-bold text-slate-900 mt-1"><span className="font-mono">{exchangeAccountTrace.exchangeSide.internalTransfer.sourceAccountId}</span> → <span className="font-mono">{exchangeAccountTrace.exchangeSide.internalTransfer.destinationAccountId}</span></p>
                    <p className="text-[11px] text-slate-600 mt-0.5"><span className="font-mono">{exchangeAccountTrace.exchangeSide.internalTransfer.reference}</span> · {exchangeAccountTrace.exchangeSide.internalTransfer.amount} · {exchangeAccountTrace.exchangeSide.internalTransfer.timestamp}</p>
                    <p className="text-[10px] text-emerald-800 mt-1">Not visible as a public blockchain transaction; represented here using exchange-side investigative evidence.</p>
                  </div>
                  <div className="ml-2.5 h-4 border-l border-emerald-300" aria-hidden="true" />
                  <div className="relative pl-8 pb-3">
                    <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold flex items-center justify-center">3</span>
                    <span className="micro-label text-emerald-700">Destination Exchange Account</span>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-1">{exchangeAccountTrace.exchangeSide.internalTransfer.destinationAccountId}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Received <strong>{exchangeAccountTrace.exchangeSide.internalTransfer.amount}</strong> from <span className="font-mono">{exchangeAccountTrace.exchangeSide.internalTransfer.sourceAccountId}</span>; the full received amount proceeds to withdrawal.</p>
                  </div>
                  <div className="ml-2.5 h-4 border-l border-emerald-300" aria-hidden="true" />
                  <div className="relative pl-8">
                    <span className="absolute left-0 top-0 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">4</span>
                    <span className="micro-label text-slate-600">Exchange Withdrawal</span>
                    <p className="text-xs font-bold text-slate-900 mt-1"><span className="font-mono">{exchangeAccountTrace.exchangeSide.withdrawal.sourceAccountId}</span> → External wallet</p>
                    <p className="text-[11px] text-slate-600 mt-0.5"><span className="font-mono">{exchangeAccountTrace.exchangeSide.withdrawal.reference}</span> · {exchangeAccountTrace.exchangeSide.withdrawal.amount} · {exchangeAccountTrace.exchangeSide.withdrawal.timestamp}</p>
                    <div className="mt-2"><MonoText value={exchangeAccountTrace.exchangeSide.withdrawal.destinationWallet} truncate /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evidence Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="micro-label text-slate-500">EVIDENCE CHECKLIST</span>
            <h3 className="text-sm font-bold text-slate-900">Supporting Signals</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{EVIDENCE_CHECKLIST.length}/4 matched</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EVIDENCE_CHECKLIST.map((item) => (
            <div key={item.title} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
<div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900 text-xs break-words">{item.title}</span>
              </div>
              <EvidenceBadge classification={item.classification} size="sm" />
            </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Evidence tier note */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>
            <strong>Confidence tier:</strong> cluster similarity is <strong>OBSERVED</strong>; behaviour and pattern matches are <strong>INFERENCE</strong>; historical cluster overlap is <strong>DERIVED</strong>. None constitute confirmation of wallet ownership.
          </span>
        </div>
        {campaignConfidence !== undefined && (
        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-lg text-[11px] text-purple-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
          <span>
            <strong>Cross-referenced:</strong> contributing case is linked to campaign {selectedCase.campaignId} ({campaignConfidence}% correlation) sharing the same collector infrastructure.
          </span>
        </div>
        )}
      </div>

      {/* Alternative Possibilities */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="micro-label text-slate-500">ALTERNATIVE HYPOTHESES</span>
          <h3 className="text-sm font-bold text-slate-900">Lower-Confidence Candidates</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Alternate destination explanations retained so the primary attribution is never presented as exclusive fact.
          </p>
        </div>

        <div className="space-y-2.5">
          {ALTERNATIVE_VASPS.map((alt) => (
            <div key={alt.name} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 text-xs">{alt.name}</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{alt.reason}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-slate-700 shrink-0">
                {alt.confidence}% confidence
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="micro-label text-amber-700 font-bold">VERIFICATION PATHWAY</span>
          <h3 className="text-sm font-bold text-slate-900">Confirmed Identity Requires LEA Action</h3>
        </div>
        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            Platform attribution is an analytical lead. To convert a <strong>Likely VASP</strong> match into confirmed account holder identity,
            submit a formal Law Enforcement Information Request (LEIR) to <strong>{selectedVasp.name} Compliance</strong>.
          </p>
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-mono text-[11px]">Compliance contact available {selectedVasp.complianceContactAvailable ? '· On file' : '· Pending'}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => showToast('LEIR Requested', `Formal information request drafted for ${selectedVasp.name} Compliance.`, 'success')}
            className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Draft LEIR Request</span>
          </button>
          <button
            onClick={() => navigateTo('reports')}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Campaign-linkage report</span>
          </button>
        </div>
      </div>

      <ExplainabilityModal
        isOpen={showExplainability}
        onClose={() => setShowExplainability(false)}
        type="vasp"
        title={`VASP Attribution Methodology — ${selectedVasp.name}`}
        data={{
          confidence: selectedVasp.confidence,
          signals: selectedVasp.attributionSignals
        }}
      />
    </div>
  );
};
