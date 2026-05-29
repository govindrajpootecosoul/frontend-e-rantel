'use client';

import { ALL_SCREEN_IDS, SCREEN_GROUPS } from '@/lib/permissions';
import type { ScreenGroupOption, ScreenId } from '@/lib/types';

interface ScreenAccessPickerProps {
  value: ScreenId[];
  onChange: (screens: ScreenId[]) => void;
  disabled?: boolean;
  groups?: ScreenGroupOption[];
}

const defaultGroups = SCREEN_GROUPS as unknown as ScreenGroupOption[];

export default function ScreenAccessPicker({
  value,
  onChange,
  disabled = false,
  groups,
}: ScreenAccessPickerProps) {
  const effectiveGroups = groups?.length ? groups : defaultGroups;
  const allIds = ALL_SCREEN_IDS;
  const allSelected = allIds.length > 0 && allIds.every((id) => value.includes(id));

  const toggle = (id: ScreenId) => {
    if (disabled) return;
    if (value.includes(id)) {
      onChange(value.filter((s) => s !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const toggleGroup = (screenIds: ScreenId[]) => {
    if (disabled) return;
    const allInGroup = screenIds.every((id) => value.includes(id));
    if (allInGroup) {
      onChange(value.filter((id) => !screenIds.includes(id)));
    } else {
      onChange(Array.from(new Set([...value, ...screenIds])));
    }
  };

  const toggleAll = () => {
    if (disabled) return;
    onChange(allSelected ? [] : [...allIds]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2">
        <span className="text-xs text-slate-400">
          {value.length} of {allIds.length} screens selected
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={toggleAll}
          className="text-xs font-medium text-cyan-400 hover:underline disabled:opacity-40"
        >
          {allSelected ? 'Clear all screens' : 'Select all screens'}
        </button>
      </div>

      {effectiveGroups.map((group) => {
        const groupIds = group.screens.map((s) => s.id);
        const allInGroup = groupIds.every((id) => value.includes(id));
        return (
          <div
            key={group.id}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
                {group.comingSoon && (
                  <span className="ml-1.5 font-normal normal-case text-amber-500/90">
                    (coming soon)
                  </span>
                )}
              </p>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggleGroup(groupIds)}
                className="text-[11px] text-cyan-400 hover:underline disabled:opacity-40"
              >
                {allInGroup ? 'Clear group' : 'Select group'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.screens.map((screen) => {
                const checked = value.includes(screen.id);
                return (
                  <label
                    key={screen.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
                      checked
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="accent-cyan-500"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(screen.id)}
                    />
                    {screen.label}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
