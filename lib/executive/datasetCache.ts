import type { ExecutiveRow } from './types';

const CACHE_KEY = 'er-executive-dataset-v1';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface CachedExecutiveDataset {
  rows: ExecutiveRow[];
  lastUpdated: string;
  savedAt: number;
}

export function readExecutiveDatasetCache(): CachedExecutiveDataset | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedExecutiveDataset;
    if (!parsed?.rows?.length || !parsed.lastUpdated) return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeExecutiveDatasetCache(rows: ExecutiveRow[], lastUpdated: string): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedExecutiveDataset = {
      rows,
      lastUpdated,
      savedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded or private mode — skip persistence
  }
}

export function clearExecutiveDatasetCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
