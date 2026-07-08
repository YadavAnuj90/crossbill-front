'use client';
import { useEffect, useState } from 'react';
import {
  ReceiptText, Plus, Trash2, FileInput, RefreshCw, ShieldCheck, ShieldAlert,
  CheckCircle2, AlertTriangle, CircleDollarSign, Banknote, TriangleAlert, PackageSearch,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Bill, CreateBillInput, Reconciliation, ReconStatus } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Drawer';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

const CATEGORIES = ['goods', 'services', 'capital_goods', 'other'];
const CATEGORY_LABEL: Record<string, string> = {
  goods: 'Goods', services: 'Services', capital_goods: 'Capital goods', other: 'Other',
};

const STATUS_TONE: Record<ReconStatus, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  matched: 'green', mismatch: 'amber', missing_in_2b: 'red', missing_in_books: 'blue',
};
const STATUS_LABEL: Record<ReconStatus, string> = {
  matched: 'Matched', mismatch: 'Mismatch', missing_in_2b: 'At risk', missing_in_books: 'In 2B only',
};

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function rupees(v: string | number | null | undefined): string {
  if (v === null || v === undefined || v === '') return '—';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (Number.isNaN(n)) return '—';
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function billTax(b: Bill): string {
  const sum = ['cgst', 'sgst', 'igst', 'cess'].reduce((acc, k) => acc + (parseFloat((b as any)[k]) || 0), 0);
  return String(sum);
}

const emptyForm: CreateBillInput = {
  vendorName: '', vendorGstin: '', billNumber: '', billDate: '', category: 'goods',
  taxableValue: '', cgst: '', sgst: '', igst: '', itcEligible: true, notes: '',
};

type Tab = 'bills' | 'recon';

export default function PurchasesPage() {
  const { notify } = useToast();
  const [tab, setTab] = useState<Tab>('bills');
  const [period, setPeriod] = useState<string>(currentMonth());

  // Bills tab
  const [bills, setBills] = useState<Bill[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateBillInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Recon tab
  const [recon, setRecon] = useState<Reconciliation | null>(null);
  const [reconLoading, setReconLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  function loadBills() {
    setBills(null);
    api.purchases.listBills({ period }).then(setBills).catch(() => setBills([]));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadBills(); }, [period]);

  function openCreate() { setForm({ ...emptyForm, billDate: '' }); setOpen(true); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vendorName.trim() || !form.billNumber.trim() || !form.billDate) {
      notify('error', 'Vendor, bill number and date are required'); return;
    }
    if (!form.taxableValue || parseFloat(form.taxableValue) <= 0) {
      notify('error', 'Enter a taxable value'); return;
    }
    const payload: CreateBillInput = {
      vendorName: form.vendorName.trim(),
      vendorGstin: form.vendorGstin?.trim() || undefined,
      billNumber: form.billNumber.trim(),
      billDate: form.billDate,
      category: form.category || undefined,
      taxableValue: form.taxableValue,
      cgst: form.cgst || undefined,
      sgst: form.sgst || undefined,
      igst: form.igst || undefined,
      itcEligible: form.itcEligible,
      notes: form.notes?.trim() || undefined,
    };
    setSaving(true);
    try {
      await api.purchases.createBill(payload);
      notify('success', 'Bill added'); setOpen(false); loadBills();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not save'); }
    finally { setSaving(false); }
  }

  async function onDelete(b: Bill) {
    if (!confirm(`Delete bill "${b.billNumber}" from ${b.vendorName}?`)) return;
    try { await api.purchases.removeBill(b.id); notify('success', 'Bill deleted'); loadBills(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  async function runReconcile() {
    setReconLoading(true);
    try {
      const r = await api.purchases.reconcile(period);
      setRecon(r);
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not reconcile'); }
    finally { setReconLoading(false); }
  }

  async function generateSample() {
    setBusy(true);
    try {
      const res = await api.purchases.sample2b(period);
      notify('success', `Sample GSTR-2B built — ${res.imported} line(s)`);
      await runReconcile();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not build sample 2B'); }
    finally { setBusy(false); }
  }

  const s = recon?.summary;
  const STAT_CARDS = s ? [
    { label: 'ITC as per books', value: rupees(s.itcAsPerBooks), icon: <Banknote className="h-5 w-5" />, tone: 'text-ink bg-paper ring-paper-border' },
    { label: 'ITC as per 2B', value: rupees(s.itcAsPer2B), icon: <CircleDollarSign className="h-5 w-5" />, tone: 'text-ink bg-paper ring-paper-border' },
    { label: 'Claimable', value: rupees(s.claimableItc), icon: <CheckCircle2 className="h-5 w-5" />, tone: 'text-brand-600 bg-brand-50 ring-brand-200' },
    { label: 'Under review', value: rupees(s.underReviewItc), icon: <AlertTriangle className="h-5 w-5" />, tone: 'text-amber-600 bg-amber-50 ring-amber-200' },
    { label: 'At risk', value: rupees(s.atRiskItc), icon: <ShieldAlert className="h-5 w-5" />, tone: 'text-red-600 bg-red-50 ring-red-200' },
    { label: 'Only in 2B', value: rupees(s.onlyIn2bItc), icon: <PackageSearch className="h-5 w-5" />, tone: 'text-blue-600 bg-blue-50 ring-blue-200' },
  ] : [];

  const TABS: { key: Tab; label: string }[] = [
    { key: 'bills', label: 'Bills' },
    { key: 'recon', label: 'ITC reconciliation' },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Purchases & ITC"
        subtitle="Record purchase bills and reconcile input tax credit against GSTR-2B — before it blocks your GSTR-3B."
        icon={<ReceiptText className="h-5 w-5" />}
        action={tab === 'bills' ? <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add bill</Button> : undefined}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-xl bg-paper p-1 ring-1 ring-inset ring-paper-border">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('rounded-lg px-3.5 py-1.5 text-sm font-medium transition',
                tab === t.key ? 'bg-paper-card text-ink shadow-card' : 'text-ink-muted hover:text-ink')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-ink-muted">Period</label>
          <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="field max-w-[180px]" />
        </div>
      </div>

      {tab === 'bills' && (
        <Reveal>
          <Card>
            {bills === null ? (
              <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : bills.length === 0 ? (
              <EmptyState icon={<ReceiptText className="h-6 w-6" />} title="No bills this period" description="Add your purchase bills for the selected month to start claiming input tax credit.">
                <Button className="mt-6" onClick={openCreate}><Plus className="h-4 w-4" /> Add bill</Button>
              </EmptyState>
            ) : (
              <Table>
                <THead>
                  <TH>Vendor</TH><TH>Bill #</TH><TH>Date</TH>
                  <TH className="text-right">Taxable</TH><TH className="text-right">Tax</TH><TH className="text-right">Total</TH>
                  <TH>ITC</TH><TH />
                </THead>
                <tbody>
                  {bills.map((b) => (
                    <TR key={b.id}>
                      <TD>
                        <p className="font-medium text-ink">{b.vendorName}</p>
                        {b.vendorGstin && <p className="font-mono text-xs text-ink-faint">{b.vendorGstin}</p>}
                      </TD>
                      <TD><span className="font-mono text-xs text-ink">{b.billNumber}</span></TD>
                      <TD>{formatDate(b.billDate)}</TD>
                      <TD className="text-right">{rupees(b.taxableValue)}</TD>
                      <TD className="text-right">{rupees(billTax(b))}</TD>
                      <TD className="text-right font-medium">{rupees(b.total)}</TD>
                      <TD>{b.itcEligible
                        ? <Badge tone="green"><ShieldCheck className="h-3.5 w-3.5" /> Eligible</Badge>
                        : <Badge tone="gray"><ShieldAlert className="h-3.5 w-3.5" /> Blocked</Badge>}</TD>
                      <TD>
                        <div className="flex items-center justify-end">
                          <button onClick={() => onDelete(b)} className="btn-ghost p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Reveal>
      )}

      {tab === 'recon' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={generateSample} loading={busy}><FileInput className="h-4 w-4" /> Generate sample GSTR-2B</Button>
            <Button onClick={runReconcile} loading={reconLoading}><RefreshCw className="h-4 w-4" /> Run reconciliation</Button>
          </div>

          {s && s.hardBlockRisk && (
            <Reveal>
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm leading-snug">
                  <span className="font-semibold">{rupees(s.atRiskItc)}</span> of ITC is in your books but missing in GSTR-2B — under the April 2026 rule this can block your GSTR-3B filing. Chase these suppliers.
                </p>
              </div>
            </Reveal>
          )}

          {recon && (
            <Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {STAT_CARDS.map((c) => (
                  <Card key={c.label} className="p-4">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ring-inset ${c.tone}`}>{c.icon}</span>
                    <p className="mt-3 text-lg font-semibold text-ink leading-none">{c.value}</p>
                    <p className="mt-1 text-xs text-ink-muted">{c.label}</p>
                  </Card>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal>
            <Card>
              {reconLoading && !recon ? (
                <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : !recon || recon.rows.length === 0 ? (
                <EmptyState
                  icon={<PackageSearch className="h-6 w-6" />}
                  title="Nothing to reconcile yet"
                  description="Add purchase bills for this period, generate the sample GSTR-2B, then run reconciliation to see matched, mismatched and at-risk ITC."
                >
                  <Button className="mt-6" variant="secondary" onClick={generateSample} loading={busy}><FileInput className="h-4 w-4" /> Generate sample GSTR-2B</Button>
                </EmptyState>
              ) : (
                <Table>
                  <THead>
                    <TH>Status</TH><TH>Vendor</TH><TH>GSTIN</TH><TH>Bill #</TH><TH>Date</TH>
                    <TH className="text-right">Books tax</TH><TH className="text-right">2B tax</TH><TH className="text-right">Diff</TH>
                  </THead>
                  <tbody>
                    {recon.rows.map((r, i) => (
                      <TR key={`${r.billId ?? 'x'}-${i}`}>
                        <TD><Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge></TD>
                        <TD className="text-ink">{r.vendorName || <span className="text-ink-faint">—</span>}</TD>
                        <TD>{r.vendorGstin ? <span className="font-mono text-xs text-ink-muted">{r.vendorGstin}</span> : <span className="text-ink-faint">—</span>}</TD>
                        <TD><span className="font-mono text-xs text-ink">{r.billNumber || '—'}</span></TD>
                        <TD>{r.billDate ? formatDate(r.billDate) : <span className="text-ink-faint">—</span>}</TD>
                        <TD className="text-right">{rupees(r.booksTax)}</TD>
                        <TD className="text-right">{rupees(r.portalTax)}</TD>
                        <TD className="text-right font-medium">{rupees(r.diff)}</TD>
                      </TR>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Reveal>
        </div>
      )}

      {/* Add bill */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Add purchase bill"
        subtitle="Record a vendor bill to claim input tax credit for this period."
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="bill-form" type="submit" loading={saving}>Add bill</Button>
        </>}
      >
        <form id="bill-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vendor name" required value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} placeholder="Acme Supplies Pvt Ltd" maxLength={160} />
            <Input label="Vendor GSTIN" value={form.vendorGstin} onChange={(e) => setForm({ ...form, vendorGstin: e.target.value })} placeholder="27ABCDE1234F1Z5" maxLength={15} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Bill number" required value={form.billNumber} onChange={(e) => setForm({ ...form, billNumber: e.target.value })} placeholder="INV-2045" maxLength={60} />
            <Input label="Bill date" type="date" required value={form.billDate} onChange={(e) => setForm({ ...form, billDate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </Select>
            <Select label="ITC eligible" value={form.itcEligible ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, itcEligible: e.target.value === 'yes' })}>
              <option value="yes">Yes — claim ITC</option>
              <option value="no">No — blocked credit</option>
            </Select>
          </div>
          <Input label="Taxable value (₹)" required value={form.taxableValue} onChange={(e) => setForm({ ...form, taxableValue: e.target.value })} placeholder="100000" maxLength={20} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="CGST (₹)" value={form.cgst} onChange={(e) => setForm({ ...form, cgst: e.target.value })} placeholder="9000" maxLength={20} />
            <Input label="SGST (₹)" value={form.sgst} onChange={(e) => setForm({ ...form, sgst: e.target.value })} placeholder="9000" maxLength={20} />
            <Input label="IGST (₹)" value={form.igst} onChange={(e) => setForm({ ...form, igst: e.target.value })} placeholder="0" maxLength={20} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="field min-h-[64px] resize-y" value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Purchase order ref, remarks…" maxLength={500} />
          </div>
        </form>
      </Drawer>
    </div>
  );
}
