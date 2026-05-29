import type { DashboardData, FiltersState } from '@/lib/types';
import { DEFAULT_FILTERS } from '@/lib/constants';

const CACHE_VERSION = 'v3';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Section = 'overview' | 'bars' | 'status';

function cacheKey(section: Section, filters: FiltersState) {
  return `er-exec-${section}-${CACHE_VERSION}-${JSON.stringify(filters)}`;
}

function read<T>(section: Section, filters: FiltersState): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(cacheKey(section, filters));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; data: T };
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function write<T>(section: Section, filters: FiltersState, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      cacheKey(section, filters),
      JSON.stringify({ savedAt: Date.now(), data })
    );
  } catch {
    // ignore quota errors
  }
}

export type OverviewCache = Pick<
  DashboardData,
  'rowCount' | 'dedupedCount' | 'summary' | 'kpiCards' | 'lastUpdated'
>;

export type BarChartsCache = {
  charts: Pick<DashboardData['charts'], 'poSaleByRetailer' | 'invoiceSaleByRetailer'>;
  lastUpdated: string;
};

export type StatusChartsCache = {
  charts: Pick<DashboardData['charts'], 'poDeliveryStatus' | 'poStatusBreakdown'>;
  lastUpdated: string;
};

export function readOverviewCache(filters: FiltersState = DEFAULT_FILTERS) {
  return read<OverviewCache>('overview', filters);
}

export function writeOverviewCache(filters: FiltersState, data: OverviewCache) {
  write('overview', filters, data);
}

export function readBarChartsCache(filters: FiltersState = DEFAULT_FILTERS) {
  return read<BarChartsCache>('bars', filters);
}

export function writeBarChartsCache(filters: FiltersState, data: BarChartsCache) {
  write('bars', filters, data);
}

export function readStatusChartsCache(filters: FiltersState = DEFAULT_FILTERS) {
  return read<StatusChartsCache>('status', filters);
}

export function writeStatusChartsCache(filters: FiltersState, data: StatusChartsCache) {
  write('status', filters, data);
}

export function clearExecutiveSectionCaches(): void {
  if (typeof window === 'undefined') return;
  try {
    const prefix = `er-exec-`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) keysToRemove.push(key);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
