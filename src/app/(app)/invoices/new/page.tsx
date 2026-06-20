'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, FileText, Users, Building2, Globe } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { Client, CreateInvoiceItemInput } from '@/lib/types';
import { CURRENCIES, SAC_CODES, GST_RATES, DEFAULT_GST_RATE } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CompliancePreview } from '@/components/invoices/CompliancePreview';
import { Reveal } from '@/components/motion/Reveal';

interface Line extends CreateInvoiceItemInput { _id: number; }
const newLine = (sac: string, gstRate: number): Line => ({ _id: Date.now() + Math.random(), description: '', sacCode: sac, quantity: 1, unitAmount: 0, gstRate });

export default function NewInvoicePage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const defaultSac = user?.defaultSac || '998314';
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<Line[]>([newLine('998314', DEFAULT_GST_RATE)]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.clients.list().then((p) => { setClients(p.items); if (p.items[0]) setClientId(p.items[0].id); }).catch(() => {});
  }, []);

  const client = clients.find((c) => c.id === clientId);
  const isDomestic = client?.type === 'domestic';

  // Domestic invoices are always INR.
  useEffect(() => { if (isDomestic) setCurrency('INR'); else if (currency === 'INR') setCurrency('USD'); }, [isDomestic]); // eslint-disable-line

  const subtotal = useMemo(() => lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitAmount) || 0), 0), [lines]);
  const previewLines = lines.map((l) => ({ lineTotal: (Number(l.quantity) || 0) * (Number(l.unitAmount) || 0), gstRate: l.gstRate ?? 0 }));

  function updateLine(id: number, patch: Partial<Line>) { setLines((ls) => ls.map((l) => (l._id === id ? { ...l, ...patch } : l))); }
  function removeLine(id: number) { setLines((ls) => (ls.length === 1 ? ls : ls.filter((l) => l._id !== id))); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) { notify('error', 'Select a client first'); return; }
    if (lines.some((l) => !l.description.trim())) { notify('error', 'Each line needs a description'); return; }
    if (subtotal <= 0) { notify('error', 'Invoice total must be greater than zero'); return; }
    if (isDomestic && !user?.gstin) { notify('error', 'Add your GSTIN in Business profile before raising a domestic invoice'); return; }
    setSaving(true);
    try {
      const inv = await api.invoices.create({
        clientId, currency: isDomestic ? 'INR' : currency, invoiceDate,
        items: lines.map((l) => ({
          description: l.description, sacCode: l.sacCode,
          quantity: Number(l.quantity), unitAmount: Number(l.unitAmount),
          gstRate: isDomestic ? (l.gstRate ?? DEFAULT_GST_RATE) : undefined,
        })),
      });
      notify('success', `Invoice ${inv.number} created — PDF is generating`);
      router.push(`/invoices/${inv.id}`);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not create invoice');
      setSaving(false);
    }
  }

  if (clients.length === 0) {
    return (
      <div>
        <PageHeader title="New invoice" eyebrow="Workspace" icon={<FileText className="h-5 w-5" />} />
        <Reveal>
          <Card><CardBody className="text-center py-14">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-black/5 mb-4"><Users className="h-6 w-6" /></span>
            <h3 className="font-semibold text-ink">Add a client first</h3>
            <p className="text-sm text-ink-muted mt-1.5 max-w-sm mx-auto">You need at least one client (foreign or domestic) before raising an invoice.</p>
            <Link href="/clients" className="btn-primary mt-5 inline-flex"><Plus className="h-4 w-4" /> Add a client</Link>
          </CardBody></Card>
        </Reveal>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"><ArrowLeft className="h-4 w-4" /> Invoices</Link>
      <PageHeader
        eyebrow={isDomestic ? 'New domestic invoice' : 'New export invoice'}
        title="Create invoice"
        subtitle={isDomestic ? 'GST (CGST+SGST or IGST) is computed automatically.' : 'Compliance fields fill themselves — focus on the work and the amount.'}
        icon={isDomestic ? <Building2 className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
        action={<Button type="submit" loading={saving}><FileText className="h-4 w-4" /> Create invoice</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Reveal>
            <Card>
              <CardHeader title="Details" action={client && (isDomestic ? <Badge tone="blue">Domestic · GST</Badge> : <Badge tone="green">Export · 0% IGST</Badge>)} />
              <CardBody className="grid gap-4 sm:grid-cols-2">
                <Select label="Client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type === 'domestic' ? 'Domestic' : c.country})</option>)}
                </Select>
                <Input label="Invoice date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                {isDomestic ? (
                  <Input label="Currency" value="INR" disabled hint="Domestic invoices are billed in INR." />
                ) : (
                  <Select label="Billing currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                )}
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card>
              <CardHeader title="Line items" action={<button type="button" onClick={() => setLines((ls) => [...ls, newLine(defaultSac, DEFAULT_GST_RATE)])} className="btn-ghost text-sm py-1.5"><Plus className="h-4 w-4" /> Add line</button>} />
              <CardBody className="space-y-4">
                {lines.map((l, idx) => {
                  const lineTotal = (Number(l.quantity) || 0) * (Number(l.unitAmount) || 0);
                  return (
                    <div key={l._id} className="rounded-xl border border-paper-border bg-paper/40 p-4 transition hover:border-brand-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-faint">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-paper-card border border-paper-border text-[10px] font-semibold text-ink-muted">{idx + 1}</span>
                          Line item
                        </span>
                        {lines.length > 1 && <button type="button" onClick={() => removeLine(l._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                      <div className="space-y-3">
                        <Input label="Description" value={l.description} onChange={(e) => updateLine(l._id, { description: e.target.value })} placeholder="e.g. Backend API development — May 2026" />
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div className="col-span-2 sm:col-span-2">
                            <Select label={isDomestic ? 'HSN/SAC' : 'SAC'} value={l.sacCode} onChange={(e) => updateLine(l._id, { sacCode: e.target.value })}>
                              {SAC_CODES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
                            </Select>
                          </div>
                          <Input label="Qty" type="number" min={0} step="0.01" value={l.quantity} onChange={(e) => updateLine(l._id, { quantity: parseFloat(e.target.value) || 0 })} />
                          <Input label={`Unit (${isDomestic ? 'INR' : currency})`} type="number" min={0} step="0.01" value={l.unitAmount} onChange={(e) => updateLine(l._id, { unitAmount: parseFloat(e.target.value) || 0 })} />
                          {isDomestic && (
                            <Select label="GST %" value={l.gstRate} onChange={(e) => updateLine(l._id, { gstRate: parseInt(e.target.value, 10) })}>
                              {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                            </Select>
                          )}
                        </div>
                        <div className="text-right text-sm text-ink-muted">
                          Line total: <span className="font-medium text-ink">{isDomestic ? 'INR' : currency} {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          {isDomestic && (l.gstRate ?? 0) > 0 && <span className="text-ink-faint"> · +{l.gstRate}% GST</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </Reveal>
        </div>

        <CompliancePreview user={user} client={client} currency={isDomestic ? 'INR' : currency} invoiceDate={invoiceDate} subtotal={subtotal} lines={previewLines} />
      </div>
    </form>
  );
}
