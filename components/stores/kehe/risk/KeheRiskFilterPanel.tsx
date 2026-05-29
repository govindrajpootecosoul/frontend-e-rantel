'use client';

import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import FilterDropdown from '@/components/ui/FilterDropdown';
import { KEHE_RISK_FILTER_KEYS, KEHE_RISK_FILTER_LABELS } from '@/lib/stores/kehe/constants';
import type { KeheRiskFilterKey } from '@/lib/stores/kehe/risk-types';
import { useKehe } from '@/providers/KeheProvider';

export default function KeheRiskFilterPanel() {
  const {
    riskFilters,
    setRiskFilter,
    resetRiskFilters,
    riskFilterOptions,
    loading,
    isFetching,
  } = useKehe();
  const busy = loading || isFetching;

  return (
    <aside className="h-full w-56 shrink-0">
      <div className="glass-panel flex h-full flex-col overflow-hidden shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-slate-800 px-2 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <SlidersHorizontal size={14} className="shrink-0 text-violet-400" />
            <h2 className="truncate text-xs font-semibold text-white">Filters</h2>
          </div>
          <button
            type="button"
            onClick={resetRiskFilters}
            title="Reset filters"
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-800/60 hover:text-violet-300"
          >
            <RotateCcw size={12} />
          </button>
        </div>
        <div className="flex-1 space-y-2.5 overflow-y-auto p-2 custom-scrollbar">
          {KEHE_RISK_FILTER_KEYS.map((key: KeheRiskFilterKey) => (
            <FilterDropdown
              key={key}
              label={KEHE_RISK_FILTER_LABELS[key]}
              value={riskFilters[key]}
              options={riskFilterOptions[key] || ['All']}
              onChange={(v) => setRiskFilter(key, v)}
              loading={busy}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
