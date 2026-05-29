'use client';

import { formatCompactCurrency, formatNumber } from '@/lib/format';
import type { SproutsAgingBucketId, SproutsInventoryDashboard } from '@/lib/stores/sprouts/inventory-types';
import { Fragment } from 'react';

export default function SproutsInventoryOverviewTable({
  data,
  loading,
}: {
  data?: SproutsInventoryDashboard;
  loading?: boolean;
}) {
  const buckets = data?.buckets ?? [];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/95">
              <th className="border-b border-slate-800 px-3 py-2 text-left font-medium text-slate-500">
                Metric
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
            <tr className="bg-slate-900/60">
              <th className="border-b border-slate-800 px-3 py-1" />
              {buckets.map((b) => (
                <Fragment key={`${b.id}-hdr`}>
                  <th className="border-b border-l border-slate-800 px-2 py-1 text-right text-[10px] text-sky-400/90">
                    Inv. Qty
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1 text-right text-[10px] text-slate-500">
                    Vendor Cost
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={buckets.length * 2 + 1}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading…
                </td>
              </tr>
            ) : (
              <>
                <tr className="border-b border-slate-800/60 bg-slate-800/20">
                  <td className="px-3 py-2 font-medium text-slate-300">Inventory Qty</td>
                  {buckets.map((b) => {
                    const cell = data?.overview[b.id as SproutsAgingBucketId];
                    return (
                      <Fragment key={`qty-${b.id}`}>
                        <td className="border-l border-slate-800/60 px-2 py-2 text-right tabular-nums text-sky-300">
                          {formatNumber(cell?.qty ?? 0)}
                        </td>
                        <td className="px-2 py-2" />
                      </Fragment>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-slate-300">Vendor Cost</td>
                  {buckets.map((b) => {
                    const cell = data?.overview[b.id as SproutsAgingBucketId];
                    return (
                      <Fragment key={`cost-${b.id}`}>
                        <td className="border-l border-slate-800/60 px-2 py-2" />
                        <td className="px-2 py-2 text-right tabular-nums text-slate-200">
                          {formatCompactCurrency(cell?.vendorCost ?? 0)}
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
