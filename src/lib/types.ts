// Shared types mirroring the NestJS backend DTOs/entities.

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'ACCOUNTANT';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Profile {
  id: string;
  email: string;
  emailVerified: boolean;
  legalName: string | null;
  gstin: string | null;
  address: string | null;
  defaultSac: string | null;
  bankAccount: string | null;
  bankIfsc: string | null;
  lutNumber: string | null;
  lutFy: string | null;
  lutArn: string | null;
  role: Role;
  orgId: string | null;
}

export interface Client {
  id: string;
  orgId: string;
  name: string;
  email: string | null;
  address: string | null;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  sacCode: string;
  quantity: string;
  unitAmount: string;
  lineTotal: string;
}

export interface Invoice {
  id: string;
  orgId: string;
  clientId: string;
  number: string;
  financialYear: string;
  invoiceDate: string;
  currency: string;
  fxRate: string;
  fxRateSource: string;
  fxRateDate: string;
  subtotal: string;
  inrEquivalent: string;
  declarationText: string;
  placeOfSupply: string;
  status: InvoiceStatus;
  femaDueDate: string;
  pdfUrl: string | null;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateInvoiceItemInput {
  description: string;
  sacCode?: string;
  quantity: number;
  unitAmount: number;
}

export interface CreateInvoiceInput {
  clientId: string;
  invoiceDate?: string;
  currency: string;
  items: CreateInvoiceItemInput[];
}

export interface CreateClientInput {
  name: string;
  email?: string;
  address?: string;
  country: string;
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED'] as const;

export interface SacCode {
  code: string;
  description: string;
}

export const SAC_CODES: SacCode[] = [
  { code: '998314', description: 'IT design and development services' },
  { code: '998313', description: 'IT consulting and support services' },
  { code: '998315', description: 'Hosting and IT infrastructure provisioning' },
  { code: '998316', description: 'IT infrastructure and network management' },
  { code: '998319', description: 'Other IT services n.e.c.' },
  { code: '998391', description: 'Specialty design services (graphic/UX)' },
  { code: '998361', description: 'Advertising services' },
  { code: '998399', description: 'Other professional/technical/business services' },
];
