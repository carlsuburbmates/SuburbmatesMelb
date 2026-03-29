'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { User, Store, ArrowRight, Mail } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'customer' | 'vendor' | null;

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithOtp, signInWithGoogle } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    analytics.signupRoleSelect(role ?? 'customer');
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      toast.error('Authentication failed. Retry.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signInWithOtp(email);
      if (error) throw error;
      
      toast.success('Magic link sent! Check your inbox.');
      analytics.signupComplete(selectedRole === 'vendor' ? 'vendor' : 'customer');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send magic link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRole(null);
    setEmail('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={selectedRole ? (selectedRole === 'vendor' ? 'Create Profile.' : 'Join SuburbMates') : 'Join SuburbMates'}
      className="max-w-lg"
    >
      {!selectedRole ? (
        <div className="space-y-4">
          <p className="text-slate-500 text-center mb-6 text-sm">
            Choose how you&rsquo;d like to use SuburbMates
          </p>
          
          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelect('customer')}
              className="flex items-center p-4 border border-slate-200 rounded-none hover:border-black transition-all text-left group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-black group-hover:text-white transition-colors">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-black uppercase tracking-widest text-xs">I&rsquo;m a Customer</h3>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">Explore the directory.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-black" />
            </button>

            <button
              onClick={() => handleRoleSelect('vendor')}
              className="flex items-center p-4 border border-slate-200 rounded-none hover:border-black transition-all text-left group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-black group-hover:text-white transition-colors">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-black uppercase tracking-widest text-xs">I&rsquo;m a Creator</h3>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">Build your profile and share your work</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-black" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-12 border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors uppercase font-black text-[10px] tracking-[0.2em]"
          >
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-slate-400">
              <span className="bg-white px-4">Or use magic link</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full h-12 pl-10 pr-4 border border-slate-200 rounded-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-slate-300"
                  placeholder="e.g., name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-black text-white uppercase font-black tracking-[0.3em] text-[10px] hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="w-full text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
            >
              Back to selection
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
}
