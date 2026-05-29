'use client';

import PoTrackerPage from '@/components/po-tracker/PoTrackerPage';
import { Suspense } from 'react';

function B2bTracker() {
  return <PoTrackerPage channelType="b2b" enableStatusDetail />;
}

export default function PoTrackerB2bPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-slate-500">Loading…</div>}>
      <B2bTracker />
    </Suspense>
  );
}
