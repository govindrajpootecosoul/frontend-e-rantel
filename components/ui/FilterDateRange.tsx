'use client';

import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DatePickerCalendar from '@/components/ui/DatePickerCalendar';
import MonthPickerCalendar from '@/components/ui/MonthPickerCalendar';
import { formatDateFilterLabel } from '@/lib/sps/dateFilters';

interface FilterDateRangeProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mode?: 'date' | 'month';
  loading?: boolean;
}

export default function FilterDateRange({
  label,
  value,
  onChange,
  mode = 'date',
  loading,
}: FilterDateRangeProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = value !== 'All';

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleApply = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('All');
    setOpen(false);
  };

  const displayLabel = active ? formatDateFilterLabel(value, mode) : 'Select date';

  return (
    <div ref={containerRef} className="flex flex-col gap-1">
      <label
        className="truncate text-[9px] font-medium uppercase tracking-wide text-slate-400"
        title={label}
      >
        {label}
      </label>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={loading}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left transition disabled:opacity-50 ${
            open
              ? 'border-cyan-500/50 bg-slate-900/80 ring-1 ring-cyan-500/20'
              : active
                ? 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10'
                : 'border-slate-700/80 bg-slate-950/60 hover:border-slate-600'
          }`}
        >
          <CalendarDays size={12} className="shrink-0 text-cyan-400/80" />
          <span
            className={`min-w-0 flex-1 truncate text-[10px] ${
              active ? 'font-medium text-cyan-300' : 'text-slate-500'
            }`}
            title={displayLabel}
          >
            {displayLabel}
          </span>
          <ChevronDown
            size={12}
            className={`shrink-0 text-slate-500 transition ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {active && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            title="Clear"
            className="shrink-0 rounded-md border border-slate-700/80 bg-slate-950/60 p-1.5 text-slate-500 hover:bg-slate-800/60 hover:text-rose-300 disabled:opacity-50"
          >
            <X size={10} />
          </button>
        )}
      </div>

      {open && (
        <div className="mt-1 rounded-lg border border-slate-700/80 bg-slate-950 p-2">
          {mode === 'month' ? (
            <MonthPickerCalendar value={value} onApply={handleApply} disabled={loading} />
          ) : (
            <DatePickerCalendar value={value} onApply={handleApply} disabled={loading} />
          )}
        </div>
      )}
    </div>
  );
}
