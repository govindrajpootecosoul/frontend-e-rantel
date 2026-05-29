import type { SpsFilterKey, SpsFiltersState } from './types';

export const SPS_FILTER_LABELS: Record<SpsFilterKey, string> = {
  channel: 'Channel',
  poYearMonth: 'PO Year, Month',
  invoiceYearMonth: 'Invoice Year, Month',
  distributor: 'Distributors',
  retailer: 'Retailers',
  poNumber: 'PO Number',
  invoiceNumber: 'Invoice Number',
  sku: 'SKU',
  poStatus: 'PO Status',
  status: 'Status',
  location: 'Location',
  warehouse: 'Warehouse',
  poDate: 'PO Date',
  invoiceDate: 'Invoice Date',
};

export const DEFAULT_SPS_FILTERS: SpsFiltersState = {
  channel: 'All',
  poYearMonth: 'All',
  invoiceYearMonth: 'All',
  distributor: 'All',
  retailer: 'All',
  poNumber: 'All',
  invoiceNumber: 'All',
  sku: 'All',
  poStatus: 'All',
  status: 'All',
  location: 'All',
  warehouse: 'All',
  poDate: 'All',
  invoiceDate: 'All',
};

export const SPS_FILTER_KEYS = Object.keys(SPS_FILTER_LABELS) as SpsFilterKey[];

export const SPS_DATE_FILTER_KEYS: SpsFilterKey[] = [
  'poYearMonth',
  'invoiceYearMonth',
  'poDate',
  'invoiceDate',
];

export const SPS_DROPDOWN_FILTER_KEYS = SPS_FILTER_KEYS.filter(
  (key) => !SPS_DATE_FILTER_KEYS.includes(key)
);

export const SPS_MONTH_FILTER_KEYS: SpsFilterKey[] = ['poYearMonth', 'invoiceYearMonth'];

export const SPS_DAY_FILTER_KEYS: SpsFilterKey[] = ['poDate', 'invoiceDate'];
