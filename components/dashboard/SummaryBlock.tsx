'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/lib/format';

interface SummaryBlockProps {
  label: string;
  value?: number;
  loading?: boolean;
  accent?: 'cyan' | 'emerald' | 'amber' | 'rose';
}

const accentMap = {
  cyan: 'text-cyan-400 ring-cyan-500/20',
  emerald: 'text-emerald-400 ring-emerald-500/20',
  amber: 'text-amber-400 ring-amber-500/20',
  rose: 'text-rose-400 ring-rose-500/20',
};

export default function SummaryBlock({
  label,
  value,
  loading,
  accent = 'cyan',
}: SummaryBlockProps) {
  return (
    <div className={`glass-panel p-4 ring-1 ${accentMap[accent]}`}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <p className={`mt-2 text-2xl font-semibold tabular-nums ${accentMap[accent].split(' ')[0]}`}>
          {formatNumber(value ?? 0)}
        </p>
      )}
    </div>
  );
}
