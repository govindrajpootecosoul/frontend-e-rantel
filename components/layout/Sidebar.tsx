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
  Users,
} from 'lucide-react';
import { hasScreen } from '@/lib/permissions';
import type { ScreenId } from '@/lib/types';
import { useDashboard } from '@/providers/DashboardProvider';
import { useAuth } from '@/providers/AuthProvider';

const poSoChildren = [
  { label: 'SPS', href: '/po-so/sps', screen: 'po_so_sps' as const },
  { label: 'Costco', href: '/po-so/costco', screen: 'po_so_costco' as const },
];

const poTrackerChildren = [
  { label: 'B2B', href: '/po-trackers/b2b', screen: 'po_tracker_b2b' as const },
  { label: 'Retails', href: '/po-trackers/retails', screen: 'po_tracker_retails' as const },
];

const storesChildren: {
  label: string;
  href?: string;
  screen: ScreenId;
  comingSoon?: boolean;
}[] = [
  { label: 'KeHe', href: '/stores/kehe', screen: 'stores_kehe' },
  { label: 'Sprouts', href: '/stores/sprouts', screen: 'stores_sprouts' },
];

function SoonBadge() {
  return (
    <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 ring-1 ring-amber-500/20">
      Soon
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboard();
  const { user, canManageUsers } = useAuth();

  const visiblePoSo = poSoChildren.filter((c) => hasScreen(user, c.screen));
  const visiblePoTracker = poTrackerChildren.filter((c) => hasScreen(user, c.screen));
  const visibleStores = storesChildren.filter((c) => hasScreen(user, c.screen));
  const showExecutive = hasScreen(user, 'executive');
  const showPoSo = visiblePoSo.length > 0;
  const showPoTracker = visiblePoTracker.length > 0;
  const showStores = visibleStores.length > 0;
  const showDemandPlannerSoon = hasScreen(user, 'demand_planner');
  const showComingSoonSection = showDemandPlannerSoon;

  const [poSoOpen, setPoSoOpen] = useState(pathname.startsWith('/po-so'));
  const [poTrackerOpen, setPoTrackerOpen] = useState(pathname.startsWith('/po-trackers'));
  const [storesOpen, setStoresOpen] = useState(pathname.startsWith('/stores'));

  useEffect(() => {
    if (pathname.startsWith('/po-so')) setPoSoOpen(true);
    if (pathname.startsWith('/po-trackers')) setPoTrackerOpen(true);
    if (pathname.startsWith('/stores')) setStoresOpen(true);
  }, [pathname]);

  const poSoActive = pathname.startsWith('/po-so');
  const poTrackerActive = pathname.startsWith('/po-trackers');
  const storesActive = pathname.startsWith('/stores');

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
        {showExecutive && (
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
        )}

        {showPoSo && (
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
                {visiblePoSo.map((child) => {
                  const active =
                    pathname === child.href || pathname.startsWith(`${child.href}/`);
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
        )}

        {showPoTracker && (
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
                {visiblePoTracker.map((child) => {
                  const active =
                    pathname === child.href || pathname.startsWith(`${child.href}/`);
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
        )}

        {showStores && (
          <div>
            <button
              type="button"
              onClick={() => !sidebarCollapsed && setStoresOpen(!storesOpen)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                storesActive
                  ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Store size={20} className="shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium">Stores</p>
                    <p className="truncate text-[11px] text-slate-500">KeHe, Sprouts</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition ${storesOpen ? 'rotate-180' : ''}`}
                  />
                </>
              )}
            </button>
            {!sidebarCollapsed && storesOpen && (
              <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-800 pl-3">
                {visibleStores.map((child) => {
                  if (child.comingSoon || !child.href) {
                    return (
                      <div
                        key={child.screen}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600"
                      >
                        {child.label}
                        <SoonBadge />
                      </div>
                    );
                  }
                  const active =
                    pathname === child.href || pathname.startsWith(`${child.href}/`);
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
        )}

        {canManageUsers && (
          <Link href="/admin/users">
            <div
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                pathname.startsWith('/admin/users')
                  ? 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Users size={20} className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">Manage Users</p>
                  <p className="truncate text-[11px] text-slate-500">Super admin</p>
                </div>
              )}
            </div>
          </Link>
        )}

        {showComingSoonSection && (
          <>
            {!sidebarCollapsed && (
              <p className="px-3 pt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Coming soon
              </p>
            )}

            {showDemandPlannerSoon && (
              <div
                className="group flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 opacity-90"
                title="Demand Planner — coming soon"
              >
                <TrendingUp size={20} className="shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">Demand Planner</p>
                    </div>
                    <SoonBadge />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
