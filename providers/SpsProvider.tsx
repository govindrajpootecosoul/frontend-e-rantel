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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DEFAULT_SPS_FILTERS } from '@/lib/sps/constants';
import type {
  SpsFilterKey,
  SpsFiltersState,
  SpsRow,
  SpsSummary,
  SpsTablePagination,
} from '@/lib/sps/types';

const EMPTY_SUMMARY: SpsSummary = {
  totalPoCount: 0,
  skuPoQty: 0,
  poAmount: 0,
  diffQty: 0,
  skuInvoiceQty: 0,
  invoiceAmount: 0,
  diffAmount: 0,
};

interface SpsContextValue {
  storeId: string;
  poRows: SpsRow[];
  invoiceRows: SpsRow[];
  summary: SpsSummary;
  totalRows: number;
  poPagination: SpsTablePagination;
  invoicePagination: SpsTablePagination;
  filters: SpsFiltersState;
  setFilter: (key: SpsFilterKey, value: string) => void;
  resetFilters: () => void;
  filterOptions: Record<SpsFilterKey, string[]>;
  loading: boolean;
  poLoading: boolean;
  invoiceLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refresh: () => void;
  lastUpdated?: string;
}

const SpsContext = createContext<SpsContextValue | null>(null);

export function SpsProvider({
  storeId,
  children,
}: {
  storeId: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SpsFiltersState>(DEFAULT_SPS_FILTERS);
  const [poPage, setPoPage] = useState(1);
  const [poPageSize, setPoPageSize] = useState(25);
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoicePageSize, setInvoicePageSize] = useState(25);

  useEffect(() => {
    setPoPage(1);
    setInvoicePage(1);
  }, [filters]);

  const filtersQuery = useQuery({
    queryKey: ['sps-filters', storeId],
    queryFn: async () => {
      const res = await api.getSpsFilters(storeId);
      return res.data;
    },
  });

  const summaryQuery = useQuery({
    queryKey: ['sps-summary', storeId, filters],
    queryFn: async () => {
      const res = await api.getSpsSummary(storeId, filters);
      return res.data;
    },
  });

  const poQuery = useQuery({
    queryKey: ['sps-orders-po', storeId, filters, poPage, poPageSize],
    queryFn: async () => {
      const res = await api.getSpsOrders(storeId, {
        type: 'po',
        page: poPage,
        limit: poPageSize,
        filters,
      });
      return res.data;
    },
  });

  const invoiceQuery = useQuery({
    queryKey: ['sps-orders-invoice', storeId, filters, invoicePage, invoicePageSize],
    queryFn: async () => {
      const res = await api.getSpsOrders(storeId, {
        type: 'invoice',
        page: invoicePage,
        limit: invoicePageSize,
        filters,
      });
      return res.data;
    },
  });

  const filterOptions = useMemo(() => {
    const options = filtersQuery.data?.filterOptions ?? {};
    return options as Record<SpsFilterKey, string[]>;
  }, [filtersQuery.data?.filterOptions]);

  const summary = summaryQuery.data?.summary ?? EMPTY_SUMMARY;
  const poRows = poQuery.data?.rows ?? [];
  const invoiceRows = invoiceQuery.data?.rows ?? [];
  const totalRows = filtersQuery.data?.totalRows ?? 0;

  const setFilter = useCallback((key: SpsFilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_SPS_FILTERS), []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sps-filters', storeId] });
    queryClient.invalidateQueries({ queryKey: ['sps-summary', storeId] });
    queryClient.invalidateQueries({ queryKey: ['sps-orders-po', storeId] });
    queryClient.invalidateQueries({ queryKey: ['sps-orders-invoice', storeId] });
  }, [queryClient, storeId]);

  const handlePoPageSizeChange = useCallback((size: number) => {
    setPoPageSize(size);
    setPoPage(1);
  }, []);

  const handleInvoicePageSizeChange = useCallback((size: number) => {
    setInvoicePageSize(size);
    setInvoicePage(1);
  }, []);

  const poPagination = useMemo(
    () => ({
      page: poPage,
      pageSize: poPageSize,
      total: poQuery.data?.total ?? 0,
      setPage: setPoPage,
      setPageSize: handlePoPageSizeChange,
    }),
    [poPage, poPageSize, poQuery.data?.total, handlePoPageSizeChange]
  );

  const invoicePagination = useMemo(
    () => ({
      page: invoicePage,
      pageSize: invoicePageSize,
      total: invoiceQuery.data?.total ?? 0,
      setPage: setInvoicePage,
      setPageSize: handleInvoicePageSizeChange,
    }),
    [invoicePage, invoicePageSize, invoiceQuery.data?.total, handleInvoicePageSizeChange]
  );

  const loading = filtersQuery.isLoading || summaryQuery.isLoading;
  const poLoading = poQuery.isLoading || poQuery.isFetching;
  const invoiceLoading = invoiceQuery.isLoading || invoiceQuery.isFetching;
  const isFetching =
    filtersQuery.isFetching ||
    summaryQuery.isFetching ||
    poQuery.isFetching ||
    invoiceQuery.isFetching;

  const error =
    (filtersQuery.error ||
      summaryQuery.error ||
      poQuery.error ||
      invoiceQuery.error) as Error | null;

  const lastUpdated =
    poQuery.data?.lastUpdated ||
    invoiceQuery.data?.lastUpdated ||
    summaryQuery.data?.lastUpdated ||
    filtersQuery.data?.lastUpdated;

  const value = useMemo(
    () => ({
      storeId,
      poRows,
      invoiceRows,
      summary,
      totalRows,
      poPagination,
      invoicePagination,
      filters,
      setFilter,
      resetFilters,
      filterOptions,
      loading,
      poLoading,
      invoiceLoading,
      isFetching,
      error,
      refresh,
      lastUpdated,
    }),
    [
      storeId,
      poRows,
      invoiceRows,
      summary,
      totalRows,
      poPagination,
      invoicePagination,
      filters,
      setFilter,
      resetFilters,
      filterOptions,
      loading,
      poLoading,
      invoiceLoading,
      isFetching,
      error,
      refresh,
      lastUpdated,
    ]
  );

  return <SpsContext.Provider value={value}>{children}</SpsContext.Provider>;
}

export function useSps() {
  const ctx = useContext(SpsContext);
  if (!ctx) throw new Error('useSps must be used within SpsProvider');
  return ctx;
}
