'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthSession, User, Vendor } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Get token from localStorage
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
      const storedVendor = typeof window !== 'undefined' ? localStorage.getItem('vendor_data') : null;
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedVendor) {
          setVendor(JSON.parse(storedVendor));
        }
        
        // Verify token is still valid
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        };
        
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers,
        });
        
        if (!response.ok) {
          // Token is invalid, clear storage
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const session: AuthSession = data.data;
      
      // Store in state
      setUser(session.user);
      setVendor(session.vendor || null);
      setToken(session.token);
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', session.token);
        localStorage.setItem('user_data', JSON.stringify(session.user));
        if (session.vendor) {
          localStorage.setItem('vendor_data', JSON.stringify(session.vendor));
        }
      }
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if we have a token
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    setUser(null);
    setVendor(null);
    setToken(null);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('vendor_data');
    }
  };

  const value: AuthContextType = {
    user,
    vendor,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}