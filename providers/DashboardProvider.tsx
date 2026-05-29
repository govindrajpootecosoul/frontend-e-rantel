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
  clearExecutiveSectionCaches,
  readBarChartsCache,
  readOverviewCache,
  readStatusChartsCache,
  writeBarChartsCache,
  writeOverviewCache,
  writeStatusChartsCache,
} from '@/lib/executive/sectionCache';
import type { DashboardData, FilterOptions, FiltersState } from '@/lib/types';

const EMPTY_BAR_SERIES = { daily: [], monthly: [], yearly: [] } as const;

interface DashboardContextValue {
  filters: FiltersState;
  setFilter: (key: keyof FiltersState, value: string) => void;
  resetFilters: () => void;
  filterOptions?: FilterOptions;
  filtersLoading: boolean;
  dashboard?: DashboardData;
  dashboardLoading: boolean;
  overviewLoading: boolean;
  barChartsLoading: boolean;
  statusChartsLoading: boolean;
  isRefreshing: boolean;
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
  const forceServerRefreshRef = useRef(false);

  const filtersQuery = useQuery({
    queryKey: ['executive-filters'],
    queryFn: async () => (await api.getExecutiveFilters()).data,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const overviewQuery = useQuery({
    queryKey: ['executive-overview', deferredFilters],
    queryFn: async () => {
      const res = await api.getExecutiveOverview(
        deferredFilters,
        forceServerRefreshRef.current
      );
      writeOverviewCache(deferredFilters, res.data);
      return res.data;
    },
    initialData: () => readOverviewCache(deferredFilters) ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const barChartsQuery = useQuery({
    queryKey: ['executive-bar-charts', deferredFilters],
    queryFn: async () => {
      const res = await api.getExecutiveBarCharts(
        deferredFilters,
        forceServerRefreshRef.current
      );
      writeBarChartsCache(deferredFilters, res.data);
      return res.data;
    },
    initialData: () => readBarChartsCache(deferredFilters) ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!overviewQuery.data,
  });

  const statusChartsQuery = useQuery({
    queryKey: ['executive-status-charts', deferredFilters],
    queryFn: async () => {
      const res = await api.getExecutiveStatusCharts(
        deferredFilters,
        forceServerRefreshRef.current
      );
      writeStatusChartsCache(deferredFilters, res.data);
      return res.data;
    },
    initialData: () => readStatusChartsCache(deferredFilters) ?? undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!overviewQuery.data,
  });

  const dashboard = useMemo((): DashboardData | undefined => {
    const overview = overviewQuery.data;
    if (!overview) return undefined;

    const barCharts = barChartsQuery.data?.charts;
    const statusCharts = statusChartsQuery.data?.charts;

    return {
      rowCount: overview.rowCount,
      dedupedCount: overview.dedupedCount,
      summary: overview.summary,
      kpiCards: overview.kpiCards,
      charts: {
        poSaleByRetailer: barCharts?.poSaleByRetailer ?? { ...EMPTY_BAR_SERIES },
        invoiceSaleByRetailer: barCharts?.invoiceSaleByRetailer ?? { ...EMPTY_BAR_SERIES },
        poDeliveryStatus: statusCharts?.poDeliveryStatus ?? [],
        poStatusBreakdown: statusCharts?.poStatusBreakdown ?? [],
      },
      lastUpdated: overview.lastUpdated,
    };
  }, [overviewQuery.data, barChartsQuery.data, statusChartsQuery.data]);

  const setFilter = useCallback((key: keyof FiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const refresh = useCallback(() => {
    clearExecutiveSectionCaches();
    forceServerRefreshRef.current = true;
    void (async () => {
      await overviewQuery.refetch();
      await Promise.all([barChartsQuery.refetch(), statusChartsQuery.refetch()]);
      forceServerRefreshRef.current = false;
    })();
  }, [overviewQuery, barChartsQuery, statusChartsQuery]);

  const isComputing = filters !== deferredFilters;

  const overviewLoading = overviewQuery.isPending && !overviewQuery.data;
  const barChartsLoading = barChartsQuery.isPending && !barChartsQuery.data;
  const statusChartsLoading = statusChartsQuery.isPending && !statusChartsQuery.data;
  const dashboardLoading = overviewLoading;
  const isRefreshing =
    (overviewQuery.isFetching && !!overviewQuery.data) ||
    (barChartsQuery.isFetching && !!barChartsQuery.data) ||
    (statusChartsQuery.isFetching && !!statusChartsQuery.data);

  const dashboardError =
    (overviewQuery.error as Error | null) ||
    (barChartsQuery.error as Error | null) ||
    (statusChartsQuery.error as Error | null);

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      resetFilters,
      filterOptions: filtersQuery.data,
      filtersLoading: filtersQuery.isPending && !filtersQuery.data,
      dashboard,
      dashboardLoading,
      overviewLoading,
      barChartsLoading,
      statusChartsLoading,
      isRefreshing,
      isComputing,
      dashboardError,
      refresh,
      sidebarCollapsed,
      setSidebarCollapsed,
    }),
    [
      filters,
      setFilter,
      resetFilters,
      filtersQuery.data,
      filtersQuery.isPending,
      dashboard,
      dashboardLoading,
      overviewLoading,
      barChartsLoading,
      statusChartsLoading,
      isRefreshing,
      isComputing,
      dashboardError,
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
