import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface MonoTextProps {
  value: string;
  displayValue?: string;
  truncate?: boolean;
  copyable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MonoText: React.FC<MonoTextProps> = ({
  value,
  displayValue,
  truncate = false,
  copyable = true,
  className = '',
  onClick
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useInvestigation();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    showToast('Copied to Clipboard', value, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDisplay = displayValue || (truncate && value.length > 14 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value);

  return (
    <span 
      className={`inline-flex max-w-full items-center gap-1.5 font-mono text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-1.5 py-0.5 rounded transition-colors group select-all ${onClick ? 'cursor-pointer hover:border-slate-400' : ''} ${className}`}
      onClick={onClick}
    >
      <span className="min-w-0 break-identifiers">{formattedDisplay}</span>
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
          title="Copy full value"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </span>
  );
};
