export interface ParsedDateFilter {
  from: string;
  to: string;
  isRange: boolean;
}

export function parseDateFilter(value: string): ParsedDateFilter {
  if (!value || value === 'All') {
    return { from: '', to: '', isRange: false };
  }

  if (value.includes('..')) {
    const [from = '', to = ''] = value.split('..');
    return { from, to, isRange: true };
  }

  return { from: value, to: value, isRange: false };
}

export function serializeDateFilter(from: string, to: string, isRange: boolean): string {
  if (!from && !to) return 'All';

  if (isRange) {
    if (from && to) return `${from}..${to}`;
    if (from) return `${from}..`;
    if (to) return `..${to}`;
    return 'All';
  }

  return from || to || 'All';
}

export function matchesDateFilter(value: string, filter: string): boolean {
  if (!filter || filter === 'All') return true;
  if (!value) return false;

  const { from, to, isRange } = parseDateFilter(filter);

  if (!isRange) {
    const target = from || to;
    return value === target;
  }

  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
}

export function formatDateFilterLabel(value: string, mode: 'date' | 'month'): string {
  if (!value || value === 'All') return 'All';

  const formatPart = (part: string) => {
    if (!part) return '';
    if (mode === 'month') {
      const [year, month] = part.split('-');
      if (!year || !month) return part;
      const d = new Date(Number(year), Number(month) - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    const d = new Date(`${part}T00:00:00`);
    if (Number.isNaN(d.getTime())) return part;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const { from, to, isRange } = parseDateFilter(value);
  if (!isRange) return formatPart(from);

  const start = formatPart(from);
  const end = formatPart(to);
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return 'All';
}

export function resolvePoMonthKey(row: {
  yearMonthPo?: string;
  commonPoDate?: string;
  poDate?: string;
}): string {
  const d = row.commonPoDate || row.poDate;
  if (d) {
    const date = new Date(d);
    if (!Number.isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    }
  }
  if (row.yearMonthPo) {
    const parsed = new Date(row.yearMonthPo);
    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getFullYear();
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    }
  }
  return '';
}

export function resolveInvoiceMonthKey(row: {
  commonInvoiceDate?: string;
  invoiceDate?: string;
}): string {
  const d = row.commonInvoiceDate || row.invoiceDate;
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
