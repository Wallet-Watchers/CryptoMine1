import React from 'react';
import { 
  Plus, 
  ArrowRight, 
  GitFork, 
  Bell, 
  Briefcase, 
  ShieldAlert, 
  Radio, 
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { MonoText } from '../components/common/MonoText';

export const Overview: React.FC = () => {
  const { cases, selectedCase, caseAlerts, navigateTo, currentRole } = useInvestigation();
  const leadCase = selectedCase;
  const isPending = (c: typeof cases[0]) => c.tracedAmount === 'Pending analysis';
  const activeCasesCount = cases.filter(caseItem => caseItem.status === 'Under Investigation' || caseItem.status === 'Monitoring').length;
  const highRiskCasesCount = cases.filter(caseItem => caseItem.riskLevel === 'HIGH').length;
  const campaignCasesCount = cases.filter(caseItem => Boolean(caseItem.campaignId)).length;
  const priorityCases = cases.filter(caseItem => caseItem.id !== leadCase.id).slice(0, 2);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="micro-label text-slate-500">INVESTIGATION COMMAND CENTER</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Investigation Desk
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Trace suspicious cryptocurrency activity from complaint to actionable evidence.
          </p>
        </div>

        {currentRole !== 'Analyst' && (
          <button
            onClick={() => navigateTo('create-case')}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New Investigation</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="micro-label text-slate-500">ACTIVE CASES</span>
          <p className="font-mono text-lg font-bold text-slate-900 mt-1">{activeCasesCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="micro-label text-slate-500">HIGH RISK</span>
          <p className="font-mono text-lg font-bold text-red-700 mt-1">{highRiskCasesCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="micro-label text-slate-500">CAMPAIGN LINKS</span>
          <p className="font-mono text-lg font-bold text-slate-900 mt-1">{campaignCasesCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="micro-label text-slate-500">FUNDS TRACED</span>
          <p className="font-mono text-lg font-bold text-orange-700 mt-1">
            {isPending(leadCase) ? '—' : leadCase.tracedAmount}
          </p>
        </div>
      </div>

      {/* Active Primary Investigation Card */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="micro-label text-orange-700 font-bold">
            ACTIVE INVESTIGATION
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={leadCase.status} />
            <RiskBadge level={leadCase.riskLevel} score={leadCase.riskScore} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              {leadCase.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <span className="font-bold text-slate-900">{leadCase.id}</span>
              <span>·</span>
              <span>{leadCase.blockchain} Network</span>
              <span>·</span>
              <span className="font-semibold text-slate-900">{leadCase.reportedAmount}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {leadCase.fraudType} case on {leadCase.blockchain}. {leadCase.intermediaryCount > 0
                ? `${leadCase.intermediaryCount} intermediary wallet${leadCase.intermediaryCount === 1 ? '' : 's'} are identified in the current investigation path.`
                : 'Complaint and suspect wallet are recorded; on-chain analysis is pending.'}
            </p>
          </div>

          <button
            onClick={() => navigateTo('case-detail', { caseId: leadCase.id })}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start shrink-0 shadow-xs"
          >
            <span>Continue Investigation</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
          </button>
        </div>

        {/* 4 Concise Metric Points */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-500">Suspect Wallet</span>
            <div className="mt-0.5">
              <MonoText value={leadCase.primaryWallet} truncate />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-500">Traced Funds</span>
            <div className="font-mono text-base font-bold text-orange-700 mt-0.5">
              {isPending(leadCase) ? <span className="text-slate-400 text-xs font-semibold">Pending analysis</span> : leadCase.tracedAmount}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-500">Transactions Analyzed</span>
            <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
              {isPending(leadCase) ? <span className="text-slate-400 text-xs font-semibold">Pending analysis</span> : `${leadCase.transactionsCount} transfers`}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-500">Intermediaries</span>
            <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
              {isPending(leadCase) ? <span className="text-slate-400 text-xs font-semibold">Pending analysis</span> : `${leadCase.intermediaryCount} transit nodes`}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Alerts & Supporting Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Alerts (3 items only) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="micro-label text-slate-500">SURVEILLANCE ACTIVITY</span>
              <h3 className="text-sm font-bold text-slate-900">Recent Alerts</h3>
            </div>
            <button
              onClick={() => navigateTo('monitoring')}
              className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Monitoring Desk</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {caseAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigateTo('case-detail', { caseId: leadCase.id, tab: 'monitoring', alertId: alert.id })}
                className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      alert.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.priority}
                    </span>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                      {alert.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {alert.description}
                </p>
              </div>
            ))}
            {caseAlerts.length === 0 && (
              <p className="p-3 text-xs text-slate-500">No surveillance alerts recorded for this case.</p>
            )}
          </div>
        </div>

        {/* Right: Supporting Investigations (2 items) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="micro-label text-slate-500">PRIORITY MATTERS</span>
              <h3 className="text-sm font-bold text-slate-900">Supporting Cases</h3>
            </div>
            <button
              onClick={() => navigateTo('cases')}
              className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>All Cases</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {priorityCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigateTo('case-detail', { caseId: c.id })}
                className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-lg cursor-pointer transition-colors space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-orange-600">
                    {c.id}
                  </span>
                  <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                </div>

                <h4 className="text-xs font-semibold text-slate-800">
                  {c.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>{c.fraudType}</span>
                  <span className="font-bold text-slate-900">{c.reportedAmount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
