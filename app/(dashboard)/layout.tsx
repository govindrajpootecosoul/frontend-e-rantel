'use client';

import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import FilterPanel from '@/components/layout/FilterPanel';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SpsFilterPanel from '@/components/sps/SpsFilterPanel';
import { resolvePoSoStoreFromPath } from '@/lib/po-so/stores';
import { DashboardProvider } from '@/providers/DashboardProvider';
import { SpsProvider } from '@/providers/SpsProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExecutive = pathname.startsWith('/executive');
  const poSoStore = resolvePoSoStoreFromPath(pathname);

  const content = (
    <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4 lg:p-6">
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      {isExecutive && <FilterPanel />}
      {poSoStore && <SpsFilterPanel />}
    </div>
  );

  return (
    <AuthGuard>
      <DashboardProvider>
        <div className="flex h-screen overflow-hidden bg-obsidian">
          <Sidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            {poSoStore ? (
              <SpsProvider storeId={poSoStore}>{content}</SpsProvider>
            ) : (
              content
            )}
          </div>
        </div>
      </DashboardProvider>
    </AuthGuard>
  );
}
