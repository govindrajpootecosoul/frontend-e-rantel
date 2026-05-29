'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { getDefaultRoute } from '@/lib/permissions';
import { useAuth } from '@/providers/AuthProvider';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const home = getDefaultRoute(user);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/30">
        <ShieldAlert className="text-rose-400" size={32} />
      </div>
      <h1 className="text-xl font-semibold text-white">No access</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Your account does not have permission to view this screen. Contact a super admin to assign
        screen access.
      </p>
      {home !== '/unauthorized' && (
        <Link
          href={home}
          className="mt-6 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Go to your dashboard
        </Link>
      )}
    </div>
  );
}
