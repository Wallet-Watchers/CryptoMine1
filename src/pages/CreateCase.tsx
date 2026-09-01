import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  FileUp,
  Trash2,
  Wallet,
  Hash,
  Link2,
  Calendar,
  ClipboardList,
  FileText,
  UploadCloud,
  Info
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { FraudType, BlockchainType } from '../types';

const FRAUD_TYPES: FraudType[] = ['Investment Scam', 'Task-Based Fraud', 'Phishing', 'Romance Scam', 'Other'];
const BLOCKCHAINS: BlockchainType[] = ['TRON', 'Ethereum', 'Bitcoin'];
const CURRENCIES = ['USDT', 'USDC', 'ETH', 'BTC', 'TRX', 'INR'];

export const CreateCase: React.FC = () => {
  const { cases, navigateTo, addNewCase, showToast, currentRole } = useInvestigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextCaseNumber = Math.max(...cases.map(c => Number(c.id.split('-').pop()) || 0)) + 1;
  const autoCaseId = `CM-2026-${String(nextCaseNumber).padStart(4, '0')}`;

  const [fraudType, setFraudType] = useState<FraudType>('Investment Scam');
  const [currency, setCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [dateOfFraud, setDateOfFraud] = useState('');
  const [blockchain, setBlockchain] = useState<BlockchainType>('TRON');
  const [description, setDescription] = useState('');

  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(pdf|txt)$/i.test(file.name)) {
      showToast('Unsupported File', 'Please upload a PDF or TXT complaint.', 'warning');
      return;
    }
    setFileName(file.name);
    showToast('Complaint Attached', `${file.name} staged for AI extraction.`, 'success');
  };

  const handleStartInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !amount || !description) {
      showToast('Missing Fields', 'Wallet address, amount and description are required.', 'warning');
      return;
    }

    const reportedAmountValue = `${Number(amount).toLocaleString()} ${currency}`;

    addNewCase({
      id: '',
      title: `${fraudType} — ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      fraudType,
      riskLevel: 'MEDIUM',
      riskScore: 0,
      blockchain,
      asset: currency,
      reportedAmount: reportedAmountValue,
      sentAmount: reportedAmountValue,
      tracedAmount: 'Pending analysis',
      retainedAmount: 'Pending analysis',
      primaryWallet: walletAddress,
      status: 'Under Investigation',
      leadInvestigator: 'A. Mehta',
      unit: 'Cyber Fraud Unit',
      createdAt: '26 Aug 2026, 15:20',
      updatedAt: 'Just now',
      complaintText: description,
      contactMethod: 'Manual entry',
      walletsIdentified: 1,
      transactionsCount: 0,
      intermediaryCount: 0,
      connectedCasesCount: 0,
      timeline: [
        {
          id: 'T-01',
          date: '26 Aug 2026',
          time: '15:20',
          title: 'Intake form completed',
          description: 'New investigation initialized from complaint intake.',
          classification: 'FACT'
        }
      ],
      evidenceSignals: [
        {
          id: 'SIG-01',
          title: 'Suspect wallet submitted',
          description: txHash ? `Primary transaction reference: ${txHash}` : 'No transaction hash supplied.',
          classification: 'OBSERVATION'
        }
      ],
      riskContributors: [
        { factor: 'Initial complaint received', points: 0, category: 'Intake', evidence: 'Awaiting on-chain analysis.', severity: 'LOW' }
      ]
    });

    if (fileName) {
      navigateTo('complaint-analysis');
    }
    showToast('Investigation Started', fileName ? 'Complaint forwarded for AI extraction & verification.' : 'New case opened for investigation.', 'success');
  };

  if (currentRole === 'Analyst') {
    showToast('Access Denied', 'Analysts cannot create new investigations.', 'warning');
    navigateTo('cases');
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="micro-label text-slate-500">NEW CASE INTAKE</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          New Investigation
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Record the reported complaint and evidence inputs. AI extraction and on-chain analysis run after intake.
        </p>
      </div>

      <form onSubmit={handleStartInvestigation} className="bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
        {/* Section 1: Case Information */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <span className="micro-label text-orange-700 font-bold">CASE INFORMATION</span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Reported Complaint Details</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Case ID (auto-generated)</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-mono font-bold text-slate-900">{autoCaseId}</span>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">READ ONLY</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Fraud Type</label>
              <select
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value as FraudType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-orange-500"
              >
                {FRAUD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Reported Amount</label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  required
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Date of Fraud</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={dateOfFraud}
                  onChange={(e) => setDateOfFraud(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Blockchain</label>
              <select
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value as BlockchainType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-orange-500"
              >
                {BLOCKCHAINS.map(b => <option key={b} value={b}>{b}</option>)}
                <option value="TRON">BSC (Smart Chain)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-orange-500 leading-relaxed"
                placeholder="Describe initial solicitation, contact vector and transfer details..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Evidence Input */}
        <div className="px-6 pb-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="micro-label text-slate-500">EVIDENCE INPUT</span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Blockchain & Complaint Evidence</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Wallet Address *</label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. TX9f81ka94jLp27Kp2"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Transaction Hash (optional)</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. 0x7e4a839fbc7189ad91cd"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Upload Complaint (PDF / TXT)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              {fileName ? (
                <div className="flex items-center justify-between px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <FileUp className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-semibold text-emerald-800">{fileName}</span>
                    <span className="text-[10px] text-emerald-600 font-mono">READY FOR AI EXTRACTION</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50/40 rounded-lg text-xs text-slate-500 hover:text-orange-700 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>Click to upload complaint file (PDF / TXT)</span>
                </button>
              )}
              <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Uploading a complaint routes into AI extraction & verification before the investigation opens.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Primary Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{fileName ? 'AI extraction → verification → case' : 'Direct to case overview'}</span>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};