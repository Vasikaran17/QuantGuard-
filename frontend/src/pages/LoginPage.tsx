import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
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
      setError('Please provide both administrative credentials.');
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#070A12] overflow-hidden">
      <CyberBackground />

      {/* Decorative Subtle Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Top Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Shield className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5 font-sans">
            QUANTGUARD <span className="text-cyan-400 text-sm font-mono font-normal ml-1">v2.4-QDS</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            Teleportation-Based Quantum Digital Signature Verification
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <span>DEFENSE COMMAND NODE // 5σ INTEGRITY</span>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="soc-card rounded-xl p-7 border border-slate-800 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Operator Authentication
            </span>
            <span className="text-[11px] font-mono text-slate-400">RESTRICTED ACCESS</span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                IDENTIFIER / USERNAME
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
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                CLEARANCE PASSKEY
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
                  className="w-full pl-9 pr-10 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo credentials hint pill */}
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between font-mono">
              <div>
                <span className="text-slate-400">Demo: </span>
                <span className="text-cyan-400 font-semibold">admin</span> / <span className="text-cyan-400">QuantGuard@2026</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline font-sans"
              >
                Autofill
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>INITIALIZE QUANTUM SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 font-mono">
              Smart India Hackathon Prototype // Quantum-Safe Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
