export type KeheTabId = 'chain-store' | 'inventory' | 'risk-inventory';

export type KeheFilterKey =
  | 'fileMonth'
  | 'retailer'
  | 'retailerArea'
  | 'sku'
  | 'upc'
  | 'material';

export type KeheFiltersState = Record<KeheFilterKey, string>;

export interface KeheChainStoreRow {
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

export interface KeheSummary {
  orderedVendorCost: number;
  shippedVendorCost: number;
  fillRateVendorCost: number;
  markupAvg: number;
  retailerCount: number;
  storeCount: number;
  skuCount: number;
  rowCount: number;
}

export interface KeheRetailerSummaryRow {
  retailer: string;
  retailerArea: string;
  storeCount: number;
  skuCount: number;
  orderedVendorCost: number;
  shippedVendorCost: number;
  difference: number;
}

export interface KeheQuantitySummaryRow {
  sku: string;
  retailer: string;
  retailerArea: string;
  storeCount: number;
  orderedQuantity: number;
  shippedQuantity: number;
  diffQty: number;
}

export interface KehePaginatedResult<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  rows: T[];
  lastUpdated?: string;
}

export interface KeheInventoryRow {
  _id: string;
  fileMonth?: string;
  retailer?: string;
  retailerArea?: string;
  sku?: string;
  upc?: string;
  productDescription?: string;
  material?: string;
  onHandQty?: number | null;
  onOrderQty?: number | null;
}

export interface KeheRiskInventoryRow {
  _id: string;
  fileMonth?: string;
  retailer?: string;
  retailerArea?: string;
  sku?: string;
  upc?: string;
  productDescription?: string;
  riskLevel?: string;
  daysOfSupply?: number | null;
}
