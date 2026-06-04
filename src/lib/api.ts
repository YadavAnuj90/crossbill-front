'use client';

// Typed API client for the Crossbill backend.
// - Access token is held in memory (not localStorage) to limit XSS exposure.
// - The HttpOnly refresh cookie is sent automatically; on 401 we transparently refresh once.

import type {
  Profile, Client, Invoice, Paginated, CreateInvoiceInput, CreateClientInput,
} from './types';

const BASE = '/api/v1';

let accessToken: string | null = null;
let refreshing: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

interface Envelope<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: { code: number; message: string };
}

async function raw(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers || {}),
    },
  });
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (!res.ok) return false;
        const json = (await res.json()) as Envelope<{ accessToken: string }>;
        accessToken = json.data.accessToken;
        return true;
      } catch {
        return false;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  let res = await raw(path, init);

  if (res.status === 401 && retry && !path.startsWith('/auth/')) {
    const ok = await tryRefresh();
    if (ok) res = await raw(path, init);
  }

  const text = await res.text();
  const json = text ? (JSON.parse(text) as Envelope<T>) : ({} as Envelope<T>);

  if (!res.ok || json.success === false) {
    const message = json.error?.message || res.statusText || 'Request failed';
    throw new ApiError(res.status, message, json);
  }
  // List endpoints return { data, meta } — fold meta back in for paginated callers.
  if (json.meta) return { items: json.data, meta: json.meta } as unknown as T;
  return json.data;
}

// ─────────────────────────── Auth ───────────────────────────
export const auth = {
  async register(input: { email: string; password: string; legalName?: string }) {
    const data = await request<{ accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    accessToken = data.accessToken;
    return data;
  },
  async login(input: { email: string; password: string }) {
    const data = await request<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    accessToken = data.accessToken;
    return data;
  },
  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      accessToken = null;
    }
  },
  async bootstrap(): Promise<boolean> {
    // Called on app load: exchange the refresh cookie for an access token.
    return tryRefresh();
  },
  googleUrl() {
    return `${BASE}/auth/google`;
  },
};

// ─────────────────────────── Profile ───────────────────────────
export const profile = {
  me: () => request<Profile>('/profile'),
  update: (patch: Partial<Profile>) =>
    request<Profile>('/profile', { method: 'PATCH', body: JSON.stringify(patch) }),
};

// ─────────────────────────── Clients ───────────────────────────
export const clients = {
  list: (page = 1, limit = 50) =>
    request<Paginated<Client>>(`/clients?page=${page}&limit=${limit}`),
  create: (input: CreateClientInput) =>
    request<Client>('/clients', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<CreateClientInput>) =>
    request<Client>(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => request<void>(`/clients/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────── Invoices ───────────────────────────
export const invoices = {
  list: (page = 1, limit = 50) =>
    request<Paginated<Invoice>>(`/invoices?page=${page}&limit=${limit}`),
  get: (id: string) => request<Invoice>(`/invoices/${id}`),
  create: (input: CreateInvoiceInput) =>
    request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(input) }),
  updateStatus: (id: string, status: string) =>
    request<Invoice>(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  pdf: (id: string) => request<{ url: string; status: string }>(`/invoices/${id}/pdf`),
};

// ─────────────────────────── Reports ───────────────────────────
export const reports = {
  gstr6a: (financialYear: string) =>
    request<{ url: string }>(`/reports/gstr-6a?financialYear=${encodeURIComponent(financialYear)}`),
};

const api = { auth, profile, clients, invoices, reports, setAccessToken, getAccessToken, ApiError };
export default api;
