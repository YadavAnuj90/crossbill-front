'use client';
import { useEffect, useState, useCallback } from 'react';
import { ListChecks, Plus, Clock, AlertTriangle, Gauge, Send } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Task, TaskProductivity, TaskWorkloadRow, Employee } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  todo: 'gray', in_progress: 'blue', blocked: 'red', done: 'green',
};
const PRIORITY_TONE: Record<string, 'gray' | 'amber' | 'red'> = { low: 'gray', medium: 'amber', high: 'red' };
const STATUSES = ['todo', 'in_progress', 'blocked', 'done'];

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <div><p className="text-xs text-ink-faint">{label}</p><p className="text-xl font-semibold text-ink">{value}</p></div>
    </Card>
  );
}

export default function TasksPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Task[] | null>(null);
  const [emps, setEmps] = useState<Employee[]>([]);
  const [prod, setProd] = useState<TaskProductivity | null>(null);
  const [work, setWork] = useState<TaskWorkloadRow[]>([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: '', assigneeId: '', priority: 'medium', dueDate: '', estimateHours: '' });
  const [report, setReport] = useState<Task | null>(null);
  const [rep, setRep] = useState({ note: '', hours: '', status: '' });

  const load = useCallback(() => {
    api.tasks.listBy(filter ? { status: filter } : {}).then(setRows).catch((e) => { setRows([]); notify('error', e instanceof Error ? e.message : 'Could not load tasks'); });
    api.tasks.productivity().then(setProd).catch(() => {});
    api.tasks.workload().then(setWork).catch(() => {});
  }, [filter, notify]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.employees.list('', '', '', 1, 200).then((p) => setEmps(p.items)).catch(() => {}); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.tasks.create({
        title: form.title.trim(),
        assigneeId: form.assigneeId || undefined,
        priority: form.priority as Task['priority'],
        dueDate: form.dueDate || undefined,
        estimateHours: form.estimateHours ? Number(form.estimateHours) : undefined,
      } as Partial<Task>);
      setOpen(false); setForm({ title: '', assigneeId: '', priority: 'medium', dueDate: '', estimateHours: '' });
      notify('success', 'Task assigned'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not create'); }
    finally { setBusy(false); }
  }

  async function setStatus(t: Task, status: string) {
    try { await api.tasks.update(t.id, { status: status as Task['status'] }); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not update'); }
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!report) return;
    setBusy(true);
    try {
      await api.tasks.report(report.id, { note: rep.note || undefined, hours: rep.hours ? Number(rep.hours) : undefined, status: rep.status || undefined });
      setReport(null); setRep({ note: '', hours: '', status: '' });
      notify('success', 'Progress logged'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not log'); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workforce"
        title="Tasks & workforce"
        subtitle="Assign work, track progress and hours, and see who's loaded."
        icon={<ListChecks className="h-5 w-5" />}
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Assign task</Button>}
      />

      {prod && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat icon={<ListChecks className="h-5 w-5" />} label="Open tasks" value={(prod.counts.todo ?? 0) + (prod.counts.in_progress ?? 0) + (prod.counts.blocked ?? 0)} />
          <Stat icon={<Clock className="h-5 w-5" />} label="In progress" value={prod.counts.in_progress ?? 0} />
          <Stat icon={<AlertTriangle className="h-5 w-5" />} label="Overdue" value={prod.overdue} />
          <Stat icon={<Gauge className="h-5 w-5" />} label="On-time rate" value={`${prod.onTimeRate}%`} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Card>
            <CardHeader title="Tasks" action={
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="py-1.5 max-w-[160px]">
                <option value="">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            } />
            {rows === null ? (
              <CardBody><p className="text-sm text-ink-muted">Loading…</p></CardBody>
            ) : rows.length === 0 ? (
              <EmptyState icon={<ListChecks className="h-6 w-6" />} title="No tasks" description="Assign a task to an employee to get started.">
                <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Assign task</Button>
              </EmptyState>
            ) : (
              <Table>
                <THead><TH>Task</TH><TH>Assignee</TH><TH>Priority</TH><TH>Status</TH><TH>Hrs</TH><TH></TH></THead>
                <tbody>
                  {rows.map((t) => (
                    <TR key={t.id}>
                      <TD className="text-ink font-medium">{t.title}{t.dueDate && <span className="block text-xs text-ink-faint">due {t.dueDate}</span>}</TD>
                      <TD>{t.assigneeName ?? '—'}</TD>
                      <TD><Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge></TD>
                      <TD>
                        <Select value={t.status} onChange={(e) => setStatus(t, e.target.value)} className="py-1 text-xs max-w-[130px]">
                          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </Select>
                      </TD>
                      <TD className="text-xs text-ink-muted font-mono">{t.loggedHours}/{t.estimateHours || '—'}</TD>
                      <TD className="text-right"><button onClick={() => { setReport(t); setRep({ note: '', hours: '', status: t.status }); }} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline"><Send className="h-3.5 w-3.5" /> Report</button></TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card>
            <CardHeader title="Workforce load" subtitle="Open tasks & hours per employee" />
            {work.length === 0 ? (
              <CardBody><p className="text-sm text-ink-muted">No workload data.</p></CardBody>
            ) : (
              <Table>
                <THead><TH>Employee</TH><TH className="text-right">Open</TH><TH className="text-right">Overdue</TH><TH className="text-right">Hrs</TH></THead>
                <tbody>
                  {work.map((w) => (
                    <TR key={w.employeeId}>
                      <TD className="text-ink">{w.name}<span className="block text-xs text-ink-faint">{w.department ?? '—'}</span></TD>
                      <TD className="text-right">{w.open}</TD>
                      <TD className="text-right">{w.overdue > 0 ? <span className="text-red-600 font-medium">{w.overdue}</span> : 0}</TD>
                      <TD className="text-right font-mono text-xs">{w.loggedHours}/{w.estimateHours || '—'}</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Reveal>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Assign task"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="task-form" type="submit" loading={busy}>Assign</Button></>}>
        <form id="task-form" onSubmit={create} className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Prepare Q2 GST filing" />
          <Select label="Assignee" value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
            <option value="">— unassigned —</option>
            {emps.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.empCode})</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </Select>
            <Input label="Estimate (hrs)" type="number" value={form.estimateHours} onChange={(e) => setForm({ ...form, estimateHours: e.target.value })} placeholder="4" />
          </div>
          <Input label="Due date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </form>
      </Modal>

      <Modal open={!!report} onClose={() => setReport(null)} title={`Log progress — ${report?.title ?? ''}`}
        footer={<><Button variant="secondary" onClick={() => setReport(null)}>Cancel</Button><Button form="report-form" type="submit" loading={busy}>Log</Button></>}>
        <form id="report-form" onSubmit={submitReport} className="space-y-4">
          <Input label="Note" value={rep.note} onChange={(e) => setRep({ ...rep, note: e.target.value })} placeholder="What progressed?" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Hours to add" type="number" value={rep.hours} onChange={(e) => setRep({ ...rep, hours: e.target.value })} placeholder="2" />
            <Select label="Status" value={rep.status} onChange={(e) => setRep({ ...rep, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </Select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
