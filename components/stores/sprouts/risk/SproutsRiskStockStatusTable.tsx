'use client';

import { formatNumber } from '@/lib/format';
import type { SproutsRiskInventoryDashboard } from '@/lib/stores/sprouts/risk-types';

export default function SproutsRiskStockStatusTable({
  data,
  loading,
}: {
  data?: SproutsRiskInventoryDashboard;
  loading?: boolean;
}) {
  const rows = data?.stockStatus ?? [];
  const totals = data?.stockTotals;

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Inventory Stock Status</h3>
        <p className="mt-0.5 text-[10px] text-slate-500">
          Only for SKU + DC from your risk file — upload risk data first, then Sprouts Inventory tab
          for stock details
        </p>
      </div>
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-900/95">
            <tr>
              {[
                'Inventory Date',
                'DC',
                'SKU',
                'Qty On Hand',
                'Qty on PO',
                'Qty on SO',
                'Vendor Case Pack',
                'Weeks on Hand',
                'Weeks on PO',
              ].map((h) => (
                <th
                  key={h}
                  className={`whitespace-nowrap border-b border-slate-800 px-3 py-2.5 font-medium uppercase tracking-wider text-slate-500 ${
                    h !== 'Inventory Date' && h !== 'DC' && h !== 'SKU' ? 'text-right' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                  {data?.hasRiskData === false
                    ? 'Upload a risk inventory file above — stock status appears after risk data is loaded'
                    : 'No matching rows in Sprouts Inventory for these risk SKU/DC — upload inventory on the Sprouts Inventory tab'}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={`${row.sku}-${row.dc}-${i}`}
                  className="border-b border-slate-800/60 hover:bg-slate-800/30"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">
                    {row.inventoryDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">{row.dc}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-cyan-300">
                    {row.sku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.qtyOnHand)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.qtyOnPo)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.qtyOnSo)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.vendorCasePack)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.weeksOnHand)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.weeksOnPo)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {rows.length > 0 && totals && (
            <tfoot className="sticky bottom-0 bg-slate-800/95">
              <tr>
                <td colSpan={3} className="px-3 py-2.5 font-semibold text-white">
                  Total
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.qtyOnHand)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.qtyOnPo)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.qtyOnSo)}
                </td>
                <td />
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.weeksOnHand)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.weeksOnPo)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
