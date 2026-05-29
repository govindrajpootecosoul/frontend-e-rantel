'use client';

import { api } from '@/lib/api';
import { DEFAULT_SPROUTS_FILTERS, DEFAULT_SPROUTS_RISK_FILTERS } from '@/lib/stores/sprouts/constants';
import type { SproutsRiskFilterKey, SproutsRiskFiltersState } from '@/lib/stores/sprouts/risk-types';
import type { SproutsTabId } from '@/lib/stores/sprouts/types';
import type {
  SproutsChainStoreRow,
  SproutsFilterKey,
  SproutsFiltersState,
  SproutsQuantitySummaryRow,
  SproutsRetailerSummaryRow,
  SproutsSummary,
} from '@/lib/stores/sprouts/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface SproutsContextValue {
  filters: SproutsFiltersState;
  setFilter: (key: SproutsFilterKey, value: string) => void;
  resetFilters: () => void;
  filterOptions: Record<string, string[]>;
  summary: SproutsSummary;
  byRetailer: SproutsRetailerSummaryRow[];
  byQuantity: SproutsQuantitySummaryRow[];
  detailRows: SproutsChainStoreRow[];
  detailPage: number;
  detailPageSize: number;
  detailTotal: number;
  detailTotalPages: number;
  setDetailPage: (page: number) => void;
  setDetailPageSize: (size: number) => void;
  loading: boolean;
  isFetching: boolean;
  error: Error | null;
  refresh: () => void;
  totalRows: number;
  activeTab: SproutsTabId;
  setActiveTab: (tab: SproutsTabId) => void;
  inventoryReportMonth: string;
  setInventoryReportMonth: (month: string) => void;
  inventoryMonthOptions: string[];
  riskFilters: SproutsRiskFiltersState;
  setRiskFilter: (key: SproutsRiskFilterKey, value: string) => void;
  resetRiskFilters: () => void;
  riskFilterOptions: Record<string, string[]>;
}

const emptySummary = (): SproutsSummary => ({
  orderedVendorCost: 0,
  shippedVendorCost: 0,
  fillRateVendorCost: 0,
  markupAvg: 0,
  retailerCount: 0,
  storeCount: 0,
  skuCount: 0,
  rowCount: 0,
});

const SproutsContext = createContext<SproutsContextValue | null>(null);

export function SproutsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SproutsFiltersState>({ ...DEFAULT_SPROUTS_FILTERS });
  const [detailPage, setDetailPage] = useState(1);
  const [detailPageSize, setDetailPageSize] = useState(25);
  const [activeTab, setActiveTab] = useState<SproutsTabId>('chain-store');
  const [inventoryReportMonth, setInventoryReportMonth] = useState('All');
  const [riskFilters, setRiskFilters] = useState<SproutsRiskFiltersState>({
    ...DEFAULT_SPROUTS_RISK_FILTERS,
  });

  const setRiskFilter = useCallback((key: SproutsRiskFilterKey, value: string) => {
    setRiskFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetRiskFilters = useCallback(() => {
    setRiskFilters({ ...DEFAULT_SPROUTS_RISK_FILTERS });
  }, []);

  const inventoryFiltersQuery = useQuery({
    queryKey: ['sprouts-inventory-filters'],
    queryFn: async () => (await api.getSproutsInventoryFilters()).data,
    staleTime: 30_000,
  });

  const riskFiltersQuery = useQuery({
    queryKey: ['sprouts-risk-filters', riskFilters],
    queryFn: async () => (await api.getSproutsRiskInventoryFilters(riskFilters)).data,
    staleTime: 30_000,
  });

  const setFilter = useCallback((key: SproutsFilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDetailPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_SPROUTS_FILTERS });
    setDetailPage(1);
  }, []);

  const filtersQuery = useQuery({
    queryKey: ['sprouts-filters', filters],
    queryFn: async () => {
      const res = await api.getSproutsChainStoreFilters(filters);
      return res.data;
    },
    staleTime: 30_000,
  });

  const summaryQuery = useQuery({
    queryKey: ['sprouts-summary', filters],
    queryFn: async () => {
      const res = await api.getSproutsChainStoreSummary(filters);
      return res.data;
    },
    staleTime: 0,
  });

  const rowsQuery = useQuery({
    queryKey: ['sprouts-rows', filters, detailPage, detailPageSize],
    queryFn: async () => {
      const res = await api.getSproutsChainStoreRows(filters, {
        page: detailPage,
        limit: detailPageSize,
      });
      return res.data;
    },
    staleTime: 0,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sprouts-filters'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-summary'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-rows'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-inventory'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-inventory-filters'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-inventory-dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-risk-filters'] });
    queryClient.invalidateQueries({ queryKey: ['sprouts-risk-dashboard'] });
  }, [queryClient]);

  const value = useMemo<SproutsContextValue>(
    () => ({
      filters,
      setFilter,
      resetFilters,
      filterOptions: filtersQuery.data?.filterOptions ?? {},
      summary: summaryQuery.data?.summary ?? emptySummary(),
      byRetailer: summaryQuery.data?.byRetailer ?? [],
      byQuantity: summaryQuery.data?.byQuantity ?? [],
      detailRows: rowsQuery.data?.rows ?? [],
      detailPage,
      detailPageSize,
      detailTotal: rowsQuery.data?.total ?? 0,
      detailTotalPages: rowsQuery.data?.totalPages ?? 0,
      setDetailPage,
      setDetailPageSize: (size: number) => {
        setDetailPageSize(size);
        setDetailPage(1);
      },
      loading: filtersQuery.isLoading || summaryQuery.isLoading || rowsQuery.isLoading,
      isFetching: filtersQuery.isFetching || summaryQuery.isFetching || rowsQuery.isFetching,
      error:
        (filtersQuery.error as Error) ||
        (summaryQuery.error as Error) ||
        (rowsQuery.error as Error) ||
        null,
      refresh,
      totalRows: filtersQuery.data?.totalRows ?? 0,
      activeTab,
      setActiveTab,
      inventoryReportMonth,
      setInventoryReportMonth,
      inventoryMonthOptions: inventoryFiltersQuery.data?.months ?? ['All'],
      riskFilters,
      setRiskFilter,
      resetRiskFilters,
      riskFilterOptions: riskFiltersQuery.data?.filterOptions ?? {},
    }),
    [
      filters,
      setFilter,
      resetFilters,
      filtersQuery.data,
      filtersQuery.isLoading,
      filtersQuery.isFetching,
      filtersQuery.error,
      summaryQuery.data,
      summaryQuery.isLoading,
      summaryQuery.isFetching,
      summaryQuery.error,
      rowsQuery.data,
      rowsQuery.isLoading,
      rowsQuery.isFetching,
      rowsQuery.error,
      detailPage,
      detailPageSize,
      refresh,
      activeTab,
      inventoryReportMonth,
      inventoryFiltersQuery.data?.months,
      riskFilters,
      setRiskFilter,
      resetRiskFilters,
      riskFiltersQuery.data?.filterOptions,
    ]
  );

  return <SproutsContext.Provider value={value}>{children}</SproutsContext.Provider>;
}

export function useSprouts() {
  const ctx = useContext(SproutsContext);
  if (!ctx) throw new Error('useSprouts must be used within SproutsProvider');
  return ctx;
}
