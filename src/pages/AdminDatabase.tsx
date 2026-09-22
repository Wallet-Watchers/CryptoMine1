import React, { useState } from 'react';
import {
  Database,
  ShieldAlert,
  Building2,
  Landmark,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { EvidenceBadge } from '../components/common/EvidenceBadge';
import { MonoText } from '../components/common/MonoText';

export const AdminDatabase: React.FC = () => {
  const { vaspDatabase, knownRiskAddresses, currentRole } = useInvestigation();
  const [vaspSearch, setVaspSearch] = useState('');
  const [riskSearch, setRiskSearch] = useState('');

  if (currentRole !== 'Admin') {
    return (
      <div className="p-10 bg-white border border-slate-200 rounded-xl shadow-2xs text-center space-y-2">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Access Restricted</h3>
        <p className="text-xs text-slate-500">
          The Intelligence Database is available to Admins only.
        </p>
      </div>
    );
  }

  const filteredVasp = vaspDatabase.filter(v =>
    v.name.toLowerCase().includes(vaspSearch.toLowerCase()) ||
    v.blockchain.toLowerCase().includes(vaspSearch.toLowerCase()) ||
    v.knownWalletCluster.toLowerCase().includes(vaspSearch.toLowerCase())
  );

  const filteredRisk = knownRiskAddresses.filter(r =>
    r.wallet.toLowerCase().includes(riskSearch.toLowerCase()) ||
    r.riskCategory.toLowerCase().includes(riskSearch.toLowerCase()) ||
    r.source.toLowerCase().includes(riskSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="micro-label text-emerald-700 font-bold">PRIVILEGED ADMIN REFERENCE</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock className="w-3 h-3" />
              ADMIN ONLY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Intelligence Database
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Maintained, privileged reference of known VASP clusters and risk addresses. This area is separate from investigator desks.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-900 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
        <span>
          <strong>Evidence tier note:</strong> VASP entries below are intelligence leads, not legal determinations. Attribution is always framed as Likely / confidence %. Verify independently before citing in evidence.
        </span>
      </div>

      {/* VASP Database Table */}
      <div className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="micro-label text-slate-500">REFERENCE TABLE</span>
                <h3 className="text-sm font-bold text-slate-900">VASP Database</h3>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={vaspSearch}
                onChange={(e) => setVaspSearch(e.target.value)}
                placeholder="Search VASP, cluster or chain..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[52rem]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
                  <th className="py-3 px-4">VASP Name</th>
                  <th className="py-3 px-4">Known Wallet / Cluster</th>
                  <th className="py-3 px-4">Blockchain</th>
                  <th className="py-3 px-4">Evidence Source</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVasp.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{v.name}</span>
                      <span className="text-slate-400 font-mono text-[11px] block">{v.id} · {v.type}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <MonoText value={v.knownWalletCluster} truncate />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{v.blockchain}</td>
                    <td className="py-3.5 px-4 text-slate-600">{v.evidenceSource}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{v.lastVerified}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full text-[11px] border ${
                        v.confidence >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : v.confidence >= 70
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {v.confidence >= 80 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {v.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Known Risk Addresses Table */}
      <div className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="micro-label text-slate-500">RISK INTELLIGENCE</span>
                <h3 className="text-sm font-bold text-slate-900">Known Risk Addresses</h3>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={riskSearch}
                onChange={(e) => setRiskSearch(e.target.value)}
                placeholder="Search address, category or source..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[52rem]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
                  <th className="py-3 px-4">Wallet</th>
                  <th className="py-3 px-4">Risk Category</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRisk.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <MonoText value={r.wallet} truncate />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <ShieldAlert className="w-3 h-3" />
                        {r.riskCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{r.source}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{r.dateAdded}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-xl text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-orange-400" />
          <span className="font-mono">Reference access logged · Admin session required</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-500">Level 4 · Privileged intelligence</span>
        </div>
      </div>
    </div>
  );
};