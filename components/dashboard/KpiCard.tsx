'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency, formatNumber } from '@/lib/format';

interface KpiCardProps {
  title: string;
  value?: number;
  loading?: boolean;
  format?: 'number' | 'currency';
  highlight?: boolean;
  animate?: boolean;
}

export default function KpiCard({
  title,
  value = 0,
  loading,
  format = 'number',
  highlight,
  animate = true,
}: KpiCardProps) {
  const animatedValue = useCountUp(value, {
    duration: 1200,
    enabled: animate && !loading,
  });

  const display =
    format === 'currency'
      ? formatCurrency(Math.round(animatedValue))
      : formatNumber(Math.round(animatedValue));

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        highlight
          ? 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900/60'
          : 'border-slate-800 bg-slate-900/50'
      }`}
    >
      <p className="text-xs text-slate-500">{title}</p>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-28" />
      ) : (
        <p className="mt-2 text-xl font-bold tabular-nums text-white">{display}</p>
      )}
    </div>
  );
}
