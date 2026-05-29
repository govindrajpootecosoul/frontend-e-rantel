'use client';

import PoTrackerDetailModal from '@/components/po-tracker/PoTrackerDetailModal';
import PoTrackerSummaryCards from '@/components/po-tracker/PoTrackerSummaryCards';
import PoTrackerTable, { type PoTrackerTableRow } from '@/components/po-tracker/PoTrackerTable';
import {
  PO_TRACKER_CONFIG,
  CATEGORY_OPTIONS,
  PO_TRACKER_STATUS_OPTIONS,
} from '@/lib/po-tracker/config';
import type {
  PoTrackerCategory,
  PoTrackerChannelType,
  PoTrackerPoSource,
} from '@/lib/po-tracker/types';
import { formatSpsDate, resolvePoStatus } from '@/lib/sps/utils';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, RefreshCw, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface PoTrackerPageProps {
  channelType: PoTrackerChannelType;
  /** Click status to open PO detail modal, edit fields, and view change history */
  enableStatusDetail?: boolean;
}

export default function PoTrackerPage({
  channelType,
  enableStatusDetail = false,
}: PoTrackerPageProps) {
  const config = PO_TRACKER_CONFIG[channelType];
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<PoTrackerCategory>('all');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [detailRow, setDetailRow] = useState<PoTrackerTableRow | null>(null);

  useEffect(() => {
    setPage(1);
    setStatus('All');
  }, [category, channelType]);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!enableStatusDetail) return;
    const poId = searchParams.get('poId');
    const poSourceParam = searchParams.get('poSource')?.toLowerCase();
    if (!poId || (poSourceParam !== 'sps' && poSourceParam !== 'costco')) return;

    setDetailRow({
      id: poId,
      poSource: poSourceParam,
      category: poSourceParam.toUpperCase(),
      poNumber: searchParams.get('poNumber') || '—',
      channel: '—',
      distributor: '—',
      retailer: '—',
      sku: '—',
      poDate: '—',
      dueDate: '—',
      warehouse: '—',
      status: '—',
    });
  }, [searchParams, enableStatusDetail]);

  const closeDetail = () => {
    setDetailRow(null);
    if (searchParams.get('poId')) {
      router.replace(channelType === 'b2b' ? '/po-trackers/b2b' : '/po-trackers/retails');
    }
  };

  const summaryQuery = useQuery({
    queryKey: ['po-tracker-summary', channelType, category, status, search],
    queryFn: async () => {
      const res = await api.getPoTrackerSummary(channelType, {
        category,
        status,
        search,
      });
      return res.data;
    },
    staleTime: 0,
  });

  const ordersQuery = useQuery({
    queryKey: ['po-tracker-orders', channelType, category, status, search, page, pageSize],
    queryFn: async () => {
      const res = await api.getPoTrackerOrders(channelType, {
        category,
        status,
        search,
        page,
        limit: pageSize,
      });
      return res.data;
    },
    staleTime: 0,
  });

  const summaryMatchesFilters =
    summaryQuery.data?.category === category &&
    summaryQuery.data?.channelType === channelType;

  const ordersMatchFilters =
    ordersQuery.data?.category === category && ordersQuery.data?.channelType === channelType;

  const summary = summaryMatchesFilters ? summaryQuery.data?.summary : undefined;
  const summaryLoading =
    summaryQuery.isLoading || summaryQuery.isFetching || !summaryMatchesFilters;

  const rows = ordersMatchFilters ? (ordersQuery.data?.rows ?? []) : [];
  const total = ordersMatchFilters ? (ordersQuery.data?.total ?? 0) : 0;
  const loading =
    ordersQuery.isLoading || ordersQuery.isFetching || !ordersMatchFilters;
  const lastUpdated = ordersQuery.data?.lastUpdated;

  const tableRows = useMemo(
    () =>
      rows.map((row) => {
        const source = String((row as { _poSource?: string })._poSource || 'sps').toLowerCase();
        const poSource: PoTrackerPoSource = source === 'costco' ? 'costco' : 'sps';
        return {
        id: row._id,
        poSource,
        category: poSource.toUpperCase(),
        poNumber: row.poNumber || '—',
        channel: row.channel || '—',
        distributor: row.distributor || '—',
        retailer: row.retailer || '—',
        sku: row.sku || '—',
        poDate: formatSpsDate(row.poDate),
        dueDate: formatSpsDate(row.poRequestedDeliveryDate),
        warehouse: row.warehouse || '—',
        status: resolvePoStatus(row) || '—',
      };
      }),
    [rows]
  );

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['po-tracker-summary', channelType] });
    queryClient.invalidateQueries({ queryKey: ['po-tracker-orders', channelType] });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
            PO Trackers
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">{config.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            {config.subtitle}
            {lastUpdated && !loading && (
              <span className="text-slate-600"> · Updated {formatDateTime(lastUpdated)}</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh now
        </button>
      </div>

      {(ordersQuery.error || summaryQuery.error) && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {(ordersQuery.error || summaryQuery.error)?.message || 'Failed to load data'}
        </div>
      )}

      <PoTrackerSummaryCards
        summary={summary}
        loading={summaryLoading}
        liveLabel={
          category === 'all'
            ? config.liveLabel
            : `${CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? category} · ${config.liveLabel}`
        }
      />

      <div className="glass-panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">PO List</h3>
          </div>
          <button
            type="button"
            onClick={() => alert('Add new PO — coming soon')}
            className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/25"
          >
            Add new PO
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Filter PO list…"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-400">
            <span className="whitespace-nowrap">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PoTrackerCategory)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-400">
            <span className="whitespace-nowrap">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
            >
              <option value="All">All Statuses</option>
              {PO_TRACKER_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        <PoTrackerTable
          rows={tableRows}
          loading={loading}
          showCategory={category === 'all'}
          onStatusClick={enableStatusDetail ? (row) => setDetailRow(row) : undefined}
          pagination={{
            page,
            pageSize,
            total,
            setPage,
            setPageSize,
          }}
        />
      </div>

      {enableStatusDetail && (
        <PoTrackerDetailModal
          open={Boolean(detailRow)}
          orderId={detailRow?.id ?? null}
          poSource={detailRow?.poSource ?? null}
          channelType={channelType}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
