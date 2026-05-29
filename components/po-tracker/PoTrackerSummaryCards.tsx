'use client';

import { formatNumber } from '@/lib/format';
import type { PoTrackerSummary } from '@/lib/po-tracker/types';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  PackageCheck,
  Truck,
} from 'lucide-react';

interface PoTrackerSummaryCardsProps {
  summary?: PoTrackerSummary;
  loading?: boolean;
  liveLabel: string;
}

function SummaryCard({
  title,
  value,
  sub,
  loading,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number;
  sub: string;
  loading?: boolean;
  icon: typeof ClipboardList;
  accent?: 'rose' | 'emerald';
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          {loading ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-800" />
          ) : (
            <p className="mt-2 text-2xl font-bold tabular-nums text-white">
              {formatNumber(value)}
            </p>
          )}
          <p
            className={`mt-1 text-xs ${
              accent === 'rose'
                ? 'text-rose-400'
                : accent === 'emerald'
                  ? 'text-emerald-400'
                  : 'text-slate-500'
            }`}
          >
            {sub}
          </p>
        </div>
        <Icon size={20} className="shrink-0 text-slate-600" />
      </div>
    </div>
  );
}

export default function PoTrackerSummaryCards({
  summary,
  loading,
  liveLabel,
}: PoTrackerSummaryCardsProps) {
  const total = summary?.totalPos ?? 0;
  const pending = summary?.pending ?? 0;
  const cancelled = summary?.cancelled ?? 0;
  const shortShipped = summary?.shortShipped ?? 0;
  const fulfilled = summary?.fulfilled ?? 0;
  const withInvoice = summary?.withInvoice ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <SummaryCard
        title="Total POs"
        value={total}
        sub={liveLabel}
        loading={loading}
        icon={ClipboardList}
      />
      <SummaryCard
        title="Pending"
        value={pending}
        sub="Live count"
        loading={loading}
        icon={Clock}
      />
      <SummaryCard
        title="Cancelled"
        value={cancelled}
        sub="Cancelled POs"
        loading={loading}
        icon={AlertTriangle}
        accent={cancelled > 0 ? 'rose' : undefined}
      />
      <SummaryCard
        title="Short Shipped"
        value={shortShipped}
        sub="Short shipped POs"
        loading={loading}
        icon={Truck}
        accent={shortShipped > 0 ? 'rose' : undefined}
      />
      <SummaryCard
        title="Fulfilled"
        value={fulfilled}
        sub="Fulfilled POs"
        loading={loading}
        icon={PackageCheck}
      />
      <SummaryCard
        title="With Invoice"
        value={withInvoice}
        sub="Invoice attached"
        loading={loading}
        icon={CheckCircle2}
        accent="emerald"
      />
    </div>
  );
}
