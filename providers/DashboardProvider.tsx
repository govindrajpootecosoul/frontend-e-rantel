'use client';

import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
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
import type { ExecutiveRow } from '@/lib/executive/types';
import type { DashboardData, FilterOptions, FiltersState } from '@/lib/types';

interface DashboardContextValue {
  filters: FiltersState;
  setFilter: (key: keyof FiltersState, value: string) => void;
  resetFilters: () => void;
  filterOptions?: FilterOptions;
  filtersLoading: boolean;
  dashboard?: DashboardData;
  dashboardLoading: boolean;
  isComputing: boolean;
  dashboardError: Error | null;
  refresh: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const deferredFilters = useDeferredValue(filters);

  const datasetQuery = useQuery({
    queryKey: ['executive-dataset'],
    queryFn: async () => {
      const res = await api.getExecutiveDataset();
      return {
        rows: res.data.rows as ExecutiveRow[],
        lastUpdated: res.data.lastUpdated,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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

  const isComputing = filters !== deferredFilters;

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      resetFilters,
      filterOptions,
      filtersLoading: datasetQuery.isLoading,
      dashboard,
      dashboardLoading: datasetQuery.isLoading,
      isComputing,
      dashboardError: datasetQuery.error as Error | null,
      refresh: () => datasetQuery.refetch(),
      sidebarCollapsed,
      setSidebarCollapsed,
    }),
    [
      filters,
      setFilter,
      resetFilters,
      filterOptions,
      datasetQuery.isLoading,
      dashboard,
      isComputing,
      datasetQuery.error,
      datasetQuery.refetch,
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
