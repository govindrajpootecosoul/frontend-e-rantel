'use client';

import SproutsInventoryAgingCards from '@/components/stores/sprouts/inventory/SproutsInventoryAgingCards';
import SproutsInventoryDcTable from '@/components/stores/sprouts/inventory/SproutsInventoryDcTable';
import SproutsInventoryOverviewTable from '@/components/stores/sprouts/inventory/SproutsInventoryOverviewTable';
import SproutsInventorySkuGrid from '@/components/stores/sprouts/inventory/SproutsInventorySkuGrid';
import SproutsUploadBar from '@/components/stores/sprouts/SproutsUploadBar';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { useSprouts } from '@/providers/SproutsProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function SproutsInventoryTab() {
  const queryClient = useQueryClient();
  const { inventoryReportMonth, refresh } = useSprouts();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ['sprouts-inventory-dashboard', inventoryReportMonth],
    queryFn: async () =>
      (await api.getSproutsInventoryDashboard(inventoryReportMonth)).data,
    staleTime: 0,
  });

  const handleUpload = async (file: File, options: { mode: 'append' | 'replace' }) => {
    setUploadMessage(null);
    setUploadError(null);
    try {
      const res = await api.uploadSproutsInventory(file, options.mode);
      setUploadMessage(res.message || `Imported ${res.data.imported} rows`);
      queryClient.invalidateQueries({ queryKey: ['sprouts-inventory-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sprouts-inventory-filters'] });
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
            : 'Upload Sprouts inventory export (EnterpriseSupplier, DC, SKU, QuantityOnHand, etc.)'}
        </p>
        <SproutsUploadBar onUpload={handleUpload} disabled={loading} />
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

      <SproutsInventoryAgingCards data={data} loading={loading} />
      <SproutsInventoryOverviewTable data={data} loading={loading} />
      <SproutsInventoryDcTable data={data} loading={loading} />
      <SproutsInventorySkuGrid data={data} loading={loading} />
    </div>
  );
}
