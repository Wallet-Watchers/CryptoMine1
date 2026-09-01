import React from 'react';
import { CaseStatus } from '../../types';

interface StatusBadgeProps {
  status: CaseStatus | 'Flagged' | 'Observed' | 'Reviewed' | 'Cleared' | 'Open' | 'Dismissed';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'Under Investigation':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Monitoring':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Flagged':
      case 'Escalated':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Reviewed':
      case 'Cleared':
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Open':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${getStyles()} ${sizeClasses}`}>
      {status}
    </span>
  );
};
