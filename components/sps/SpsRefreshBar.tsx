'use client';

import { RefreshCw } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { getPoSoStoreConfig } from '@/lib/po-so/stores';
import { useSps } from '@/providers/SpsProvider';

export default function SpsRefreshBar() {
  const { storeId, poPagination, totalRows, refresh, isFetching, lastUpdated } = useSps();
  const store = getPoSoStoreConfig(storeId);

  return (
    <div className="glass-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="text-sm text-slate-400">
        <span className="font-medium text-slate-200">{formatNumber(poPagination.total)}</span> of{' '}
        <span className="font-medium text-slate-200">{formatNumber(totalRows)}</span> rows from{' '}
        <span className="text-slate-300">{store.collection}</span>
        {lastUpdated && (
          <span className="ml-2 text-xs text-slate-500">
            · Updated {new Date(lastUpdated).toLocaleString()}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => refresh()}
        disabled={isFetching}
        className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
      >
        <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
        Refresh now
      </button>
    </div>
  );
}
