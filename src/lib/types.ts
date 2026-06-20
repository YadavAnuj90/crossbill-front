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


export type PaymentStatus = 'created' | 'paid' | 'cancelled' | 'expired' | 'failed';
export type PaymentPurpose = 'invoice' | 'subscription';

export interface Payment {
  id: string;
  orgId: string;
  purpose: PaymentPurpose;
  invoiceId: string | null;
  invoiceNumber: string | null;
  planId: string | null;
  provider: string;
  razorpayLinkId: string;
  shortUrl: string;
  amount: string;
  amountPaise: number;
  currency: string;
  status: PaymentStatus;
  razorpayPaymentId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  priceInr: number;
  tagline: string;
  features: string[];
}

export interface BillingOverview {
  configured: boolean;
  currentPlan: Plan;
  planActivatedAt: string | null;
  plans: Plan[];
}


export type AgreementStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'declined' | 'voided';
export const AGREEMENT_CATEGORIES = ['nda', 'msa', 'sow', 'engagement', 'custom'] as const;
export type AgreementCategory = typeof AGREEMENT_CATEGORIES[number];

export interface AuditEvent { at: string; event: string; detail: string | null; }

export interface Agreement {
  id: string;
  orgId: string;
  clientId: string | null;
  title: string;
  category: string;
  body: string;
  sellerName: string | null;
  clientName: string | null;
  status: AgreementStatus;
  signerName: string | null;
  signerEmail: string | null;
  otpRequired: boolean;
  signatureImage: string | null;
  signedName: string | null;
  signedPdfUrl: string | null;
  signerIp: string | null;
  signerLat: number | null;
  signerLng: number | null;
  signerGeoAccuracy: number | null;
  geoFenceStatus: 'ok' | 'outside' | 'unknown';
  selfieImage: string | null;
  faceMatchStatus: string | null;
  verifyCode: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  signedAt: string | null;
  declinedAt: string | null;
  auditTrail: AuditEvent[];
  effectiveDate: string | null;
  renewalDate: string | null;
  expiryDate: string | null;
  obligations: Obligation[];
  lifecycleRemindersSent: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Obligation {
  _id?: string;
  id?: string;
  title: string;
  owner: string | null;
  dueDate: string | null;
  done: boolean;
}

export interface SetLifecycleInput {
  effectiveDate?: string;
  renewalDate?: string;
  expiryDate?: string;
}

export interface AddObligationInput {
  title: string;
  owner?: string;
  dueDate?: string;
}

export interface ClauseReview {
  results: Array<{ clause: string; present: boolean; why: string }>;
  missing: string[];
  score: number;
}

export interface CreateAgreementInput {
  title: string;
  category?: string;
  body?: string;
  clientId?: string;
}
export interface SendAgreementInput { signerName: string; signerEmail: string; aadhaarRequired?: boolean; }
export interface SignAgreementInput {
  signedName: string;
  signatureImage: string;
  consent: boolean;
  otp?: string;
  lat?: number;
  lng?: number;
  accuracy?: number;
  selfie?: string;
}

export interface Geofence { label: string; lat: number; lng: number; radiusKm: number; }

export interface VerifyResult {
  found: boolean;
  title?: string;
  category?: string;
  sellerName?: string | null;
  signerName?: string | null;
  signerEmail?: string | null;
  signedAt?: string | null;
  signerIp?: string | null;
  otpVerified?: boolean;
  geoFenceStatus?: 'ok' | 'outside' | 'unknown';
  selfieCaptured?: boolean;
  integrity?: 'valid';
  signedPdfUrl?: string | null;
}

export interface SigningView {
  id: string;
  title: string;
  category: string;
  body: string;
  sellerName: string | null;
  signerName: string | null;
  otpRequired: boolean;
  aadhaarRequired: boolean;
  aadhaarVerified: boolean;
  status: AgreementStatus;
  signedPdfUrl: string | null;
}

export interface EsignStatus { aadhaarEsign: boolean; eStamp: boolean; provider: string | null; }

export type ConsentBasis = 'consent' | 'contract' | 'legal_obligation' | 'legitimate_use';
export type ConsentStatus = 'active' | 'withdrawn' | 'expired';
export interface Consent {
  id: string;
  orgId: string;
  clientId: string | null;
  dataPrincipal: string | null;
  purpose: string;
  basis: ConsentBasis;
  status: ConsentStatus;
  grantedAt: string;
  expiresAt: string | null;
  withdrawnAt: string | null;
  notes: string | null;
  createdAt: string;
}
export interface CreateConsentInput {
  clientId?: string;
  dataPrincipal?: string;
  purpose: string;
  basis?: string;
  expiresAt?: string;
  notes?: string;
}

export interface AgreementTemplate {
  id: string;
  orgId: string;
  name: string;
  category: string;
  body: string;
  fields: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  category?: string;
  body: string;
}

export interface BulkRecipientInput {
  signerName: string;
  signerEmail: string;
  values?: Record<string, string>;
  clientId?: string;
  title?: string;
}

export interface BulkSendInput {
  recipients: BulkRecipientInput[];
}

export interface BulkSendResult {
  templateId: string;
  sent: number;
  total: number;
  results: Array<{ signerEmail: string; agreementId?: string; signUrl?: string; status: string; error?: string }>;
}

// ─────────────────────────── HR · Employees ───────────────────────────
export type EmploymentType = 'full_time' | 'contract' | 'intern';
export type EmployeeStatus = 'onboarding' | 'active' | 'on_notice' | 'exited';

export interface EmployeeDoc { _id?: string; id?: string; label: string; url: string; }

export interface Employee {
  id: string;
  orgId: string;
  empCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  mobile: string | null;
  department: string | null;
  designation: string | null;
  joiningDate: string | null;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  reportingManager: string | null;
  ctcAnnual: string;
  dob: string | null;
  address: string | null;
  emergencyContact: string | null;
  documents: EmployeeDoc[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  empCode: string;
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  status?: string;
  employmentType?: string;
  reportingManager?: string;
  ctcAnnual?: string;
  dob?: string;
  address?: string;
  emergencyContact?: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  onboarding: number;
  onNotice: number;
  exited: number;
  byDepartment: Array<{ department: string; count: number }>;
}

// ─────────────────────────── HR · Attendance & leave ───────────────────────────
export type AttendanceStatus = 'present' | 'absent' | 'half' | 'leave';

export interface Attendance {
  id: string;
  orgId: string;
  employeeId: string;
  date: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  workedMinutes: number;
  status: AttendanceStatus;
  source: string;
  createdAt: string;
}

export interface AttendanceSummary {
  month: string;
  byEmployee: Array<{ employeeId: string; present: number; half: number; leave: number; workedHours: number }>;
  totals: { present: number; half: number; leave: number; workedHours: number };
}

export interface AttendanceStats { pendingLeaves: number; presentToday: number; }

export type LeaveType = 'casual' | 'sick' | 'earned' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Leave {
  id: string;
  orgId: string;
  employeeId: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string | null;
  status: LeaveStatus;
  approverId: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface CreateLeaveInput {
  employeeId: string;
  type: string;
  from: string;
  to: string;
  reason?: string;
}

// ─────────────────────────── Company verification (§2) ───────────────────────────
export type VerificationStatus = 'unsubmitted' | 'pending' | 'verified' | 'rejected';

export interface Company {
  id: string;
  name: string;
  gstin: string | null;
  pan: string | null;
  registeredAddress: string | null;
  logoUrl: string | null;
  website: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerMobile: string | null;
  verificationStatus: VerificationStatus;
  verificationNotes: string | null;
  verificationSubmittedAt: string | null;
  verifiedAt: string | null;
  plan: string;
}

export interface UpdateCompanyInput {
  name?: string;
  gstin?: string;
  pan?: string;
  registeredAddress?: string;
  logoUrl?: string;
  website?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerMobile?: string;
}

// ─────────────────────────── HR · Payroll ───────────────────────────
export type SlipStatus = 'draft' | 'finalised' | 'shared';

export interface SalarySlip {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  empCode: string | null;
  designation: string | null;
  month: string;
  basic: string; hra: string; bonus: string; allowances: string;
  pf: string; esic: string; tds: string; otherDeductions: string;
  gross: string; totalDeductions: string; net: string;
  status: SlipStatus;
  pdfUrl: string | null;
  generatedAt: string | null;
  createdAt: string;
}

export interface CreateSlipInput {
  employeeId: string;
  month: string;
  basic?: string; hra?: string; bonus?: string; allowances?: string;
  pf?: string; esic?: string; tds?: string; otherDeductions?: string;
}

export interface PayrollRun {
  id: string;
  orgId: string;
  period: string;
  status: 'draft' | 'finalised';
  gross: string; deductions: string; net: string;
  slipCount: number;
  finalisedAt: string | null;
  createdAt: string;
}

// ─────────────────────────── HR · Letters ───────────────────────────
export type LetterKind = 'offer' | 'experience' | 'relieving';
export type LetterStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface HrLetter {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  kind: LetterKind;
  status: LetterStatus;
  designation: string | null;
  department: string | null;
  joiningDate: string | null;
  ctc: string | null;
  reportingManager: string | null;
  fromDate: string | null;
  toDate: string | null;
  pdfUrl: string | null;
  generatedAt: string | null;
  sentAt: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface CreateLetterInput {
  employeeId: string;
  kind: string;
  designation?: string;
  department?: string;
  joiningDate?: string;
  ctc?: string;
  reportingManager?: string;
  fromDate?: string;
  toDate?: string;
}

// ─────────────────────────── HR · Onboarding & exit ───────────────────────────
export interface ChecklistItem { _id?: string; id?: string; key: string; label: string; required: boolean; done: boolean; docUrl: string | null; }
export interface Onboarding {
  id: string;
  orgId: string;
  employeeId: string;
  checklist: ChecklistItem[];
  status: 'in_progress' | 'complete';
  completedAt: string | null;
}

export interface AssetItem { _id?: string; id?: string; asset: string; returned: boolean; }
export type ExitStatus = 'initiated' | 'notice' | 'cleared' | 'settled';
export interface Exit {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  resignationDate: string;
  lastWorkingDate: string | null;
  noticeDays: number;
  reason: string | null;
  assets: AssetItem[];
  managerApproved: boolean;
  hrApproved: boolean;
  finalSettlement: string;
  settlementNotes: string | null;
  status: ExitStatus;
  completedAt: string | null;
  createdAt: string;
}
export interface CreateExitInput { employeeId: string; resignationDate: string; noticeDays?: number; reason?: string; }
export interface UpdateExitInput {
  assets?: Array<{ asset: string; returned?: boolean }>;
  managerApproved?: boolean;
  hrApproved?: boolean;
  finalSettlement?: string;
  settlementNotes?: string;
  lastWorkingDate?: string;
  status?: string;
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
