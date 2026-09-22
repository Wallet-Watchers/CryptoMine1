import React, { useState } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Eye, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Plus,
  Wallet,
  X,
  Check
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
    navigateTo,
    monitoredNodes,
    addMonitoredWallet,
    showToast
  } = useInvestigation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAddWallet = () => {
    if (!newAddress.trim()) {
      showToast('Missing Address', 'Enter a wallet address to add to the watchlist.', 'warning');
      return;
    }
    addMonitoredWallet(newAddress.trim(), newLabel.trim() || `Watchlist entry — ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`);
    setNewAddress('');
    setNewLabel('');
    setIsAddOpen(false);
  };

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

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddOpen(prev => !prev)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Wallet to Watchlist</span>
          </button>

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
      </div>

      {/* Add Wallet Form */}
      {isAddOpen && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <div>
              <span className="micro-label text-slate-500">ADD TO WATCHLIST</span>
              <h3 className="text-sm font-bold text-slate-900">New monitored address</h3>
            </div>
            <button
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Wallet Address *</label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. TX9f81ka94jLp27Kp2"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Label (optional)</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-orange-500"
                placeholder="e.g. New intermediary hop"
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              onClick={handleAddWallet}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add to Watchlist</span>
            </button>
          </div>
        </div>
      )}

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

          <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
            <span><strong>Auto-enrollment:</strong> wallets reaching Stage 3 (intermediary layering detected) in the case workflow are automatically added to this watchlist.</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {monitoredCaseWallets.map((w) => (
              <div
                key={w.address}
                onClick={() => navigateTo('case-detail', { caseId: selectedCase.id, tab: 'overview', wallet: w.address })}
                className="py-3 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors flex flex-col gap-1 items-start sm:flex-row sm:items-center sm:justify-between group"
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      a.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.priority}
                    </span>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors break-words">
                      {a.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{a.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {a.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
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
