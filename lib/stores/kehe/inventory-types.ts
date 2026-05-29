export type KeheAgingBucketId =
  | 'lte30'
  | 'd31_60'
  | 'd61_90'
  | 'd91_120'
  | 'd121_365'
  | 'd366plus';

export interface KeheBucketValue {
  qty: number;
  vendorCost: number;
}

export interface KeheAgingBucketMeta {
  id: KeheAgingBucketId;
  label: string;
  group: 'below91' | 'above90';
}

export interface KeheInventoryDashboard {
  rowCount: number;
  buckets: KeheAgingBucketMeta[];
  below91: KeheBucketValue;
  above90: KeheBucketValue;
  overview: Record<KeheAgingBucketId, KeheBucketValue>;
  byDc: {
    dc: string;
    buckets: Record<KeheAgingBucketId, KeheBucketValue>;
    totalQty: number;
    totalCost: number;
  }[];
  skuGrid: {
    sku: string;
    dc: string;
    productDescription: string;
    buckets: Record<KeheAgingBucketId, KeheBucketValue>;
  }[];
  dcList: string[];
  lastUpdated?: string;
}

export interface KeheInventoryRow {
  _id: string;
  enterpriseSupplier?: string;
  dc?: string;
  sku?: string;
  upc?: string;
  productDescription?: string;
  quantityOnHand?: number | null;
  quantityOnPurchaseOrder?: number | null;
  weeksOnHand?: number | null;
  vendorCost?: number | null;
  reportMonth?: string;
  downloadedOn?: string;
  material?: string;
  productCategory?: string;
  agingBucket?: string;
  inventoryAgeDays?: number;
}
