import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  FileText,
  GitFork,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { FraudType, BlockchainType } from '../types';

export const CreateCase: React.FC = () => {
  const { navigateTo, addNewCase, showToast } = useInvestigation();

  const [title, setTitle] = useState('Investment Scam — Suspect Wallet Analysis');
  const [fraudType, setFraudType] = useState<FraudType>('Investment Scam');
  const [blockchain, setBlockchain] = useState<BlockchainType>('TRON');
  const [asset, setAsset] = useState('USDT');
  const [reportedAmount, setReportedAmount] = useState('50,000 USDT');
  const [suspectWallet, setSuspectWallet] = useState('TX9f81ka94jLp27Kp2');
  const [txHash, setTxHash] = useState('0x7e4a839fbc7189ad91cd');
  const [complaintText, setComplaintText] = useState(
    'The victim was contacted through Telegram and promised guaranteed investment returns. The victim transferred 50,000 USDT to the reported wallet address. The suspect then instructed the victim to make additional deposits.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectWallet || !complaintText) {
      showToast('Missing Fields', 'Please provide a suspect wallet address and complaint details.', 'warning');
      return;
    }
    setIsAnalyzing(true);

    // Short sequential analysis state
    const timer1 = setTimeout(() => setCurrentStep(2), 350);
    const timer2 = setTimeout(() => setCurrentStep(3), 700);
    const timer3 = setTimeout(() => setCurrentStep(4), 1050);
    const timer4 = setTimeout(() => {
      addNewCase({
        id: '', // Assigned centrally by InvestigationContext.
        title,
        fraudType,
        riskLevel: 'HIGH',
        riskScore: 87,
        blockchain,
        asset,
        reportedAmount,
        sentAmount: reportedAmount,
        tracedAmount: 'Pending analysis',
        retainedAmount: 'Pending analysis',
        primaryWallet: suspectWallet,
        status: 'Under Investigation',
        leadInvestigator: 'A. Mehta',
        unit: 'Cyber Fraud Unit',
        createdAt: '25 Aug 2026, 10:15',
        updatedAt: 'Just now',
        complaintText,
        contactMethod: 'Telegram Channel (@GoldenAlphaYield)',
        walletsIdentified: 1,
        transactionsCount: 0,
        intermediaryCount: 0,
        connectedCasesCount: 0,
        timeline: [
          {
            id: 'T-01',
            date: 'Today',
            title: 'Complaint filed & analyzed',
            description: 'Complaint intake recorded; on-chain evidence analysis is pending.',
            classification: 'FACT'
          }
        ],
        evidenceSignals: [
          {
            id: 'SIG-01',
            title: 'Primary wallet submitted',
            description: txHash ? 'Primary transaction reference: ' + txHash : 'No transaction reference supplied.',
            classification: 'OBSERVATION'
          }
        ],
        riskContributors: [
          { factor: 'Initial complaint received', points: 0, category: 'Intake', evidence: 'Awaiting on-chain analysis.', severity: 'LOW' }
        ]
      });
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="micro-label text-slate-500">NEW CASE INTAKE</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          New Investigation
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Record reported complaint details and initiate automated blockchain analysis.
        </p>
      </div>

      {!isAnalyzing ? (
        <form onSubmit={handleStartAnalysis} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          {/* Section 1: Complaint Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Complaint Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Fraud Classification</label>
                <select
                  value={fraudType}
                  onChange={(e) => setFraudType(e.target.value as FraudType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-orange-500"
                >
                  <option value="Investment Scam">Investment Scam</option>
                  <option value="Task-Based Fraud">Task-Based Fraud</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Romance Scam">Romance Scam</option>
                  <option value="Pig Butchering">Pig Butchering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reported Loss Amount</label>
                <input
                  type="text"
                  required
                  value={reportedAmount}
                  onChange={(e) => setReportedAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. 50,000 USDT"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Investigation Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. Investment Scam — Suspect Wallet Analysis"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Complaint Description</label>
                <textarea
                  rows={3}
                  required
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-orange-500 leading-relaxed"
                  placeholder="Describe initial solicitation, contact vector and transfer details..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Blockchain Evidence */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Blockchain Evidence
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Blockchain & Asset</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={blockchain}
                    onChange={(e) => setBlockchain(e.target.value as BlockchainType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none"
                  >
                    <option value="TRON">TRON</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="Bitcoin">Bitcoin</option>
                  </select>
                  <input
                    type="text"
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none"
                    placeholder="USDT"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Suspect Wallet Address *</label>
                <input
                  type="text"
                  required
                  value={suspectWallet}
                  onChange={(e) => setSuspectWallet(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. TX9f81ka94jLp27Kp2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Primary Outbound Transaction Hash (Optional)</label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 outline-none focus:border-orange-500"
                  placeholder="e.g. 0x7e4a839fbc7189ad91cd"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
            >
              <span>Analyze Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* Analysis Progress State */
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6 text-center animate-in fade-in duration-200">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Analyzing Investigation Evidence...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Extracting on-chain transaction paths, intermediary nodes, and campaign overlaps.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left text-xs">
            <div className={`p-2.5 rounded-lg border flex items-center justify-between ${currentStep >= 1 ? 'bg-slate-50 border-slate-200 text-slate-900 font-medium' : 'text-slate-400 border-transparent'}`}>
              <span>1. Parsing complaint structure & loss amounts</span>
              {currentStep > 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <div className={`p-2.5 rounded-lg border flex items-center justify-between ${currentStep >= 2 ? 'bg-slate-50 border-slate-200 text-slate-900 font-medium' : 'text-slate-400 border-transparent'}`}>
              <span>2. Retrieving on-chain ledger transfers for {suspectWallet.slice(0, 6)}...</span>
              {currentStep > 2 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <div className={`p-2.5 rounded-lg border flex items-center justify-between ${currentStep >= 3 ? 'bg-slate-50 border-slate-200 text-slate-900 font-medium' : 'text-slate-400 border-transparent'}`}>
              <span>3. Identifying intermediary transit nodes (TB7x...29Lm, TC8m...81Qa)</span>
              {currentStep > 3 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <div className={`p-2.5 rounded-lg border flex items-center justify-between ${currentStep >= 4 ? 'bg-slate-50 border-slate-200 text-slate-900 font-medium' : 'text-slate-400 border-transparent'}`}>
              <span>4. Synthesizing fraud network correlation & VASP candidate</span>
              {currentStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
