export type PoSoStoreId = 'sps' | 'costco';

export interface PoSoStoreConfig {
  id: PoSoStoreId;
  trackerLabel: string;
  title: string;
  collection: string;
  database: string;
}

export const PO_SO_STORES: Record<PoSoStoreId, PoSoStoreConfig> = {
  sps: {
    id: 'sps',
    trackerLabel: 'SPS Tracker',
    title: 'SPS Order Summary',
    collection: 'purchase_orders_sps',
    database: 'ecosoulpo',
  },
  costco: {
    id: 'costco',
    trackerLabel: 'Costco Tracker',
    title: 'Costco Order Summary',
    collection: 'purchase_orders_costco',
    database: 'ecosoulpo',
  },
};

export function getPoSoStoreConfig(storeId: string): PoSoStoreConfig {
  const key = storeId.toLowerCase() as PoSoStoreId;
  return PO_SO_STORES[key] ?? PO_SO_STORES.sps;
}

export function resolvePoSoStoreFromPath(pathname: string): PoSoStoreId | null {
  if (pathname.startsWith('/po-so/costco')) return 'costco';
  if (pathname.startsWith('/po-so/sps')) return 'sps';
  return null;
}
