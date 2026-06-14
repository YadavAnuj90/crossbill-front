'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';
import type { Profile } from './types';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, legalName?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: Profile | null) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    try {
      const me = await api.profile.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // On mount: exchange refresh cookie → access token, then load the profile.
  useEffect(() => {
    (async () => {
      const ok = await api.auth.bootstrap();
      if (ok) await loadProfile();
      setLoading(false);
    })();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    await api.auth.login({ email, password });
    await loadProfile();
    try { sessionStorage.setItem('cb_welcome', 'returning'); } catch {}
    router.push('/dashboard');
  }, [loadProfile, router]);

  const register = useCallback(async (email: string, password: string, legalName?: string) => {
    await api.auth.register({ email, password, legalName });
    await loadProfile();
    try { sessionStorage.setItem('cb_welcome', 'new'); } catch {}
    router.push('/dashboard');
  }, [loadProfile, router]);

  const logout = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
