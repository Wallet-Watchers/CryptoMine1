import React from 'react';
import { EvidenceClassification } from '../../types';

interface EvidenceBadgeProps {
  classification: EvidenceClassification;
  confidence?: number;
  size?: 'sm' | 'md';
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ 
  classification, 
  confidence, 
  size = 'md' 
}) => {
  const getStyles = () => {
    switch (classification) {
      case 'FACT':
        return {
          bg: 'bg-slate-900 text-white border-slate-700',
          dot: 'bg-emerald-400',
          label: 'FACT',
          desc: 'Verified on-chain or confirmed police report'
        };
      case 'OBSERVATION':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-blue-500',
          label: 'OBSERVED',
          desc: 'Directly observed from transaction behavior'
        };
      case 'DERIVED':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-600',
          label: 'DERIVED',
          desc: 'Calculated via multi-hop correlation'
        };
      case 'INFERENCE':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          label: 'INFERENCE',
          desc: 'Probabilistic analytical model output'
        };
      case 'POSSIBLE':
        return {
          bg: 'bg-amber-50 text-amber-900 border-dashed border-amber-300',
          dot: 'bg-amber-500',
          label: 'POSSIBLE',
          desc: 'Candidate attribution requiring independent verification'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          label: classification,
          desc: 'Evidence item'
        };
    }
  };

  const config = getStyles();
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border ${config.bg} ${sizeClasses}`}
      title={`${config.label}: ${config.desc}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
      {confidence !== undefined && (
        <span className="opacity-75 font-normal">· {confidence}%</span>
      )}
    </span>
  );
};
