import type { SproutsFilterKey } from './types';

export const SPROUTS_FILTER_KEYS: SproutsFilterKey[] = [
  'fileMonth',
  'retailer',
  'retailerArea',
  'sku',
  'upc',
  'material',
];

export const SPROUTS_FILTER_LABELS: Record<SproutsFilterKey, string> = {
  fileMonth: 'Month Year',
  retailer: 'Retailer',
  retailerArea: 'Retailer Area',
  sku: 'SKU',
  upc: 'UPC',
  material: 'Material',
};

export const DEFAULT_SPROUTS_FILTERS: Record<SproutsFilterKey, string> = {
  fileMonth: 'All',
  retailer: 'All',
  retailerArea: 'All',
  sku: 'All',
  upc: 'All',
  material: 'All',
};

export const SPROUTS_TABS = [
  { id: 'chain-store' as const, label: 'Sprouts Chain Store' },
  { id: 'inventory' as const, label: 'Sprouts Inventory' },
  { id: 'risk-inventory' as const, label: 'Sprouts Risk Inventory' },
];

export const SPROUTS_RISK_FILTER_KEYS = [
  'reportMonth',
  'sku',
  'dc',
  'material',
  'upc',
] as const;

export const SPROUTS_RISK_FILTER_LABELS: Record<(typeof SPROUTS_RISK_FILTER_KEYS)[number], string> = {
  reportMonth: 'Month',
  sku: 'SKU',
  dc: 'DC',
  material: 'Material',
  upc: 'UPC',
};

export const DEFAULT_SPROUTS_RISK_FILTERS: Record<(typeof SPROUTS_RISK_FILTER_KEYS)[number], string> = {
  reportMonth: 'All',
  sku: 'All',
  dc: 'All',
  material: 'All',
  upc: 'All',
};
