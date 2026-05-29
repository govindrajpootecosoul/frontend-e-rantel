'use client';

import { formatNumber } from '@/lib/format';
import type { KeheRiskInventoryDashboard } from '@/lib/stores/kehe/risk-types';

export default function KeheRiskAtRiskTable({
  data,
  loading,
}: {
  data?: KeheRiskInventoryDashboard;
  loading?: boolean;
}) {
  const rows = data?.atRisk ?? [];
  const totals = data?.atRiskTotals;

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-violet-500/30 bg-violet-500/15 px-4 py-3">
        <h3 className="text-sm font-semibold text-violet-200">Inventory at Risk</h3>
      </div>
      <div className="max-h-[320px] overflow-auto">
        <table className="w-full min-w-[1000px] border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-900/95">
            <tr>
              {[
                'Report Date',
                'DC',
                'Broker',
                'SKU',
                'Sell By Date',
                'Units No Forecast',
                'Velocity/Day',
                'Days Remaining',
                'Shelf Life',
                'UOM',
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border-b border-slate-800 px-3 py-2.5 text-left font-medium uppercase tracking-wider text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                  No risk rows — upload file
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={`${row.sku}-${row.dc}-${i}`}
                  className="border-b border-slate-800/60 hover:bg-slate-800/30"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">{row.reportDate}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">{row.dc}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">{row.broker}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-cyan-300">
                    {row.sku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">{row.sellByDate}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-rose-300">
                    {formatNumber(row.unitsOnHandWithNoForecastDemand)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.unitSalesVelocityPerDay)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.daysRemainingToShipToCustomer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-300">
                    {formatNumber(row.guaranteedShelfLifeDaysToCustomer)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-300">{row.uom}</td>
                </tr>
              ))
            )}
          </tbody>
          {rows.length > 0 && totals && (
            <tfoot className="sticky bottom-0 bg-slate-800/95">
              <tr>
                <td colSpan={5} className="px-3 py-2.5 font-semibold text-white">
                  Total
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.unitsOnHandWithNoForecastDemand)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.unitSalesVelocityPerDay)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.daysRemainingToShipToCustomer)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-white">
                  {formatNumber(totals.guaranteedShelfLifeDaysToCustomer)}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
