import type { SpsRow } from '@/lib/sps/types';

export type PoTrackerChannelType = 'b2b' | 'retail';
export type PoTrackerCategory = 'all' | 'sps' | 'costco';
export type PoTrackerPoSource = 'sps' | 'costco';

export interface PoTrackerSummary {
  totalPos: number;
  pending: number;
  cancelled: number;
  shortShipped: number;
  statusIssues: number;
  withInvoice: number;
  fulfilled: number;
}

export interface PoTrackerPaginatedResult {
  channelType: PoTrackerChannelType;
  category: PoTrackerCategory;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  rows: SpsRow[];
  lastUpdated: string;
}

export interface PoTrackerConfig {
  channelType: PoTrackerChannelType;
  title: string;
  subtitle: string;
  liveLabel: string;
}

export interface PoHistoryChange {
  field: string;
  from: string;
  to: string;
}

export interface PoHistoryEntry {
  action: string;
  at: string;
  by: {
    id?: string;
    name: string;
    email: string;
  };
  changes: PoHistoryChange[];
}

export type PoTrackerOrder = SpsRow & {
  poLink?: string;
  history?: PoHistoryEntry[];
  _poSource?: string;
};

export interface PoTrackerOrderDetail {
  poSource: PoTrackerPoSource;
  row: PoTrackerOrder;
  lastUpdated: string;
}

export interface PoTrackerOrderUpdateBody {
  poNumber?: string;
  channel?: string;
  distributor?: string;
  retailer?: string;
  sku?: string;
  poDate?: string | null;
  poRequestedDeliveryDate?: string | null;
  location?: string;
  warehouse?: string;
  invoiceNumber?: string;
  invoiceAmount?: number | null;
  poLink?: string;
  status?: string;
}
