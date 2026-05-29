'use client';

import KeheChainStoreTab from '@/components/stores/kehe/KeheChainStoreTab';
import KeheInventoryTab from '@/components/stores/kehe/KeheInventoryTab';
import KeheRiskInventoryTab from '@/components/stores/kehe/KeheRiskInventoryTab';
import { KEHE_TABS } from '@/lib/stores/kehe/constants';
import type { KeheTabId } from '@/lib/stores/kehe/types';
import { useKehe } from '@/providers/KeheProvider';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function KehePage() {
  const { refresh, loading, isFetching, error, totalRows } = useKehe();
  const [activeTab, setActiveTab] = useState<KeheTabId>('chain-store');

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">KeHE Stores</h1>
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
        {KEHE_TABS.map((tab) => {
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

      {activeTab === 'chain-store' && <KeheChainStoreTab />}
      {activeTab === 'inventory' && <KeheInventoryTab />}
      {activeTab === 'risk-inventory' && <KeheRiskInventoryTab />}
    </div>
  );
}
