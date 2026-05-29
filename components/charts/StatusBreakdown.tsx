'use client';

import type { StatusPoint } from '@/lib/types';
import { formatNumber } from '@/lib/format';

interface StatusBreakdownProps {
  title: string;
  data: StatusPoint[];
  loading?: boolean;
  variant?: 'bar' | 'ring';
}

const STATUS_COLORS = ['#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#A78BFA', '#64748B'];

export default function StatusBreakdown({
  title,
  data,
  loading,
  variant = 'bar',
}: StatusBreakdownProps) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;

  if (loading) {
    return (
      <div className="glass-panel h-72 animate-pulse p-6">
        <div className="h-4 w-40 rounded bg-slate-800" />
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 rounded bg-slate-800/60" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'ring') {
    let offset = 0;
    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    return (
      <div className="glass-panel p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No status data</p>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
              <g transform="translate(70, 70)">
                {data.map((item, i) => {
                  const pct = item.count / total;
                  const dash = pct * circumference;
                  const circle = (
                    <circle
                      key={item.status}
                      r={radius}
                      fill="none"
                      stroke={STATUS_COLORS[i % STATUS_COLORS.length]}
                      strokeWidth={18}
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90)"
                    />
                  );
                  offset += dash;
                  return circle;
                })}
              </g>
            </svg>
            <ul className="flex-1 space-y-2">
              {data.map((item, i) => (
                <li key={item.status} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                    />
                    <span className="max-w-[120px] truncate">{item.status}</span>
                  </span>
                  <span className="tabular-nums text-slate-200">
                    {formatNumber(item.count)} ({((item.count / total) * 100).toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No status data</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, i) => {
            const pct = (item.count / total) * 100;
            return (
              <div key={item.status}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="max-w-[70%] truncate text-slate-400">{item.status}</span>
                  <span className="tabular-nums text-slate-300">{formatNumber(item.count)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
