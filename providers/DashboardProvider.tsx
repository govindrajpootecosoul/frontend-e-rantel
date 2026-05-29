'use client';

import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DEFAULT_FILTERS } from '@/lib/constants';
import {
  applyExecutiveFilters,
  buildExecutiveFilterOptions,
  computeExecutiveDashboard,
} from '@/lib/executive/compute';
import {
  clearExecutiveDatasetCache,
  readExecutiveDatasetCache,
  writeExecutiveDatasetCache,
} from '@/lib/executive/datasetCache';
import type { ExecutiveRow } from '@/lib/executive/types';
import type { DashboardData, FilterOptions, FiltersState } from '@/lib/types';

interface ExecutiveDataset {
  rows: ExecutiveRow[];
  lastUpdated: string;
}

interface DashboardContextValue {
  filters: FiltersState;
  setFilter: (key: keyof FiltersState, value: string) => void;
  resetFilters: () => void;
  filterOptions?: FilterOptions;
  filtersLoading: boolean;
  dashboard?: DashboardData;
  dashboardLoading: boolean;
  isRefreshing: boolean;
  isComputing: boolean;
  dashboardError: Error | null;
  refresh: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

function getInitialDataset(): ExecutiveDataset | undefined {
  const cached = readExecutiveDatasetCache();
  if (!cached) return undefined;
  return { rows: cached.rows, lastUpdated: cached.lastUpdated };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const deferredFilters = useDeferredValue(filters);
  const forceServerRefreshRef = useRef(false);

  const datasetQuery = useQuery({
    queryKey: ['executive-dataset'],
    queryFn: async () => {
      const forceRefresh = forceServerRefreshRef.current;
      forceServerRefreshRef.current = false;
      const res = await api.getExecutiveDataset(forceRefresh);
      const data = {
        rows: res.data.rows as ExecutiveRow[],
        lastUpdated: res.data.lastUpdated,
      };
      writeExecutiveDatasetCache(data.rows, data.lastUpdated);
      return data;
    },
    initialData: getInitialDataset,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: 'always',
  });

  const allRows = datasetQuery.data?.rows ?? [];
  const lastUpdated = datasetQuery.data?.lastUpdated ?? new Date().toISOString();

  const filterOptions = useMemo(
    () => (allRows.length ? buildExecutiveFilterOptions(allRows) : undefined),
    [allRows]
  );

  const filteredRows = useMemo(
    () => applyExecutiveFilters(allRows, deferredFilters),
    [allRows, deferredFilters]
  );

  const dashboard = useMemo(
    () => (allRows.length ? computeExecutiveDashboard(filteredRows, lastUpdated) : undefined),
    [filteredRows, lastUpdated, allRows.length]
  );

  const setFilter = useCallback((key: keyof FiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const refresh = useCallback(() => {
    clearExecutiveDatasetCache();
    forceServerRefreshRef.current = true;
    void datasetQuery.refetch();
  }, [datasetQuery]);

  const isComputing = filters !== deferredFilters;
  const hasData = allRows.length > 0;
  const dashboardLoading = datasetQuery.isPending && !hasData;
  const isRefreshing = datasetQuery.isFetching && hasData;

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      resetFilters,
      filterOptions,
      filtersLoading: dashboardLoading,
      dashboard,
      dashboardLoading,
      isRefreshing,
      isComputing,
      dashboardError: datasetQuery.error as Error | null,
      refresh,
      sidebarCollapsed,
      setSidebarCollapsed,
    }),
    [
      filters,
      setFilter,
      resetFilters,
      filterOptions,
      dashboardLoading,
      dashboard,
      isRefreshing,
      isComputing,
      datasetQuery.error,
      refresh,
      sidebarCollapsed,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
