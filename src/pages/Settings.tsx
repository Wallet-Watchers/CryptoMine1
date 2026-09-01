import React from 'react';
import { 
  User, 
  Shield, 
  LogOut, 
  CheckCircle2,
  Lock,
  PenLine,
  ShieldCheck
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { ROLE_DEFINITIONS } from '../data/mockData';
import { UserRole } from '../types';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  Analyst: <Lock className="w-3.5 h-3.5" />,
  Investigator: <PenLine className="w-3.5 h-3.5" />,
  Supervisor: <ShieldCheck className="w-3.5 h-3.5" />
};

export const Settings: React.FC = () => {
  const { logout, showToast, currentRole, currentInvestigator } = useInvestigation();

  const handleSave = () => {
    showToast('Preferences Saved', 'Workspace settings updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="micro-label text-slate-500">USER PROFILE & PREFERENCES</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          Settings
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Investigator credentials, access level, and workspace configurations.
        </p>
      </div>

      {/* Investigator Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#0f1217] text-white rounded-xl flex items-center justify-center font-mono font-bold text-lg">
              {currentInvestigator.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentInvestigator.name}</h3>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                  Active Session
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentInvestigator.unit} · Lead Financial Crimes Investigator
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">Investigator Badge ID</span>
            <p className="font-mono font-bold text-slate-900">{currentInvestigator.name.toUpperCase().replace('.', '.')}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">Access Level</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">{currentRole}</span>
              {currentRole === 'Investigator' && <span className="text-[10px] text-slate-500">/ Read-Write</span>}
              {currentRole === 'Analyst' && <span className="text-[10px] text-slate-500">/ Read-Only</span>}
              {currentRole === 'Supervisor' && <span className="text-[10px] text-slate-500">/ Admin</span>}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">2FA Status</span>
            <p className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              OTP Enforced
            </p>
          </div>
        </div>
      </div>

      {/* Role Definitions Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">Access Level & Role Matrix</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">DEFINED AT INVESTIGATION DESK LEVEL</span>
        </div>

        <div className="space-y-3">
          {ROLE_DEFINITIONS.map((def) => {
            const isCurrent = def.role === currentRole;
            return (
              <div
                key={def.role}
                className={`rounded-lg border p-4 text-xs transition-colors ${
                  isCurrent ? 'border-orange-300 bg-orange-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-md flex items-center justify-center ${isCurrent ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {ROLE_ICONS[def.role]}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{def.role}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[9px] font-mono font-bold">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-0.5">{def.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {def.permissions.map((perm) => (
                    <span key={perm} className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          Permission changes require a Supervisor to approve. Analyst sessions cannot create cases, run tracing, or modify evidence.
        </p>
      </div>

      {/* Workspace Display Preferences */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Workspace Configurations</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Display Density</label>
            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none">
              <option>Compact (High Density)</option>
              <option>Standard</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Alert Stream Priority</label>
            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none">
              <option>High Priority Only</option>
              <option>All Events in Real Time</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};