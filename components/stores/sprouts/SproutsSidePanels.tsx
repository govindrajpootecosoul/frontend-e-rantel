'use client';

import SproutsFilterPanel from '@/components/stores/sprouts/SproutsFilterPanel';
import SproutsInventoryFilterPanel from '@/components/stores/sprouts/inventory/SproutsInventoryFilterPanel';
import SproutsRiskFilterPanel from '@/components/stores/sprouts/risk/SproutsRiskFilterPanel';
import { useSprouts } from '@/providers/SproutsProvider';

export default function SproutsSidePanels() {
  const { activeTab } = useSprouts();

  if (activeTab === 'inventory') return <SproutsInventoryFilterPanel />;
  if (activeTab === 'risk-inventory') return <SproutsRiskFilterPanel />;
  if (activeTab === 'chain-store') return <SproutsFilterPanel />;
  return null;
}
