'use client';

import KpiCard from '@/components/dashboard/KpiCard';
import { useSps } from '@/providers/SpsProvider';

export default function SpsMetricGrid() {
  const { summary, loading } = useSps();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      <KpiCard title="Total PO Count" value={summary.totalPoCount} loading={loading} highlight />
      <KpiCard title="SKU PO Qty" value={summary.skuPoQty} loading={loading} />
      <KpiCard title="PO Amount" value={summary.poAmount} loading={loading} format="currency" highlight />
      <KpiCard title="Diff Qty" value={summary.diffQty} loading={loading} />
      <KpiCard title="SKU Invoice Qty" value={summary.skuInvoiceQty} loading={loading} />
      <KpiCard title="Invoice Amount" value={summary.invoiceAmount} loading={loading} format="currency" />
      <KpiCard title="Diff Amount" value={summary.diffAmount} loading={loading} format="currency" />
    </div>
  );
}
