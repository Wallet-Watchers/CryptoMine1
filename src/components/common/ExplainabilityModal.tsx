import React from 'react';
import { Modal } from './Modal';
import { EvidenceBadge } from './EvidenceBadge';
import { RiskBadge } from './RiskBadge';
import { ShieldAlert, Info, Cpu, CheckCircle2 } from 'lucide-react';
import { RiskContributor } from '../../types';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'risk-score' | 'campaign' | 'vasp';
  title: string;
  subtitle?: string;
  data?: {
    score?: number;
    riskLevel?: string;
    confidence?: number;
    contributors?: RiskContributor[];
    signals?: {
      title: string;
      classification: any;
      description: string;
    }[];
  };
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  subtitle,
  data
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle || "Forensic Explainability & Methodological Trace"}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top summary card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 border border-orange-200 rounded-lg text-orange-700">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="micro-label text-slate-500">METHODOLOGY SUMMARY</span>
              <h4 className="text-base font-semibold text-slate-900 mt-0.5">
                {type === 'risk-score' && "Algorithmic Risk Decomposition"}
                {type === 'campaign' && "Multi-Case Graph Correlation"}
                {type === 'vasp' && "Heuristic Destination Attribution"}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-layer classification across on-chain telemetry and case graph records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 px-3.5 py-2 rounded-lg">
            {type === 'risk-score' && (
              <div>
                <span className="micro-label text-slate-400">COMPUTED SCORE</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-slate-900">{data?.score || 87}</span>
                  <span className="text-slate-400 font-mono text-xs">/ 100</span>
                  <RiskBadge level={(data?.riskLevel as any) || 'HIGH'} showScore={false} size="sm" />
                </div>
              </div>
            )}
            {(type === 'campaign' || type === 'vasp') && (
              <div>
                <span className="micro-label text-slate-400">ANALYTICAL CONFIDENCE</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-orange-600">{data?.confidence || 91}%</span>
                  <span className="text-xs font-mono text-slate-500 border border-slate-200 bg-slate-50 px-2 py-0.5 rounded">
                    Probabilistic
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown section */}
        {type === 'risk-score' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Risk Weight Contributors
              </h5>
              <span className="text-xs text-slate-500">Cumulative: {data?.score || 87} pts</span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
              {(data?.contributors || [
                { factor: "Rapid fund movement", points: 20, category: "Velocity", evidence: "Outbound tranche moved onward within minutes of receipt.", severity: "HIGH" },
                { factor: "Multiple wallet splitting", points: 18, category: "Layering", evidence: "Incoming funds fragmented across several downstream addresses.", severity: "HIGH" },
                { factor: "High-risk connections", points: 25, category: "Network", evidence: "Direct interaction with known fraud-flagged counterparty cluster.", severity: "HIGH" },
                { factor: "Repeated consolidation", points: 14, category: "Dispersal", evidence: "Multiple tranches re-merged into a single collector wallet.", severity: "MEDIUM" },
                { factor: "Known suspicious cluster", points: 10, category: "Correlation", evidence: "Address overlaps a flagged intelligence-database cluster.", severity: "MEDIUM" }
              ]).map((c, i) => (
                <div key={i} className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm text-slate-900 break-words">{c.factor}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {c.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.evidence}</p>
                  </div>
                  <div className="text-right shrink-0 justify-end">
                    <span className="font-mono text-base font-bold text-orange-600">+{c.points}</span>
                    <div className="text-[10px] text-slate-400">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signals for Campaign or VASP */}
        {(type === 'campaign' || type === 'vasp') && (
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Supporting Evidence Signals
            </h5>
            <div className="space-y-2.5">
              {(data?.signals || [
                {
                  title: "Shared wallet infrastructure",
                  classification: "FACT",
                  description: "Three separate cases funnel into common collector node TE5r...18Nz."
                },
                {
                  title: "Routing similarity",
                  classification: "OBSERVATION",
                  description: "Funds follow an identical 2-to-3 hop transit schema before aggregation."
                },
                {
                  title: "Timing pattern",
                  classification: "OBSERVATION",
                  description: "Transactions occur within correlated windows with rapid onward forwarding."
                },
                {
                  title: "Similar destination cluster",
                  classification: "INFERENCE",
                  description: "Downstream sweep patterns match candidate VASP cluster attribution."
                }
              ]).map((sig, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-3.5 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="font-medium text-sm text-slate-900 break-words min-w-0">{sig.title}</span>
                    <EvidenceBadge classification={sig.classification} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sig.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Classification Reference Guide */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-500" />
            Standard Evidence Classification Hierarchy
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
              <EvidenceBadge classification="FACT" size="sm" />
              <span className="text-slate-600 text-[11px]">Direct block/police records with 100% determinism.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
              <EvidenceBadge classification="OBSERVATION" size="sm" />
              <span className="text-slate-600 text-[11px]">Directly observed transfer velocity and topological structure.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
              <EvidenceBadge classification="DERIVED" size="sm" />
              <span className="text-slate-600 text-[11px]">Multi-case intersection through exact address matching.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
              <EvidenceBadge classification="INFERENCE" size="sm" />
              <span className="text-slate-600 text-[11px]">Algorithmic behavioural clustering based on similarity models.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200 md:col-span-2">
              <EvidenceBadge classification="POSSIBLE" size="sm" />
              <span className="text-slate-600 text-[11px]">Heuristic attribution to external VASPs. Always requires independent lawful verification.</span>
            </div>
          </div>
        </div>

        {/* Disclaimer footer */}
        <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Investigator Notice:</strong> Illustrative prototype risk model. All outputs serve as analytical leads for authorized law enforcement teams and require independent legal verification before judicial submission.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors"
          >
            Close & Return to Workspace
          </button>
        </div>
      </div>
    </Modal>
  );
};
