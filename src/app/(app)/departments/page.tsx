'use client';
import { useEffect, useState, useCallback } from 'react';
import { Building2, Plus, Trash2, Users } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Department, Employee } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';

export default function DepartmentsPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Department[] | null>(null);
  const [emps, setEmps] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '', headEmployeeId: '', parentId: '' });

  const load = useCallback(() => {
    api.departments.list().then(setRows).catch((e) => { setRows([]); notify('error', e instanceof Error ? e.message : 'Could not load departments'); });
    api.employees.list('', '', '', 1, 200).then((p) => setEmps(p.items)).catch(() => {});
  }, [notify]);
  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.departments.create({
        name: form.name.trim(), code: form.code.trim().toUpperCase(),
        description: form.description.trim() || undefined,
        headEmployeeId: form.headEmployeeId || undefined,
        parentId: form.parentId || undefined,
      } as Partial<Department>);
      setOpen(false); setForm({ name: '', code: '', description: '', headEmployeeId: '', parentId: '' });
      notify('success', 'Department created'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not create'); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this department?')) return;
    try { await api.departments.remove(id); notify('success', 'Deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  if (rows === null) return <PageLoader />;
  const empName = (id: string | null) => { const e = emps.find((x) => x.id === id); return e ? `${e.firstName} ${e.lastName ?? ''}`.trim() : '—'; };

  return (
    <div>
      <PageHeader
        eyebrow="HR"
        title="Departments"
        subtitle="Organise teams, set department heads and nest sub-departments."
        icon={<Building2 className="h-5 w-5" />}
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New department</Button>}
      />

      <Reveal>
        <Card>
          {rows.length === 0 ? (
            <EmptyState icon={<Building2 className="h-6 w-6" />} title="No departments yet" description="Create your first department to group employees and set a reporting head.">
              <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New department</Button>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Department</TH><TH>Code</TH><TH>Head</TH><TH className="text-right">Headcount</TH><TH></TH></THead>
              <tbody>
                {rows.map((d) => (
                  <TR key={d.id}>
                    <TD className="text-ink font-medium">{d.name}{d.parentId && <span className="ml-2 text-xs text-ink-faint">sub-dept</span>}</TD>
                    <TD><span className="font-mono text-xs">{d.code}</span></TD>
                    <TD>{empName(d.headEmployeeId)}</TD>
                    <TD className="text-right"><Badge tone="blue"><Users className="h-3.5 w-3.5" /> {d.headcount ?? 0}</Badge></TD>
                    <TD className="text-right"><button onClick={() => remove(d.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title="New department"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="dept-form" type="submit" loading={busy}>Create</Button></>}>
        <form id="dept-form" onSubmit={create} className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Engineering" />
          <Input label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="ENG" />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" />
          <Select label="Department head" value={form.headEmployeeId} onChange={(e) => setForm({ ...form, headEmployeeId: e.target.value })}>
            <option value="">— none —</option>
            {emps.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.empCode})</option>)}
          </Select>
          <Select label="Parent department" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
            <option value="">— top-level —</option>
            {rows.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </form>
      </Modal>
    </div>
  );
}
