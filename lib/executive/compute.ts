import type {
  ChartPeriod,
  DashboardData,
  FilterKey,
  FilterOptions,
  FiltersState,
  PeriodRetailerSeries,
  StatusPoint,
} from '@/lib/types';
import { matchesDateFilter, resolvePoMonthKey } from '@/lib/sps/dateFilters';
import type { ExecutiveRow } from './types';

const CHART_PERIODS: ChartPeriod[] = ['daily', 'monthly', 'yearly'];

const FILTER_OPTION_KEYS: FilterKey[] = [
  'retailer',
  'location',
  'status',
  'poStatus',
  'warehouse',
  'distributor',
  'storeId',
  'poDeliveryStatus',
  'sku',
  'delayDays',
];

const prependAll = (values: Iterable<string>) => [
  'All',
  ...Array.from(new Set(values)).filter(Boolean).sort(),
];

export const applyExecutiveFilters = (rows: ExecutiveRow[], filters: FiltersState): ExecutiveRow[] =>
  rows.filter((row) => {
    if (filters.retailer !== 'All' && row.retailer !== filters.retailer) return false;
    if (filters.location !== 'All' && row.location !== filters.location) return false;
    if (filters.status !== 'All' && row.status !== filters.status) return false;
    if (filters.poStatus !== 'All' && row.poStatus !== filters.poStatus) return false;
    if (filters.warehouse !== 'All' && row.warehouse !== filters.warehouse) return false;
    if (filters.distributor !== 'All' && row.distributor !== filters.distributor) return false;
    if (filters.storeId !== 'All' && row.storeId !== filters.storeId) return false;
    if (filters.poDeliveryStatus !== 'All' && row.poDeliveryStatus !== filters.poDeliveryStatus)
      return false;
    if (filters.sku !== 'All' && row.sku !== filters.sku) return false;
    if (filters.delayDays !== 'All' && String(row.delayDays ?? '') !== filters.delayDays)
      return false;
    if (!matchesDateFilter(resolvePoMonthKey(row), filters.yearMonthPo)) return false;
    return true;
  });

export const buildExecutiveFilterOptions = (rows: ExecutiveRow[]): FilterOptions => {
  const buckets: Record<string, Set<string>> = {};
  for (const k of FILTER_OPTION_KEYS) buckets[k] = new Set();

  for (const row of rows) {
    if (row.retailer) buckets.retailer.add(row.retailer);
    if (row.location) buckets.location.add(row.location);
    if (row.status) buckets.status.add(row.status);
    if (row.poStatus) buckets.poStatus.add(row.poStatus);
    if (row.warehouse) buckets.warehouse.add(row.warehouse);
    if (row.distributor) buckets.distributor.add(row.distributor);
    if (row.storeId) buckets.storeId.add(row.storeId);
    if (row.poDeliveryStatus) buckets.poDeliveryStatus.add(row.poDeliveryStatus);
    if (row.sku) buckets.sku.add(row.sku);
    if (row.delayDays !== undefined && row.delayDays !== null) {
      buckets.delayDays.add(String(row.delayDays));
    }
  }

  const result = {} as FilterOptions;
  for (const k of FILTER_OPTION_KEYS) {
    result[k] = prependAll(buckets[k]);
  }
  result.yearMonthPo = ['All'];
  return result;
};

const rowTime = (row: ExecutiveRow) => {
  const t = row.updatedAt ? new Date(row.updatedAt).getTime() : 0;
  return Number.isNaN(t) ? 0 : t;
};

const dedupeRows = (rows: ExecutiveRow[]) => {
  const map = new Map<string, ExecutiveRow>();
  for (const row of rows) {
    const key = `${row.storeId || ''}|${row.poNumber || ''}|${row.sku || ''}`;
    const existing = map.get(key);
    if (!existing || rowTime(row) >= rowTime(existing)) {
      map.set(key, row);
    }
  }
  return Array.from(map.values());
};

const uniqueCount = (rows: ExecutiveRow[], field: keyof ExecutiveRow) => {
  const set = new Set<string>();
  for (const row of rows) {
    const val = row[field];
    if (val !== undefined && val !== null && val !== '') set.add(String(val));
  }
  return set.size;
};

const uniquePoCount = (rows: ExecutiveRow[]) => {
  const set = new Set<string>();
  for (const row of rows) {
    set.add(`${row.storeId || ''}|${row.poNumber || ''}`);
  }
  return set.size;
};

const sumField = (rows: ExecutiveRow[], field: keyof ExecutiveRow) =>
  rows.reduce((acc, row) => acc + (Number(row[field]) || 0), 0);

const getRowDate = (row: ExecutiveRow, dateField: 'poDate' | 'commonInvoiceDate') => {
  if (dateField === 'poDate') {
    const raw = row.commonPoDate || row.poDate;
    if (raw) {
      const date = new Date(raw);
      if (!Number.isNaN(date.getTime())) return date;
    }
    if (row.yearMonthPo) {
      const date = new Date(row.yearMonthPo);
      if (!Number.isNaN(date.getTime())) return date;
    }
    return null;
  }
  const raw = row[dateField];
  if (raw) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (row.commonPoDate) {
    const date = new Date(row.commonPoDate);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
};

const formatPeriodKey = (date: Date, period: ChartPeriod) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  if (period === 'daily') return `${y}-${m}-${d}`;
  if (period === 'yearly') return String(y);
  return `${y}-${m}`;
};

const groupByPeriodRetailer = (
  rows: ExecutiveRow[],
  amountField: keyof ExecutiveRow,
  dateField: 'poDate' | 'commonInvoiceDate'
): PeriodRetailerSeries => {
  const result: PeriodRetailerSeries = { daily: [], monthly: [], yearly: [] };
  const maps: Record<ChartPeriod, Map<string, { period: string; retailer: string; amount: number }>> =
    {
      daily: new Map(),
      monthly: new Map(),
      yearly: new Map(),
    };

  for (const row of rows) {
    const retailer = row.retailer || 'Unknown';
    const amount = Number(row[amountField]) || 0;

    for (const period of CHART_PERIODS) {
      let periodLabel: string | null = null;
      if (period === 'monthly' && dateField === 'poDate') {
        periodLabel = resolvePoMonthKey(row);
      } else {
        const date = getRowDate(row, dateField);
        if (date) periodLabel = formatPeriodKey(date, period);
      }
      if (!periodLabel) continue;

      const key = `${periodLabel}||${retailer}`;
      const map = maps[period];
      if (!map.has(key)) {
        map.set(key, { period: periodLabel, retailer, amount: 0 });
      }
      map.get(key)!.amount += amount;
    }
  }

  for (const period of CHART_PERIODS) {
    result[period] = Array.from(maps[period].values()).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  }
  return result;
};

const groupByDeliveryStatus = (rows: ExecutiveRow[], statusField: keyof ExecutiveRow): StatusPoint[] => {
  const map = new Map<string, number>();
  for (const row of rows) {
    const status = String(row[statusField] || 'Unknown');
    map.set(status, (map.get(status) || 0) + 1);
  }
  return Array.from(map.entries()).map(([status, count]) => ({ status, count }));
};

export const computeExecutiveDashboard = (
  rows: ExecutiveRow[],
  lastUpdated: string
): DashboardData => {
  const deduped = dedupeRows(rows);
  const skuPoQty = sumField(deduped, 'skuQty');
  const skuInvoiceQty = sumField(deduped, 'invoiceQty');
  const poAmount = sumField(deduped, 'poSales');
  const invoiceAmount = sumField(deduped, 'totalSales') || sumField(deduped, 'invoiceAmount');

  return {
    rowCount: rows.length,
    dedupedCount: deduped.length,
    summary: {
      channelSelect: uniqueCount(deduped, 'storeId'),
      uniqueDistributors: uniqueCount(deduped, 'distributor'),
      uniqueRetailers: uniqueCount(deduped, 'retailer'),
      uniqueLocations: uniqueCount(deduped, 'location'),
    },
    kpiCards: {
      totalPoCount: uniquePoCount(rows),
      skuPoQty,
      poAmount,
      diffQty: skuPoQty - skuInvoiceQty,
      skuInvoiceQty,
      invoiceAmount,
      diffAmount: poAmount - invoiceAmount,
    },
    charts: {
      poSaleByRetailer: groupByPeriodRetailer(rows, 'poSales', 'poDate'),
      invoiceSaleByRetailer: groupByPeriodRetailer(rows, 'totalSales', 'commonInvoiceDate'),
      poDeliveryStatus: groupByDeliveryStatus(rows, 'poDeliveryStatus'),
      poStatusBreakdown: groupByDeliveryStatus(rows, 'poStatus'),
    },
    lastUpdated,
  };
};
