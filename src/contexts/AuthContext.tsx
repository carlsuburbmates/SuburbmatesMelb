'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Vendor } from '@/lib/types';
import supabase from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signInWithOtpAs: (email: string, userType: 'customer' | 'business_owner') => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ensureUserRecord = async (sessionUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (!userError && !userData) {
        const metadata = (sessionUser.user_metadata ?? {}) as Record<string, unknown>;
        const requestedType = metadata.user_type === 'business_owner' ? 'business_owner' : 'customer';
        await supabase.from('users').upsert({
          id: sessionUser.id,
          email: sessionUser.email || '',
          user_type: requestedType,
          first_name: typeof metadata.first_name === 'string' ? metadata.first_name : null,
          last_name: typeof metadata.last_name === 'string' ? metadata.last_name : null,
        });
      }
    };

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setToken(session.access_token);
        await ensureUserRecord(session.user);
        // Sync user and check for vendor profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (userData) {
          setUser(userData);
          const { data: vendorData } = await supabase
            .from('vendors')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          setVendor(vendorData || null);
        }
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setToken(session.access_token);
        await ensureUserRecord(session.user);
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(userData || null);
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        setVendor(vendorData || null);
      } else {
        setUser(null);
        setVendor(null);
        setToken(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (email: string) => {
    return await signInWithOtpAs(email, 'customer');
  };

  const signInWithOtpAs = async (email: string, userType: 'customer' | 'business_owner') => {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          user_type: userType,
        },
      },
    });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVendor(null);
    setToken(null);
  };

  const value = {
    user,
    vendor,
    token,
    isAuthenticated: !!user,
    isLoading,
    signInWithOtp,
    signInWithOtpAs,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
