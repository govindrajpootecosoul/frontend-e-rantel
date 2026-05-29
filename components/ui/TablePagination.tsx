'use client';

import { formatNumber } from '@/lib/format';

export const PAGE_SIZE_OPTIONS = [25, 50, 100, 200] as const;

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: TablePaginationProps) {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(page * pageSize, total);
  const canGoPrev = page > 1 && !disabled;
  const canGoNext = page < totalPages && !disabled;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-4 py-3 text-sm text-slate-400">
      <p>
        Showing{' '}
        <span className="font-medium text-slate-200">{formatNumber(start)}</span> to{' '}
        <span className="font-medium text-slate-200">{formatNumber(end)}</span> of{' '}
        <span className="font-medium text-slate-200">{formatNumber(total)}</span> items
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span>Items per page</span>
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200 outline-none focus:border-cyan-500/50 disabled:opacity-50"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
