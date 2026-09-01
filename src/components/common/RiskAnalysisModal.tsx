import React from 'react';
import { Modal } from './Modal';
import { RiskBadge } from './RiskBadge';
import { Cpu, Activity, Clock } from 'lucide-react';
import { RiskContributor, RiskLevel } from '../../types';

export interface RiskTimelineEntry {
  time: string;
  event: string;
}

interface RiskAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  level: RiskLevel;
  entityLabel: string;
  contributors?: RiskContributor[];
  timeline?: RiskTimelineEntry[];
  summary?: string;
}

const DEFAULT_CONTRIBUTORS: RiskContributor[] = [
  { factor: 'Rapid fund movement', points: 20, category: 'Velocity', evidence: 'Funds moved onward within minutes of receipt (average hold < 8.4 min).', severity: 'HIGH' },
  { factor: 'Multiple wallet splitting', points: 18, category: 'Layering', evidence: 'Incoming funds fragmented across several downstream addresses.', severity: 'HIGH' },
  { factor: 'High-risk connections', points: 25, category: 'Network', evidence: 'Direct interaction with known fraud-flagged counterparty cluster.', severity: 'HIGH' },
  { factor: 'Repeated consolidation', points: 14, category: 'Dispersal', evidence: 'Multiple tranches re-merged into a single collector wallet.', severity: 'MEDIUM' },
  { factor: 'Known suspicious cluster', points: 10, category: 'Correlation', evidence: 'Address overlaps a flagged intelligence-database cluster.', severity: 'MEDIUM' }
];

const DEFAULT_TIMELINE: RiskTimelineEntry[] = [
  { time: '14:32', event: '₹2L received' },
  { time: '14:35', event: '₹1.2L transferred' },
  { time: '14:37', event: '₹80K split' },
  { time: '14:41', event: 'Funds consolidated' },
  { time: '14:46', event: 'Transferred toward VASP' }
];

export const RiskAnalysisModal: React.FC<RiskAnalysisModalProps> = ({
  isOpen,
  onClose,
  score,
  level,
  entityLabel,
  contributors,
  timeline,
  summary
}) => {
  const contributorList = contributors && contributors.length > 0 ? contributors : DEFAULT_CONTRIBUTORS;
  const timelineList = timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE;
  const sum = contributorList.reduce((acc, c) => acc + c.points, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Risk Score Decomposition"
      subtitle={`Explainable breakdown for ${entityLabel}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Score Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 border border-orange-200 rounded-lg text-orange-700">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="micro-label text-slate-500">ALGORITHMIC RISK DECOMPOSITION</span>
              <h4 className="text-base font-semibold text-slate-900 mt-0.5">Why this score?</h4>
              {summary && <p className="text-xs text-slate-500 mt-0.5">{summary}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-3.5 py-2 rounded-lg">
            <span className="font-mono text-2xl font-bold text-slate-900">{score}</span>
            <span className="text-slate-400 font-mono text-xs">/ 100</span>
            <RiskBadge level={level} showScore={false} size="sm" />
          </div>
        </div>

        {/* Score Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-orange-600" />
              Contributing Factors
            </h5>
            <span className="text-xs text-slate-500 font-mono">Σ {sum} pts → {score}</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
            {contributorList.map((c, i) => (
              <div key={i} className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-900">{c.factor}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{c.evidence}</p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <RiskBadge level={c.severity} showScore={false} size="sm" />
                  <span className="font-mono text-base font-bold text-orange-600">+{c.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behaviour Timeline */}
        <div>
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-600" />
            Behaviour Timeline
          </h5>
          <div className="relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
            {timelineList.map((entry, idx) => (
              <div key={idx} className="relative flex items-center gap-3 text-xs">
                <div className="absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-white bg-orange-600 ring-2 ring-orange-200" />
                <span className="font-mono font-bold text-slate-900 w-14 shrink-0">{entry.time}</span>
                <span className="text-slate-600">{entry.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-xs">
          <span>
            <strong>Investigator Notice:</strong> This breakdown is an analytical lead, not an adjudication. Scores inform prioritization and require on-chain verification before evidentiary use.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};