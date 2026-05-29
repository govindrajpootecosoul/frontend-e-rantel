'use client';

import SproutsChainStoreTab from '@/components/stores/sprouts/SproutsChainStoreTab';
import SproutsInventoryTab from '@/components/stores/sprouts/SproutsInventoryTab';
import SproutsRiskInventoryTab from '@/components/stores/sprouts/SproutsRiskInventoryTab';
import { SPROUTS_TABS } from '@/lib/stores/sprouts/constants';
import type { SproutsTabId } from '@/lib/stores/sprouts/types';
import { useSprouts } from '@/providers/SproutsProvider';
import { RefreshCw } from 'lucide-react';

export default function SproutsPage() {
  const { refresh, loading, isFetching, error, totalRows, activeTab, setActiveTab } = useSprouts();

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sprouts Stores</h1>
          <p className="mt-1 text-sm text-slate-500">
            Chain store analytics, inventory, and risk inventory
            {totalRows > 0 && (
              <span className="text-slate-600"> · {totalRows.toLocaleString()} chain store rows</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading || isFetching}
          className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error.message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
        {SPROUTS_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'chain-store' && <SproutsChainStoreTab />}
      {activeTab === 'inventory' && <SproutsInventoryTab />}
      {activeTab === 'risk-inventory' && <SproutsRiskInventoryTab />}
    </div>
  );
}
