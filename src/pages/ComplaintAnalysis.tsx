import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Pencil, 
  ArrowRight, 
  ShieldAlert,
  Save,
  X
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { EvidenceBadge } from '../components/common/EvidenceBadge';

export const ComplaintAnalysis: React.FC = () => {
  const { 
    complaint,
    extractedFields,
    updateExtractedField,
    setComplaintAnalysisComplete,
    navigateTo,
    showToast
  } = useInvestigation();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const saveEdit = (key: string) => {
    if (!editValue.trim()) return;
    updateExtractedField(key, editValue.trim(), true);
    setEditingKey(null);
    showToast('Field Corrected', 'Extracted value updated by investigator and marked as verified.', 'success');
  };

  const verifiedCount = extractedFields.filter(f => f.verified).length;
  const pendingCount = extractedFields.length - verifiedCount;

  const handleConfirm = () => {
    setComplaintAnalysisComplete();
    navigateTo('case-detail', { caseId: 'CM-2026-0017' });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="micro-label text-orange-700 font-bold">AI EXTRACTION VERIFICATION DESK</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Complaint Analysis
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Review every AI-extracted field before it becomes case intelligence. Nothing proceeds to the investigation without investigator sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-2xs">
          <span className="font-mono font-bold text-slate-900">{verifiedCount}/{extractedFields.length}</span>
          <span className="text-slate-500">fields verified</span>
          {pendingCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
              {pendingCount} need review
            </span>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Original Complaint */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="micro-label text-slate-500">ORIGINAL COMPLAINT</span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Raw Statement</h3>
              </div>
            </div>
            <EvidenceBadge classification="FACT" size="sm" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Date Filed</span>
                <span className="font-mono font-bold text-slate-900">{complaint.dateFiled}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Source</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">{complaint.source}</span>
              </div>
            </div>

            <div className="border-l-2 border-orange-500 pl-3">
              <span className="micro-label text-slate-400">COMPLAINT REFERENCE</span>
              <div className="font-mono font-bold text-slate-900 text-xs mt-1">{complaint.id}</div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200/60 rounded-lg p-4 select-text">
              {complaint.text}
            </p>
          </div>

          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Original text is immutable. Only extracted fields can be corrected below.</span>
          </div>
        </div>

        {/* Right: AI Extracted Information */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="micro-label text-orange-700">AI EXTRACTED INFORMATION</span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Structured Field Cards</h3>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">VERIFICATION REQUIRED</span>
          </div>

          <div className="p-5 space-y-3">
            {extractedFields.map((field) => (
              <div key={field.key} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="micro-label text-slate-500">{field.label}</span>
                    {field.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        Needs Verification
                      </span>
                    )}
                  </div>

                  {editingKey === field.key ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => saveEdit(field.key)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                        title="Save correction & verify"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(field.key, field.value)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md border border-slate-200 hover:border-orange-300 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>

                {editingKey === field.key ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(field.key)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-orange-400 rounded-lg font-mono text-xs text-slate-900 outline-none focus:bg-white"
                    />
                    <button
                      onClick={() => saveEdit(field.key)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  <div className="font-mono text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-2 select-text">
                    {field.value}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer: Confirm & Continue */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              {pendingCount > 0
                ? `${pendingCount} field${pendingCount === 1 ? '' : 's'} still flagged for verification.`
                : 'All extracted fields verified.'}
            </span>
            <button
              onClick={handleConfirm}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer ${
                pendingCount > 0
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
            >
              <span>{pendingCount > 0 ? 'Confirm & Continue (Review Remaining)' : 'Confirm & Continue to Investigation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};