import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, KeyRound, ChevronLeft } from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { login } = useInvestigation();
  const [investigatorId, setInvestigatorId] = useState('A.MEHTA');
  const [password, setPassword] = useState('demo');
  const [role, setRole] = useState<UserRole>('Investigator');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStage('otp');
    }, 400);
  };

  const handleOtpChange = (idx: number, value: string) => {
    const next = [...otp];
    next[idx] = value.replace(/[^0-9]/g, '');
    setOtp(next);
    if (value && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length !== 6) return;
    setIsLoading(true);
    setTimeout(() => {
      login(investigatorId, password, role);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0d0f13] flex flex-col lg:flex-row text-slate-100 select-none">
      {/* Left Branding Hero Section */}
      <div className="lg:w-7/12 p-6 sm:p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1e232d] relative bg-radial from-[#151922] via-[#0d0f13] to-[#090b0e]">
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

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
      <div className="lg:w-5/12 p-6 sm:p-8 lg:p-16 flex flex-col justify-center bg-[#090b0e]">
        <div className="max-w-md w-full mx-auto space-y-6">
          {stage === 'credentials' ? (
            <>
              <div>
                <span className="micro-label text-orange-500 tracking-wider">
                  SECURE INVESTIGATOR ACCESS
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Welcome back</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sign in to access your active investigation desk.
                </p>
              </div>

              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Investigator ID / Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={investigatorId}
                      onChange={(e) => setInvestigatorId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-orange-500 rounded-lg text-sm text-white font-mono placeholder-slate-600 outline-none transition-colors"
                      placeholder="e.g. A.MEHTA or a.mehta@cfu.gov"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
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

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Access Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-orange-500 rounded-lg text-sm text-white font-mono outline-none transition-colors"
                  >
                    <option value="Investigator">Investigator</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer">
                    Forgot password?
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
                  Authorized personnel only · Cyber Fraud Unit
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStage('credentials')}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to credentials
              </button>

              <div>
                <span className="micro-label text-orange-500 tracking-wider">
                  TWO-FACTOR AUTHENTICATION
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Enter verification code</h3>
                <p className="text-xs text-slate-400 mt-1">
                  A 6-digit code was sent to your registered authenticator for {investigatorId}.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-9 h-11 sm:w-11 sm:h-12 text-center bg-slate-900/80 border border-slate-800 focus:border-orange-500 rounded-lg text-lg font-mono font-bold text-white outline-none transition-colors"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 active:scale-[0.99] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating...' : 'Verify & Sign In'}</span>
                </button>

                <div className="text-center">
                  <span className="text-[11px] text-slate-500 cursor-pointer hover:text-slate-300">
                    Didn't receive a code? Resend
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
