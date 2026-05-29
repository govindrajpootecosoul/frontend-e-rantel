'use client';

import PoTrackerPage from '@/components/po-tracker/PoTrackerPage';
import { Suspense } from 'react';

function RetailsTracker() {
  return <PoTrackerPage channelType="retail" enableStatusDetail />;
}

export default function PoTrackerRetailsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-slate-500">Loading…</div>}>
      <RetailsTracker />
    </Suspense>
  );
}
