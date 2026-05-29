'use client';

import KpiCard from '@/components/dashboard/KpiCard';
import SummaryBlock from '@/components/dashboard/SummaryBlock';
import GroupedBarChart from '@/components/charts/GroupedBarChart';
import StatusBreakdown from '@/components/charts/StatusBreakdown';
import { RefreshCw } from 'lucide-react';
import { formatDateTime, formatNumber } from '@/lib/format';
import { useDashboard } from '@/providers/DashboardProvider';

export default function ExecutivePage() {
  const { dashboard, dashboardLoading, isComputing, dashboardError, refresh } = useDashboard();
  const busy = dashboardLoading || isComputing;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Executive Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time purchase order analytics
            {dashboard?.lastUpdated && !dashboardLoading && (
              <span className="text-slate-600">
                {' '}
                · Updated {formatDateTime(dashboard.lastUpdated)}
              </span>
            )}
            {dashboard?.rowCount !== undefined && (
              <span className="text-slate-600">
                {' '}
                · {formatNumber(dashboard.rowCount)} rows
                {isComputing && ' · recalculating…'}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          disabled={dashboardLoading}
          className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"
        >
          <RefreshCw size={14} className={dashboardLoading ? 'animate-spin' : ''} />
          Refresh data
        </button>
      </div>

      {dashboardError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {dashboardError.message}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Channel Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryBlock
            label="Channel Select"
            value={dashboard?.summary.channelSelect}
            loading={busy}
            accent="cyan"
          />
          <SummaryBlock
            label="Unique Distributors"
            value={dashboard?.summary.uniqueDistributors}
            loading={busy}
            accent="emerald"
          />
          <SummaryBlock
            label="Unique Retailers"
            value={dashboard?.summary.uniqueRetailers}
            loading={busy}
            accent="amber"
          />
          <SummaryBlock
            label="Unique Locations"
            value={dashboard?.summary.uniqueLocations}
            loading={busy}
            accent="rose"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          KPI Metrics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          <KpiCard
            title="Total PO Count"
            value={dashboard?.kpiCards.totalPoCount}
            loading={busy}
            highlight
          />
          <KpiCard
            title="SKU PO Qty"
            value={dashboard?.kpiCards.skuPoQty}
            loading={busy}
          />
          <KpiCard
            title="PO Amount"
            value={dashboard?.kpiCards.poAmount}
            loading={busy}
            format="currency"
            highlight
          />
          <KpiCard
            title="Diff Qty"
            value={dashboard?.kpiCards.diffQty}
            loading={busy}
          />
          <KpiCard
            title="SKU Invoice Qty"
            value={dashboard?.kpiCards.skuInvoiceQty}
            loading={busy}
          />
          <KpiCard
            title="Invoice Amount"
            value={dashboard?.kpiCards.invoiceAmount}
            loading={busy}
            format="currency"
          />
          <KpiCard
            title="Diff Amount"
            value={dashboard?.kpiCards.diffAmount}
            loading={busy}
            format="currency"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GroupedBarChart
          title="PO Sale Amount"
          dataByPeriod={
            dashboard?.charts.poSaleByRetailer || {
              daily: [],
              monthly: [],
              yearly: [],
            }
          }
          loading={dashboardLoading}
        />
        <GroupedBarChart
          title="Invoice Sale Amount"
          dataByPeriod={
            dashboard?.charts.invoiceSaleByRetailer || {
              daily: [],
              monthly: [],
              yearly: [],
            }
          }
          loading={dashboardLoading}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatusBreakdown
          title="PO Delivery Status"
          data={dashboard?.charts.poDeliveryStatus || []}
          loading={dashboardLoading}
          variant="ring"
        />
        <StatusBreakdown
          title="PO Delivery Status (Bars)"
          data={dashboard?.charts.poDeliveryStatus || []}
          loading={dashboardLoading}
          variant="bar"
        />
        <StatusBreakdown
          title="PO Status Breakdown"
          data={dashboard?.charts.poStatusBreakdown || []}
          loading={dashboardLoading}
          variant="bar"
        />
      </section>
    </div>
  );
}
