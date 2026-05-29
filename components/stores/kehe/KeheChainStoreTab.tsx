'use client';

import KeheDataTable from '@/components/stores/kehe/KeheDataTable';
import KeheMetricGrid from '@/components/stores/kehe/KeheMetricGrid';
import KeheUploadBar from '@/components/stores/kehe/KeheUploadBar';
import { api } from '@/lib/api';
import { formatCompactCurrency, formatCurrency, formatNumber } from '@/lib/format';
import { KEHE_DETAIL_COLUMNS } from '@/lib/stores/kehe/columns';
import type { KeheTableColumn } from '@/lib/stores/kehe/columns';
import type { KeheQuantitySummaryRow, KeheRetailerSummaryRow } from '@/lib/stores/kehe/types';
import { useKehe } from '@/providers/KeheProvider';
import { useState } from 'react';

const RETAILER_COLUMNS: KeheTableColumn<KeheRetailerSummaryRow>[] = [
  { key: 'retailer', header: 'Retailer', render: (r) => r.retailer || '—' },
  { key: 'storeCount', header: 'Store', align: 'right', render: (r) => formatNumber(r.storeCount) },
  { key: 'skuCount', header: 'SKU', align: 'right', render: (r) => formatNumber(r.skuCount) },
  {
    key: 'orderedVendorCost',
    header: 'Ordered (Vendor Cost)',
    align: 'right',
    render: (r) => formatCurrency(r.orderedVendorCost),
  },
  {
    key: 'shippedVendorCost',
    header: 'Shipped (Vendor Cost)',
    align: 'right',
    render: (r) => formatCurrency(r.shippedVendorCost),
  },
  {
    key: 'difference',
    header: 'Difference',
    align: 'right',
    render: (r) => formatCurrency(r.difference),
  },
];

const QTY_COLUMNS: KeheTableColumn<KeheQuantitySummaryRow>[] = [
  { key: 'sku', header: 'SKU', render: (r) => r.sku || '—' },
  { key: 'retailer', header: 'Retailer', render: (r) => r.retailer || '—' },
  { key: 'storeCount', header: 'Store', align: 'right', render: (r) => formatNumber(r.storeCount) },
  { key: 'orderedQuantity', header: 'Ordered (Qty)', align: 'right', render: (r) => formatNumber(r.orderedQuantity) },
  { key: 'shippedQuantity', header: 'Shipped (Qty)', align: 'right', render: (r) => formatNumber(r.shippedQuantity) },
  { key: 'diffQty', header: 'Diff Qty', align: 'right', render: (r) => formatNumber(r.diffQty) },
];

export default function KeheChainStoreTab() {
  const {
    summary,
    byRetailer,
    byQuantity,
    detailRows,
    detailPage,
    detailPageSize,
    detailTotal,
    setDetailPage,
    setDetailPageSize,
    loading,
    refresh,
    totalRows,
  } = useKehe();

  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const retailerTotals = byRetailer.reduce(
    (acc, row) => ({
      ordered: acc.ordered + row.orderedVendorCost,
      shipped: acc.shipped + row.shippedVendorCost,
      diff: acc.diff + row.difference,
    }),
    { ordered: 0, shipped: 0, diff: 0 }
  );

  const qtyTotals = byQuantity.reduce(
    (acc, row) => ({
      ordered: acc.ordered + row.orderedQuantity,
      shipped: acc.shipped + row.shippedQuantity,
      diff: acc.diff + row.diffQty,
    }),
    { ordered: 0, shipped: 0, diff: 0 }
  );

  const handleUpload = async (file: File, options: { mode: 'append' | 'replace' }) => {
    setUploadMessage(null);
    setUploadError(null);
    try {
      const res = await api.uploadKeheChainStore(file, options.mode);
      setUploadMessage(res.message || `Imported ${res.data.imported} rows`);
      refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  return (
    <div className="space-y-5">
      <KeheMetricGrid />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {totalRows > 0
            ? `${formatNumber(totalRows)} rows in database`
            : 'No chain store data yet — optional upload below'}
        </p>
        <KeheUploadBar onUpload={handleUpload} disabled={loading} />
      </div>

      {uploadMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          {uploadMessage}
        </div>
      )}
      {uploadError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <KeheDataTable
          title="Retailer Vendor Cost Ordered by Shipped"
          columns={RETAILER_COLUMNS}
          rows={byRetailer.map((r, i) => ({ ...r, _id: `${r.retailer}-${i}` }))}
          loading={loading}
          footer={{
            label: 'Total',
            values: {
              orderedVendorCost: formatCurrency(retailerTotals.ordered),
              shippedVendorCost: formatCurrency(retailerTotals.shipped),
              difference: formatCurrency(retailerTotals.diff),
            },
          }}
        />
        <KeheDataTable
          title="Quantity Ordered Vs Shipped"
          columns={QTY_COLUMNS}
          rows={byQuantity.map((r, i) => ({ ...r, _id: `${r.sku}-${i}` }))}
          loading={loading}
          headerClassName="border-b border-slate-800 bg-cyan-500/10"
          footer={{
            label: 'Total',
            values: {
              orderedQuantity: formatNumber(qtyTotals.ordered),
              shippedQuantity: formatNumber(qtyTotals.shipped),
              diffQty: formatNumber(qtyTotals.diff),
            },
          }}
        />
      </div>

      <KeheDataTable
        title="Chain Store Detailed View"
        columns={KEHE_DETAIL_COLUMNS}
        rows={detailRows}
        loading={loading}
        pagination={{
          page: detailPage,
          pageSize: detailPageSize,
          total: detailTotal,
          onPageChange: setDetailPage,
          onPageSizeChange: setDetailPageSize,
        }}
        footer={{
          label: 'Total',
          values: {
            orderedVendorCost: formatCompactCurrency(summary.orderedVendorCost),
            shippedVendorCost: formatCompactCurrency(summary.shippedVendorCost),
            orderedQuantity: formatNumber(
              detailRows.reduce((s, r) => s + (r.orderedQuantity ?? 0), 0)
            ),
            shippedQuantity: formatNumber(
              detailRows.reduce((s, r) => s + (r.shippedQuantity ?? 0), 0)
            ),
          },
        }}
      />
    </div>
  );
}
