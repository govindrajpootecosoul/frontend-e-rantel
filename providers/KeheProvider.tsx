'use client';

import { api } from '@/lib/api';
import { DEFAULT_KEHE_FILTERS } from '@/lib/stores/kehe/constants';
import type {
  KeheChainStoreRow,
  KeheFilterKey,
  KeheFiltersState,
  KeheQuantitySummaryRow,
  KeheRetailerSummaryRow,
  KeheSummary,
} from '@/lib/stores/kehe/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface KeheContextValue {
  filters: KeheFiltersState;
  setFilter: (key: KeheFilterKey, value: string) => void;
  resetFilters: () => void;
  filterOptions: Record<string, string[]>;
  summary: KeheSummary;
  byRetailer: KeheRetailerSummaryRow[];
  byQuantity: KeheQuantitySummaryRow[];
  detailRows: KeheChainStoreRow[];
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
}

const emptySummary = (): KeheSummary => ({
  orderedVendorCost: 0,
  shippedVendorCost: 0,
  fillRateVendorCost: 0,
  markupAvg: 0,
  retailerCount: 0,
  storeCount: 0,
  skuCount: 0,
  rowCount: 0,
});

const KeheContext = createContext<KeheContextValue | null>(null);

export function KeheProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<KeheFiltersState>({ ...DEFAULT_KEHE_FILTERS });
  const [detailPage, setDetailPage] = useState(1);
  const [detailPageSize, setDetailPageSize] = useState(25);

  const setFilter = useCallback((key: KeheFilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDetailPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_KEHE_FILTERS });
    setDetailPage(1);
  }, []);

  const filtersQuery = useQuery({
    queryKey: ['kehe-filters', filters],
    queryFn: async () => {
      const res = await api.getKeheChainStoreFilters(filters);
      return res.data;
    },
    staleTime: 30_000,
  });

  const summaryQuery = useQuery({
    queryKey: ['kehe-summary', filters],
    queryFn: async () => {
      const res = await api.getKeheChainStoreSummary(filters);
      return res.data;
    },
    staleTime: 0,
  });

  const rowsQuery = useQuery({
    queryKey: ['kehe-rows', filters, detailPage, detailPageSize],
    queryFn: async () => {
      const res = await api.getKeheChainStoreRows(filters, {
        page: detailPage,
        limit: detailPageSize,
      });
      return res.data;
    },
    staleTime: 0,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['kehe-filters'] });
    queryClient.invalidateQueries({ queryKey: ['kehe-summary'] });
    queryClient.invalidateQueries({ queryKey: ['kehe-rows'] });
    queryClient.invalidateQueries({ queryKey: ['kehe-inventory'] });
    queryClient.invalidateQueries({ queryKey: ['kehe-risk'] });
  }, [queryClient]);

  const value = useMemo<KeheContextValue>(
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
    ]
  );

  return <KeheContext.Provider value={value}>{children}</KeheContext.Provider>;
}

export function useKehe() {
  const ctx = useContext(KeheContext);
  if (!ctx) throw new Error('useKehe must be used within KeheProvider');
  return ctx;
}
