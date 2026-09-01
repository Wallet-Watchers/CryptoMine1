import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export const NotificationToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInvestigation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            case 'alert':
              return <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-slate-600 shrink-0" />;
          }
        };

        const getBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white';
            case 'warning':
              return 'border-amber-200 bg-white';
            case 'alert':
              return 'border-red-200 bg-white';
            default:
              return 'border-slate-200 bg-white';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border shadow-lg rounded-lg p-3.5 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-bottom-2 ${getBorder()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
