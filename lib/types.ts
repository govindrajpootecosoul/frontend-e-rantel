export type FilterKey =
  | 'retailer'
  | 'location'
  | 'status'
  | 'poStatus'
  | 'warehouse'
  | 'yearMonthPo'
  | 'distributor'
  | 'storeId'
  | 'poDeliveryStatus'
  | 'sku'
  | 'delayDays';

export type FiltersState = Record<FilterKey, string>;

export type FilterOptions = Record<FilterKey, string[]>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
}

export interface DashboardSummary {
  channelSelect: number;
  uniqueDistributors: number;
  uniqueRetailers: number;
  uniqueLocations: number;
}

export interface KpiCards {
  totalPoCount: number;
  skuPoQty: number;
  poAmount: number;
  diffQty: number;
  skuInvoiceQty: number;
  invoiceAmount: number;
  diffAmount: number;
}

export type ChartPeriod = 'daily' | 'monthly' | 'yearly';

export interface PeriodRetailerPoint {
  period: string;
  retailer: string;
  amount: number;
}

export type PeriodRetailerSeries = Record<ChartPeriod, PeriodRetailerPoint[]>;

export interface StatusPoint {
  status: string;
  count: number;
}

export interface DashboardData {
  rowCount: number;
  dedupedCount: number;
  summary: DashboardSummary;
  kpiCards: KpiCards;
  charts: {
    poSaleByRetailer: PeriodRetailerSeries;
    invoiceSaleByRetailer: PeriodRetailerSeries;
    poDeliveryStatus: StatusPoint[];
    poStatusBreakdown: StatusPoint[];
  };
  lastUpdated: string;
}
