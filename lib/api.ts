import { getToken } from './auth';
import type { DashboardData, FilterOptions, FiltersState } from './types';
import type { NotificationsResponse } from './notifications/types';
import type {
  PoTrackerCategory,
  PoTrackerChannelType,
  PoTrackerOrderDetail,
  PoTrackerOrderUpdateBody,
  PoTrackerPaginatedResult,
  PoTrackerPoSource,
  PoTrackerSummary,
} from './po-tracker/types';
import type { SpsFilterKey, SpsFiltersState, SpsPaginatedResult, SpsSummary } from './sps/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function buildSpsQuery(
  store: string,
  params: {
    type?: 'po' | 'invoice';
    page?: number;
    limit?: number;
    filters?: SpsFiltersState;
  } = {}
) {
  const search = new URLSearchParams({ store });
  if (params.type) search.set('type', params.type);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.filters) {
    for (const key of Object.keys(params.filters) as SpsFilterKey[]) {
      const value = params.filters[key];
      if (value && value !== 'All') search.set(key, value);
    }
  }
  return search.toString();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Start the backend: cd backend_e-rantel && npm run dev`
    );
  }

  let json: { message?: string; success?: boolean };
  try {
    json = await res.json();
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }

  return json as T;
}

export const api = {
  signup: (body: { fullname: string; email: string; mobile?: string; password: string }) =>
    request<{ success: boolean; data: { token: string; user: unknown } }>(
      '/api/v1/auth/signup',
      { method: 'POST', body: JSON.stringify(body) }
    ),

  signin: (body: { email: string; password: string }) =>
    request<{ success: boolean; data: { token: string; user: unknown } }>(
      '/api/v1/auth/signin',
      { method: 'POST', body: JSON.stringify(body) }
    ),

  getExecutiveDataset: (refresh = false) =>
    request<{
      success: boolean;
      data: { rowCount: number; rows: unknown[]; lastUpdated: string };
    }>(
      `/api/v1/executive/dataset${refresh ? '?refresh=1' : ''}`,
      { method: 'GET' },
      true
    ),

  getFilters: () =>
    request<{ success: boolean; data: FilterOptions }>(
      '/api/v1/executive/filters',
      { method: 'GET' },
      true
    ),

  getDashboard: (filters: FiltersState) =>
    request<{ success: boolean; data: DashboardData }>(
      '/api/v1/executive/dashboard',
      { method: 'POST', body: JSON.stringify({ filters }) },
      true
    ),

  getSpsOrders: (
    store: string,
    params: {
      type?: 'po' | 'invoice';
      page?: number;
      limit?: number;
      filters?: SpsFiltersState;
    } = {}
  ) =>
    request<{ success: boolean; data: SpsPaginatedResult }>(
      `/api/v1/sps/orders?${buildSpsQuery(store, params)}`,
      { method: 'GET' },
      true
    ),

  getSpsSummary: (store: string, filters: SpsFiltersState) =>
    request<{ success: boolean; data: { storeId: string; summary: SpsSummary; lastUpdated: string } }>(
      `/api/v1/sps/summary?${buildSpsQuery(store, { filters })}`,
      { method: 'GET' },
      true
    ),

  getSpsFilters: (store: string) =>
    request<{
      success: boolean;
      data: {
        storeId: string;
        totalRows: number;
        filterOptions: Record<string, string[]>;
        lastUpdated: string;
      };
    }>(`/api/v1/sps/filters?store=${encodeURIComponent(store)}`, { method: 'GET' }, true),

  getPoTrackerOrders: (
    channelType: PoTrackerChannelType,
    params: {
      category?: PoTrackerCategory;
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const search = new URLSearchParams({ channelType });
    search.set('category', params.category ?? 'all');
    if (params.status) search.set('status', params.status);
    if (params.search) search.set('search', params.search);
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    return request<{ success: boolean; data: PoTrackerPaginatedResult }>(
      `/api/v1/po-tracker/orders?${search.toString()}`,
      { method: 'GET' },
      true
    );
  },

  getPoTrackerSummary: (
    channelType: PoTrackerChannelType,
    params: {
      category?: PoTrackerCategory;
      status?: string;
      search?: string;
    } = {}
  ) => {
    const search = new URLSearchParams({ channelType });
    search.set('category', params.category ?? 'all');
    if (params.status) search.set('status', params.status);
    if (params.search) search.set('search', params.search);
    return request<{
      success: boolean;
      data: { channelType: PoTrackerChannelType; category: PoTrackerCategory; summary: PoTrackerSummary; lastUpdated: string };
    }>(`/api/v1/po-tracker/summary?${search.toString()}`, { method: 'GET' }, true);
  },

  getPoTrackerFilters: (channelType: PoTrackerChannelType, category: PoTrackerCategory = 'all') =>
    request<{
      success: boolean;
      data: {
        channelType: PoTrackerChannelType;
        category: PoTrackerCategory;
        statuses: string[];
        lastUpdated: string;
      };
    }>(
      `/api/v1/po-tracker/filters?channelType=${encodeURIComponent(channelType)}&category=${encodeURIComponent(category)}`,
      { method: 'GET' },
      true
    ),

  getPoTrackerOrder: (id: string, poSource: PoTrackerPoSource) =>
    request<{ success: boolean; data: PoTrackerOrderDetail }>(
      `/api/v1/po-tracker/orders/${encodeURIComponent(id)}?poSource=${encodeURIComponent(poSource)}`,
      { method: 'GET' },
      true
    ),

  updatePoTrackerOrder: (
    id: string,
    poSource: PoTrackerPoSource,
    body: PoTrackerOrderUpdateBody,
    channelType: PoTrackerChannelType
  ) =>
    request<{ success: boolean; data: PoTrackerOrderDetail & { message?: string } }>(
      `/api/v1/po-tracker/orders/${encodeURIComponent(id)}?poSource=${encodeURIComponent(poSource)}&channelType=${encodeURIComponent(channelType)}`,
      { method: 'PATCH', body: JSON.stringify(body) },
      true
    ),

  getNotifications: (limit = 30) =>
    request<{ success: boolean; data: NotificationsResponse }>(
      `/api/v1/notifications?limit=${limit}`,
      { method: 'GET' },
      true
    ),

  markNotificationRead: (id: string) =>
    request<{ success: boolean; data: { unreadCount: number } }>(
      `/api/v1/notifications/${encodeURIComponent(id)}/read`,
      { method: 'PATCH' },
      true
    ),

  markAllNotificationsRead: () =>
    request<{ success: boolean; data: { unreadCount: number } }>(
      '/api/v1/notifications/read-all',
      { method: 'PATCH' },
      true
    ),
};
