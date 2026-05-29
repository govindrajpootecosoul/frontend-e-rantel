import { normalizeAuthUser } from './permissions';
import type { AuthUser } from './types';

const TOKEN_KEY = 'er_token';
const USER_KEY = 'er_user';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuth = (token: string, user: AuthUser) => {
  const normalized = normalizeAuthUser(user);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
};

export const updateStoredUser = (user: AuthUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(normalizeAuthUser(user)));
};

export const updateStoredToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return normalizeAuthUser(JSON.parse(raw) as AuthUser);
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => Boolean(getToken());
