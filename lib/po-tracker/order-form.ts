import type { PoTrackerOrder, PoTrackerOrderUpdateBody } from './types';

/** Match backend UTC calendar date for <input type="date">. */
export const toDateInputValue = (value?: string | null): string => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const resolveOrderStatus = (row: PoTrackerOrder): string =>
  row.newStatus || row.status || row.poStatus || '';

export const orderToForm = (row: PoTrackerOrder): PoTrackerOrderUpdateBody => ({
  poNumber: row.poNumber || '',
  channel: row.channel || '',
  distributor: row.distributor || '',
  retailer: row.retailer || '',
  sku: row.sku || '',
  poDate: row.poDate ? toDateInputValue(row.poDate) : '',
  poRequestedDeliveryDate: row.poRequestedDeliveryDate
    ? toDateInputValue(row.poRequestedDeliveryDate)
    : '',
  location: row.location || '',
  warehouse: row.warehouse || '',
  invoiceNumber: row.invoiceNumber || '',
  invoiceAmount: row.invoiceAmount ?? null,
  poLink: row.poLink || '',
  status: resolveOrderStatus(row),
});

export const formatHistoryAt = (value: string): string => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
};
