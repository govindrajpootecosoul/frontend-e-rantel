'use client';

import KeheInventoryAgingCards from '@/components/stores/kehe/inventory/KeheInventoryAgingCards';
import KeheInventoryDcTable from '@/components/stores/kehe/inventory/KeheInventoryDcTable';
import KeheInventoryOverviewTable from '@/components/stores/kehe/inventory/KeheInventoryOverviewTable';
import KeheInventorySkuGrid from '@/components/stores/kehe/inventory/KeheInventorySkuGrid';
import KeheUploadBar from '@/components/stores/kehe/KeheUploadBar';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { useKehe } from '@/providers/KeheProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function KeheInventoryTab() {
  const queryClient = useQueryClient();
  const { inventoryReportMonth, refresh } = useKehe();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ['kehe-inventory-dashboard', inventoryReportMonth],
    queryFn: async () =>
      (await api.getKeheInventoryDashboard(inventoryReportMonth)).data,
    staleTime: 0,
  });

  const handleUpload = async (file: File, options: { mode: 'append' | 'replace' }) => {
    setUploadMessage(null);
    setUploadError(null);
    try {
      const res = await api.uploadKeheInventory(file, options.mode);
      setUploadMessage(res.message || `Imported ${res.data.imported} rows`);
      queryClient.invalidateQueries({ queryKey: ['kehe-inventory-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['kehe-inventory-filters'] });
      refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const loading = dashboardQuery.isLoading;
  const data = dashboardQuery.data;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {data?.rowCount
            ? `${formatNumber(data.rowCount)} line items`
            : 'Upload KeHE inventory export (EnterpriseSupplier, DC, SKU, QuantityOnHand, etc.)'}
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
      {dashboardQuery.error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
          {(dashboardQuery.error as Error).message}
        </div>
      )}

      <KeheInventoryAgingCards data={data} loading={loading} />
      <KeheInventoryOverviewTable data={data} loading={loading} />
      <KeheInventoryDcTable data={data} loading={loading} />
      <KeheInventorySkuGrid data={data} loading={loading} />
    </div>
  );
}
