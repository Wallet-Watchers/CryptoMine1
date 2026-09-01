import React from 'react';
import { 
  User, 
  Shield, 
  LogOut, 
  CheckCircle2
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { CURRENT_INVESTIGATOR } from '../data/mockData';

export const Settings: React.FC = () => {
  const { logout, showToast } = useInvestigation();

  const handleSave = () => {
    showToast('Preferences Saved', 'Workspace settings updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <span className="micro-label text-slate-500">USER PROFILE & PREFERENCES</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          Settings
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Investigator credentials and workspace configurations.
        </p>
      </div>

      {/* Investigator Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#0f1217] text-white rounded-xl flex items-center justify-center font-mono font-bold text-lg">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{CURRENT_INVESTIGATOR.name}</h3>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                  Active Session
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {CURRENT_INVESTIGATOR.unit} · {CURRENT_INVESTIGATOR.rank}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">Investigator Badge ID</span>
            <p className="font-mono font-bold text-slate-900">{CURRENT_INVESTIGATOR.badgeId}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg space-y-0.5">
            <span className="text-slate-500 text-[10px] uppercase font-mono">Access Level</span>
            <p className="font-semibold text-slate-900">{CURRENT_INVESTIGATOR.accessLevel}</p>
          </div>
        </div>
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
