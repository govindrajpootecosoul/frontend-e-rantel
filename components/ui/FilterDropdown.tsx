'use client';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  loading?: boolean;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  loading,
}: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="truncate text-[9px] font-medium uppercase tracking-wide text-slate-400" title={label}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        title={value}
        className="w-full truncate rounded-md border border-slate-700/80 bg-slate-950/60 px-1.5 py-1.5 text-[11px] text-slate-100 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
      >
        {(options.length ? options : ['All']).map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
