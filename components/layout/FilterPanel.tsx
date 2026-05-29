'use client';

import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import FilterDateRange from '@/components/ui/FilterDateRange';
import FilterDropdown from '@/components/ui/FilterDropdown';
import { FILTER_KEYS, FILTER_LABELS } from '@/lib/constants';
import type { FilterKey } from '@/lib/types';
import { useDashboard } from '@/providers/DashboardProvider';

const MONTH_FILTER_KEYS: FilterKey[] = ['yearMonthPo'];

export default function FilterPanel() {
  const {
    filters,
    setFilter,
    resetFilters,
    filterOptions,
    filtersLoading,
    isComputing,
  } = useDashboard();

  const busy = filtersLoading;

  return (
    <aside className="h-full w-56 shrink-0">
      <div className="glass-panel flex h-full flex-col overflow-hidden shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-slate-800 px-2 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <SlidersHorizontal size={14} className="shrink-0 text-cyan-400" />
            <h2 className="truncate text-xs font-semibold text-white">Filters</h2>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            title="Reset filters"
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-800/60 hover:text-cyan-300"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto p-2 custom-scrollbar">
          {FILTER_KEYS.map((key) => {
            if (MONTH_FILTER_KEYS.includes(key)) {
              return (
                <FilterDateRange
                  key={key}
                  label={FILTER_LABELS[key]}
                  value={filters[key]}
                  onChange={(v) => setFilter(key, v)}
                  mode="month"
                  loading={busy}
                />
              );
            }

            return (
              <FilterDropdown
                key={key}
                label={FILTER_LABELS[key]}
                value={filters[key]}
                options={filterOptions?.[key] || ['All']}
                onChange={(v) => setFilter(key, v)}
                loading={busy}
              />
            );
          })}
        </div>

        {isComputing && !filtersLoading && (
          <div className="border-t border-slate-800 px-2 py-1.5 text-center text-[10px] text-cyan-400/80">
            Updating…
          </div>
        )}
      </div>
    </aside>
  );
}
