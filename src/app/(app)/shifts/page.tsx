'use client';
import { useEffect, useState, useCallback } from 'react';
import { Clock4, Plus, Trash2, Users, CalendarRange } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Shift, ShiftRoster, Employee } from '@/lib/types';
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayLabel = (d: number[]) => (d.length === 7 ? 'All week' : d.map((x) => DAYS[x]).join(' '));

export default function ShiftsPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Shift[] | null>(null);
  const [roster, setRoster] = useState<ShiftRoster | null>(null);
  const [emps, setEmps] = useState<Employee[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', startTime: '09:30', endTime: '18:30', breakMinutes: '60', graceMinutes: '10', workingDays: [1, 2, 3, 4, 5, 6] as number[] });
  const [assignFor, setAssignFor] = useState<Shift | null>(null);
  const [assignDept, setAssignDept] = useState('');

  const load = useCallback(() => {
    api.shifts.list().then(setRows).catch((e) => { setRows([]); notify('error', e instanceof Error ? e.message : 'Could not load shifts'); });
    api.shifts.roster().then(setRoster).catch(() => {});
    api.employees.list('', '', '', 1, 200).then((p) => setEmps(p.items)).catch(() => {});
  }, [notify]);
  useEffect(() => { load(); }, [load]);

  function toggleDay(d: number) {
    setForm((f) => ({ ...f, workingDays: f.workingDays.includes(d) ? f.workingDays.filter((x) => x !== d) : [...f.workingDays, d].sort() }));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.shifts.create({
        name: form.name.trim(), code: form.code.trim().toUpperCase(),
        startTime: form.startTime, endTime: form.endTime,
        breakMinutes: Number(form.breakMinutes) || 0, graceMinutes: Number(form.graceMinutes) || 0,
        workingDays: form.workingDays,
      } as Partial<Shift>);
      setOpen(false); setForm({ name: '', code: '', startTime: '09:30', endTime: '18:30', breakMinutes: '60', graceMinutes: '10', workingDays: [1, 2, 3, 4, 5, 6] });
      notify('success', 'Shift created'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not create'); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this shift? Assigned employees will be unassigned.')) return;
    try { await api.shifts.remove(id); notify('success', 'Deleted'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not delete'); }
  }

  const depts = [...new Set(emps.map((e) => e.department).filter(Boolean))] as string[];
  async function assign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignFor) return;
    setBusy(true);
    try {
      const r = await api.shifts.assign(assignFor.id, assignDept ? { department: assignDept } : {});
      setAssignFor(null); setAssignDept('');
      notify('success', `Assigned ${r.assigned} employee(s)`); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not assign'); }
    finally { setBusy(false); }
  }

  if (rows === null) return <PageLoader />;

  return (
    <div>
      <PageHeader
        eyebrow="HR"
        title="Shifts & scheduling"
        subtitle="Define shifts, assign teams, and drive late-detection + payroll working-days."
        icon={<Clock4 className="h-5 w-5" />}
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New shift</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <Card>
            <CardHeader title="Shifts" />
            {rows.length === 0 ? (
              <EmptyState icon={<Clock4 className="h-6 w-6" />} title="No shifts yet" description="Create a shift, then assign employees or whole departments to it.">
                <Button className="mt-6" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New shift</Button>
              </EmptyState>
            ) : (
              <Table>
                <THead><TH>Shift</TH><TH>Timing</TH><TH>Days</TH><TH className="text-right">Assigned</TH><TH></TH></THead>
                <tbody>
                  {rows.map((s) => (
                    <TR key={s.id}>
                      <TD className="text-ink font-medium">{s.name}<span className="block text-xs text-ink-faint font-mono">{s.code}</span></TD>
                      <TD className="font-mono text-xs">{s.startTime}–{s.endTime}<span className="block text-ink-faint">+{s.graceMinutes}m grace</span></TD>
                      <TD className="text-xs">{dayLabel(s.workingDays)}</TD>
                      <TD className="text-right"><Badge tone="blue"><Users className="h-3.5 w-3.5" /> {s.assignedCount ?? 0}</Badge></TD>
                      <TD className="text-right whitespace-nowrap">
                        <button onClick={() => setAssignFor(s)} className="text-sm text-brand-700 hover:underline mr-3">Assign</button>
                        <button onClick={() => remove(s.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card>
            <CardHeader title="Today's roster" subtitle={roster ? `${roster.date} · ${roster.unassigned} unassigned` : ''} />
            <CardBody className="space-y-3">
              {!roster || roster.shifts.length === 0 ? (
                <p className="text-sm text-ink-muted">No shifts to roster.</p>
              ) : roster.shifts.map((s) => (
                <div key={s.id} className="rounded-xl border border-paper-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">{s.name} <span className="font-mono text-xs text-ink-faint">{s.startTime}–{s.endTime}</span></span>
                    {s.worksToday ? <Badge tone="green"><CalendarRange className="h-3.5 w-3.5" /> On today</Badge> : <Badge tone="gray">Off today</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{s.employees.length ? s.employees.map((e) => e.name).join(', ') : 'No one assigned'}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New shift"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="shift-form" type="submit" loading={busy}>Create</Button></>}>
        <form id="shift-form" onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="General" />
            <Input label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="GEN" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" type="time" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input label="End" type="time" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Break (min)" type="number" value={form.breakMinutes} onChange={(e) => setForm({ ...form, breakMinutes: e.target.value })} />
            <Input label="Grace (min)" type="number" value={form.graceMinutes} onChange={(e) => setForm({ ...form, graceMinutes: e.target.value })} />
          </div>
          <div>
            <label className="label">Working days</label>
            <div className="flex gap-1.5 mt-1">
              {DAYS.map((d, i) => (
                <button type="button" key={d} onClick={() => toggleDay(i)}
                  className={`h-9 w-10 rounded-lg text-xs font-medium ring-1 ring-inset transition-colors ${form.workingDays.includes(i) ? 'bg-brand-600 text-white ring-brand-600' : 'bg-paper text-ink-muted ring-paper-border'}`}>{d}</button>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={!!assignFor} onClose={() => setAssignFor(null)} title={`Assign to ${assignFor?.name ?? ''}`}
        footer={<><Button variant="secondary" onClick={() => setAssignFor(null)}>Cancel</Button><Button form="assign-form" type="submit" loading={busy}>Assign</Button></>}>
        <form id="assign-form" onSubmit={assign} className="space-y-4">
          <Select label="Assign a whole department" value={assignDept} onChange={(e) => setAssignDept(e.target.value)}>
            <option value="">— choose department —</option>
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <p className="hint">Everyone in the selected department will be moved onto this shift.</p>
        </form>
      </Modal>
    </div>
  );
}
