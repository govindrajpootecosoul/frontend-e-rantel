'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatCompactCurrency, formatNumber, formatPercent } from '@/lib/format';
import { useKehe } from '@/providers/KeheProvider';

function MetricTile({
  title,
  value,
  loading,
  accent,
}: {
  title: string;
  value: string;
  loading?: boolean;
  accent: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent}`}>
      <p className="text-xs font-medium text-slate-400">{title}</p>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <p className="mt-2 text-xl font-bold tabular-nums text-white">{value}</p>
      )}
    </div>
  );
}

export default function KeheMetricGrid() {
  const { summary, loading } = useKehe();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile
          title="Ordered (Vendor Cost)"
          value={formatCompactCurrency(summary.orderedVendorCost)}
          loading={loading}
          accent="border-orange-500/30 bg-orange-500/5"
        />
        <MetricTile
          title="Shipped (Vendor Cost)"
          value={formatCompactCurrency(summary.shippedVendorCost)}
          loading={loading}
          accent="border-amber-500/30 bg-amber-500/5"
        />
        <MetricTile
          title="Fill Rate"
          value={formatPercent(summary.fillRateVendorCost)}
          loading={loading}
          accent="border-rose-500/30 bg-rose-500/5"
        />
        <MetricTile
          title="Markup"
          value={formatPercent(summary.markupAvg, 1)}
          loading={loading}
          accent="border-orange-400/20 bg-orange-400/5"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricTile
          title="Retailer Count"
          value={formatNumber(summary.retailerCount)}
          loading={loading}
          accent="border-emerald-500/30 bg-emerald-500/5"
        />
        <MetricTile
          title="Store Count"
          value={formatNumber(summary.storeCount)}
          loading={loading}
          accent="border-teal-500/30 bg-teal-500/5"
        />
        <MetricTile
          title="SKU Count"
          value={formatNumber(summary.skuCount)}
          loading={loading}
          accent="border-sky-500/30 bg-sky-500/5"
        />
      </div>
    </div>
  );
}
