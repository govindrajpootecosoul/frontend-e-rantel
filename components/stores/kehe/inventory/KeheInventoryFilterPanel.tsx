'use client';

import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import FilterDropdown from '@/components/ui/FilterDropdown';
import { useKehe } from '@/providers/KeheProvider';

export default function KeheInventoryFilterPanel() {
  const {
    inventoryReportMonth,
    setInventoryReportMonth,
    inventoryMonthOptions,
    isFetching,
    loading,
  } = useKehe();
  const busy = loading || isFetching;

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
            onClick={() => setInventoryReportMonth('All')}
            title="Reset filters"
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-800/60 hover:text-cyan-300"
          >
            <RotateCcw size={12} />
          </button>
        </div>
        <div className="flex-1 space-y-2.5 overflow-y-auto p-2 custom-scrollbar">
          <FilterDropdown
            label="Month"
            value={inventoryReportMonth}
            options={inventoryMonthOptions}
            onChange={setInventoryReportMonth}
            loading={busy}
          />
        </div>
      </div>
    </aside>
  );
}
