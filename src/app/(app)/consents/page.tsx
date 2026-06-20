'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Ban } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Consent, Client, CreateConsentInput } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const BASIS_LABEL: Record<string, string> = {
  consent: 'Consent', contract: 'Contract', legal_obligation: 'Legal obligation', legitimate_use: 'Legitimate use',
};
const empty: CreateConsentInput = { clientId: '', dataPrincipal: '', purpose: 'Invoicing & GST/FEMA compliance', basis: 'consent', notes: '' };

export default function ConsentsPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Consent[] | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateConsentInput>(empty);
  const [saving, setSaving] = useState(false);

  function load() { api.consents.list().then((p) => setRows(p.items)).catch(() => setRows([])); }
  useEffect(() => { load(); api.clients.list(1, 200).then((p) => setClients(p.items)).catch(() => {}); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.purpose.trim()) { notify('error', 'Describe the purpose'); return; }
    setSaving(true);
    try {
      await api.consents.create({
        clientId: form.clientId || undefined, dataPrincipal: form.dataPrincipal || undefined,
        purpose: form.purpose.trim(), basis: form.basis, notes: form.notes || undefined,
      });
      notify('success', 'Consent recorded'); setOpen(false); setForm(empty); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not record'); }
    finally { setSaving(false); }
  }

  async function withdraw(c: Consent) {
    if (!confirm(`Withdraw consent for "${c.purpose}"?`)) return;
    try { await api.consents.withdraw(c.id); notify('success', 'Consent withdrawn'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not withdraw'); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Setup"
        title="Consent register"
        subtitle="Record the lawful basis and consent for processing client data — your DPDP Act audit log."
        icon={<ShieldCheck className="h-5 w-5" />}
        action={<Button onClick={() => { setForm(empty); setOpen(true); }}><Plus className="h-4 w-4" /> Record consent</Button>}
      />

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<ShieldCheck className="h-6 w-6" />} title="No consents recorded" description="Log each purpose you process client data for, and the lawful basis — exportable for DPDP audits.">
              <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Record consent</Button>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Data principal</TH><TH>Purpose</TH><TH>Basis</TH><TH>Status</TH><TH>Granted</TH><TH /></THead>
              <tbody>
                {rows.map((c) => (
                  <TR key={c.id}>
                    <TD className="text-ink">{c.dataPrincipal ?? <span className="text-ink-faint">—</span>}</TD>
                    <TD><span className="block max-w-[260px] truncate" title={c.purpose}>{c.purpose}</span></TD>
                    <TD><span className="text-sm text-ink-muted">{BASIS_LABEL[c.basis] ?? c.basis}</span></TD>
                    <TD>{c.status === 'active' ? <Badge tone="green">Active</Badge> : c.status === 'withdrawn' ? <Badge tone="red">Withdrawn</Badge> : <Badge tone="gray">Expired</Badge>}</TD>
                    <TD>{formatDate(c.grantedAt)}</TD>
                    <TD className="text-right">{c.status === 'active' && <button onClick={() => withdraw(c)} className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:underline"><Ban className="h-3.5 w-3.5" /> Withdraw</button>}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title="Record consent"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="consent-form" type="submit" loading={saving}>Record</Button></>}>
        <form id="consent-form" onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Client (optional)" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">— none —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Lawful basis" value={form.basis} onChange={(e) => setForm({ ...form, basis: e.target.value })}>
              <option value="consent">Consent</option>
              <option value="contract">Contract</option>
              <option value="legal_obligation">Legal obligation</option>
              <option value="legitimate_use">Legitimate use</option>
            </Select>
          </div>
          <Input label="Data principal (if not a client)" value={form.dataPrincipal} onChange={(e) => setForm({ ...form, dataPrincipal: e.target.value })} placeholder="Name or email" />
          <Input label="Purpose" required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Invoicing & GST/FEMA compliance" />
          <div>
            <label className="label">Notes</label>
            <textarea className="field min-h-[72px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Retention period, scope, how consent was obtained…" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
