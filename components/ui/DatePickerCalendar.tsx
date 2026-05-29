'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  formatDayKey,
  formatMonthYear,
  getCalendarDays,
  isKeyInRange,
  normalizeRangeKeys,
  parseDateKey,
  toDateKey,
  WEEKDAY_LABELS,
} from '@/lib/sps/calendarUtils';
import { parseDateFilter, serializeDateFilter } from '@/lib/sps/dateFilters';

interface DatePickerCalendarProps {
  value: string;
  onApply: (value: string) => void;
  disabled?: boolean;
}

export default function DatePickerCalendar({ value, onApply, disabled }: DatePickerCalendarProps) {
  const applied = parseDateFilter(value);
  const initialAnchor = parseDateKey(applied.from || applied.to) ?? new Date();

  const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialAnchor.getMonth());
  const [draftStart, setDraftStart] = useState(applied.from);
  const [draftEnd, setDraftEnd] = useState(applied.isRange ? applied.to : '');

  useEffect(() => {
    const next = parseDateFilter(value);
    const anchor = parseDateKey(next.from || next.to);
    if (anchor) {
      setViewYear(anchor.getFullYear());
      setViewMonth(anchor.getMonth());
    }
    setDraftStart(next.from);
    setDraftEnd(next.isRange ? next.to : '');
  }, [value]);

  const cells = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const viewDate = new Date(viewYear, viewMonth, 1);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleDayClick = (key: string) => {
    if (disabled) return;

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
  const canApply = Boolean(draftStart);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={disabled}
          onClick={() => shiftMonth(-1)}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-800/60 hover:text-white disabled:opacity-50"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-[10px] font-medium text-slate-200">{formatMonthYear(viewDate)}</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => shiftMonth(1)}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-800/60 hover:text-white disabled:opacity-50"
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="py-0.5 text-center text-[8px] font-medium uppercase text-slate-500"
          >
            {day}
          </div>
        ))}

        {cells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-7" />;
          }

          const key = toDateKey(date);
          const isStart = draftStart === key;
          const isEnd = draftEnd === key;
          const inRange =
            rangePreview && isKeyInRange(key, rangePreview.start, rangePreview.end);
          const isSelected = isStart || isEnd || (draftStart === key && !draftEnd);
          const isToday = key === toDateKey(new Date());

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(key)}
              className={`h-7 rounded text-[10px] tabular-nums transition disabled:opacity-50 ${
                isSelected
                  ? 'bg-cyan-500 font-semibold text-slate-950'
                  : inRange
                    ? 'bg-cyan-500/25 text-cyan-100'
                    : isToday
                      ? 'ring-1 ring-cyan-500/40 text-cyan-300 hover:bg-slate-800/60'
                      : 'text-slate-300 hover:bg-slate-800/60'
              } ${inRange && !isStart && !isEnd ? 'rounded-none' : ''} ${
                isStart && inRange && draftEnd ? 'rounded-r-none' : ''
              } ${isEnd && inRange && draftStart ? 'rounded-l-none' : ''}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <p className="text-[9px] text-slate-500">
        {!draftStart && 'Select a date, or pick start & end for range'}
        {draftStart && !draftEnd && `Selected: ${formatDayKey(draftStart)} — Apply for single date`}
        {draftStart &&
          draftEnd &&
          `Range: ${formatDayKey(draftStart)} – ${formatDayKey(draftEnd)} — Apply to filter`}
      </p>

      <button
        type="button"
        disabled={disabled || !canApply}
        onClick={handleApply}
        className="w-full rounded-md bg-cyan-500/20 py-1.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-cyan-500/30 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Apply
      </button>
    </div>
  );
}
