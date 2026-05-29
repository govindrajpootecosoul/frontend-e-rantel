'use client';

import { formatCompactCurrency, formatNumber } from '@/lib/format';
import type { SproutsAgingBucketId, SproutsInventoryDashboard } from '@/lib/stores/sprouts/inventory-types';
import { Fragment } from 'react';

export default function SproutsInventoryDcTable({
  data,
  loading,
}: {
  data?: SproutsInventoryDashboard;
  loading?: boolean;
}) {
  const buckets = data?.buckets ?? [];
  const rows = data?.byDc ?? [];

  const totals = buckets.reduce(
    (acc, b) => {
      const id = b.id as SproutsAgingBucketId;
      rows.forEach((r) => {
        acc[id].qty += r.buckets[id]?.qty ?? 0;
        acc[id].cost += r.buckets[id]?.vendorCost ?? 0;
      });
      return acc;
    },
    Object.fromEntries(
      buckets.map((b) => [b.id, { qty: 0, cost: 0 }])
    ) as Record<SproutsAgingBucketId, { qty: number; cost: number }>
  );

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">DC by Inventory Aged &amp; Vendor Cost</h3>
      </div>
      <div className="max-h-[400px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-900/95">
            <tr>
              <th className="border-b border-slate-800 px-3 py-2 text-left font-medium text-slate-500">
                DC
              </th>
              {buckets.map((b) => (
                <th
                  key={b.id}
                  colSpan={2}
                  className="border-b border-l border-slate-800 px-2 py-2 text-center font-medium text-slate-400"
                >
                  {b.label}
                </th>
              ))}
            </tr>
            <tr className="bg-slate-900/70">
              <th className="border-b border-slate-800" />
              {buckets.map((b) => (
                <Fragment key={`${b.id}-sub`}>
                  <th className="border-b border-l border-slate-800 px-1 py-1 text-right text-[10px] text-sky-400/80">
                    Qty
                  </th>
                  <th className="border-b border-slate-800 px-1 py-1 text-right text-[10px] text-slate-500">
                    Cost
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={buckets.length * 2 + 1} className="px-4 py-10 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={buckets.length * 2 + 1} className="px-4 py-10 text-center text-slate-500">
                  No data — upload inventory file
                </td>
              </tr>
            ) : (
              <>
                {rows.map((row) => (
                  <tr
                    key={row.dc}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30"
                  >
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-200">
                      {row.dc}
                    </td>
                    {buckets.map((b) => {
                      const cell = row.buckets[b.id as SproutsAgingBucketId];
                      return (
                        <Fragment key={`${row.dc}-${b.id}`}>
                          <td className="border-l border-slate-800/40 px-2 py-2 text-right tabular-nums text-sky-300">
                            {formatNumber(cell?.qty ?? 0)}
                          </td>
                          <td className="px-2 py-2 text-right tabular-nums text-slate-300">
                            {formatCompactCurrency(cell?.vendorCost ?? 0)}
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-slate-800/90 font-semibold">
                  <td className="px-3 py-2.5 text-white">Total</td>
                  {buckets.map((b) => {
                    const id = b.id as SproutsAgingBucketId;
                    return (
                      <Fragment key={`total-${b.id}`}>
                        <td className="border-l border-slate-700 px-2 py-2.5 text-right tabular-nums text-white">
                          {formatNumber(totals[id]?.qty ?? 0)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums text-white">
                          {formatCompactCurrency(totals[id]?.cost ?? 0)}
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
