export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function toMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function parseDateKey(key: string): Date | null {
  if (!key) return null;
  const d = new Date(`${key}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseMonthKey(key: string): Date | null {
  if (!key) return null;
  const [year, month] = key.split('-');
  if (!year || !month) return null;
  const d = new Date(Number(year), Number(month) - 1, 1);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function compareDateKeys(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function normalizeRangeKeys(start: string, end: string): { start: string; end: string } {
  if (!start || !end) return { start, end };
  if (compareDateKeys(start, end) <= 0) return { start, end };
  return { start: end, end: start };
}

export function isKeyInRange(key: string, start: string, end: string): boolean {
  if (!key || !start || !end) return false;
  const { start: s, end: e } = normalizeRangeKeys(start, end);
  return key >= s && key <= e;
}

export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatDayKey(key: string): string {
  const d = parseDateKey(key);
  if (!d) return key;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatMonthKeyLabel(key: string): string {
  const d = parseMonthKey(key);
  if (!d) return key;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
