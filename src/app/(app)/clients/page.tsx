'use client';
import { useEffect, useState } from 'react';
import { Users, Plus, Trash2, Pencil, Globe, Building2, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Client, CreateClientInput, ClientType } from '@/lib/types';
import { INDIA_STATES, stateNameOf } from '@/lib/types';
import { countryName, flagEmoji, formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

const emptyForm: CreateClientInput = { type: 'foreign', name: '', email: '', address: '', country: '', stateCode: '', gstin: '', customerType: 'b2b' };

export default function ClientsPage() {
  const { notify } = useToast();
  const [clients, setClients] = useState<Client[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<CreateClientInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => api.clients.list().then((p) => setClients(p.items)).catch(() => setClients([]));
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setOpen(true); }
  function openCreateType(t: 'foreign' | 'domestic') { setEditing(null); setForm({ ...emptyForm, type: t }); setOpen(true); }
  function openEdit(c: Client) {
    setEditing(c);
    setForm({
      type: c.type, name: c.name, email: c.email ?? '', address: c.address ?? '',
      country: c.country ?? '', stateCode: c.stateCode ?? '', gstin: c.gstin ?? '',
      customerType: c.customerType ?? 'b2b',
    });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.type === 'foreign' && (form.country ?? '').length !== 2) { notify('error', 'Use a 2-letter country code (e.g. US, GB)'); return; }
    if (form.type === 'domestic' && !form.stateCode) { notify('error', 'Select the client’s state'); return; }
    if (form.type === 'domestic' && form.customerType === 'b2b' && !(form.gstin ?? '').trim()) { notify('error', 'B2B clients need a GSTIN'); return; }
    setSaving(true);
    try {
      const payload: CreateClientInput = {
        type: form.type, name: form.name,
        email: form.email || undefined, address: form.address || undefined,
        ...(form.type === 'foreign'
          ? { country: form.country }
          : { stateCode: form.stateCode, customerType: form.customerType, gstin: form.customerType === 'b2b' ? form.gstin : undefined }),
      };
      if (editing) { await api.clients.update(editing.id, payload); notify('success', 'Client updated'); }
      else { await api.clients.create(payload); notify('success', 'Client added'); }
      setOpen(false); load();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not save client');
    } finally { setSaving(false); }
  }

  async function onDelete(c: Client) {
    if (!confirm(`Delete ${c.name}? Invoices already raised are kept.`)) return;
    try { await api.clients.remove(c.id); notify('success', 'Client deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        subtitle="Foreign clients (export) and Indian clients (domestic GST)."
        icon={<Users className="h-5 w-5" />}
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add client</Button>}
      />

      <Reveal>
        <Card>
          {clients === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : clients.length === 0 ? (
            <EmptyState icon={<Users className="h-6 w-6" />} title="Add your first client" description="Choose who you’re billing — Crossbill applies the right compliance for each.">
              <div className="mt-7 grid w-full max-w-xl gap-4 sm:grid-cols-2">
                {([
                  { t: 'foreign' as const, icon: Globe, title: 'Foreign client', tag: 'Export', desc: 'Bill in USD/EUR — LUT, FEMA & FIRC handled.', tone: 'from-brand-400 to-emerald-600', glow: 'brand' as const },
                  { t: 'domestic' as const, icon: Building2, title: 'Indian client', tag: 'Domestic GST', desc: 'Bill in INR — CGST/SGST or IGST, auto.', tone: 'from-cyan-400 to-teal-600', glow: 'blue' as const },
                ]).map((o) => (
                  <SpotlightCard key={o.t} glow={o.glow} onClick={() => openCreateType(o.t)} className="cursor-pointer p-5 text-left">
                    <div className="flex items-center justify-between">
                      <span className={cn('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6', o.tone)}><o.icon className="h-5 w-5" /></span>
                      <span className="badge bg-paper text-ink-muted border border-paper-border">{o.tag}</span>
                    </div>
                    <h4 className="mt-4 font-semibold text-ink flex items-center gap-1">{o.title} <Plus className="h-3.5 w-3.5 text-ink-faint opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" /></h4>
                    <p className="mt-1 text-sm text-ink-muted leading-snug">{o.desc}</p>
                  </SpotlightCard>
                ))}
              </div>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Client</TH><TH>Type</TH><TH>Location</TH><TH>Tax ID</TH><TH>Added</TH><TH /></THead>
              <tbody>
                {clients.map((c) => (
                  <TR key={c.id}>
                    <TD><div className="flex items-center gap-3"><Avatar name={c.name} /><span className="font-medium text-ink">{c.name}</span></div></TD>
                    <TD>{c.type === 'domestic'
                      ? <Badge tone="blue">Domestic · {c.customerType?.toUpperCase()}</Badge>
                      : <Badge tone="green">Export</Badge>}</TD>
                    <TD>{c.type === 'domestic'
                      ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-ink-faint" /> {stateNameOf(c.stateCode)}</span>
                      : <span className="inline-flex items-center gap-1.5">{flagEmoji(c.country ?? '')} {countryName(c.country ?? '')}</span>}</TD>
                    <TD>{c.gstin ? <span className="font-mono text-xs">{c.gstin}</span> : <span className="text-ink-faint">—</span>}</TD>
                    <TD>{formatDate(c.createdAt)}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(c)} className="btn-ghost p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit client' : 'Add client'}
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="client-form" type="submit" loading={saving}>{editing ? 'Save' : 'Add client'}</Button>
        </>}
      >
        <form id="client-form" onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Client type</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-paper border border-paper-border">
              {([['foreign', 'Foreign · Export', Globe], ['domestic', 'Indian · GST', Building2]] as [ClientType, string, any][]).map(([t, lbl, Icon]) => (
                <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                  className={cn('inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition', form.type === t ? 'bg-white shadow-card text-ink' : 'text-ink-muted hover:text-ink')}>
                  <Icon className="h-4 w-4" /> {lbl}
                </button>
              ))}
            </div>
          </div>

          <Input label="Client name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={form.type === 'foreign' ? 'Foo Inc.' : 'Acme Pvt Ltd'} />

          {form.type === 'foreign' ? (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Country code" required maxLength={2} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })} placeholder="US" prefix={<Globe className="h-4 w-4" />} hint="ISO 2-letter" />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ap@foo.com" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Customer type" value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value as any })}>
                  <option value="b2b">B2B — registered business</option>
                  <option value="b2c">B2C — unregistered</option>
                </Select>
                <Select label="State (place of supply)" value={form.stateCode} onChange={(e) => setForm({ ...form, stateCode: e.target.value })}>
                  <option value="">Select state…</option>
                  {INDIA_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
                </Select>
              </div>
              {form.customerType === 'b2b' && (
                <Input label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} placeholder="27ABCDE1234F1Z5" hint="15-character GSTIN of the client." />
              )}
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="accounts@acme.in" />
            </>
          )}

          <div>
            <label className="label">Address</label>
            <textarea className="field min-h-[64px] resize-y" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, city, state, PIN" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
