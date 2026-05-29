'use client';

import NotificationBell from '@/components/layout/NotificationBell';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuth, getUser } from '@/lib/auth';
import { formatDateTime } from '@/lib/format';
import { useDashboard } from '@/providers/DashboardProvider';

export default function Header() {
  const router = useRouter();
  const { dashboard, dashboardLoading } = useDashboard();
  const [userName, setUserName] = useState('Executive');

  useEffect(() => {
    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/signin');
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/50 px-6 py-4">
      <div>
        <p className="text-xs text-slate-500">Welcome back</p>
        <p className="text-sm font-medium text-slate-200">{userName}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Last refresh</p>
          <p className="text-xs text-slate-300">
            {dashboardLoading
              ? 'Updating…'
              : dashboard?.lastUpdated
                ? formatDateTime(dashboard.lastUpdated)
                : '—'}
          </p>
        </div>
        <NotificationBell />
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5">
          <User size={16} className="text-cyan-400" />
          <span className="text-xs text-slate-300">Executive</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 transition hover:border-rose-500/30 hover:text-rose-300"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </header>
  );
}
