import type { ReactNode } from 'react';
import { BarChart3 } from 'lucide-react';

export default function AuthFormShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-obsidian to-obsidian" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/30">
            <BarChart3 className="text-cyan-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">E-Rental</h1>
          <p className="mt-1 text-sm text-slate-400">Executive Analytics Portal</p>
        </div>
        <div className="glass-panel p-8 shadow-2xl shadow-black/40">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
