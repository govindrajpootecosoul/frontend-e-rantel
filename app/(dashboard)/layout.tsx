'use client';

import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import FilterPanel from '@/components/layout/FilterPanel';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SpsFilterPanel from '@/components/sps/SpsFilterPanel';
import KeheSidePanels from '@/components/stores/kehe/KeheSidePanels';
import SproutsSidePanels from '@/components/stores/sprouts/SproutsSidePanels';
import { resolvePoSoStoreFromPath } from '@/lib/po-so/stores';
import { KeheProvider } from '@/providers/KeheProvider';
import { SproutsProvider } from '@/providers/SproutsProvider';
import AccessGuard from '@/components/auth/AccessGuard';
import { AuthProvider } from '@/providers/AuthProvider';
import { DashboardProvider } from '@/providers/DashboardProvider';
import { SpsProvider } from '@/providers/SpsProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExecutive = pathname.startsWith('/executive');
  const isAdminUsers = pathname.startsWith('/admin/users');
  const poSoStore = resolvePoSoStoreFromPath(pathname);
  const isKehe = pathname.startsWith('/stores/kehe');
  const isSprouts = pathname.startsWith('/stores/sprouts');
  const isStoresDashboard = isKehe || isSprouts;

  const content = (
    <div
      className={`flex min-h-0 flex-1 overflow-hidden p-4 lg:p-6 ${
        isStoresDashboard ? 'gap-4 lg:gap-6' : 'gap-4'
      }`}
    >
      <main
        className={`min-h-0 min-w-0 flex-1 overflow-y-auto ${
          isStoresDashboard ? 'pe-4 lg:pe-6' : ''
        }`}
      >
        {children}
      </main>
      {isExecutive && !isAdminUsers && <FilterPanel />}
      {poSoStore && <SpsFilterPanel />}
      {isKehe && <KeheSidePanels />}
      {isSprouts && <SproutsSidePanels />}
    </div>
  );

  return (
    <AuthGuard>
      <AuthProvider>
        <AccessGuard>
          <DashboardProvider>
            <div className="flex h-screen overflow-hidden bg-obsidian">
              <Sidebar />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Header />
                {poSoStore ? (
                  <SpsProvider storeId={poSoStore}>{content}</SpsProvider>
                ) : isKehe ? (
                  <KeheProvider>{content}</KeheProvider>
                ) : isSprouts ? (
                  <SproutsProvider>{content}</SproutsProvider>
                ) : (
                  content
                )}
              </div>
            </div>
          </DashboardProvider>
        </AccessGuard>
      </AuthProvider>
    </AuthGuard>
  );
}
