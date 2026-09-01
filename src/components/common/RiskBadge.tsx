import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  onClick?: () => void;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  score, 
  size = 'md',
  showScore = true,
  onClick 
}) => {
  const getStyles = () => {
    switch (level) {
      case 'HIGH':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-600',
          badgeText: 'HIGH RISK'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          badgeText: 'MEDIUM'
        };
      case 'LOW':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          badgeText: 'LOW'
        };
      case 'SAFE':
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          badgeText: 'SAFE'
        };
      default:
        return {
          bg: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          badgeText: level
        };
    }
  };

  const style = getStyles();

  if (size === 'lg') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-md border ${style.bg}${onClick ? ' cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse`} />
        <span className="font-semibold tracking-wide text-sm">{style.badgeText}</span>
        {showScore && score !== undefined && (
          <span className="font-mono font-bold text-sm border-l border-current/20 pl-2">
            {score} / 100
          </span>
        )}
      </div>
    );
  }

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs';

  return (
    <span onClick={onClick} className={`inline-flex items-center gap-1.5 font-medium rounded border ${style.bg} ${sizeClasses}${onClick ? ' cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span className="tracking-wide">{level}</span>
      {showScore && score !== undefined && (
        <span className="font-mono text-[10px] opacity-80">({score})</span>
      )}
    </span>
  );
};
