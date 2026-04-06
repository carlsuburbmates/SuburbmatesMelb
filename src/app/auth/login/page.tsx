'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithOtp, signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      toast.error('Google login failed.');
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signInWithOtp(email);
      if (error) throw error;
      toast.success('Magic link sent! Check your email.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send magic link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-base flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow — top left */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-slate-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center text-3xl font-bold text-ink-primary uppercase tracking-[0.3em]">
          Sign In
        </h2>
        <p className="mt-4 text-center text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.4em]">
          Protocol Access: SuburbMates
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-ink-surface-1 border border-white/5 p-8 md:p-10 shadow-2xl rounded-sm">
          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full h-14 border border-white/10 flex items-center justify-center gap-4 hover:bg-white/5 hover:border-white/20 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-primary">
                Continue with Google
              </span>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:translate-x-1 group-hover:text-white transition-all" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.4em] text-ink-tertiary">
                <span className="bg-ink-surface-1 px-6">Or use email</span>
              </div>
            </div>

            <form onSubmit={handleMagicLinkLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-ink-tertiary mb-3 ml-1">
                  Secure Identity (Email)
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary group-focus-within:text-ink-primary transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-ink-base border border-white/10 focus:border-white/30 text-ink-primary text-sm placeholder:text-ink-tertiary placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest transition-all focus:outline-none"
                    placeholder="ENTER EMAIL ADDRESS"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-white text-black uppercase font-bold tracking-[0.5em] text-[10px] hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing' : 'Send Magic Link'}
              </button>
            </form>

            <div className="pt-8 mt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest text-center">
                Initial Encounter? {' '}
                <Link href="/auth/signup" className="text-ink-primary hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
                  Register Profile
                </Link>
              </p>
              
              <Link href="/" className="text-[9px] font-bold text-ink-tertiary hover:text-ink-secondary transition-all uppercase tracking-[0.2em] flex items-center gap-2 group">
                <span className="w-px h-3 bg-white/10" />
                Return to Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
