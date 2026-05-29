export interface ExecutiveRow {
  _id?: string;
  category?: string;
  storeId?: string;
  poNumber?: string;
  sku?: string;
  poSales?: number;
  poDate?: string;
  totalSales?: number;
  invoiceQty?: number;
  skuQty?: number;
  poAmount?: number;
  invoiceAmount?: number;
  poStatus?: string;
  poDeliveryStatus?: string;
  distributor?: string;
  retailer?: string;
  location?: string;
  updatedAt?: string;
  commonInvoiceDate?: string;
  commonPoDate?: string;
  yearMonthPo?: string;
  status?: string;
  warehouse?: string;
  delayDays?: number;
}
