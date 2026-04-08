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

type UserRole = 'customer' | 'business_owner' | null;

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithOtpAs, signInWithGoogle } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    analytics.signupRoleSelect(role ?? 'customer');
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch {
      toast.error('Authentication failed. Retry.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const role = selectedRole === 'business_owner' ? 'business_owner' : 'customer';
      const { error } = await signInWithOtpAs(email, role);
      if (error) throw error;
      
      toast.success('Magic link sent! Check your inbox.');
      analytics.signupComplete(role);
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
      title={selectedRole ? (selectedRole === 'business_owner' ? 'Create Profile.' : 'Join SuburbMates') : 'Join SuburbMates'}
      className="max-w-lg"
    >
      {!selectedRole ? (
        <div className="space-y-4">
          <p className="text-ink-secondary text-center mb-6 text-xs uppercase tracking-wider font-mono">
            How would you like to use SuburbMates?
          </p>
          
          <div className="grid gap-3">
            <button
              onClick={() => handleRoleSelect('customer')}
              className="flex items-center p-5 border border-white/10 rounded-sm hover:border-white/30 hover:bg-white/5 transition-all text-left group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-black transition-colors rounded-sm">
                <User className="w-5 h-5 text-ink-primary group-hover:text-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-ink-primary uppercase tracking-widest text-xs">Customer</h3>
                <p className="text-[10px] text-ink-tertiary mt-1 uppercase tracking-wider">Explore and find creators.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary transition-all group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => handleRoleSelect('business_owner')}
              className="flex items-center p-5 border border-white/10 rounded-sm hover:border-white/30 hover:bg-white/5 transition-all text-left group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-black transition-colors rounded-sm">
                <Store className="w-5 h-5 text-ink-primary group-hover:text-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-ink-primary uppercase tracking-widest text-xs">Creator</h3>
                <p className="text-[10px] text-ink-tertiary mt-1 uppercase tracking-wider">Showcase your work and get leads.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary transition-all group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-12 border border-white/20 bg-white/5 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors uppercase font-bold text-[10px] tracking-widest text-ink-primary rounded-sm"
          >
            Continue with Google
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-widest text-ink-tertiary">
              <span className="bg-ink-surface-1 px-4 uppercase">Direct Link</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-ink-secondary mb-3 ml-1">
                Enter your email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full h-14 pl-12 pr-4 bg-ink-surface-2 border border-white/10 rounded-sm focus:outline-none focus:border-white/40 transition-all placeholder:text-white/10 text-ink-primary"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-white text-black uppercase font-bold tracking-widest text-xs hover:bg-white/90 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="relative z-10">{isLoading ? 'Sending...' : 'Send Magic Link'}</span>
              {!isLoading && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="w-full text-[10px] font-bold uppercase tracking-widest text-ink-tertiary hover:text-ink-primary transition-colors text-center pb-2"
            >
              ← Back to selection
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
}
