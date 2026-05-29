'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Store,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useDashboard } from '@/providers/DashboardProvider';

const poSoChildren = [
  { label: 'SPS', href: '/po-so/sps' },
  { label: 'Costco', href: '/po-so/costco' },
];

const poTrackerChildren = [
  { label: 'B2B', href: '/po-trackers/b2b' },
  { label: 'Retails', href: '/po-trackers/retails' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboard();
  const [poSoOpen, setPoSoOpen] = useState(pathname.startsWith('/po-so'));
  const [poTrackerOpen, setPoTrackerOpen] = useState(pathname.startsWith('/po-trackers'));

  useEffect(() => {
    if (pathname.startsWith('/po-so')) setPoSoOpen(true);
    if (pathname.startsWith('/po-trackers')) setPoTrackerOpen(true);
  }, [pathname]);

  const poSoActive = pathname.startsWith('/po-so');
  const poTrackerActive = pathname.startsWith('/po-trackers');

  return (
    <aside
      className={`flex h-full shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-950/80 transition-all duration-300 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-5">
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-lg font-semibold text-white">E-Rental</h1>
            <p className="text-[11px] text-slate-500">Executive Portal</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <Link href="/executive">
          <div
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              pathname.startsWith('/executive')
                ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={20} className="shrink-0" />
            {!sidebarCollapsed && (
              <p className="truncate text-sm font-medium">Executive Analytics</p>
            )}
          </div>
        </Link>

        <div>
          <button
            type="button"
            onClick={() => !sidebarCollapsed && setPoSoOpen(!poSoOpen)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              poSoActive
                ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Package size={20} className="shrink-0" />
            {!sidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">PO & SO Dashboard</p>
                  <p className="truncate text-[11px] text-slate-500">SPS, Costco</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition ${poSoOpen ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </button>
          {!sidebarCollapsed && poSoOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-800 pl-3">
              {poSoChildren.map((child) => {
                const active = pathname === child.href || pathname.startsWith(`${child.href}/`);
                return (
                  <Link key={child.href} href={child.href}>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-cyan-500/10 font-medium text-cyan-300'
                          : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      {child.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => !sidebarCollapsed && setPoTrackerOpen(!poTrackerOpen)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              poTrackerActive
                ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Truck size={20} className="shrink-0" />
            {!sidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">PO Trackers</p>
                  <p className="truncate text-[11px] text-slate-500">B2B, Retails</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition ${poTrackerOpen ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </button>
          {!sidebarCollapsed && poTrackerOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-800 pl-3">
              {poTrackerChildren.map((child) => {
                const active = pathname === child.href || pathname.startsWith(`${child.href}/`);
                return (
                  <Link key={child.href} href={child.href}>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-cyan-500/10 font-medium text-cyan-300'
                          : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      {child.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="group flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 opacity-70"
          title="Coming Soon"
        >
          <Store size={20} className="shrink-0" />
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Stores</p>
                <p className="truncate text-[11px] text-slate-500">KeHe, Sprouts</p>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 ring-1 ring-amber-500/20">
                Soon
              </span>
            </>
          )}
        </div>

        <div
          className="group flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 opacity-70"
          title="Coming Soon"
        >
          <TrendingUp size={20} className="shrink-0" />
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Demand Planner</p>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 ring-1 ring-amber-500/20">
                Soon
              </span>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}
