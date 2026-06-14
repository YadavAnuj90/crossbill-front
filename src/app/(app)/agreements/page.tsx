'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileSignature, Plus, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Agreement, Client, CreateAgreementInput } from '@/lib/types';
import { AGREEMENT_CATEGORIES } from '@/lib/types';
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

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  draft: 'gray', sent: 'blue', viewed: 'amber', signed: 'green', declined: 'red', voided: 'gray',
};

const empty: CreateAgreementInput = { title: '', category: 'nda', body: '', clientId: '' };

export default function AgreementsPage() {
  const { notify } = useToast();
  const router = useRouter();
  const [rows, setRows] = useState<Agreement[] | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateAgreementInput>(empty);
  const [saving, setSaving] = useState(false);

  function load() { api.agreements.list().then((p) => setRows(p.items)).catch(() => setRows([])); }
  useEffect(() => { load(); api.clients.list(1, 200).then((p) => setClients(p.items)).catch(() => {}); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { notify('error', 'Give the agreement a title'); return; }
    setSaving(true);
    try {
      const a = await api.agreements.create({
        title: form.title.trim(), category: form.category,
        body: form.body || undefined, clientId: form.clientId || undefined,
      });
      notify('success', 'Agreement created'); setOpen(false); setForm(empty);
      router.push(`/agreements/${a.id}`);
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not create'); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Agreements"
        subtitle="Send NDAs, MSAs and engagement letters for a legally-valid e-signature with audit trail."
        icon={<FileSignature className="h-5 w-5" />}
        action={<Button onClick={() => { setForm(empty); setOpen(true); }}><Plus className="h-4 w-4" /> New agreement</Button>}
      />

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<FileSignature className="h-6 w-6" />} title="Create your first agreement" description="Draft a contract, send it to your client, and collect a signed PDF with a tamper-evident audit trail.">
              <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New agreement</Button>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Title</TH><TH>Type</TH><TH>Signer</TH><TH>Status</TH><TH>Updated</TH><TH /></THead>
              <tbody>
                {rows.map((a) => (
                  <TR key={a.id}>
                    <TD><Link href={`/agreements/${a.id}`} className="font-medium text-ink hover:text-brand-700">{a.title}</Link></TD>
                    <TD><span className="uppercase text-xs text-ink-muted">{a.category}</span></TD>
                    <TD>{a.signerName ?? a.clientName ?? <span className="text-ink-faint">—</span>}</TD>
                    <TD><Badge tone={STATUS_TONE[a.status] ?? 'gray'}>{a.status === 'signed' && <ShieldCheck className="h-3.5 w-3.5" />} {a.status}</Badge></TD>
                    <TD>{formatDate(a.updatedAt)}</TD>
                    <TD className="text-right"><Link href={`/agreements/${a.id}`} className="text-sm text-brand-700 hover:underline">Open</Link></TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title="New agreement"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="agr-form" type="submit" loading={saving}>Create</Button></>}>
        <form id="agr-form" onSubmit={create} className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Mutual NDA — Foo Inc." />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {AGREEMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </Select>
            <Select label="Client (optional)" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">— none —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="label">Body / terms</label>
            <textarea className="field min-h-[160px] resize-y" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Paste or write the agreement text. It will be rendered into the signed PDF." />
          </div>
        </form>
      </Modal>
    </div>
  );
}
