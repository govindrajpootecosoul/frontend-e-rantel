import type { KeheFilterKey } from './types';

export const KEHE_FILTER_KEYS: KeheFilterKey[] = [
  'fileMonth',
  'retailer',
  'retailerArea',
  'sku',
  'upc',
  'material',
];

export const KEHE_FILTER_LABELS: Record<KeheFilterKey, string> = {
  fileMonth: 'Month Year',
  retailer: 'Retailer',
  retailerArea: 'Retailer Area',
  sku: 'SKU',
  upc: 'UPC',
  material: 'Material',
};

export const DEFAULT_KEHE_FILTERS: Record<KeheFilterKey, string> = {
  fileMonth: 'All',
  retailer: 'All',
  retailerArea: 'All',
  sku: 'All',
  upc: 'All',
  material: 'All',
};

export const KEHE_TABS = [
  { id: 'chain-store' as const, label: 'KeHE Chain Store' },
  { id: 'inventory' as const, label: 'KeHE Inventory' },
  { id: 'risk-inventory' as const, label: 'KeHE Risk Inventory' },
];

export const KEHE_RISK_FILTER_KEYS = [
  'reportMonth',
  'sku',
  'dc',
  'material',
  'upc',
] as const;

export const KEHE_RISK_FILTER_LABELS: Record<(typeof KEHE_RISK_FILTER_KEYS)[number], string> = {
  reportMonth: 'Month',
  sku: 'SKU',
  dc: 'DC',
  material: 'Material',
  upc: 'UPC',
};

export const DEFAULT_KEHE_RISK_FILTERS: Record<(typeof KEHE_RISK_FILTER_KEYS)[number], string> = {
  reportMonth: 'All',
  sku: 'All',
  dc: 'All',
  material: 'All',
  upc: 'All',
};
