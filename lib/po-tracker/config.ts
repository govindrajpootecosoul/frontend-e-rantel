import type { PoTrackerChannelType, PoTrackerConfig } from './types';

export const PO_TRACKER_CONFIG: Record<PoTrackerChannelType, PoTrackerConfig> = {
  b2b: {
    channelType: 'b2b',
    title: 'PO Tracker — B2B',
    subtitle: 'Track and manage B2B purchase orders from SPS and Costco.',
    liveLabel: 'B2B live',
  },
  retail: {
    channelType: 'retail',
    title: 'PO Tracker — Retails',
    subtitle: 'Track and manage retail purchase orders from SPS and Costco.',
    liveLabel: 'Retails live',
  },
};

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'sps', label: 'SPS' },
  { value: 'costco', label: 'Costco' },
] as const;

/** Status filter options (All + fixed list). */
export const PO_TRACKER_STATUS_OPTIONS = [
  'Cancelled',
  'Fulfilled',
  'Over Shipped',
  'Pending',
  'Short Shipped',
] as const;

export function resolvePoTrackerChannel(pathname: string): PoTrackerChannelType | null {
  if (pathname.startsWith('/po-trackers/b2b')) return 'b2b';
  if (pathname.startsWith('/po-trackers/retails')) return 'retail';
  return null;
}
