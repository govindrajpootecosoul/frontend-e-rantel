export type SproutsRiskFilterKey = 'reportMonth' | 'sku' | 'dc' | 'material' | 'upc';

export type SproutsRiskFiltersState = Record<SproutsRiskFilterKey, string>;

export interface SproutsMaterialSlice {
  material: string;
  value: number;
}

export interface SproutsMaterialPoSoSlice {
  material: string;
  qtyOnPo: number;
  qtyOnSo: number;
}

export interface SproutsAtRiskRow {
  reportDate: string;
  dc: string;
  broker: string;
  sku: string;
  sellByDate: string;
  unitsOnHandWithNoForecastDemand: number;
  unitSalesVelocityPerDay: number;
  daysRemainingToShipToCustomer: number;
  guaranteedShelfLifeDaysToCustomer: number;
  uom: string;
}

export interface SproutsStockStatusRow {
  inventoryDate: string;
  dc: string;
  sku: string;
  qtyOnHand: number;
  qtyOnPo: number;
  qtyOnSo: number;
  vendorCasePack: number;
  weeksOnHand: number;
  weeksOnPo: number;
}

export interface SproutsRiskInventoryDashboard {
  rowCount: number;
  materialByQtyOnHand: SproutsMaterialSlice[];
  materialByPoSo: SproutsMaterialPoSoSlice[];
  atRisk: SproutsAtRiskRow[];
  atRiskTotals: Omit<SproutsAtRiskRow, 'reportDate' | 'dc' | 'broker' | 'sku' | 'sellByDate' | 'uom'>;
  stockStatus: SproutsStockStatusRow[];
  stockTotals: Omit<SproutsStockStatusRow, 'inventoryDate' | 'dc' | 'sku' | 'vendorCasePack'>;
  hasRiskData?: boolean;
  hasInventoryEnrichment?: boolean;
  lastUpdated?: string;
}
