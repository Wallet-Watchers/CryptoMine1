import React from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Eye, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { MonoText } from '../components/common/MonoText';

export const Monitoring: React.FC = () => {
  const { 
    selectedCase,
    caseAlerts,
    caseWallets,
    isMonitoringActive, 
    toggleMonitoring, 
    navigateTo 
  } = useInvestigation();
  const monitoredCaseWallets = caseWallets.length > 0 ? caseWallets : [{
    address: selectedCase.primaryWallet,
    shortAddress: `${selectedCase.primaryWallet.slice(0, 6)}...${selectedCase.primaryWallet.slice(-4)}`,
    label: 'Primary Suspect Wallet',
    lastActivity: selectedCase.updatedAt,
    riskLevel: selectedCase.riskLevel
  }];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="micro-label text-slate-500">CONTINUOUS SURVEILLANCE</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Monitoring
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time surveillance across tracked suspect wallets, intermediary transit nodes, and emerging triggers.
          </p>
        </div>

        <button
          onClick={toggleMonitoring}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs ${
            isMonitoringActive
              ? 'bg-slate-900 hover:bg-slate-800 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isMonitoringActive ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause Surveillance</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-white" />
              <span>Resume Surveillance</span>
            </>
          )}
        </button>
      </div>

      {/* Main Two Column Layout: Watchlist & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Monitored Watchlist */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="micro-label text-slate-500">WATCHLIST ROSTER</span>
              <h3 className="text-sm font-bold text-slate-900">Tracked Wallets ({monitoredCaseWallets.length})</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isMonitoringActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-[11px] font-mono text-slate-500">{isMonitoringActive ? 'Active' : 'Paused'}</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {monitoredCaseWallets.map((w) => (
              <div
                key={w.address}
                onClick={() => navigateTo('case-detail', { caseId: selectedCase.id, tab: 'overview', wallet: w.address })}
                className="py-3 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="font-mono font-bold text-slate-900 group-hover:text-orange-600">
                    {w.shortAddress}
                  </div>
                  <div className="text-slate-500 text-[11px]">{w.label}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-500">{w.lastActivity}</span>
                  <RiskBadge level={w.riskLevel} size="sm" showScore={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Surveillance Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="micro-label text-slate-500">EVENT LOG</span>
            <h3 className="text-sm font-bold text-slate-900">Recent Surveillance Alerts</h3>
          </div>

          <div className="space-y-3">
            {caseAlerts.map((a) => (
              <div
                key={a.id}
                onClick={() => navigateTo('case-detail', { caseId: selectedCase.id, tab: 'monitoring', alertId: a.id })}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      a.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.priority}
                    </span>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                      {a.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{a.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {a.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                  <span>Subject: {a.subject.slice(0, 12)}...</span>
                  <span className="text-orange-600 font-sans font-medium">Inspect Event →</span>
                </div>
              </div>
            ))}
            {caseAlerts.length === 0 && (
              <p className="p-3 text-xs text-slate-500">No surveillance alerts recorded for this case.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
