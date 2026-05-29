export type FilterKey =
  | 'category'
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

export type UserRole = 'user' | 'superadmin' | 'super_admin';

export type ScreenId =
  | 'executive'
  | 'po_so_sps'
  | 'po_so_costco'
  | 'po_tracker_b2b'
  | 'po_tracker_retails'
  | 'stores_kehe'
  | 'stores_sprouts'
  | 'demand_planner';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  screenAccess: ScreenId[];
}

export interface ManagedUser extends AuthUser {
  createdAt?: string;
  updatedAt?: string;
}

export interface ScreenGroupOption {
  id: string;
  label: string;
  comingSoon?: boolean;
  screens: { id: ScreenId; label: string }[];
}

export interface DashboardSummary {
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
