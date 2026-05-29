'use client';

import { formatNumber } from '@/lib/format';
import type { KeheAgingBucketId, KeheInventoryDashboard } from '@/lib/stores/kehe/inventory-types';
import { Fragment, useMemo } from 'react';

export default function KeheInventorySkuGrid({
  data,
  loading,
}: {
  data?: KeheInventoryDashboard;
  loading?: boolean;
}) {
  const buckets = data?.buckets ?? [];

  const rows = useMemo(() => {
    const map = new Map<
      string,
      {
        sku: string;
        productDescription: string;
        byDc: Map<string, Record<KeheAgingBucketId, number>>;
      }
    >();

    for (const item of data?.skuGrid ?? []) {
      if (!map.has(item.sku)) {
        map.set(item.sku, {
          sku: item.sku,
          productDescription: item.productDescription,
          byDc: new Map(),
        });
      }
      const entry = map.get(item.sku)!;
      if (!entry.byDc.has(item.dc)) {
        entry.byDc.set(
          item.dc,
          Object.fromEntries(buckets.map((b) => [b.id, 0])) as Record<KeheAgingBucketId, number>
        );
      }
      const dcBuckets = entry.byDc.get(item.dc)!;
      buckets.forEach((b) => {
        const id = b.id as KeheAgingBucketId;
        dcBuckets[id] += item.buckets[id]?.qty ?? 0;
      });
    }

    return [...map.values()].sort((a, b) => a.sku.localeCompare(b.sku));
  }, [data?.skuGrid, buckets]);

  const dcList = data?.dcList ?? [];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Inventory Aging By SKU across DC</h3>
      </div>
      <div className="max-h-[480px] overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-slate-900/95">
            <tr>
              <th
                rowSpan={2}
                className="border-b border-slate-800 px-3 py-2 text-left font-medium text-slate-500"
              >
                SKU
              </th>
              {dcList.map((dc) => (
                <th
                  key={dc}
                  colSpan={buckets.length}
                  className="border-b border-l border-slate-800 px-2 py-2 text-center font-medium text-cyan-400/90"
                >
                  {dc}
                </th>
              ))}
            </tr>
            <tr>
              {dcList.map((dc) =>
                buckets.map((b) => (
                  <th
                    key={`${dc}-${b.id}`}
                    className="border-b border-l border-slate-800/60 px-1 py-1 text-right text-[9px] font-normal text-slate-500"
                    title={b.label}
                  >
                    {b.label.replace(' days', 'd').replace(' to ', '-')}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={1 + dcList.length * buckets.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={1 + dcList.length * buckets.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No SKU data
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.sku}
                  className="border-b border-slate-800/60 hover:bg-slate-800/30"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    <span className="font-medium">{row.sku}</span>
                    {row.productDescription && (
                      <span className="mt-0.5 block max-w-[140px] truncate text-[10px] text-slate-500">
                        {row.productDescription}
                      </span>
                    )}
                  </td>
                  {dcList.map((dc) => {
                    const dcBuckets = row.byDc.get(dc);
                    return (
                      <Fragment key={`${row.sku}-${dc}`}>
                        {buckets.map((b) => (
                          <td
                            key={`${row.sku}-${dc}-${b.id}`}
                            className="border-l border-slate-800/40 px-1.5 py-2 text-right tabular-nums text-slate-400"
                          >
                            {formatNumber(
                              dcBuckets?.[b.id as KeheAgingBucketId] ?? 0
                            )}
                          </td>
                        ))}
                      </Fragment>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
