export type SproutsAgingBucketId =
  | 'lte30'
  | 'd31_60'
  | 'd61_90'
  | 'd91_120'
  | 'd121_365'
  | 'd366plus';

export interface SproutsBucketValue {
  qty: number;
  vendorCost: number;
}

export interface SproutsAgingBucketMeta {
  id: SproutsAgingBucketId;
  label: string;
  group: 'below91' | 'above90';
}

export interface SproutsInventoryDashboard {
  rowCount: number;
  buckets: SproutsAgingBucketMeta[];
  below91: SproutsBucketValue;
  above90: SproutsBucketValue;
  overview: Record<SproutsAgingBucketId, SproutsBucketValue>;
  byDc: {
    dc: string;
    buckets: Record<SproutsAgingBucketId, SproutsBucketValue>;
    totalQty: number;
    totalCost: number;
  }[];
  skuGrid: {
    sku: string;
    dc: string;
    productDescription: string;
    buckets: Record<SproutsAgingBucketId, SproutsBucketValue>;
  }[];
  dcList: string[];
  lastUpdated?: string;
}

export interface SproutsInventoryRow {
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
