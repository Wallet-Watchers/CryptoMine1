import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

export const Login: React.FC = () => {
  const { login } = useInvestigation();
  const [investigatorId, setInvestigatorId] = useState('A.MEHTA');
  const [password, setPassword] = useState('demo');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(investigatorId, password);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0d0f13] flex flex-col lg:flex-row text-slate-100 select-none">
      {/* Left Branding Hero Section */}
      <div className="lg:w-7/12 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1e232d] relative bg-radial from-[#151922] via-[#0d0f13] to-[#090b0e]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider font-mono text-white m-0 leading-none">
                CryptoMine
              </h1>
              <span className="text-[11px] text-slate-500 font-mono tracking-widest block uppercase mt-1">
                Digital Asset Investigation Platform
              </span>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>FINANCIAL CRIME INTELLIGENCE</span>
          </div>
        </div>

        <div className="my-12 lg:my-0 max-w-xl">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Trace the signal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              behind the wallet.
            </span>
          </h2>
          <p className="mt-5 text-sm lg:text-base text-slate-400 leading-relaxed">
            Structured intelligence for investigators working cryptocurrency-enabled fraud cases, 
            campaign linkages, intermediary layering detection, and downstream VASP attribution.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg">
              <span className="micro-label text-slate-500">EVIDENCE STANDARD</span>
              <p className="text-slate-300 mt-1">Multi-tier classification across Facts, Observations, and Inferences.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg">
              <span className="micro-label text-slate-500">CORRELATION ENGINE</span>
              <p className="text-slate-300 mt-1">Connect fragmented complaints into unified fraud syndicate patterns.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1e232d] text-xs text-slate-500 font-mono">
          <span>CASEWORK DESK · Investigative clarity at every hop.</span>
        </div>
      </div>

      {/* Right Sign-in Form */}
      <div className="lg:w-5/12 p-8 lg:p-16 flex flex-col justify-center bg-[#090b0e]">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <span className="micro-label text-orange-500 tracking-wider">
              SECURE INVESTIGATOR ACCESS
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">Welcome back</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to access your active investigation desk.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Investigator Badge ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={investigatorId}
                  onChange={(e) => setInvestigatorId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-orange-500 rounded-lg text-sm text-white font-mono placeholder-slate-600 outline-none transition-colors"
                  placeholder="e.g. A.MEHTA"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-orange-500 rounded-lg text-sm text-white font-mono placeholder-slate-600 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Sign In to Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
              Authorized personnel only · Cyber Fraud Unit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
