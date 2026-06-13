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

export type ClientType = 'foreign' | 'domestic';
export type CustomerType = 'b2b' | 'b2c';

export interface Client {
  id: string;
  orgId: string;
  type: ClientType;
  name: string;
  email: string | null;
  address: string | null;
  country: string | null;
  stateCode: string | null;
  gstin: string | null;
  customerType: CustomerType | null;
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
  gstRate: number;
}

export type InvoiceType = 'export' | 'domestic';
export type InvoiceTaxType = 'LUT_ZERO' | 'IGST' | 'CGST_SGST';

export interface Invoice {
  id: string;
  orgId: string;
  type: InvoiceType;
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
  taxType: InvoiceTaxType;
  cgstAmount: string;
  sgstAmount: string;
  igstAmount: string;
  taxTotal: string;
  grandTotal: string;
  declarationText: string;
  placeOfSupply: string;
  placeOfSupplyState: string | null;
  status: InvoiceStatus;
  femaDueDate: string | null;
  pdfUrl: string | null;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export type NoteKind = 'credit' | 'debit';

export interface Note {
  id: string;
  orgId: string;
  kind: NoteKind;
  number: string;
  financialYear: string;
  noteDate: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientId: string;
  invoiceType: InvoiceType;
  currency: string;
  fxRate: string;
  fxRateSource: string;
  fxRateDate: string;
  reason: string;
  subtotal: string;
  taxType: InvoiceTaxType;
  cgstAmount: string;
  sgstAmount: string;
  igstAmount: string;
  taxTotal: string;
  grandTotal: string;
  placeOfSupply: string;
  placeOfSupplyState: string | null;
  pdfUrl: string | null;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteItemInput {
  description: string;
  sacCode?: string;
  quantity: number;
  unitAmount: number;
  gstRate?: number;
}

export interface CreateNoteInput {
  invoiceId: string;
  kind: NoteKind;
  reason: string;
  items: CreateNoteItemInput[];
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
  gstRate?: number;
}

export interface CreateInvoiceInput {
  clientId: string;
  invoiceDate?: string;
  currency?: string;
  items: CreateInvoiceItemInput[];
}

export interface CreateClientInput {
  type: ClientType;
  name: string;
  email?: string;
  address?: string;
  country?: string;
  stateCode?: string;
  gstin?: string;
  customerType?: CustomerType;
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

export interface Remittance {
  id: string;
  orgId: string;
  invoiceId: string;
  amountReceived: string;
  currency: string;
  receivedDate: string;
  purposeCode: string;
  fircDocUrl: string | null;
  fircFilename: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateRemittanceInput {
  invoiceId: string;
  amountReceived: number;
  currency: string;
  receivedDate: string;
  purposeCode: string;
  notes?: string;
}

export type FemaBucket = 'overdue' | 'critical' | 'urgent' | 'watch' | 'ontrack';

export interface FemaAging {
  daysToDue: number;
  monthsElapsed: number;
  bucket: FemaBucket;
}

export type AgingInvoice = Invoice & { aging: FemaAging };

export interface PurposeCode { code: string; description: string; }

export const PURPOSE_CODES: PurposeCode[] = [
  { code: 'P0802', description: 'Software consultancy / implementation / supply' },
  { code: 'P0801', description: 'Telecommunication & computer services' },
  { code: 'P0803', description: 'Information / data / news-related services' },
  { code: 'P0806', description: 'Business & management consultancy' },
  { code: 'P0807', description: 'Advertising, market research & polling' },
  { code: 'P0808', description: 'Research & development services' },
  { code: 'P0809', description: 'Architectural, engineering & technical services' },
  { code: 'P0902', description: 'Other technical, trade-related & business services' },
];
export const DEFAULT_PURPOSE_CODE = 'P0802';

export interface IndiaState { code: string; name: string; }
export const INDIA_STATES: IndiaState[] = [
  { code: '01', name: 'Jammu & Kashmir' }, { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' }, { code: '04', name: 'Chandigarh' }, { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' }, { code: '07', name: 'Delhi' }, { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' }, { code: '10', name: 'Bihar' }, { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' }, { code: '13', name: 'Nagaland' }, { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' }, { code: '16', name: 'Tripura' }, { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' }, { code: '19', name: 'West Bengal' }, { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' }, { code: '22', name: 'Chhattisgarh' }, { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' }, { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' }, { code: '29', name: 'Karnataka' }, { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' }, { code: '32', name: 'Kerala' }, { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' }, { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' }, { code: '37', name: 'Andhra Pradesh' }, { code: '38', name: 'Ladakh' },
];
export const GST_RATES = [0, 5, 12, 18, 28];
export const DEFAULT_GST_RATE = 18;

export function stateNameOf(code: string | null | undefined): string {
  if (!code) return '—';
  return INDIA_STATES.find((s) => s.code === code)?.name ?? code;
}
export function stateCodeFromGstin(gstin?: string | null): string | null {
  if (!gstin || gstin.length < 2) return null;
  return gstin.slice(0, 2);
}
