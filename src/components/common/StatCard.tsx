import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeType = 'info',
  icon,
  onClick,
  className = ''
}) => {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="micro-label text-slate-500">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
};
