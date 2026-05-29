import type { FilterKey, FiltersState } from './types';

export const FILTER_LABELS: Record<FilterKey, string> = {
  category: 'Category',
  retailer: 'Retailer',
  location: 'Location',
  status: 'Status',
  poStatus: 'PO Status',
  warehouse: 'Warehouse',
  yearMonthPo: 'PO Year, Month',
  distributor: 'Distributor',
  storeId: 'Store ID',
  poDeliveryStatus: 'Delivery Status',
  sku: 'SKU',
  delayDays: 'Delay Days',
};

export const DEFAULT_FILTERS: FiltersState = {
  category: 'All',
  retailer: 'All',
  location: 'All',
  status: 'All',
  poStatus: 'All',
  warehouse: 'All',
  yearMonthPo: 'All',
  distributor: 'All',
  storeId: 'All',
  poDeliveryStatus: 'All',
  sku: 'All',
  delayDays: 'All',
};

export const FILTER_KEYS = Object.keys(FILTER_LABELS) as FilterKey[];
