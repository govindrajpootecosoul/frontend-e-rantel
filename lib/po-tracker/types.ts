import type { SpsRow } from '@/lib/sps/types';

export type PoTrackerChannelType = 'b2b' | 'retail';
export type PoTrackerCategory = 'all' | 'sps' | 'costco';

export interface PoTrackerSummary {
  totalPos: number;
  pending: number;
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
