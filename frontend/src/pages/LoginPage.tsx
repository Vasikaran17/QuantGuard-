import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { CyberBackground } from '../components/CyberBackground';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('QuantGuard@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Please provide your user identifier and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(username.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('QuantGuard@2026');
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#0A0E17] text-slate-100">
      <CyberBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Emblem & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider font-mono text-white mb-1 uppercase">
            QUANTGUARD
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Quantum-Inspired Cyber Threat Detection
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0F172A] rounded-2xl p-6 border border-[#1E293B] shadow-2xl">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1E293B]">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              Terminal Authentication
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-slate-300 border border-[#334155]">
              Prototype Demo
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0A0E17] border border-[#1E293B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#0A0E17] border border-[#1E293B] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Credentials Helper Card */}
            <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E293B] text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Evaluation: </span>
                <span className="font-mono text-cyan-400 font-semibold">admin</span> / <span className="font-mono text-slate-300">QuantGuard@2026</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                Autofill
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-cyan-600/25"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Compliance & Technical Protocol Footer */}
          <div className="mt-5 pt-4 border-t border-[#1E293B] text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Protected under the Quantum No-Cloning Theorem · Local Prototype Verification Workflow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
