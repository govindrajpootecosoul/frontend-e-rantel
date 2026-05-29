'use client';

import TablePagination from '@/components/ui/TablePagination';
import { formatCurrency, formatNumber } from '@/lib/format';
import { formatSpsDate, resolvePoStatus } from '@/lib/sps/utils';
import type { SpsRow, SpsTablePagination } from '@/lib/sps/types';

interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render: (row: T) => React.ReactNode;
}

interface SpsDataTableProps {
  title: string;
  columns: Column<SpsRow>[];
  rows: SpsRow[];
  loading?: boolean;
  footer?: { label: string; values: Record<string, React.ReactNode> };
  pagination?: SpsTablePagination;
}

export default function SpsDataTable({
  title,
  columns,
  rows,
  loading,
  footer,
  pagination,
}: SpsDataTableProps) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap border-b border-slate-800 px-3 py-2.5 font-medium uppercase tracking-wider text-slate-500 ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                  No rows available
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-slate-800/60 transition hover:bg-slate-800/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-3 py-2 text-slate-300 ${
                        col.align === 'right' ? 'text-right tabular-nums' : ''
                      }`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footer && !loading && rows.length > 0 && (
            <tfoot className="sticky bottom-0 bg-slate-950/95 font-semibold text-cyan-300">
              <tr>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border-t border-slate-700 px-3 py-2 ${
                      col.align === 'right' ? 'text-right tabular-nums' : ''
                    }`}
                  >
                    {footer.values[col.key] ?? ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {pagination && (
        <TablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.setPage}
          onPageSizeChange={pagination.setPageSize}
          disabled={loading}
        />
      )}
    </div>
  );
}

export const PO_TABLE_COLUMNS: Column<SpsRow>[] = [
  { key: 'poDate', header: 'PO Date', render: (r) => formatSpsDate(r.poDate) },
  {
    key: 'yearMonthPo',
    header: 'Year Month PO',
    render: (r) => r.yearMonthPo || formatSpsDate(r.commonPoDate || r.poDate),
  },
  {
    key: 'poRequestedDeliveryDate',
    header: 'PO Requested Delivery Date',
    render: (r) => formatSpsDate(r.poRequestedDeliveryDate),
  },
  { key: 'poNumber', header: '# PO', render: (r) => r.poNumber || '—' },
  { key: 'distributor', header: 'Distributors', render: (r) => r.distributor || '—' },
  { key: 'retailer', header: 'Retailers', render: (r) => r.retailer || '—' },
  { key: 'channel', header: 'Channel', render: (r) => r.channel || '—' },
  { key: 'shippingCity', header: 'City', render: (r) => r.shippingCity || '—' },
  { key: 'upcGtin', header: 'UPC/GTIN', render: (r) => r.upcGtin || '—' },
  { key: 'sku', header: 'SKU', render: (r) => r.sku || '—' },
  { key: 'status', header: 'Status', render: (r) => resolvePoStatus(r) || '—' },
  {
    key: 'skuQty',
    header: 'PO SKU Qty',
    align: 'right',
    render: (r) => formatNumber(r.skuQty ?? 0),
  },
  {
    key: 'poSales',
    header: 'PO Amount',
    align: 'right',
    render: (r) => formatCurrency(r.poSales ?? 0),
  },
  { key: 'location', header: 'Location', render: (r) => r.location || '—' },
  {
    key: 'unitListCost',
    header: 'Unit LC',
    align: 'right',
    render: (r) => formatCurrency(r.unitListCost ?? 0),
  },
];

export const INVOICE_TABLE_COLUMNS: Column<SpsRow>[] = [
  { key: 'invoiceNumber', header: '# Invoice', render: (r) => r.invoiceNumber || '—' },
  { key: 'invoiceDate', header: 'Invoice Date', render: (r) => formatSpsDate(r.invoiceDate) },
  {
    key: 'poRequestedDeliveryDate',
    header: 'PO Requested Delivery Date',
    render: (r) => formatSpsDate(r.poRequestedDeliveryDate),
  },
  { key: 'poNumber', header: '# PO', render: (r) => r.poNumber || '—' },
  { key: 'distributor', header: 'Distributors', render: (r) => r.distributor || '—' },
  { key: 'retailer', header: 'Retailers', render: (r) => r.retailer || '—' },
  { key: 'channel', header: 'Channel', render: (r) => r.channel || '—' },
  { key: 'sku', header: 'SKU', render: (r) => r.sku || '—' },
  {
    key: 'invoiceQty',
    header: 'Invoice Qty',
    align: 'right',
    render: (r) => formatNumber(r.invoiceQty ?? 0),
  },
  {
    key: 'srp',
    header: 'SRP',
    align: 'right',
    render: (r) => (r.srp != null ? formatCurrency(r.srp) : '—'),
  },
  {
    key: 'totalSales',
    header: 'Invoice Amount',
    align: 'right',
    render: (r) => formatCurrency(r.totalSales ?? 0),
  },
  {
    key: 'unitListCost',
    header: 'Unit List Cost',
    align: 'right',
    render: (r) => formatCurrency(r.unitListCost ?? 0),
  },
  {
    key: 'ecoRevenue',
    header: 'EcoSoul Secondary Revenue',
    align: 'right',
    render: (r) => formatCurrency(r.totalSales ?? 0),
  },
];
