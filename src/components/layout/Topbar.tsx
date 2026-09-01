import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronRight, 
  Plus, 
  X, 
  Briefcase, 
  Wallet, 
  ArrowRight,
  Shield
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CURRENT_INVESTIGATOR } from '../../data/mockData';

export const Topbar: React.FC = () => {
  const { 
    activePage, 
    selectedCaseId, 
    activeCaseTab,
    navigateTo, 
    alerts, 
    cases, 
    wallets 
  } = useInvestigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = alerts.filter(a => !a.isRead);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = searchQuery.toLowerCase().trim();
  const searchResults = q.length > 0 ? {
    cases: cases.filter(c => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.primaryWallet.toLowerCase().includes(q)),
    wallets: Object.values(wallets).filter(w => w.address.toLowerCase().includes(q) || (w.label && w.label.toLowerCase().includes(q)))
  } : null;

  const totalResults = searchResults ? (searchResults.cases.length + searchResults.wallets.length) : 0;

  const getBreadcrumbs = () => {
    switch (activePage) {
      case 'dashboard':
        return ['Dashboard'];
      case 'cases':
        return ['Cases'];
      case 'case-detail':
        return ['Cases', selectedCaseId, activeCaseTab.charAt(0).toUpperCase() + activeCaseTab.slice(1).replace('-', ' ')];
      case 'create-case':
        return ['Cases', 'New Investigation'];
      case 'complaint-analysis':
        return ['Cases', 'Analysis Queue', 'Complaint Analysis'];
      case 'network':
        return ['Network Intelligence'];
      case 'monitoring':
        return ['Surveillance Monitoring'];
      case 'reports':
        return ['Reports'];
      case 'admin':
        return ['Intelligence Database', 'Admin'];
      case 'settings':
        return ['Settings'];
      default:
        return ['Dashboard'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs no-print">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'text-slate-900 font-semibold font-mono'
                  : 'hover:text-slate-800 cursor-pointer'
              }
              onClick={() => {
                if (idx === 0) {
                  if (breadcrumbs[0] === 'Cases') navigateTo('cases');
                  else navigateTo('dashboard');
                } else if (idx === 1 && breadcrumbs[0] === 'Cases') {
                  navigateTo('case-detail', { caseId: selectedCaseId });
                }
              }}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Center: Global Search Input */}
      <div ref={searchRef} className="relative w-80 lg:w-96">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case ID, wallet address or transaction..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 border border-slate-200 focus:border-orange-500 rounded-lg transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Suggestions Dropdown */}
        {isSearchOpen && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 text-xs max-h-80 overflow-y-auto z-50 animate-in fade-in duration-100">
            {totalResults === 0 ? (
              <div className="py-4 text-center text-slate-400">
                <p>No matching cases or wallets for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults?.cases && searchResults.cases.length > 0 && (
                  <div>
                    <span className="micro-label text-slate-400 px-2 block mb-1">CASES</span>
                    {searchResults.cases.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          navigateTo('case-detail', { caseId: c.id });
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-orange-600" />
                          <div>
                            <span className="font-mono font-bold text-slate-900">{c.id}</span>
                            <span className="text-slate-600 ml-2">{c.title}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-900">{c.reportedAmount}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults?.wallets && searchResults.wallets.length > 0 && (
                  <div>
                    <span className="micro-label text-slate-400 px-2 block mb-1">WALLETS</span>
                    {searchResults.wallets.map(w => (
                      <div
                        key={w.address}
                        onClick={() => {
                          navigateTo('case-detail', { caseId: 'CM-2026-0017', tab: 'fund-flow' });
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="w-3.5 h-3.5 text-slate-600" />
                          <div>
                            <span className="font-mono font-bold text-slate-900">{w.shortAddress}</span>
                            <span className="text-slate-500 ml-2 text-[11px]">{w.label}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700">Risk {w.riskScore}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Investigator Identity */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            title="Surveillance Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="micro-label text-slate-500">RECENT SURVEILLANCE ALERTS</span>
                <button
                  onClick={() => {
                    navigateTo('monitoring');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-orange-600 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-2 divide-y divide-slate-100">
                {alerts.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      navigateTo('case-detail', { caseId: 'CM-2026-0017', tab: 'monitoring' });
                      setIsNotifOpen(false);
                    }}
                    className="py-2.5 hover:bg-slate-50 rounded px-1.5 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[10px] font-bold ${a.priority === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>
                        {a.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                    </div>
                    <p className="font-semibold text-slate-900 mt-0.5">{a.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Identity */}
        <div
          onClick={() => navigateTo('settings')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-[#0f1217] rounded-full flex items-center justify-center text-white font-mono text-xs font-bold">
            AM
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-none">{CURRENT_INVESTIGATOR.name}</div>
            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{CURRENT_INVESTIGATOR.unit}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
