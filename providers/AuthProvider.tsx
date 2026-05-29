'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { getUser, updateStoredToken, updateStoredUser } from '@/lib/auth';
import { canAccessAdminUsers, isSuperAdmin, normalizeAuthUser } from '@/lib/permissions';
import type { AuthUser } from '@/lib/types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  isSuperAdmin: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const cached = getUser();
    if (!cached) {
      setUser(null);
      return;
    }
    try {
      const res = await api.getMe();
      if (res.data.token) updateStoredToken(res.data.token);
      const fresh = normalizeAuthUser(res.data.user);
      updateStoredUser(fresh);
      setUser(fresh);
    } catch {
      setUser(cached);
    }
  }, []);

  useEffect(() => {
    const cached = getUser();
    if (!cached) {
      setLoading(false);
      return;
    }
    setUser(cached);
    void (async () => {
      try {
        const res = await api.getMe();
        if (res.data.token) updateStoredToken(res.data.token);
        const fresh = normalizeAuthUser(res.data.user);
        updateStoredUser(fresh);
        setUser(fresh);
      } catch {
        setUser(cached);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      isSuperAdmin: isSuperAdmin(user),
      canManageUsers: canAccessAdminUsers(user),
    }),
    [user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
