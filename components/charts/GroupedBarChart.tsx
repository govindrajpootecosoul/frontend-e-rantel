'use client';

import { useMemo, useState } from 'react';
import PeriodToggle from '@/components/charts/PeriodToggle';
import type { ChartPeriod, PeriodRetailerPoint, PeriodRetailerSeries } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface GroupedBarChartProps {
  title: string;
  dataByPeriod: PeriodRetailerSeries;
  loading?: boolean;
  defaultPeriod?: ChartPeriod;
}

const COLORS = ['#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#A78BFA', '#60A5FA'];

const PERIOD_LABEL: Record<ChartPeriod, string> = {
  daily: 'Day',
  monthly: 'Month',
  yearly: 'Year',
};

export default function GroupedBarChart({
  title,
  dataByPeriod,
  loading,
  defaultPeriod = 'monthly',
}: GroupedBarChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>(defaultPeriod);
  const data: PeriodRetailerPoint[] = dataByPeriod[period] || [];

  const { periods, retailers, matrix, max } = useMemo(() => {
    const periodSet = new Set<string>();
    const retailerSet = new Set<string>();
    for (const d of data) {
      periodSet.add(d.period);
      retailerSet.add(d.retailer);
    }
    const periods = Array.from(periodSet).sort();
    const retailers = Array.from(retailerSet).sort().slice(0, 6);
    const matrix: Record<string, Record<string, number>> = {};
    let max = 0;
    for (const p of periods) {
      matrix[p] = {};
      for (const r of retailers) {
        const point = data.find((d) => d.period === p && d.retailer === r);
        const val = point?.amount || 0;
        matrix[p][r] = val;
        if (val > max) max = val;
      }
    }
    return { periods, retailers, matrix, max: max || 1 };
  }, [data]);

  const displayTitle = `${title} by ${PERIOD_LABEL[period]} & Retailer`;

  if (loading) {
    return (
      <div className="glass-panel h-80 animate-pulse p-6">
        <div className="h-4 w-48 rounded bg-slate-800" />
        <div className="mt-8 h-48 rounded bg-slate-800/60" />
      </div>
    );
  }

  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-white">
          {displayTitle}
        </h3>
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>
      {periods.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">No chart data for current filters</p>
      ) : (
        <>
          <div className="flex h-52 items-end gap-2 overflow-x-auto pb-2">
            {periods.map((p) => (
              <div key={p} className="flex min-w-[72px] flex-1 flex-col items-center gap-1">
                <div className="flex h-44 w-full items-end justify-center gap-0.5">
                  {retailers.map((retailer, ri) => {
                    const val = matrix[p][retailer] || 0;
                    const height = `${Math.max((val / max) * 100, 2)}%`;
                    return (
                      <div
                        key={`${p}-${retailer}`}
                        title={`${retailer}: ${formatCurrency(val)}`}
                        className="w-2 rounded-t-sm transition-all hover:opacity-80 sm:w-3"
                        style={{
                          height,
                          backgroundColor: COLORS[ri % COLORS.length],
                        }}
                      />
                    );
                  })}
                </div>
                <span className="max-w-[64px] truncate text-[9px] text-slate-500" title={p}>
                  {p}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {retailers.map((r, i) => (
              <div key={r} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="max-w-[100px] truncate">{r}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
