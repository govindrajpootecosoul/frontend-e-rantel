'use client';

import type { ChartPeriod } from '@/lib/types';

const OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

interface PeriodToggleProps {
  value: ChartPeriod;
  onChange: (period: ChartPeriod) => void;
}

export default function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <div className="flex shrink-0 rounded-lg border border-slate-800 bg-slate-950/60 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
            value === opt.value
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
