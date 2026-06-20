'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plane, Plus, Check, X, CalendarCheck } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, Leave, CreateLeaveInput } from '@/lib/types';
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

const TYPE_LABEL: Record<string, string> = { casual: 'Casual', sick: 'Sick', earned: 'Earned', unpaid: 'Unpaid' };
const STATUS_TONE: Record<string, 'gray' | 'amber' | 'green' | 'red'> = { pending: 'amber', approved: 'green', rejected: 'red' };

const empty: CreateLeaveInput = { employeeId: '', type: 'casual', from: '', to: '', reason: '' };

export default function LeavePage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Leave[] | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateLeaveInput>(empty);
  const [saving, setSaving] = useState(false);

  function load() { api.leaves.list(statusFilter).then(setRows).catch(() => setRows([])); }
  useEffect(() => { load(); api.employees.list('', '', '').then((p) => setEmployees(p.items)).catch(() => {}); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [statusFilter]);

  const empName = useMemo(() => {
    const m: Record<string, string> = {};
    employees.forEach((e) => { m[e.id] = `${e.firstName} ${e.lastName ?? ''}`.trim(); });
    return m;
  }, [employees]);

  async function request(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId) { notify('error', 'Pick an employee'); return; }
    if (!form.from || !form.to) { notify('error', 'Select the dates'); return; }
    if (form.to < form.from) { notify('error', 'End date is before start date'); return; }
    setSaving(true);
    try {
      await api.leaves.request({ ...form, reason: form.reason || undefined });
      notify('success', 'Leave requested'); setOpen(false); setForm(empty); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not request'); }
    finally { setSaving(false); }
  }

  async function decide(l: Leave, decision: 'approved' | 'rejected') {
    try { await api.leaves.decide(l.id, decision); notify('success', `Leave ${decision}`); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Leave"
        subtitle="Request leave and approve your team's time off."
        icon={<Plane className="h-5 w-5" />}
        action={<div className="flex items-center gap-2"><Link href="/attendance" className="btn-secondary"><CalendarCheck className="h-4 w-4" /> Attendance</Link><Button onClick={() => { setForm(empty); setOpen(true); }}><Plus className="h-4 w-4" /> Request leave</Button></div>}
      />

      <div className="mb-4 flex items-center gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field max-w-[200px]">
          <option value="">All requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<Plane className="h-6 w-6" />} title="No leave requests" description="Requests appear here for approval, with a running history.">
              <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Request leave</Button>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Employee</TH><TH>Type</TH><TH>Dates</TH><TH className="text-right">Days</TH><TH>Reason</TH><TH>Status</TH><TH className="text-right">Action</TH></THead>
              <tbody>
                {rows.map((l) => (
                  <TR key={l.id}>
                    <TD className="text-ink">{empName[l.employeeId] ?? l.employeeId}</TD>
                    <TD>{TYPE_LABEL[l.type] ?? l.type}</TD>
                    <TD className="text-sm">{formatDate(l.from)} → {formatDate(l.to)}</TD>
                    <TD className="text-right">{l.days}</TD>
                    <TD><span className="block max-w-[200px] truncate text-sm" title={l.reason ?? ''}>{l.reason ?? '—'}</span></TD>
                    <TD><Badge tone={STATUS_TONE[l.status] ?? 'gray'}>{l.status}</Badge></TD>
                    <TD className="text-right">
                      {l.status === 'pending' ? (
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => decide(l, 'approved')} className="btn-ghost text-sm py-1.5 text-brand-700"><Check className="h-4 w-4" /> Approve</button>
                          <button onClick={() => decide(l, 'rejected')} className="btn-ghost text-sm py-1.5 text-red-500"><X className="h-4 w-4" /> Reject</button>
                        </div>
                      ) : <span className="text-xs text-ink-faint">{l.decidedAt ? formatDate(l.decidedAt) : ''}</span>}
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title="Request leave"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="leave-form" type="submit" loading={saving}>Submit</Button></>}>
        <form id="leave-form" onSubmit={request} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Employee" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select…</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </Select>
            <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['casual', 'sick', 'earned', 'unpaid'].map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="From" type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            <Input label="To" type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
          </div>
          <div>
            <label className="label">Reason</label>
            <textarea className="field min-h-[64px] resize-y" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Optional note" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
