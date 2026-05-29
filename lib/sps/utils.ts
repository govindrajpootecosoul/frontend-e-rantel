import type { SpsFilterKey, SpsFiltersState, SpsRow, SpsSummary } from './types';
import {
  matchesDateFilter,
  resolveInvoiceMonthKey,
  resolvePoMonthKey,
} from './dateFilters';

const prependAll = (values: Iterable<string>) => [
  'All',
  ...Array.from(new Set(values)).filter(Boolean).sort(),
];

export const formatSpsDate = (value?: string | null): string => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatSpsDateKey = (value?: string | null): string => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const rowTime = (row: SpsRow) => {
  const t = row.updatedAt ? new Date(row.updatedAt).getTime() : 0;
  return Number.isNaN(t) ? 0 : t;
};

export const resolvePoStatus = (row: SpsRow) =>
  row.poStatus || row.newStatus || row.status || '';

export const resolveStatus = (row: SpsRow) =>
  row.newStatus || row.status || row.poStatus || '';

export const resolvePoYearMonth = (row: SpsRow) => {
  if (row.yearMonthPo) return String(row.yearMonthPo);
  const d = row.commonPoDate || row.poDate;
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}/1/${String(date.getFullYear()).slice(-2)}`;
};

export const resolveInvoiceYearMonth = (row: SpsRow) => {
  const d = row.commonInvoiceDate || row.invoiceDate;
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}/1/${String(date.getFullYear()).slice(-2)}`;
};

export const dedupeSpsRows = (rows: SpsRow[]): SpsRow[] => {
  const map = new Map<string, SpsRow>();
  for (const row of rows) {
    const key = `${row.storeId || ''}|${row.poNumber || ''}|${row.sku || ''}`;
    const existing = map.get(key);
    if (!existing || rowTime(row) >= rowTime(existing)) {
      map.set(key, row);
    }
  }
  return Array.from(map.values());
};

const sumField = (rows: SpsRow[], field: keyof SpsRow) =>
  rows.reduce((acc, row) => acc + (Number(row[field]) || 0), 0);

export const summarizeSpsRows = (filtered: SpsRow[]): SpsSummary => {
  const deduped = dedupeSpsRows(filtered);
  const poKeys = new Set<string>();
  for (const row of filtered) {
    poKeys.add(`${row.storeId || ''}|${row.poNumber || ''}`);
  }

  return {
    totalPoCount: poKeys.size,
    skuPoQty: sumField(deduped, 'skuQty'),
    poAmount: sumField(deduped, 'poSales'),
    diffQty: sumField(deduped, 'qtyDiff'),
    skuInvoiceQty: sumField(deduped, 'invoiceQty'),
    invoiceAmount: sumField(deduped, 'totalSales'),
    diffAmount: sumField(deduped, 'amtDiff'),
  };
};

const matches = (value: string, filter: string) => {
  if (!filter || filter === 'All') return true;
  return value === filter;
};

export const applySpsFilters = (rows: SpsRow[], filters: SpsFiltersState): SpsRow[] =>
  rows.filter((row) => {
    if (!matches(row.channel || '', filters.channel)) return false;
    if (!matches(row.distributor || '', filters.distributor)) return false;
    if (!matches(row.retailer || '', filters.retailer)) return false;
    if (!matches(row.poNumber || '', filters.poNumber)) return false;
    if (!matches(row.invoiceNumber || '', filters.invoiceNumber)) return false;
    if (!matches(row.sku || '', filters.sku)) return false;
    if (!matches(resolvePoStatus(row), filters.poStatus)) return false;
    if (!matches(resolveStatus(row), filters.status)) return false;
    if (!matches(row.location || '', filters.location)) return false;
    if (!matches(row.warehouse || '', filters.warehouse)) return false;
    if (!matchesDateFilter(resolvePoMonthKey(row), filters.poYearMonth)) return false;
    if (!matchesDateFilter(resolveInvoiceMonthKey(row), filters.invoiceYearMonth)) return false;
    if (!matchesDateFilter(formatSpsDateKey(row.poDate), filters.poDate)) return false;
    if (!matchesDateFilter(formatSpsDateKey(row.invoiceDate), filters.invoiceDate)) return false;
    return true;
  });

export const buildSpsFilterOptions = (rows: SpsRow[]): Record<SpsFilterKey, string[]> => {
  const buckets: Record<string, Set<string>> = {};
  for (const key of [
    'channel',
    'poYearMonth',
    'invoiceYearMonth',
    'distributor',
    'retailer',
    'poNumber',
    'invoiceNumber',
    'sku',
    'poStatus',
    'status',
    'location',
    'warehouse',
    'poDate',
    'invoiceDate',
  ]) {
    buckets[key] = new Set();
  }

  for (const row of rows) {
    if (row.channel) buckets.channel.add(row.channel);
    const pym = resolvePoYearMonth(row);
    if (pym) buckets.poYearMonth.add(pym);
    const iym = resolveInvoiceYearMonth(row);
    if (iym) buckets.invoiceYearMonth.add(iym);
    if (row.distributor) buckets.distributor.add(row.distributor);
    if (row.retailer) buckets.retailer.add(row.retailer);
    if (row.poNumber) buckets.poNumber.add(row.poNumber);
    if (row.invoiceNumber) buckets.invoiceNumber.add(row.invoiceNumber);
    if (row.sku) buckets.sku.add(row.sku);
    const ps = resolvePoStatus(row);
    if (ps) buckets.poStatus.add(ps);
    const st = resolveStatus(row);
    if (st) buckets.status.add(st);
    if (row.location) buckets.location.add(row.location);
    if (row.warehouse) buckets.warehouse.add(row.warehouse);
    const pd = formatSpsDateKey(row.poDate);
    if (pd) buckets.poDate.add(pd);
    const id = formatSpsDateKey(row.invoiceDate);
    if (id) buckets.invoiceDate.add(id);
  }

  const result = {} as Record<SpsFilterKey, string[]>;
  for (const [key, set] of Object.entries(buckets)) {
    result[key as SpsFilterKey] = prependAll(set);
  }
  return result;
};

export const getInvoiceRows = (rows: SpsRow[]) =>
  rows.filter((r) => r.invoiceNumber && String(r.invoiceNumber).trim() !== '');
