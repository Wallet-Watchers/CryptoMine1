import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  FileDown, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const Reports: React.FC = () => {
  const { cases, navigateTo } = useInvestigation();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <span className="micro-label text-slate-500">INVESTIGATION REPORTS</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          Reports
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Generate, preview and export formal evidence dossiers for legal proceedings and partner intelligence sharing.
        </p>
      </div>

      {/* Reports Roster */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
              <th className="py-3 px-4">Case Ref</th>
              <th className="py-3 px-4">Investigation Title</th>
              <th className="py-3 px-4">Fraud Type</th>
              <th className="py-3 px-4">Reported Loss</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Lead Investigator</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigateTo('case-detail', { caseId: c.id, tab: 'report' })}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-orange-600">
                  {c.id}
                </td>

                <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-orange-600">
                  {c.title}
                </td>

                <td className="py-3.5 px-4 text-slate-700">
                  {c.fraudType}
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                  {c.reportedAmount}
                </td>

                <td className="py-3.5 px-4">
                  <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                </td>

                <td className="py-3.5 px-4 text-slate-600">
                  {c.leadInvestigator}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="text-orange-600 font-semibold flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
