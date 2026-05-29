import type { KeheChainStoreRow } from './types';
import { formatCurrency, formatNumber } from '@/lib/format';

export interface KeheTableColumn<TRow = KeheChainStoreRow> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render: (row: TRow) => string;
}

const cell = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
};

const num = (value: number | null | undefined, decimals = 0) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return formatNumber(value, decimals);
};

const money = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return formatCurrency(value);
};

const pct = (value: number | null | undefined, decimals = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${formatNumber(value, value % 1 === 0 ? 0 : decimals)}%`;
};

/** Stored as 0–1 ratio (e.g. 0.6667 → 66.67%) */
const pctFromRatio = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const n = value <= 1 ? value * 100 : value;
  return pct(n);
};

/** Markup margin stored as decimal (e.g. 0.388 → 38.84%) */
const markupPct = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const n = value <= 1 ? value * 100 : value;
  return `${formatNumber(n, 2)}%`;
};

export const KEHE_DETAIL_COLUMNS: KeheTableColumn[] = [
  { key: 'fileMonth', header: 'File Month', render: (r) => cell(r.fileMonth) },
  { key: 'retailer', header: 'Retailer', render: (r) => cell(r.retailer) },
  { key: 'retailerArea', header: 'Retailer Area', render: (r) => cell(r.retailerArea) },
  { key: 'productDescription', header: 'Product Description', render: (r) => cell(r.productDescription) },
  { key: 'fillRateVendorCost', header: 'Fill Rate (Vendor Cost)', align: 'right', render: (r) => pct(r.fillRateVendorCost) },
  { key: 'orderedVendorCost', header: 'Ordered (Vendor Cost)', align: 'right', render: (r) => money(r.orderedVendorCost) },
  { key: 'shippedVendorCost', header: 'Shipped (Vendor Cost)', align: 'right', render: (r) => money(r.shippedVendorCost) },
  { key: 'upc', header: 'UPC', render: (r) => cell(r.upc) },
  { key: 'fillRateQuantity', header: 'Fill Rate (Quantity)', align: 'right', render: (r) => pctFromRatio(r.fillRateQuantity) },
  { key: 'orderedQuantity', header: 'Ordered (Quantity)', align: 'right', render: (r) => num(r.orderedQuantity) },
  { key: 'shippedQuantity', header: 'Shipped (Quantity)', align: 'right', render: (r) => num(r.shippedQuantity) },
  { key: 'fillRateListWholesale', header: 'Fill Rate (List Wholesale)', align: 'right', render: (r) => pct(r.fillRateListWholesale) },
  { key: 'orderedListWholesale', header: 'Ordered (List Wholesale)', align: 'right', render: (r) => money(r.orderedListWholesale) },
  { key: 'shippedListWholesale', header: 'Shipped (List Wholesale)', align: 'right', render: (r) => money(r.shippedListWholesale) },
  { key: 'sku', header: 'SKU', render: (r) => cell(r.sku) },
  { key: 'boxPerCase', header: 'Box per Case', align: 'right', render: (r) => num(r.boxPerCase) },
  { key: 'material', header: 'Material', render: (r) => cell(r.material) },
  { key: 'productCategory', header: 'Product Category', render: (r) => cell(r.productCategory) },
  { key: 'productSubCategory', header: 'Product Sub Category', render: (r) => cell(r.productSubCategory) },
  { key: 'productType', header: 'Product Type', render: (r) => cell(r.productType) },
  { key: 'orderedCaseCostVendorCost', header: 'Ordered Case Cost (Vendor)', align: 'right', render: (r) => money(r.orderedCaseCostVendorCost) },
  { key: 'orderedCaseCostListWholesale', header: 'Ordered Case Cost (List)', align: 'right', render: (r) => money(r.orderedCaseCostListWholesale) },
  { key: 'markup', header: 'Markup', align: 'right', render: (r) => markupPct(r.markup) },
];
