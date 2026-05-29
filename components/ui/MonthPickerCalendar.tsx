'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  formatMonthKeyLabel,
  isKeyInRange,
  MONTH_LABELS,
  normalizeRangeKeys,
  parseMonthKey,
} from '@/lib/sps/calendarUtils';
import { parseDateFilter, serializeDateFilter } from '@/lib/sps/dateFilters';

interface MonthPickerCalendarProps {
  value: string;
  onApply: (value: string) => void;
  disabled?: boolean;
}

export default function MonthPickerCalendar({ value, onApply, disabled }: MonthPickerCalendarProps) {
  const applied = parseDateFilter(value);
  const initialAnchor = parseMonthKey(applied.from || applied.to) ?? new Date();

  const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());
  const [draftStart, setDraftStart] = useState(applied.from);
  const [draftEnd, setDraftEnd] = useState(applied.isRange ? applied.to : '');

  useEffect(() => {
    const next = parseDateFilter(value);
    const anchor = parseMonthKey(next.from || next.to);
    if (anchor) setViewYear(anchor.getFullYear());
    setDraftStart(next.from);
    setDraftEnd(next.isRange ? next.to : '');
  }, [value]);

  const monthKey = (monthIndex: number) =>
    `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`;

  const handleMonthClick = (monthIndex: number) => {
    if (disabled) return;
    const key = monthKey(monthIndex);

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(key);
      setDraftEnd('');
      return;
    }

    if (draftStart === key) return;

    const { start, end } = normalizeRangeKeys(draftStart, key);
    setDraftStart(start);
    setDraftEnd(end);
  };

  const handleApply = () => {
    if (!draftStart || disabled) return;

    if (draftEnd) {
      onApply(serializeDateFilter(draftStart, draftEnd, true));
      return;
    }

    onApply(serializeDateFilter(draftStart, draftStart, false));
  };

  const rangePreview = draftStart && draftEnd ? normalizeRangeKeys(draftStart, draftEnd) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setViewYear((y) => y - 1)}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-800/60 hover:text-white disabled:opacity-50"
          aria-label="Previous year"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-[10px] font-medium text-slate-200">{viewYear}</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setViewYear((y) => y + 1)}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-800/60 hover:text-white disabled:opacity-50"
          aria-label="Next year"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {MONTH_LABELS.map((label, index) => {
          const key = monthKey(index);
          const isStart = draftStart === key;
          const isEnd = draftEnd === key;
          const inRange =
            rangePreview && isKeyInRange(key, rangePreview.start, rangePreview.end);
          const isSelected = isStart || isEnd || (draftStart === key && !draftEnd);

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => handleMonthClick(index)}
              className={`rounded py-1.5 text-[10px] font-medium transition disabled:opacity-50 ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950'
                  : inRange
                    ? 'bg-cyan-500/25 text-cyan-100'
                    : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="text-[9px] text-slate-500">
        {!draftStart && 'Select a month, or pick start & end for range'}
        {draftStart && !draftEnd && `Selected: ${formatMonthKeyLabel(draftStart)} — Apply for single month`}
        {draftStart &&
          draftEnd &&
          `Range: ${formatMonthKeyLabel(draftStart)} – ${formatMonthKeyLabel(draftEnd)} — Apply to filter`}
      </p>

      <button
        type="button"
        disabled={disabled || !draftStart}
        onClick={handleApply}
        className="w-full rounded-md bg-cyan-500/20 py-1.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-cyan-500/30 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Apply
      </button>
    </div>
  );
}
