'use client';

import TablePagination from '@/components/ui/TablePagination';

export interface PoTrackerTableRow {
  id: string;
  category: string;
  poNumber: string;
  channel: string;
  distributor: string;
  retailer: string;
  sku: string;
  poDate: string;
  dueDate: string;
  warehouse: string;
  status: string;
}

interface PoTrackerTableProps {
  rows: PoTrackerTableRow[];
  loading?: boolean;
  showCategory?: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

const COLUMNS = [
  { key: 'poNumber', header: 'PO Number' },
  { key: 'category', header: 'Category' },
  { key: 'channel', header: 'Channel' },
  { key: 'distributor', header: 'Distributor' },
  { key: 'retailer', header: 'Retailer' },
  { key: 'sku', header: 'SKU' },
  { key: 'poDate', header: 'PO Date' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'warehouse', header: 'Warehouse' },
  { key: 'status', header: 'Status' },
] as const;

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const tone =
    lower.includes('fulfill')
      ? 'bg-slate-700/80 text-slate-200'
      : lower.includes('pending')
        ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25'
        : lower.includes('cancel')
          ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/25'
          : 'bg-slate-800 text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>
      {status}
    </span>
  );
}

export default function PoTrackerTable({
  rows,
  loading,
  showCategory,
  pagination,
}: PoTrackerTableProps) {
  const visibleColumns = COLUMNS.filter((col) => showCategory || col.key !== 'category');

  return (
    <>
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap border-b border-slate-800 px-3 py-2.5 font-medium uppercase tracking-wider text-slate-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No purchase orders found
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-800/60 transition hover:bg-slate-800/30"
                >
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-3 py-2 text-slate-300">
                      {col.key === 'status' ? (
                        <StatusBadge status={row.status} />
                      ) : col.key === 'category' ? (
                        <span className="font-medium uppercase text-cyan-300/90">
                          {row.category}
                        </span>
                      ) : (
                        row[col.key as keyof PoTrackerTableRow]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={pagination.setPage}
        onPageSizeChange={(size) => {
          pagination.setPageSize(size);
          pagination.setPage(1);
        }}
        disabled={loading}
      />
    </>
  );
}
