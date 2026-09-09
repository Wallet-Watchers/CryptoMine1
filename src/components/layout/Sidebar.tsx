import React from 'react';
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
  ShieldCheck
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

  return (
    <aside className="w-60 bg-[#0B1220] border-r border-[#1E293B] flex flex-col h-screen shrink-0 sticky top-0 text-slate-300 select-none z-40 no-print">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B]">
        <div 
          onClick={() => navigateTo('dashboard')}
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
            onClick={() => navigateTo('create-case')}
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
                  onClick={() => navigateTo(item.id)}
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
  );
};
