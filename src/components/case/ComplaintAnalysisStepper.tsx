import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Cpu, 
  FileText,
  Layers,
  Network
} from 'lucide-react';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { RiskBadge } from '../common/RiskBadge';
import { MonoText } from '../common/MonoText';
import { ExtractedComplaintIntelligence } from '../../types';

interface ComplaintAnalysisStepperProps {
  onComplete: (data: ExtractedComplaintIntelligence) => void;
  autoStart?: boolean;
}

const STEPS = [
  { id: 1, label: 'Parsing complaint text & statement structure', icon: FileText },
  { id: 2, label: 'Extracting forensic entities (fraud type, contact vector, assets)', icon: Sparkles },
  { id: 3, label: 'Isolating primary suspect recipient wallet', icon: ShieldCheck },
  { id: 4, label: 'Retrieving on-chain transaction ledger (42 transfers)', icon: Cpu },
  { id: 5, label: 'Analyzing wallet behaviour (layering velocity & splitting)', icon: Layers },
  { id: 6, label: 'Cross-referencing multi-case campaign registry (CMP-004 match)', icon: Network },
  { id: 7, label: 'Synthesizing explainable risk profile & VASP candidate', icon: CheckCircle2 }
];

export const ComplaintAnalysisStepper: React.FC<ComplaintAnalysisStepperProps> = ({
  onComplete,
  autoStart = true
}) => {
  const [currentStep, setCurrentStep] = useState<number>(autoStart ? 1 : 0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!autoStart || isCompleted) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsCompleted(true);
          onComplete({
            fraudType: 'Investment Scam',
            contactMethod: 'Telegram Channel (@GoldenAlphaYield)',
            amount: '50,000 USDT',
            asset: 'USDT',
            blockchain: 'TRON',
            suspectWallet: 'TX9f81ka94jLp27Kp2',
            txHash: '0x7e4a839fbc7189ad91cd',
            confidence: 96,
            extractedEntities: [
              { entity: 'Fraud Modality', value: 'Investment Scam (Telegram Ponzi)', confidence: 98, category: 'EXTRACTED' },
              { entity: 'Contact Vector', value: 'Telegram Channel (@GoldenAlphaYield)', confidence: 95, category: 'EXTRACTED' },
              { entity: 'Reported Loss', value: '50,000 USDT', confidence: 99, category: 'FACT' },
              { entity: 'Suspect Address', value: 'TX9f81ka94jLp27Kp2 (TRON)', confidence: 99, category: 'FACT' },
              { entity: 'Primary Outbound Tx', value: '0x7e4a...91cd (12,400 USDT)', confidence: 94, category: 'FACT' },
              { entity: 'Campaign Nexus', value: 'CMP-004 · Operation Golden Yield', confidence: 91, category: 'DERIVED' },
              { entity: 'VASP Candidate', value: 'Binance (Cluster V-018)', confidence: 89, category: 'DERIVED' }
            ]
          });
          return prev;
        }
      });
    }, 480);

    return () => clearInterval(interval);
  }, [autoStart, isCompleted, onComplete]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 border border-orange-200 rounded-lg text-orange-700">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="micro-label text-slate-500">PROTOTYPE INTELLIGENCE PIPELINE</span>
            <h3 className="text-base font-bold text-slate-900">
              {isCompleted ? 'Complaint Intelligence Extracted' : 'Simulating Multi-Stage Analysis...'}
            </h3>
          </div>
        </div>
        <div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Intelligence Indexed (96% Confidence)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Stage {currentStep} / {STEPS.length}
            </span>
          )}
        </div>
      </div>

      {/* Stepper Progress List */}
      <div className="grid grid-cols-1 gap-2.5">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id || isCompleted;
          const isCurrent = currentStep === step.id && !isCompleted;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-all ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                  : isCurrent
                  ? 'bg-orange-50/80 border-orange-300 text-orange-950 shadow-xs'
                  : 'bg-white border-slate-100 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-orange-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : step.id}
                </div>
                <span className="font-medium">{step.label}</span>
              </div>

              <div>
                {isDone && <span className="font-mono text-emerald-600 font-bold">READY</span>}
                {isCurrent && (
                  <span className="font-mono text-orange-600 font-bold flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    PROCESSING
                  </span>
                )}
                {!isDone && !isCurrent && <span className="font-mono text-slate-400">PENDING</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extracted Intelligence Results Card */}
      {isCompleted && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="micro-label text-orange-400">STRUCTURED ENTITY SUMMARY</span>
            <span className="text-xs text-slate-400 font-mono">Case ID: CM-2026-0017</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Fraud Classification</span>
              <p className="font-semibold text-white text-sm">Investment Scam (Telegram Ponzi)</p>
              <div className="pt-1">
                <EvidenceBadge classification="FACT" size="sm" />
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Contact Vector</span>
              <p className="font-semibold text-white text-sm">Telegram Channel (@GoldenAlphaYield)</p>
              <div className="pt-1">
                <EvidenceBadge classification="OBSERVATION" size="sm" />
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Reported Loss & Blockchain</span>
              <p className="font-mono font-bold text-orange-400 text-base">50,000 USDT (TRON)</p>
              <div className="pt-1">
                <EvidenceBadge classification="FACT" size="sm" />
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 font-mono uppercase text-[10px]">Primary Suspect Wallet</span>
              <div className="pt-0.5">
                <MonoText value="TX9f81ka94jLp27Kp2" />
              </div>
              <div className="pt-1 flex items-center gap-2">
                <RiskBadge level="HIGH" score={87} size="sm" />
                <span className="text-[10px] text-slate-400">42 Transactions Observed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
