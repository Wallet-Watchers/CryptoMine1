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
  const { selectedCase, selectedVasp, navigateTo, showToast, campaign } = useInvestigation();
  const [showExplainability, setShowExplainability] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="micro-label text-emerald-700 font-bold">DOWNSTREAM DESTINATION ATTRIBUTION</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">VASP Attribution Analysis</h3>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
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
              <div className="flex items-baseline gap-3 mt-2">
                <h4 className="text-3xl font-extrabold tracking-tight">{selectedVasp.name}</h4>
                <span className="font-mono text-xl font-bold text-emerald-400">
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
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Candidate cluster</span>
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
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900 text-xs">{item.title}</span>
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
            <div key={alt.name} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="font-semibold text-slate-900 text-xs">{alt.name}</span>
                  <p className="text-[11px] text-slate-500">{alt.reason}</p>
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