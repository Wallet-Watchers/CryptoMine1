import React, { useState } from 'react';
import {
  LayoutDashboard, 
  Briefcase, 
  Network, 
  Radio, 
  FileText, 
  Settings as SettingsIcon, 
  Shield, 
  Plus,
  Database,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { ActivePage } from '../../types';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  adminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activePage, navigateTo, alerts, currentRole, currentInvestigator } = useInvestigation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;
  const isAdmin = currentRole === 'Admin';
  const isAnalyst = currentRole === 'User';

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cases', label: 'Cases', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Network className="w-4 h-4" /> },
    { 
      id: 'monitoring', 
      label: 'Monitoring', 
      icon: <Radio className="w-4 h-4" />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined 
    },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'admin', label: 'Intelligence Database', icon: <Database className="w-4 h-4" />, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);
  const navigate = (page: ActivePage) => {
    navigateTo(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation"
        aria-expanded={isMobileOpen}
        className="fixed left-3 top-2.5 z-50 flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden no-print"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 md:hidden no-print"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-60 flex-col border-r border-[#1E293B] bg-[#0B1220] text-slate-300 shadow-2xl transition-transform duration-200 md:sticky md:top-0 md:z-40 md:flex md:h-screen md:shrink-0 md:translate-x-0 md:shadow-none no-print ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B]">
        <div 
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-orange-500 transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider text-white font-mono block leading-none">
              CryptoMine
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1 block">
              Investigation Desk
            </span>
          </div>
        </div>

        {/* Action: New Investigation */}
        {!isAnalyst && (
          <button
            onClick={() => navigate('create-case')}
            className="mt-4 w-full py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Investigation</span>
          </button>
        )}
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = activePage === item.id || 
              (item.id === 'cases' && activePage === 'case-detail') ||
              (item.id === 'cases' && activePage === 'create-case') ||
              (item.id === 'admin' && activePage === 'admin');

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group cursor-pointer ${
                    isActive
                      ? 'bg-[#1c222c] text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Investigator Context Footer */}
      <div className="p-3.5 border-t border-[#1E293B] bg-[#0B1220]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-mono font-bold text-xs">
            {currentInvestigator.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{currentInvestigator.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{currentInvestigator.unit}</div>
          </div>
          {isAdmin && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-600/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {currentRole}
            </span>
          )}
        </div>
      </div>
      </aside>

      {isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation"
          className="fixed left-[13.5rem] top-2.5 z-[60] flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 md:hidden no-print"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </>
  );
};
