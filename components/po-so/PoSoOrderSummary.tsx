'use client';

import SpsDataTable, {
  INVOICE_TABLE_COLUMNS,
  PO_TABLE_COLUMNS,
} from '@/components/sps/SpsDataTable';
import SpsMetricGrid from '@/components/sps/SpsMetricGrid';
import SpsRefreshBar from '@/components/sps/SpsRefreshBar';
import { formatCurrency, formatNumber } from '@/lib/format';
import { getPoSoStoreConfig } from '@/lib/po-so/stores';
import { useSps } from '@/providers/SpsProvider';

export default function PoSoOrderSummary() {
  const {
    storeId,
    poRows,
    invoiceRows,
    summary,
    poPagination,
    invoicePagination,
    poLoading,
    invoiceLoading,
    error,
  } = useSps();

  const store = getPoSoStoreConfig(storeId);

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
            {store.trackerLabel}
          </p>
          <h1 className="text-2xl font-bold text-white">{store.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            SKU-level purchase order and invoice tracking for {store.id.toUpperCase()} channel data
            from <span className="text-slate-400">{store.collection}</span> (
            <span className="text-slate-400">{store.database}</span>).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => alert('Manual entry — coming soon')}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            Manual Entry
          </button>
          <button
            type="button"
            onClick={() => alert('File upload — coming soon')}
            className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/25"
          >
            Upload File
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error.message}
        </div>
      )}

      <SpsRefreshBar />
      <SpsMetricGrid />

      <SpsDataTable
        title="Individual PO's SKU Summary"
        columns={PO_TABLE_COLUMNS}
        rows={poRows}
        loading={poLoading}
        pagination={poPagination}
        footer={{
          label: 'Total',
          values: {
            poDate: 'Total',
            skuQty: formatNumber(summary.skuPoQty),
            poSales: formatCurrency(summary.poAmount),
          },
        }}
      />

      <SpsDataTable
        title="Individual Invoice SKU Summary"
        columns={INVOICE_TABLE_COLUMNS}
        rows={invoiceRows}
        loading={invoiceLoading}
        pagination={invoicePagination}
        footer={{
          label: 'Total',
          values: {
            invoiceNumber: 'Total',
            invoiceQty: formatNumber(summary.skuInvoiceQty),
            totalSales: formatCurrency(summary.invoiceAmount),
          },
        }}
      />
    </div>
  );
}
