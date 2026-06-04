'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, FileText, Users } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { Client, CreateInvoiceItemInput } from '@/lib/types';
import { CURRENCIES, SAC_CODES } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CompliancePreview } from '@/components/invoices/CompliancePreview';

interface Line extends CreateInvoiceItemInput { _id: number; }
const newLine = (sac: string): Line => ({ _id: Date.now() + Math.random(), description: '', sacCode: sac, quantity: 1, unitAmount: 0 });

export default function NewInvoicePage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const defaultSac = user?.defaultSac || '998314';
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<Line[]>([newLine('998314')]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.clients.list().then((p) => { setClients(p.items); if (p.items[0]) setClientId(p.items[0].id); }).catch(() => {});
  }, []);
  useEffect(() => { setLines((ls) => ls.map((l) => (l.description === '' && l.unitAmount === 0 ? { ...l, sacCode: defaultSac } : l))); }, [defaultSac]);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitAmount) || 0), 0), [lines]);

  function updateLine(id: number, patch: Partial<Line>) { setLines((ls) => ls.map((l) => (l._id === id ? { ...l, ...patch } : l))); }
  function removeLine(id: number) { setLines((ls) => (ls.length === 1 ? ls : ls.filter((l) => l._id !== id))); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) { notify('error', 'Select a client first'); return; }
    if (lines.some((l) => !l.description.trim())) { notify('error', 'Each line needs a description'); return; }
    if (subtotal <= 0) { notify('error', 'Invoice total must be greater than zero'); return; }
    setSaving(true);
    try {
      const inv = await api.invoices.create({
        clientId, currency, invoiceDate,
        items: lines.map((l) => ({ description: l.description, sacCode: l.sacCode, quantity: Number(l.quantity), unitAmount: Number(l.unitAmount) })),
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
        <PageHeader title="New invoice" />
        <Card><CardBody className="text-center py-14">
          <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-brand-50 text-brand-600 mb-4"><Users className="h-6 w-6" /></span>
          <h3 className="font-semibold text-ink">Add a client first</h3>
          <p className="text-sm text-ink-muted mt-1.5 max-w-sm mx-auto">You need at least one foreign client before raising an export invoice.</p>
          <Link href="/clients" className="btn-primary mt-5 inline-flex"><Plus className="h-4 w-4" /> Add a client</Link>
        </CardBody></Card>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Link href="/invoices" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4"><ArrowLeft className="h-4 w-4" /> Invoices</Link>
      <PageHeader title="New export invoice" subtitle="Compliance fields fill themselves — focus on the work and the amount." action={<Button type="submit" loading={saving}><FileText className="h-4 w-4" /> Create invoice</Button>} />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Details" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Select label="Client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.country})</option>)}
              </Select>
              <Input label="Invoice date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              <Select label="Billing currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Line items" action={<button type="button" onClick={() => setLines((ls) => [...ls, newLine(defaultSac)])} className="btn-ghost text-sm py-1.5"><Plus className="h-4 w-4" /> Add line</button>} />
            <CardBody className="space-y-4">
              {lines.map((l, idx) => (
                <div key={l._id} className="rounded-xl border border-paper-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-ink-faint">Line {idx + 1}</span>
                    {lines.length > 1 && <button type="button" onClick={() => removeLine(l._id)} className="text-red-500 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                  <div className="space-y-3">
                    <Input label="Description" value={l.description} onChange={(e) => updateLine(l._id, { description: e.target.value })} placeholder="e.g. Backend API development — May 2026" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="col-span-2 sm:col-span-2">
                        <Select label="SAC" value={l.sacCode} onChange={(e) => updateLine(l._id, { sacCode: e.target.value })}>
                          {SAC_CODES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
                        </Select>
                      </div>
                      <Input label="Qty" type="number" min={0} step="0.01" value={l.quantity} onChange={(e) => updateLine(l._id, { quantity: parseFloat(e.target.value) || 0 })} />
                      <Input label={`Unit (${currency})`} type="number" min={0} step="0.01" value={l.unitAmount} onChange={(e) => updateLine(l._id, { unitAmount: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="text-right text-sm text-ink-muted">Line total: <span className="font-medium text-ink">{currency} {((Number(l.quantity) || 0) * (Number(l.unitAmount) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <CompliancePreview user={user} currency={currency} invoiceDate={invoiceDate} subtotal={subtotal} />
      </div>
    </form>
  );
}
