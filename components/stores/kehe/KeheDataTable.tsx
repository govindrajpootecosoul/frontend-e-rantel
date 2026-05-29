'use client';

import TablePagination from '@/components/ui/TablePagination';
import type { KeheTableColumn } from '@/lib/stores/kehe/columns';

interface KeheDataTableProps<TRow extends { _id: string }> {
  title: string;
  columns: KeheTableColumn<TRow>[];
  rows: TRow[];
  loading?: boolean;
  headerClassName?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  footer?: { label: string; values: Record<string, React.ReactNode> };
  getCellValue?: (row: TRow, column: KeheTableColumn<TRow>) => string;
}

export default function KeheDataTable<TRow extends { _id: string }>({
  title,
  columns,
  rows,
  loading,
  headerClassName = 'bg-slate-900/95',
  pagination,
  footer,
  getCellValue,
}: KeheDataTableProps<TRow>) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className={`border-b border-slate-800 px-4 py-3 ${headerClassName}`}>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-xs">
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
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  No data — upload an Excel or CSV file to get started
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
                      {getCellValue ? getCellValue(row, col) : col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footer && rows.length > 0 && (
            <tfoot className="sticky bottom-0 bg-slate-800/95">
              <tr>
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-3 py-2.5 text-xs font-semibold text-white ${
                      col.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {idx === 0 ? footer.label : footer.values[col.key] ?? ''}
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
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  );
}
