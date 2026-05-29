'use client';

import StatusBreakdown from '@/components/charts/StatusBreakdown';
import { formatNumber } from '@/lib/format';
import type { KeheRiskInventoryDashboard } from '@/lib/stores/kehe/risk-types';

const CHART_COLORS = ['#6366F1', '#F97316', '#22D3EE', '#34D399', '#FB7185', '#A78BFA'];

export default function KeheRiskCharts({
  data,
  loading,
}: {
  data?: KeheRiskInventoryDashboard;
  loading?: boolean;
}) {
  const ringData =
    data?.materialByQtyOnHand.map((m) => ({
      status: m.material,
      count: m.value,
    })) ?? [];

  const poSo = data?.materialByPoSo ?? [];
  const maxPoSo = Math.max(
    1,
    ...poSo.flatMap((m) => [m.qtyOnPo, m.qtyOnSo])
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-violet-500/20">
        <div className="border-b border-violet-500/30 bg-violet-500/15 px-4 py-2.5">
          <h3 className="text-sm font-semibold text-violet-200">Material by Qty on Hand</h3>
        </div>
        <div className="bg-slate-900/40 p-2 [&_h3]:hidden">
          <StatusBreakdown
            title="Material"
            data={ringData}
            loading={loading}
            variant="ring"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-violet-500/20">
        <div className="border-b border-violet-500/30 bg-violet-500/15 px-4 py-2.5">
          <h3 className="text-sm font-semibold text-violet-200">Material by PO &amp; SO</h3>
        </div>
        <div className="space-y-4 bg-slate-900/40 p-5">
          {loading ? (
            <div className="h-48 animate-pulse rounded bg-slate-800/60" />
          ) : poSo.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              {data?.hasRiskData === false
                ? 'Upload risk file first'
                : 'Upload KeHE Inventory tab data for matching SKU/DC'}
            </p>
          ) : (
            poSo.map((row, idx) => (
              <div key={row.material}>
                <p className="mb-2 text-xs font-medium text-slate-400">{row.material}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] text-sky-400">Qty on PO</span>
                    <div className="h-5 flex-1 overflow-hidden rounded bg-slate-800">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${(row.qtyOnPo / maxPoSo) * 100}%`,
                          backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                        }}
                      />
                    </div>
                    <span className="w-12 text-right text-xs tabular-nums text-slate-300">
                      {formatNumber(row.qtyOnPo)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[10px] text-rose-400">Qty on SO</span>
                    <div className="h-5 flex-1 overflow-hidden rounded bg-slate-800">
                      <div
                        className="h-full rounded bg-rose-500/80"
                        style={{ width: `${(row.qtyOnSo / maxPoSo) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-xs tabular-nums text-slate-300">
                      {formatNumber(row.qtyOnSo)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
