'use client';

import { Upload, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface SproutsUploadBarProps {
  onUpload: (file: File, options: { mode: 'append' | 'replace' }) => Promise<void>;
  disabled?: boolean;
  showReplace?: boolean;
}

const ACCEPT =
  '.xlsx,.xls,.csv,.tsv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/tab-separated-values,text/plain';

export default function SproutsUploadBar({
  onUpload,
  disabled,
  showReplace = true,
}: SproutsUploadBarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file || disabled || uploading) return;
    setUploading(true);
    try {
      await onUpload(file, { mode: replaceMode ? 'replace' : 'append' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showReplace && (
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={replaceMode}
            onChange={(e) => setReplaceMode(e.target.checked)}
            className="rounded border-slate-600"
          />
          Replace existing data
        </label>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/25 disabled:opacity-50"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        Upload File
      </button>
      <span className="text-[10px] text-slate-600">Excel or CSV — detected automatically</span>
    </div>
  );
}
