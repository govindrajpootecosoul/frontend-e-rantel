'use client';

import { api } from '@/lib/api';
import { PO_TRACKER_STATUS_OPTIONS } from '@/lib/po-tracker/config';
import { formatHistoryAt, orderToForm } from '@/lib/po-tracker/order-form';
import type { PoHistoryEntry, PoTrackerOrder, PoTrackerOrderUpdateBody, PoTrackerPoSource } from '@/lib/po-tracker/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PoTrackerDetailModalProps {
  open: boolean;
  orderId: string | null;
  poSource: PoTrackerPoSource | null;
  channelType: 'retail' | 'b2b';
  onClose: () => void;
}

const FIELDS: { key: keyof PoTrackerOrderUpdateBody; label: string; required?: boolean; type?: string }[] = [
  { key: 'poNumber', label: 'PO Number', required: true },
  { key: 'channel', label: 'Channel', required: true },
  { key: 'distributor', label: 'Distributor' },
  { key: 'retailer', label: 'Retailer' },
  { key: 'sku', label: 'SKU' },
  { key: 'poDate', label: 'PO Date', type: 'date' },
  { key: 'poRequestedDeliveryDate', label: 'Due Date', type: 'date' },
  { key: 'location', label: 'Location' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'invoiceNumber', label: 'Invoice Number' },
  { key: 'invoiceAmount', label: 'Invoice Amount', type: 'number' },
  { key: 'poLink', label: 'PO Link' },
  { key: 'status', label: 'Status' },
];

function HistoryPanel({ history, loading }: { history: PoHistoryEntry[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-slate-500">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-500">
        No changes recorded yet.
      </div>
    );
  }

  return (
    <div className="max-h-[min(70vh,520px)] space-y-0 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/40">
      {history.map((entry, idx) => (
        <div
          key={`${entry.at}-${idx}`}
          className="border-b border-slate-800 px-4 py-3 last:border-b-0"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-white">{entry.action}</p>
            <p className="shrink-0 text-xs text-slate-500">{formatHistoryAt(entry.at)}</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            By {entry.by?.name || 'Unknown'}
            {entry.by?.email ? ` (${entry.by.email})` : ''}
          </p>
          <div className="mt-2 space-y-1">
            {entry.changes?.map((change) => (
              <p key={`${change.field}-${change.from}-${change.to}`} className="text-sm text-slate-300">
                <span className="font-semibold text-slate-200">{change.field}:</span>{' '}
                {change.from} → {change.to}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PoTrackerDetailModal({
  open,
  orderId,
  poSource,
  channelType,
  onClose,
}: PoTrackerDetailModalProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PoTrackerOrderUpdateBody>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editHint, setEditHint] = useState(false);

  const detailQuery = useQuery({
    queryKey: ['po-tracker-order', orderId, poSource],
    queryFn: async () => {
      const res = await api.getPoTrackerOrder(orderId!, poSource!);
      return res.data;
    },
    enabled: open && Boolean(orderId && poSource),
  });

  const row = detailQuery.data?.row;

  useEffect(() => {
    if (!open) {
      setEditing(false);
      setSaveError(null);
      setEditHint(false);
    }
  }, [open]);

  useEffect(() => {
    if (!editHint) return;
    const timer = window.setTimeout(() => setEditHint(false), 4000);
    return () => window.clearTimeout(timer);
  }, [editHint]);

  useEffect(() => {
    if (row) {
      setForm(orderToForm(row));
      setEditing(false);
      setSaveError(null);
    }
  }, [row]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.updatePoTrackerOrder(orderId!, poSource!, form, channelType);
      return res.data;
    },
    onSuccess: (data) => {
      setEditing(false);
      setSaveError(null);
      if (data.row) setForm(orderToForm(data.row));
      queryClient.invalidateQueries({ queryKey: ['po-tracker-order', orderId, poSource] });
      queryClient.invalidateQueries({ queryKey: ['po-tracker-orders', channelType] });
      queryClient.invalidateQueries({ queryKey: ['po-tracker-summary', channelType] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err: Error) => {
      setSaveError(err.message);
    },
  });

  if (!open) return null;

  const titlePo = row?.poNumber || form.poNumber || '—';
  const history = (row?.history as PoHistoryEntry[] | undefined) ?? [];

  const updateField = (key: keyof PoTrackerOrderUpdateBody, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === 'invoiceAmount' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const promptEditFirst = () => {
    if (editing) return;
    setEditHint(true);
  };

  const startEditing = () => {
    setEditHint(false);
    setEditing(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">PO Details — {titlePo}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {detailQuery.isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20 text-slate-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : detailQuery.error ? (
          <div className="p-6 text-sm text-rose-300">{detailQuery.error.message}</div>
        ) : (
          <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-2">
            <div className="overflow-y-auto border-b border-slate-800 p-5 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">Entry details</h3>
                {!editing ? (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/25"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (row) setForm(orderToForm(row));
                        setEditing(false);
                        setSaveError(null);
                      }}
                      className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saveMutation.isPending}
                      onClick={() => saveMutation.mutate()}
                      className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/25 disabled:opacity-50"
                    >
                      {saveMutation.isPending ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {saveError && (
                <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  {saveError}
                </div>
              )}

              {!editing && (
                <p className="mb-3 text-xs text-slate-500">
                  View only — click <span className="font-medium text-amber-300">Edit</span> to
                  change fields.
                </p>
              )}

              {editHint && !editing && (
                <div
                  className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs text-amber-200"
                  role="status"
                >
                  Click the <span className="font-semibold">Edit</span> button first to update any
                  fields.
                </div>
              )}

              <div className="mb-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Id</p>
                <p className="mt-0.5 break-all font-mono text-xs text-slate-400">{row?._id}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <label key={field.key} className="block">
                    <span className="text-xs text-slate-500">
                      {field.label}
                      {field.required && <span className="text-rose-400"> *</span>}
                    </span>
                    {field.key === 'status' ? (
                      <select
                        value={form.status ?? ''}
                        disabled={!editing}
                        onMouseDown={(e) => {
                          if (!editing) {
                            e.preventDefault();
                            promptEditFirst();
                          }
                        }}
                        onChange={(e) => updateField('status', e.target.value)}
                        className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm text-slate-200 outline-none ${
                          editing
                            ? 'border-slate-600 bg-slate-900 focus:border-cyan-500/50'
                            : 'cursor-not-allowed border-slate-800 bg-slate-900/60 opacity-80'
                        }`}
                      >
                        <option value="">—</option>
                        {PO_TRACKER_STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={
                          field.key === 'invoiceAmount'
                            ? form.invoiceAmount ?? ''
                            : String(form[field.key] ?? '')
                        }
                        readOnly={!editing}
                        onFocus={(e) => {
                          if (!editing) {
                            e.target.blur();
                            promptEditFirst();
                          }
                        }}
                        onClick={() => {
                          if (!editing) promptEditFirst();
                        }}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm text-slate-200 outline-none ${
                          editing
                            ? 'border-slate-600 bg-slate-900 focus:border-cyan-500/50'
                            : 'cursor-not-allowed border-slate-800 bg-slate-900/60'
                        }`}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">History</h3>
              <HistoryPanel history={history} loading={detailQuery.isFetching && !row} />
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-800 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
