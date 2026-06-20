'use client';

// Typed API client for the Crossbill backend.
// - Access token is held in memory (not localStorage) to limit XSS exposure.
// - The HttpOnly refresh cookie is sent automatically; on 401 we transparently refresh once.

import type {
  Profile, Client, Invoice, Paginated, CreateInvoiceInput, CreateClientInput,
  Remittance, CreateRemittanceInput, AgingInvoice, Note, CreateNoteInput,
  Payment, Plan, BillingOverview,
  Agreement, CreateAgreementInput, SendAgreementInput, SignAgreementInput, SigningView, EsignStatus,
  Consent, CreateConsentInput,
  AgreementTemplate, CreateTemplateInput, BulkSendInput, BulkSendResult,
  Geofence, VerifyResult, SetLifecycleInput, AddObligationInput, ClauseReview,
  Employee, CreateEmployeeInput, EmployeeStats,
  Attendance, AttendanceSummary, AttendanceStats, Leave, CreateLeaveInput,
  Company, UpdateCompanyInput,
  SalarySlip, CreateSlipInput, PayrollRun,
  HrLetter, CreateLetterInput,
  Onboarding, Exit, CreateExitInput, UpdateExitInput,
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
  femaAging: () => request<AgingInvoice[]>('/invoices/fema/aging'),
  get: (id: string) => request<Invoice>(`/invoices/${id}`),
  create: (input: CreateInvoiceInput) =>
    request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(input) }),
  updateStatus: (id: string, status: string) =>
    request<Invoice>(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  pdf: (id: string) => request<{ url: string; status: string }>(`/invoices/${id}/pdf`),
};

// ─────────────────────────── Remittances / FIRC ───────────────────────────
export const remittances = {
  create: (input: CreateRemittanceInput) =>
    request<Remittance>('/remittances', { method: 'POST', body: JSON.stringify(input) }),
  listForInvoice: (invoiceId: string) =>
    request<Remittance[]>(`/remittances?invoiceId=${invoiceId}`),
  async uploadFirc(remittanceId: string, file: File): Promise<Remittance> {
    const form = new FormData();
    form.append('firc', file);
    // No Content-Type header: the browser sets the multipart boundary.
    const res = await fetch(`${BASE}/remittances/${remittanceId}/firc`, {
      method: 'POST',
      credentials: 'include',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: form,
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new ApiError(res.status, json.error?.message || 'FIRC upload failed', json);
    }
    return json.data as Remittance;
  },
  fircUrl: (remittanceId: string) => `${BASE}/remittances/${remittanceId}/firc`,
};

// ─────────────────────────── Credit / Debit Notes ───────────────────────────
export const notes = {
  listForInvoice: (invoiceId: string) =>
    request<Note[]>(`/notes?invoiceId=${invoiceId}`),
  list: (page = 1, limit = 50) =>
    request<Paginated<Note>>(`/notes?page=${page}&limit=${limit}`),
  create: (input: CreateNoteInput) =>
    request<Note>('/notes', { method: 'POST', body: JSON.stringify(input) }),
  pdf: (id: string) => request<{ url: string }>(`/notes/${id}/pdf`),
};

// ─────────────────────────── Payments (Razorpay) ───────────────────────────
export const payments = {
  status: () => request<{ configured: boolean; provider: string }>('/payments/status'),
  listForInvoice: (invoiceId: string) => request<Payment[]>(`/payments?invoiceId=${invoiceId}`),
  list: (page = 1, limit = 50) => request<Paginated<Payment>>(`/payments?page=${page}&limit=${limit}`),
  createLink: (invoiceId: string) =>
    request<Payment>('/payments/links', { method: 'POST', body: JSON.stringify({ invoiceId }) }),
};

// ─────────────────────────── Billing / Subscription ───────────────────────────
export const billing = {
  overview: () => request<BillingOverview>('/billing'),
  checkout: (planId: string) =>
    request<{ shortUrl: string; paymentId: string; plan: Plan }>('/billing/checkout', { method: 'POST', body: JSON.stringify({ planId }) }),
};

// ─────────────────────────── Agreements + eSign ───────────────────────────
export const agreements = {
  list: (page = 1, limit = 100) => request<Paginated<Agreement>>(`/agreements?page=${page}&limit=${limit}`),
  get: (id: string) => request<Agreement>(`/agreements/${id}`),
  create: (input: CreateAgreementInput) =>
    request<Agreement>('/agreements', { method: 'POST', body: JSON.stringify(input) }),
  send: (id: string, input: SendAgreementInput) =>
    request<Agreement & { signUrl: string }>(`/agreements/${id}/send`, { method: 'POST', body: JSON.stringify(input) }),
  esignStatus: () => request<EsignStatus>('/agreements/esign/status'),
  getGeofences: () => request<Geofence[]>('/agreements/geofences'),
  setGeofences: (fences: Geofence[]) =>
    request<Geofence[]>('/agreements/geofences', { method: 'PUT', body: JSON.stringify({ fences }) }),
  verify: (code: string) => request<VerifyResult>(`/agreements/verify/${encodeURIComponent(code)}`),
  // lifecycle + obligations + search
  search: (q: string, status: string, page = 1, limit = 100) =>
    request<Paginated<Agreement>>(`/agreements/search?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`),
  setLifecycle: (id: string, input: SetLifecycleInput) =>
    request<Agreement>(`/agreements/${id}/lifecycle`, { method: 'PUT', body: JSON.stringify(input) }),
  clauseReview: (id: string) => request<ClauseReview>(`/agreements/${id}/clause-review`),
  addObligation: (id: string, input: AddObligationInput) =>
    request<Agreement>(`/agreements/${id}/obligations`, { method: 'POST', body: JSON.stringify(input) }),
  toggleObligation: (id: string, obId: string) =>
    request<Agreement>(`/agreements/${id}/obligations/${obId}`, { method: 'PUT' }),
  removeObligation: (id: string, obId: string) =>
    request<Agreement>(`/agreements/${id}/obligations/${obId}`, { method: 'DELETE' }),
  runReminders: () => request<{ processed: number; remindersSent: number }>('/agreements/lifecycle/run-reminders', { method: 'POST' }),
  // public signer flow
  forSigning: (token: string) => request<SigningView>(`/agreements/sign/${token}`),
  resendOtp: (token: string) => request<{ otpRequired: boolean; sent?: boolean }>(`/agreements/sign/${token}/otp`, { method: 'POST' }),
  aadhaarInit: (token: string, aadhaar: string) =>
    request<{ referenceId: string; otpRequired: boolean; sandbox?: boolean; devOtp?: string; alreadyVerified?: boolean }>(`/agreements/sign/${token}/aadhaar/init`, { method: 'POST', body: JSON.stringify({ aadhaar }) }),
  aadhaarVerify: (token: string, referenceId: string, otp: string) =>
    request<{ verified: boolean; last4: string | null }>(`/agreements/sign/${token}/aadhaar/verify`, { method: 'POST', body: JSON.stringify({ referenceId, otp }) }),
  sign: (token: string, input: SignAgreementInput) =>
    request<{ status: string; signedPdfUrl: string | null; verifyCode?: string; geoFenceStatus?: string }>(`/agreements/sign/${token}`, { method: 'POST', body: JSON.stringify(input) }),
  decline: (token: string) => request<{ status: string }>(`/agreements/sign/${token}/decline`, { method: 'POST' }),
};

// ─────────────────────────── Agreement templates (automation) ───────────────────────────
export const agreementTemplates = {
  list: (page = 1, limit = 100) => request<Paginated<AgreementTemplate>>(`/agreement-templates?page=${page}&limit=${limit}`),
  create: (input: CreateTemplateInput) =>
    request<AgreementTemplate>('/agreement-templates', { method: 'POST', body: JSON.stringify(input) }),
  remove: (id: string) => request<{ deleted: boolean }>(`/agreement-templates/${id}`, { method: 'DELETE' }),
  use: (id: string, input: { title?: string; clientId?: string; values?: Record<string, string> }) =>
    request<Agreement>(`/agreement-templates/${id}/use`, { method: 'POST', body: JSON.stringify(input) }),
  bulkSend: (id: string, input: BulkSendInput) =>
    request<BulkSendResult>(`/agreement-templates/${id}/bulk-send`, { method: 'POST', body: JSON.stringify(input) }),
};

// ─────────────────────────── Consents (DPDP) ───────────────────────────
export const consents = {
  list: (page = 1, limit = 100) => request<Paginated<Consent>>(`/consents?page=${page}&limit=${limit}`),
  create: (input: CreateConsentInput) =>
    request<Consent>('/consents', { method: 'POST', body: JSON.stringify(input) }),
  withdraw: (id: string) => request<Consent>(`/consents/${id}/withdraw`, { method: 'POST' }),
};

// ─────────────────────────── HR · Employees ───────────────────────────
export const employees = {
  list: (q = '', department = '', status = '', page = 1, limit = 100) =>
    request<Paginated<Employee>>(`/employees?q=${encodeURIComponent(q)}&department=${encodeURIComponent(department)}&status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`),
  get: (id: string) => request<Employee>(`/employees/${id}`),
  stats: () => request<EmployeeStats>('/employees/stats'),
  create: (input: CreateEmployeeInput) =>
    request<Employee>('/employees', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: Partial<CreateEmployeeInput>) =>
    request<Employee>(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => request<{ deleted: boolean }>(`/employees/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────── Company verification (§2) ───────────────────────────
export const company = {
  get: () => request<Company>('/company'),
  update: (input: UpdateCompanyInput) => request<Company>('/company', { method: 'PATCH', body: JSON.stringify(input) }),
  submit: () => request<Company>('/company/submit', { method: 'POST' }),
  setVerification: (status: 'verified' | 'rejected', notes?: string) =>
    request<Company>('/company/verification', { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
};

// ─────────────────────────── HR · Attendance & leave ───────────────────────────
export const attendance = {
  checkIn: (employeeId: string) => request<Attendance>('/attendance/check-in', { method: 'POST', body: JSON.stringify({ employeeId }) }),
  checkOut: (employeeId: string) => request<Attendance>('/attendance/check-out', { method: 'POST', body: JSON.stringify({ employeeId }) }),
  today: () => request<Attendance[]>('/attendance/today'),
  list: (employeeId = '', month = '') => request<Attendance[]>(`/attendance?employeeId=${employeeId}&month=${month}`),
  summary: (month: string) => request<AttendanceSummary>(`/attendance/summary?month=${month}`),
  stats: () => request<AttendanceStats>('/attendance/stats'),
};

export const leaves = {
  list: (status = '', employeeId = '') => request<Leave[]>(`/leaves?status=${status}&employeeId=${employeeId}`),
  request: (input: CreateLeaveInput) => request<Leave>('/leaves', { method: 'POST', body: JSON.stringify(input) }),
  decide: (id: string, decision: 'approved' | 'rejected') =>
    request<Leave>(`/leaves/${id}/decision`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
};

// ─────────────────────────── HR · Payroll ───────────────────────────
export const payroll = {
  listSlips: (employeeId = '', month = '') => request<SalarySlip[]>(`/payroll/slips?employeeId=${employeeId}&month=${month}`),
  createSlip: (input: CreateSlipInput) => request<SalarySlip>('/payroll/slips', { method: 'POST', body: JSON.stringify(input) }),
  getSlip: (id: string) => request<SalarySlip>(`/payroll/slips/${id}`),
  removeSlip: (id: string) => request<{ deleted: boolean }>(`/payroll/slips/${id}`, { method: 'DELETE' }),
  listRuns: () => request<PayrollRun[]>('/payroll/runs'),
  run: (period: string) => request<PayrollRun>('/payroll/runs', { method: 'POST', body: JSON.stringify({ period }) }),
  finalise: (period: string) => request<PayrollRun>(`/payroll/runs/${period}/finalise`, { method: 'POST' }),
};

// ─────────────────────────── HR · Letters ───────────────────────────
export const letters = {
  list: (kind = '', employeeId = '') => request<HrLetter[]>(`/letters?kind=${kind}&employeeId=${employeeId}`),
  create: (input: CreateLetterInput) => request<HrLetter>('/letters', { method: 'POST', body: JSON.stringify(input) }),
  get: (id: string) => request<HrLetter>(`/letters/${id}`),
  setStatus: (id: string, status: 'sent' | 'accepted' | 'rejected' | 'expired') =>
    request<HrLetter>(`/letters/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id: string) => request<{ deleted: boolean }>(`/letters/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────── HR · Onboarding & exit ───────────────────────────
export const onboarding = {
  get: (employeeId: string) => request<Onboarding>(`/onboarding/${employeeId}`),
  toggle: (employeeId: string, itemId: string, done: boolean, docUrl?: string) =>
    request<Onboarding>(`/onboarding/${employeeId}/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ done, docUrl }) }),
};

export const exits = {
  list: (status = '') => request<Exit[]>(`/exits?status=${status}`),
  create: (input: CreateExitInput) => request<Exit>('/exits', { method: 'POST', body: JSON.stringify(input) }),
  get: (id: string) => request<Exit>(`/exits/${id}`),
  update: (id: string, input: UpdateExitInput) => request<Exit>(`/exits/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
};

// ─────────────────────────── Reports ───────────────────────────
export const reports = {
  gstr6a: (financialYear: string) =>
    request<{ url: string }>(`/reports/gstr-6a?financialYear=${encodeURIComponent(financialYear)}`),

  /** Downloads the document bundle ZIP for a financial year (triggers a browser download). */
  async downloadBundle(financialYear: string): Promise<void> {
    const res = await fetch(`${BASE}/reports/bundle?financialYear=${encodeURIComponent(financialYear)}`, {
      method: 'GET',
      credentials: 'include',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    if (!res.ok) {
      let message = 'Could not generate the bundle';
      try { const j = await res.json(); message = j.error?.message || message; } catch { /* binary or empty */ }
      throw new ApiError(res.status, message);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crossbill-bundle-${financialYear}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};

const api = { auth, profile, clients, invoices, remittances, notes, payments, billing, agreements, agreementTemplates, consents, employees, attendance, leaves, company, payroll, letters, onboarding, exits, reports, setAccessToken, getAccessToken, ApiError };
export default api;
