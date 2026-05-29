export interface SpsRow {
  _id: string;
  storeId?: string;
  distributor?: string;
  retailer?: string;
  channel?: string;
  poNumber?: string;
  poDate?: string;
  poRequestedDeliveryDate?: string;
  poAmount?: number;
  poStatus?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceAmount?: number;
  shippingCity?: string;
  yearMonthPo?: string;
  delayDays?: number;
  poDeliveryStatus?: string;
  upcGtin?: string;
  sku?: string;
  skuQty?: number;
  poSales?: number;
  invoiceQty?: number;
  status?: string;
  totalSales?: number;
  location?: string;
  warehouse?: string;
  qtyDiff?: number;
  amtDiff?: number;
  unitListCost?: number;
  commonPoDate?: string;
  commonInvoiceDate?: string;
  newPoDeliveryStatus?: string;
  newStatus?: string;
  srp?: number;
  updatedAt?: string;
}

export type SpsFilterKey =
  | 'channel'
  | 'poYearMonth'
  | 'invoiceYearMonth'
  | 'distributor'
  | 'retailer'
  | 'poNumber'
  | 'invoiceNumber'
  | 'sku'
  | 'poStatus'
  | 'status'
  | 'location'
  | 'warehouse'
  | 'poDate'
  | 'invoiceDate';

export type SpsFiltersState = Record<SpsFilterKey, string>;

export interface SpsSummary {
  totalPoCount: number;
  skuPoQty: number;
  poAmount: number;
  diffQty: number;
  skuInvoiceQty: number;
  invoiceAmount: number;
  diffAmount: number;
}

export interface SpsPaginatedResult {
  storeId: string;
  type: 'po' | 'invoice';
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  rows: SpsRow[];
  lastUpdated: string;
}

export interface SpsTablePagination {
  page: number;
  pageSize: number;
  total: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export interface SpsFilterOptions {
  [key: string]: string[];
}
