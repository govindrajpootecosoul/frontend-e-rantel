export type KeheRiskFilterKey = 'reportMonth' | 'sku' | 'dc' | 'material' | 'upc';

export type KeheRiskFiltersState = Record<KeheRiskFilterKey, string>;

export interface KeheMaterialSlice {
  material: string;
  value: number;
}

export interface KeheMaterialPoSoSlice {
  material: string;
  qtyOnPo: number;
  qtyOnSo: number;
}

export interface KeheAtRiskRow {
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

export interface KeheStockStatusRow {
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

export interface KeheRiskInventoryDashboard {
  rowCount: number;
  materialByQtyOnHand: KeheMaterialSlice[];
  materialByPoSo: KeheMaterialPoSoSlice[];
  atRisk: KeheAtRiskRow[];
  atRiskTotals: Omit<KeheAtRiskRow, 'reportDate' | 'dc' | 'broker' | 'sku' | 'sellByDate' | 'uom'>;
  stockStatus: KeheStockStatusRow[];
  stockTotals: Omit<KeheStockStatusRow, 'inventoryDate' | 'dc' | 'sku' | 'vendorCasePack'>;
  hasRiskData?: boolean;
  hasInventoryEnrichment?: boolean;
  lastUpdated?: string;
}
