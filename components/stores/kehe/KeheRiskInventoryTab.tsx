'use client';

import KeheDataTable from '@/components/stores/kehe/KeheDataTable';
import KeheUploadBar from '@/components/stores/kehe/KeheUploadBar';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import type { KeheTableColumn } from '@/lib/stores/kehe/columns';
import type { KeheRiskInventoryRow } from '@/lib/stores/kehe/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const RISK_COLUMNS: KeheTableColumn<KeheRiskInventoryRow>[] = [
  { key: 'fileMonth', header: 'File Month', render: (r) => r.fileMonth || '—' },
  { key: 'retailer', header: 'Retailer', render: (r) => r.retailer || '—' },
  { key: 'retailerArea', header: 'Retailer Area', render: (r) => r.retailerArea || '—' },
  { key: 'sku', header: 'SKU', render: (r) => r.sku || '—' },
  { key: 'upc', header: 'UPC', render: (r) => r.upc || '—' },
  { key: 'productDescription', header: 'Product', render: (r) => r.productDescription || '—' },
  { key: 'riskLevel', header: 'Risk Level', render: (r) => r.riskLevel || '—' },
  {
    key: 'daysOfSupply',
    header: 'Days of Supply',
    align: 'right',
    render: (r) =>
      r.daysOfSupply === null || r.daysOfSupply === undefined ? '—' : formatNumber(r.daysOfSupply),
  },
];

export default function KeheRiskInventoryTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const summaryQuery = useQuery({
    queryKey: ['kehe-risk-summary'],
    queryFn: async () => (await api.getKeheRiskInventorySummary()).data,
  });

  const rowsQuery = useQuery({
    queryKey: ['kehe-risk', page, pageSize],
    queryFn: async () => (await api.getKeheRiskInventoryRows({ page, limit: pageSize })).data,
  });

  const handleUpload = async (file: File, options: { mode: 'append' | 'replace' }) => {
    setUploadMessage(null);
    setUploadError(null);
    try {
      const res = await api.uploadKeheRiskInventory(file, options.mode);
      setUploadMessage(res.message || `Imported ${res.data.imported} rows`);
      queryClient.invalidateQueries({ queryKey: ['kehe-risk'] });
      queryClient.invalidateQueries({ queryKey: ['kehe-risk-summary'] });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const loading = summaryQuery.isLoading || rowsQuery.isLoading;
  const rows = rowsQuery.data?.rows ?? [];

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-xl border border-slate-800 p-4">
        <p className="text-sm text-slate-400">
          KeHE Risk Inventory — upload Excel or CSV. Data is stored in the{' '}
          <code className="text-cyan-400">kehe_risk_inventory</code> collection.
        </p>
        <p className="mt-2 text-2xl font-bold text-white">
          {formatNumber(summaryQuery.data?.rowCount ?? 0)} rows
        </p>
      </div>

      <div className="flex flex-wrap justify-end">
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

      <KeheDataTable
        title="KeHE Risk Inventory"
        columns={RISK_COLUMNS}
        rows={rows}
        loading={loading}
        pagination={{
          page,
          pageSize,
          total: rowsQuery.data?.total ?? 0,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
      />
    </div>
  );
}
