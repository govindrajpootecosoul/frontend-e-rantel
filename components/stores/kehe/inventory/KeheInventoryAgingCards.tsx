'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatCompactCurrency, formatNumber } from '@/lib/format';
import type {
  KeheAgingBucketId,
  KeheAgingBucketMeta,
  KeheInventoryDashboard,
} from '@/lib/stores/kehe/inventory-types';

function BucketCell({
  label,
  qty,
  cost,
  variant,
}: {
  label: string;
  qty: number;
  cost: number;
  variant: 'blue' | 'red';
}) {
  const qtyClass = variant === 'red' ? 'text-rose-400' : 'text-sky-400';
  return (
    <div className="min-w-[100px] flex-1 border-r border-slate-800/80 px-3 py-2 last:border-r-0">
      <p className="text-[10px] font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold tabular-nums ${qtyClass}`}>
        {formatNumber(qty)}
      </p>
      <p className="text-xs tabular-nums text-slate-300">{formatCompactCurrency(cost)}</p>
      <p className="text-[9px] text-slate-600">Vendor Cost</p>
    </div>
  );
}

export default function KeheInventoryAgingCards({
  data,
  loading,
}: {
  data?: KeheInventoryDashboard;
  loading?: boolean;
}) {
  const below = (data?.buckets ?? []).filter((b) => b.group === 'below91');
  const above = (data?.buckets ?? []).filter((b) => b.group === 'above90');
  const overview = data?.overview;

  const renderGroup = (
    title: string,
    buckets: KeheAgingBucketMeta[],
    variant: 'blue' | 'red'
  ) => (
    <div className="glass-panel overflow-hidden">
      <div
        className={`border-b px-4 py-2.5 text-xs font-semibold ${
          variant === 'red'
            ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
            : 'border-sky-500/20 bg-sky-500/10 text-sky-200'
        }`}
      >
        {title}
      </div>
      <div className="flex overflow-x-auto">
        {loading
          ? buckets.map((b) => (
              <div key={b.id} className="flex-1 px-3 py-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          : buckets.map((b) => (
              <BucketCell
                key={b.id}
                label={b.label}
                qty={overview?.[b.id as KeheAgingBucketId]?.qty ?? 0}
                cost={overview?.[b.id as KeheAgingBucketId]?.vendorCost ?? 0}
                variant={variant}
              />
            ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {renderGroup(
        'Aged Inventory & Vendor Cost below 91 Days',
        below,
        'blue'
      )}
      {renderGroup(
        'Aged Inventory & Vendor Cost Above 90 Days',
        above,
        'red'
      )}
    </div>
  );
}
