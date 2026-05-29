export type SproutsTabId = 'chain-store' | 'inventory' | 'risk-inventory';

export type SproutsFilterKey =
  | 'fileMonth'
  | 'retailer'
  | 'retailerArea'
  | 'sku'
  | 'upc'
  | 'material';

export type SproutsFiltersState = Record<SproutsFilterKey, string>;

export interface SproutsChainStoreRow {
  _id: string;
  fileMonth?: string;
  retailer?: string;
  retailerArea?: string;
  productDescription?: string;
  fillRateVendorCost?: number | null;
  orderedVendorCost?: number | null;
  shippedVendorCost?: number | null;
  upc?: string;
  fillRateQuantity?: number | null;
  orderedQuantity?: number | null;
  shippedQuantity?: number | null;
  fillRateListWholesale?: number | null;
  orderedListWholesale?: number | null;
  shippedListWholesale?: number | null;
  sku?: string;
  boxPerCase?: number | null;
  material?: string;
  productCategory?: string;
  productSubCategory?: string;
  productType?: string;
  orderedCaseCostVendorCost?: number | null;
  orderedCaseCostListWholesale?: number | null;
  markup?: number | null;
}

export interface SproutsSummary {
  orderedVendorCost: number;
  shippedVendorCost: number;
  fillRateVendorCost: number;
  markupAvg: number;
  retailerCount: number;
  storeCount: number;
  skuCount: number;
  rowCount: number;
}

export interface SproutsRetailerSummaryRow {
  retailer: string;
  retailerArea: string;
  storeCount: number;
  skuCount: number;
  orderedVendorCost: number;
  shippedVendorCost: number;
  difference: number;
}

export interface SproutsQuantitySummaryRow {
  sku: string;
  retailer: string;
  retailerArea: string;
  storeCount: number;
  orderedQuantity: number;
  shippedQuantity: number;
  diffQty: number;
}

export interface SproutsPaginatedResult<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  rows: T[];
  lastUpdated?: string;
}
