'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutTemplate, Plus, Trash2, FilePlus2, Send, ArrowLeft, Copy, Check, X,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { AgreementTemplate, Client, BulkRecipientInput, BulkSendResult } from '@/lib/types';
import { AGREEMENT_CATEGORIES } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { waShareUrl } from '@/lib/share';
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

const FIELD_RE = /\{\{\s*([\w.-]+)\s*\}\}/g;
function detectFields(body: string): string[] {
  const out = new Set<string>(); let m: RegExpExecArray | null; FIELD_RE.lastIndex = 0;
  while ((m = FIELD_RE.exec(body)) !== null) out.add(m[1]);
  return [...out];
}

export default function TemplatesPage() {
  const { notify } = useToast();
  const router = useRouter();
  const [rows, setRows] = useState<AgreementTemplate[] | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  // create
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('nda');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  // bulk send
  const [bulkFor, setBulkFor] = useState<AgreementTemplate | null>(null);

  function load() { api.agreementTemplates.list().then((p) => setRows(p.items)).catch(() => setRows([])); }
  useEffect(() => { load(); api.clients.list(1, 200).then((p) => setClients(p.items)).catch(() => {}); }, []);

  const detected = useMemo(() => detectFields(body), [body]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) { notify('error', 'Name and body are required'); return; }
    setSaving(true);
    try {
      await api.agreementTemplates.create({ name: name.trim(), category, body });
      notify('success', 'Template saved'); setOpen(false); setName(''); setBody(''); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not save'); }
    finally { setSaving(false); }
  }

  async function useTemplate(t: AgreementTemplate) {
    try {
      const a = await api.agreementTemplates.use(t.id, {});
      notify('success', 'Draft created from template');
      router.push(`/agreements/${a.id}`);
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not create'); }
  }

  async function remove(t: AgreementTemplate) {
    if (!confirm(`Delete template "${t.name}"?`)) return;
    try { await api.agreementTemplates.remove(t.id); notify('success', 'Deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  return (
    <div>
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"><ArrowLeft className="h-4 w-4" /> Agreements</Link>
      <PageHeader
        eyebrow="Automation"
        title="Templates"
        subtitle="Reusable agreements with {{merge_fields}} — create one or send to many signers at once."
        icon={<LayoutTemplate className="h-5 w-5" />}
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New template</Button>}
      />

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<LayoutTemplate className="h-6 w-6" />} title="No templates yet" description="Save a reusable agreement once, then generate or bulk-send it with merge fields filled in.">
              <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New template</Button>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Template</TH><TH>Type</TH><TH>Merge fields</TH><TH>Created</TH><TH /></THead>
              <tbody>
                {rows.map((t) => (
                  <TR key={t.id}>
                    <TD className="font-medium text-ink">{t.name}</TD>
                    <TD><span className="uppercase text-xs text-ink-muted">{t.category}</span></TD>
                    <TD>{t.fields.length === 0 ? <span className="text-ink-faint text-sm">—</span> : <div className="flex flex-wrap gap-1">{t.fields.map((f) => <span key={f} className="rounded bg-paper px-1.5 py-0.5 text-[11px] font-mono text-ink-muted">{f}</span>)}</div>}</TD>
                    <TD>{formatDate(t.createdAt)}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => useTemplate(t)} className="btn-ghost text-sm py-1.5" title="Create a draft"><FilePlus2 className="h-4 w-4" /> Use</button>
                        <button onClick={() => setBulkFor(t)} className="btn-ghost text-sm py-1.5" title="Send to many"><Send className="h-4 w-4" /> Bulk send</button>
                        <button onClick={() => remove(t)} className="btn-ghost p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      {/* Create template */}
      <Modal open={open} onClose={() => setOpen(false)} title="New template"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="tpl-form" type="submit" loading={saving}>Save template</Button></>}>
        <form id="tpl-form" onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Template name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Standard NDA" />
            <Select label="Type" value={category} onChange={(e) => setCategory(e.target.value)}>
              {AGREEMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </Select>
          </div>
          <div>
            <label className="label">Body</label>
            <textarea className="field min-h-[200px] resize-y font-mono text-sm" value={body} onChange={(e) => setBody(e.target.value)} placeholder={'Use {{client_name}}, {{amount}}, {{date}} as merge fields.\n\nThis NDA is entered into between {{seller}} and {{client_name}} on {{date}}...'} />
            <p className="hint mt-1.5">Wrap merge fields in double braces, e.g. <code className="font-mono">{'{{client_name}}'}</code>.</p>
          </div>
          {detected.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-ink-muted mb-1.5">Detected fields</p>
              <div className="flex flex-wrap gap-1.5">{detected.map((f) => <span key={f} className="rounded-md bg-brand-50 px-2 py-1 text-xs font-mono text-brand-700 ring-1 ring-inset ring-brand-200">{f}</span>)}</div>
            </div>
          )}
        </form>
      </Modal>

      {bulkFor && <BulkSendModal template={bulkFor} clients={clients} onClose={() => setBulkFor(null)} />}
    </div>
  );
}

function BulkSendModal({ template, clients, onClose }: { template: AgreementTemplate; clients: Client[]; onClose: () => void }) {
  const { notify } = useToast();
  const [recipients, setRecipients] = useState<BulkRecipientInput[]>([{ signerName: '', signerEmail: '', values: {} }]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BulkSendResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function setRow(i: number, patch: Partial<BulkRecipientInput>) {
    setRecipients((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function setVal(i: number, field: string, v: string) {
    setRecipients((rs) => rs.map((r, idx) => (idx === i ? { ...r, values: { ...(r.values ?? {}), [field]: v } } : r)));
  }
  function addRow() { setRecipients((rs) => [...rs, { signerName: '', signerEmail: '', values: {} }]); }
  function removeRow(i: number) { setRecipients((rs) => rs.filter((_, idx) => idx !== i)); }

  async function send() {
    const valid = recipients.filter((r) => r.signerName.trim() && r.signerEmail.includes('@'));
    if (valid.length === 0) { notify('error', 'Add at least one signer with a valid email'); return; }
    setBusy(true);
    try {
      const res = await api.agreementTemplates.bulkSend(template.id, { recipients: valid });
      setResult(res);
      notify('success', `Sent ${res.sent} of ${res.total}`);
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Bulk send failed'); }
    finally { setBusy(false); }
  }

  async function copy(url: string, id: string) {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(null), 1500);
  }

  return (
    <Modal open onClose={onClose} title={`Bulk send · ${template.name}`}
      footer={result
        ? <Button onClick={onClose}>Done</Button>
        : <><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={send} loading={busy}><Send className="h-4 w-4" /> Send to {recipients.length}</Button></>}>
      {result ? (
        <div className="space-y-2">
          <p className="text-sm text-ink-muted">{result.sent} of {result.total} sent. Share each link:</p>
          {result.results.map((r) => (
            <div key={r.signerEmail} className="flex items-center gap-2 rounded-lg border border-paper-border p-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">{r.signerEmail}</p>
                {r.status === 'sent' && r.signUrl ? <p className="text-[11px] font-mono text-ink-faint truncate">{r.signUrl}</p> : <p className="text-[11px] text-red-500">{r.error ?? 'failed'}</p>}
              </div>
              {r.status === 'sent' && r.signUrl && (
                <>
                  <button onClick={() => copy(r.signUrl!, r.signerEmail)} className="btn-ghost text-xs py-1">{copied === r.signerEmail ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>
                  <a href={waShareUrl(`Please sign "${template.name}": ${r.signUrl}`)} target="_blank" rel="noreferrer" className="btn-ghost text-xs py-1">WA</a>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-ink-muted">Each signer gets their own agreement from this template{template.fields.length > 0 ? ', with their values merged in.' : '.'}</p>
          {recipients.map((r, i) => (
            <div key={i} className="rounded-xl border border-paper-border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input className="field py-2 text-sm" placeholder="Signer name" value={r.signerName} onChange={(e) => setRow(i, { signerName: e.target.value })} />
                <input className="field py-2 text-sm" placeholder="email@client.com" value={r.signerEmail} onChange={(e) => setRow(i, { signerEmail: e.target.value })} />
                {recipients.length > 1 && <button onClick={() => removeRow(i)} className="btn-ghost p-2 text-red-500"><X className="h-4 w-4" /></button>}
              </div>
              {template.fields.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {template.fields.map((f) => (
                    <input key={f} className="field py-1.5 text-sm" placeholder={f} value={r.values?.[f] ?? ''} onChange={(e) => setVal(i, f, e.target.value)} />
                  ))}
                </div>
              )}
            </div>
          ))}
          <button onClick={addRow} className="btn-ghost text-sm"><Plus className="h-4 w-4" /> Add signer</button>
        </div>
      )}
    </Modal>
  );
}
