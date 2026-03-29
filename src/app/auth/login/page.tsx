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
    } catch {
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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-black text-black uppercase tracking-[0.2em]">
          Sign In
        </h2>
        <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Welcome back to SuburbMates
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-14 border border-slate-200 flex items-center justify-center gap-4 hover:border-black transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
              Continue with Google
            </span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-black transition-all" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.4em] text-slate-300">
              <span className="bg-white px-6">Or use email</span>
            </div>
          </div>

          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-black mb-3 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 border border-slate-200 rounded-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-slate-200 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-black text-white uppercase font-black tracking-[0.4em] text-[10px] hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            New here?{' '}
            <Link href="/" className="text-black hover:underline decoration-2 underline-offset-4">
              Explore profiles
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
