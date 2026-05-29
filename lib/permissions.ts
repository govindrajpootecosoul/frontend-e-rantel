import type { AuthUser, ScreenId } from './types';

export const SCREEN_GROUPS = [
  {
    id: 'executive',
    label: 'Executive Analytics',
    comingSoon: false,
    screens: [{ id: 'executive' as ScreenId, label: 'Executive Analytics' }],
  },
  {
    id: 'po_so',
    label: 'PO & SO Dashboard',
    comingSoon: false,
    screens: [
      { id: 'po_so_sps' as ScreenId, label: 'SPS' },
      { id: 'po_so_costco' as ScreenId, label: 'Costco' },
    ],
  },
  {
    id: 'po_tracker',
    label: 'PO Trackers',
    comingSoon: false,
    screens: [
      { id: 'po_tracker_b2b' as ScreenId, label: 'B2B' },
      { id: 'po_tracker_retails' as ScreenId, label: 'Retails' },
    ],
  },
  {
    id: 'stores',
    label: 'Stores',
    comingSoon: false,
    screens: [
      { id: 'stores_kehe' as ScreenId, label: 'KeHe' },
      { id: 'stores_sprouts' as ScreenId, label: 'Sprouts', comingSoon: true },
    ],
  },
  {
    id: 'demand_planner',
    label: 'Demand Planner',
    comingSoon: true,
    screens: [{ id: 'demand_planner' as ScreenId, label: 'Demand Planner' }],
  },
] as const;

export const COMING_SOON_SCREEN_IDS: ScreenId[] = SCREEN_GROUPS.flatMap((g) =>
  g.screens
    .filter((s) => ('comingSoon' in s && s.comingSoon) || g.comingSoon)
    .map((s) => s.id)
);

export const ALL_SCREEN_IDS: ScreenId[] = SCREEN_GROUPS.flatMap((g) =>
  g.screens.map((s) => s.id)
);

const PATH_SCREEN_MAP: { prefix: string; screen: ScreenId }[] = [
  { prefix: '/executive', screen: 'executive' },
  { prefix: '/po-so/sps', screen: 'po_so_sps' },
  { prefix: '/po-so/costco', screen: 'po_so_costco' },
  { prefix: '/po-trackers/b2b', screen: 'po_tracker_b2b' },
  { prefix: '/po-trackers/retails', screen: 'po_tracker_retails' },
  { prefix: '/stores/kehe', screen: 'stores_kehe' },
];

/** DB uses `superadmin`; legacy `super_admin` is also accepted */
export const SUPER_ADMIN_ROLES = ['superadmin', 'super_admin'] as const;

function normalizeRoleKey(role: string | undefined): string {
  if (!role) return '';
  return role.toLowerCase().replace(/[\s_-]+/g, '');
}

export function isSuperAdminRole(role: string | undefined): boolean {
  if (SUPER_ADMIN_ROLES.includes(role as (typeof SUPER_ADMIN_ROLES)[number])) return true;
  return normalizeRoleKey(role) === 'superadmin';
}

/** Super admin always gets every screen; regular users keep their assigned list. */
export function normalizeAuthUser(user: AuthUser): AuthUser {
  if (isSuperAdmin(user)) {
    return {
      ...user,
      role: 'superadmin',
      screenAccess: [...ALL_SCREEN_IDS],
    };
  }
  return {
    ...user,
    screenAccess: user.screenAccess ?? [],
  };
}

export function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  return isSuperAdminRole(user?.role);
}

export function hasScreen(user: AuthUser | null | undefined, screenId: ScreenId): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return (user.screenAccess ?? []).includes(screenId);
}

export function canAccessAdminUsers(user: AuthUser | null | undefined): boolean {
  return isSuperAdmin(user);
}

export function canAccessPath(pathname: string, user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  if (pathname.startsWith('/admin/users')) return canAccessAdminUsers(user);
  if (isSuperAdmin(user)) return true;

  const match = PATH_SCREEN_MAP.find(({ prefix }) => pathname.startsWith(prefix));
  if (!match) return true;
  if (pathname.startsWith('/admin')) return false;
  return hasScreen(user, match.screen);
}

const DEFAULT_ROUTE_ORDER = [
  '/executive',
  '/po-so/sps',
  '/po-so/costco',
  '/po-trackers/b2b',
  '/po-trackers/retails',
  '/stores/kehe',
  '/admin/users',
] as const;

export function getDefaultRoute(user: AuthUser | null | undefined): string {
  if (!user) return '/signin';
  if (isSuperAdmin(user)) return '/executive';
  for (const path of DEFAULT_ROUTE_ORDER) {
    if (canAccessPath(path, user)) return path;
  }
  return '/unauthorized';
}

export function getScreenLabel(screenId: ScreenId): string {
  for (const group of SCREEN_GROUPS) {
    const found = group.screens.find((s) => s.id === screenId);
    if (found) return found.label;
  }
  return screenId;
}
