'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileBadge, Plus, Download, Trash2, Send, Check, X, Users,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, HrLetter, CreateLetterInput } from '@/lib/types';
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

const KIND_LABEL: Record<string, string> = { offer: 'Offer letter', experience: 'Experience certificate', relieving: 'Relieving letter' };
const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = { draft: 'gray', sent: 'blue', accepted: 'green', rejected: 'red', expired: 'amber' };

const empty: CreateLetterInput = { employeeId: '', kind: 'offer', designation: '', department: '', joiningDate: '', ctc: '', reportingManager: '', fromDate: '', toDate: '' };

export default function LettersPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<HrLetter[] | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [kindFilter, setKindFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateLetterInput>(empty);
  const [saving, setSaving] = useState(false);

  function load() { api.letters.list(kindFilter).then(setRows).catch(() => setRows([])); }
  useEffect(() => { load(); api.employees.list('', '', '').then((p) => setEmployees(p.items)).catch(() => {}); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [kindFilter]);

  const empMap = useMemo(() => { const m: Record<string, Employee> = {}; employees.forEach((e) => { m[e.id] = e; }); return m; }, [employees]);

  function pickEmployee(id: string) {
    const e = empMap[id];
    setForm((f) => ({
      ...f, employeeId: id,
      designation: e?.designation ?? '', department: e?.department ?? '',
      joiningDate: e?.joiningDate ? e.joiningDate.slice(0, 10) : '',
      ctc: e?.ctcAnnual && e.ctcAnnual !== '0.00' ? e.ctcAnnual : '',
      reportingManager: e?.reportingManager ?? '',
      fromDate: e?.joiningDate ? e.joiningDate.slice(0, 10) : '',
    }));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId) { notify('error', 'Pick an employee'); return; }
    setSaving(true);
    try {
      await api.letters.create({
        ...form,
        designation: form.designation || undefined, department: form.department || undefined,
        joiningDate: form.joiningDate || undefined, ctc: form.ctc || undefined,
        reportingManager: form.reportingManager || undefined, fromDate: form.fromDate || undefined, toDate: form.toDate || undefined,
      });
      notify('success', 'Letter generated'); setOpen(false); setForm(empty); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not generate'); }
    finally { setSaving(false); }
  }

  async function openPdf(l: HrLetter) {
    try { const fresh = await api.letters.get(l.id); if (fresh.pdfUrl) window.open(fresh.pdfUrl, '_blank'); else notify('info', 'PDF still generating'); }
    catch { notify('info', 'PDF still generating — try again'); }
  }
  async function setStatus(l: HrLetter, status: 'sent' | 'accepted' | 'rejected') {
    try { await api.letters.setStatus(l.id, status); notify('success', `Marked ${status}`); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }
  async function remove(l: HrLetter) {
    if (!confirm(`Delete this ${KIND_LABEL[l.kind]}?`)) return;
    try { await api.letters.remove(l.id); notify('success', 'Deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }

  const isOffer = form.kind === 'offer';
  const isExp = form.kind === 'experience';

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="HR letters"
        subtitle="Generate offer, experience and relieving letters from employee records."
        icon={<FileBadge className="h-5 w-5" />}
        action={<Button onClick={() => { setForm(empty); setOpen(true); }}><Plus className="h-4 w-4" /> New letter</Button>}
      />

      <div className="mb-4 flex items-center gap-2">
        <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} className="field max-w-[220px]">
          <option value="">All letters</option>
          <option value="offer">Offer letters</option>
          <option value="experience">Experience certificates</option>
          <option value="relieving">Relieving letters</option>
        </select>
      </div>

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<FileBadge className="h-6 w-6" />} title="No letters yet" description="Generate a branded offer, experience or relieving letter from an employee's record.">
              {employees.length === 0
                ? <Link href="/employees" className="btn-primary mt-6"><Users className="h-4 w-4" /> Add employees first</Link>
                : <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New letter</Button>}
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Employee</TH><TH>Type</TH><TH>Status</TH><TH>Created</TH><TH className="text-right">Actions</TH></THead>
              <tbody>
                {rows.map((l) => (
                  <TR key={l.id}>
                    <TD className="text-ink font-medium">{l.employeeName}</TD>
                    <TD>{KIND_LABEL[l.kind] ?? l.kind}</TD>
                    <TD><Badge tone={STATUS_TONE[l.status] ?? 'gray'}>{l.status}</Badge></TD>
                    <TD>{formatDate(l.createdAt)}</TD>
                    <TD className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => openPdf(l)} className="btn-ghost text-sm py-1.5 text-brand-700"><Download className="h-4 w-4" /> PDF</button>
                        {l.kind === 'offer' && l.status === 'draft' && <button onClick={() => setStatus(l, 'sent')} className="btn-ghost text-sm py-1.5"><Send className="h-4 w-4" /> Send</button>}
                        {l.kind === 'offer' && l.status === 'sent' && (
                          <>
                            <button onClick={() => setStatus(l, 'accepted')} className="btn-ghost text-sm py-1.5 text-brand-700"><Check className="h-4 w-4" /></button>
                            <button onClick={() => setStatus(l, 'rejected')} className="btn-ghost text-sm py-1.5 text-red-500"><X className="h-4 w-4" /></button>
                          </>
                        )}
                        <button onClick={() => remove(l)} className="btn-ghost p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title="New HR letter"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="letter-form" type="submit" loading={saving}>Generate</Button></>}>
        <form id="letter-form" onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Letter type" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="offer">Offer letter</option>
              <option value="experience">Experience certificate</option>
              <option value="relieving">Relieving letter</option>
            </Select>
            <Select label="Employee" value={form.employeeId} onChange={(e) => pickEmployee(e.target.value)}>
              <option value="">Select…</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Senior Engineer" />
            <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Engineering" />
          </div>
          {isOffer && (
            <div className="grid grid-cols-3 gap-4">
              <Input label="Joining date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
              <Input label="Annual CTC (₹)" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} placeholder="1200000" />
              <Input label="Reporting manager" value={form.reportingManager} onChange={(e) => setForm({ ...form, reportingManager: e.target.value })} placeholder="Name" />
            </div>
          )}
          {(isExp || form.kind === 'relieving') && (
            <div className="grid grid-cols-2 gap-4">
              {isExp && <Input label="From (joined)" type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />}
              <Input label={isExp ? 'To (last day)' : 'Last working day'} type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
            </div>
          )}
          <p className="hint">Fields prefill from the employee record — edit as needed. The letter is rendered as a branded PDF.</p>
        </form>
      </Modal>
    </div>
  );
}
