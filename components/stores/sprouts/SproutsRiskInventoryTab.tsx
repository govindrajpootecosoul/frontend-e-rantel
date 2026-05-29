'use client';

import SproutsUploadBar from '@/components/stores/sprouts/SproutsUploadBar';
import SproutsRiskAtRiskTable from '@/components/stores/sprouts/risk/SproutsRiskAtRiskTable';
import SproutsRiskCharts from '@/components/stores/sprouts/risk/SproutsRiskCharts';
import SproutsRiskStockStatusTable from '@/components/stores/sprouts/risk/SproutsRiskStockStatusTable';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { useSprouts } from '@/providers/SproutsProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function SproutsRiskInventoryTab() {
  const queryClient = useQueryClient();
  const { riskFilters, refresh } = useSprouts();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ['sprouts-risk-dashboard', riskFilters],
    queryFn: async () => (await api.getSproutsRiskInventoryDashboard(riskFilters)).data,
    staleTime: 0,
  });

  const handleUpload = async (file: File, options: { mode: 'append' | 'replace' }) => {
    setUploadMessage(null);
    setUploadError(null);
    try {
      const res = await api.uploadSproutsRiskInventory(file, options.mode);
      setUploadMessage(res.message || `Imported ${res.data.imported} rows`);
      queryClient.invalidateQueries({ queryKey: ['sprouts-risk-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sprouts-risk-filters'] });
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
            ? `${formatNumber(data.rowCount)} at-risk line items`
            : 'Upload Sprouts risk export (ESN, DC, SKU, UnitsOnHandWithNoForecastDemand, etc.)'}
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

      <SproutsRiskCharts data={data} loading={loading} />
      <SproutsRiskAtRiskTable data={data} loading={loading} />
      <SproutsRiskStockStatusTable data={data} loading={loading} />
    </div>
  );
}
