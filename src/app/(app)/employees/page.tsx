'use client';
import { useEffect, useState } from 'react';
import {
  Users, Plus, Pencil, Trash2, Search, Building2, BadgeCheck, Clock, LogOut,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, CreateEmployeeInput, EmployeeStats } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  onboarding: 'amber', active: 'green', on_notice: 'amber', exited: 'gray',
};
const STATUS_LABEL: Record<string, string> = {
  onboarding: 'Onboarding', active: 'Active', on_notice: 'On notice', exited: 'Exited',
};

const empty: CreateEmployeeInput = {
  empCode: '', firstName: '', lastName: '', email: '', mobile: '',
  department: '', designation: '', joiningDate: '', status: 'active',
  employmentType: 'full_time', reportingManager: '', ctcAnnual: '', address: '',
};

export default function EmployeesPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Employee[] | null>(null);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<CreateEmployeeInput>(empty);
  const [saving, setSaving] = useState(false);

  function load() {
    api.employees.list(q.trim(), '', statusFilter).then((p) => setRows(p.items)).catch(() => setRows([]));
    api.employees.stats().then(setStats).catch(() => {});
  }
  useEffect(() => { load(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [q, statusFilter]);

  function openCreate() { setEditing(null); setForm(empty); setOpen(true); }
  function openEdit(e: Employee) {
    setEditing(e);
    setForm({
      empCode: e.empCode, firstName: e.firstName, lastName: e.lastName ?? '',
      email: e.email ?? '', mobile: e.mobile ?? '', department: e.department ?? '',
      designation: e.designation ?? '', joiningDate: e.joiningDate ? e.joiningDate.slice(0, 10) : '',
      status: e.status, employmentType: e.employmentType, reportingManager: e.reportingManager ?? '',
      ctcAnnual: e.ctcAnnual ?? '', dob: e.dob ? e.dob.slice(0, 10) : '', address: e.address ?? '',
      emergencyContact: e.emergencyContact ?? '',
    });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.empCode.trim() || !form.firstName.trim()) { notify('error', 'Employee ID and first name are required'); return; }
    const payload: CreateEmployeeInput = {
      ...form,
      email: form.email || undefined, mobile: form.mobile || undefined,
      department: form.department || undefined, designation: form.designation || undefined,
      joiningDate: form.joiningDate || undefined, reportingManager: form.reportingManager || undefined,
      ctcAnnual: form.ctcAnnual || undefined, dob: form.dob || undefined,
      address: form.address || undefined, emergencyContact: form.emergencyContact || undefined,
      lastName: form.lastName || undefined,
    };
    setSaving(true);
    try {
      if (editing) { await api.employees.update(editing.id, payload); notify('success', 'Employee updated'); }
      else { await api.employees.create(payload); notify('success', 'Employee added'); }
      setOpen(false); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not save'); }
    finally { setSaving(false); }
  }

  async function onDelete(e: Employee) {
    if (!confirm(`Delete ${e.firstName} ${e.lastName ?? ''}? This removes the HR record.`)) return;
    try { await api.employees.remove(e.id); notify('success', 'Employee deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  const STAT_CARDS = stats ? [
    { label: 'Total', value: stats.total, icon: <Users className="h-5 w-5" />, tone: 'text-ink bg-paper ring-paper-border' },
    { label: 'Active', value: stats.active, icon: <BadgeCheck className="h-5 w-5" />, tone: 'text-brand-600 bg-brand-50 ring-brand-200' },
    { label: 'Onboarding', value: stats.onboarding, icon: <Clock className="h-5 w-5" />, tone: 'text-amber-600 bg-amber-50 ring-amber-200' },
    { label: 'On notice / exited', value: stats.onNotice + stats.exited, icon: <LogOut className="h-5 w-5" />, tone: 'text-ink-muted bg-paper ring-paper-border' },
  ] : [];

  return (
    <div>
      <PageHeader
        eyebrow="HR"
        title="Employees"
        subtitle="Your team's HR records — profiles, departments and documents."
        icon={<Users className="h-5 w-5" />}
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add employee</Button>}
      />

      {stats && (
        <Reveal>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAT_CARDS.map((s) => (
              <Card key={s.label} className="p-4 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ring-inset ${s.tone}`}>{s.icon}</span>
                <div><p className="text-xl font-semibold text-ink leading-none">{s.value}</p><p className="text-xs text-ink-muted mt-1">{s.label}</p></div>
              </Card>
            ))}
          </div>
        </Reveal>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, ID, designation, department…" className="field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field max-w-[180px]">
          <option value="">All statuses</option>
          {['active', 'onboarding', 'on_notice', 'exited'].map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            (q.trim() || statusFilter) ? (
              <EmptyState icon={<Search className="h-6 w-6" />} title="No matching employees" description="Try a different search or status filter." />
            ) : (
              <EmptyState icon={<Users className="h-6 w-6" />} title="Add your first employee" description="Build your team directory — onboarding, payroll and letters all start here.">
                <Button className="mt-6" onClick={openCreate}><Plus className="h-4 w-4" /> Add employee</Button>
              </EmptyState>
            )
          ) : (
            <Table>
              <THead><TH>Employee</TH><TH>ID</TH><TH>Department</TH><TH>Designation</TH><TH>Status</TH><TH>Joined</TH><TH /></THead>
              <tbody>
                {rows.map((e) => (
                  <TR key={e.id}>
                    <TD><div className="flex items-center gap-3"><Avatar name={`${e.firstName} ${e.lastName ?? ''}`} /><div><p className="font-medium text-ink">{e.firstName} {e.lastName}</p>{e.email && <p className="text-xs text-ink-faint">{e.email}</p>}</div></div></TD>
                    <TD><span className="font-mono text-xs">{e.empCode}</span></TD>
                    <TD>{e.department ? <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-ink-faint" /> {e.department}</span> : <span className="text-ink-faint">—</span>}</TD>
                    <TD>{e.designation ?? <span className="text-ink-faint">—</span>}</TD>
                    <TD><Badge tone={STATUS_TONE[e.status] ?? 'gray'}>{STATUS_LABEL[e.status] ?? e.status}</Badge></TD>
                    <TD>{e.joiningDate ? formatDate(e.joiningDate) : '—'}</TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(e)} className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(e)} className="btn-ghost p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
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
        title={editing ? 'Edit employee' : 'Add employee'}
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button form="emp-form" type="submit" loading={saving}>{editing ? 'Save' : 'Add employee'}</Button>
        </>}
      >
        <form id="emp-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employee ID" required value={form.empCode} onChange={(e) => setForm({ ...form, empCode: e.target.value })} placeholder="EMP-001" />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['active', 'onboarding', 'on_notice', 'exited'].map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Anita" />
            <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Rao" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="anita@company.com" />
            <Input label="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91…" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Engineering" />
            <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Senior Engineer" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
              <option value="full_time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </Select>
            <Input label="Joining date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
            <Input label="Annual CTC (₹)" value={form.ctcAnnual} onChange={(e) => setForm({ ...form, ctcAnnual: e.target.value })} placeholder="1200000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Reporting manager" value={form.reportingManager} onChange={(e) => setForm({ ...form, reportingManager: e.target.value })} placeholder="Name" />
            <Input label="Emergency contact" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} placeholder="Name · phone" />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="field min-h-[64px] resize-y" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Residential address" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
