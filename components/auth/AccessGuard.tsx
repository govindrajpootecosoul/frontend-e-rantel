'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { canAccessPath, getDefaultRoute } from '@/lib/permissions';
import { useAuth } from '@/providers/AuthProvider';

export default function AccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    if (pathname === '/unauthorized') return;

    if (!canAccessPath(pathname, user)) {
      const fallback = getDefaultRoute(user);
      router.replace(fallback === pathname ? '/unauthorized' : fallback);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
      </div>
    );
  }

  return <>{children}</>;
}
