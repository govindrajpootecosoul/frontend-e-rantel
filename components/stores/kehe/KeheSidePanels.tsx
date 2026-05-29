'use client';

import KeheFilterPanel from '@/components/stores/kehe/KeheFilterPanel';
import KeheInventoryFilterPanel from '@/components/stores/kehe/inventory/KeheInventoryFilterPanel';
import KeheRiskFilterPanel from '@/components/stores/kehe/risk/KeheRiskFilterPanel';
import { useKehe } from '@/providers/KeheProvider';

export default function KeheSidePanels() {
  const { activeTab } = useKehe();

  if (activeTab === 'inventory') return <KeheInventoryFilterPanel />;
  if (activeTab === 'risk-inventory') return <KeheRiskFilterPanel />;
  if (activeTab === 'chain-store') return <KeheFilterPanel />;
  return null;
}
