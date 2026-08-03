'use client';
import { useEffect, useState, useCallback } from 'react';
import { UserCircle, LogIn, LogOut, CalendarCheck, Plane, ListChecks, FileText, Plus, Send, Megaphone, FileCheck2, Check } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { EssSummary, Attendance, SalarySlip, Leave, Task, EssAnnouncement, EssPolicy } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';

const TONE: Record<string, 'green' | 'amber' | 'red' | 'gray' | 'blue'> = { present: 'green', half: 'amber', leave: 'blue', absent: 'gray' };
const LEAVE_TONE: Record<string, 'amber' | 'green' | 'red'> = { pending: 'amber', approved: 'green', rejected: 'red' };
const money = (v?: string) => `₹${parseFloat(v || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <div><p className="text-xs text-ink-faint">{label}</p><p className="text-xl font-semibold text-ink">{value}</p></div>
    </Card>
  );
}

export default function MyWorkspacePage() {
  const { notify } = useToast();
  const [summary, setSummary] = useState<EssSummary | null>(null);
  const [notLinked, setNotLinked] = useState<string | null>(null);
  const [att, setAtt] = useState<Attendance[]>([]);
  const [slips, setSlips] = useState<SalarySlip[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [anns, setAnns] = useState<EssAnnouncement[]>([]);
  const [pols, setPols] = useState<EssPolicy[]>([]);
  const [busy, setBusy] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [lf, setLf] = useState({ type: 'casual', from: '', to: '', reason: '' });
  const month = new Date().toISOString().slice(0, 7);

  const load = useCallback(() => {
    api.me.summary().then((s) => { setSummary(s); setNotLinked(null); }).catch((e) => setNotLinked(e instanceof Error ? e.message : 'Not linked'));
    api.me.attendance(month).then(setAtt).catch(() => {});
    api.me.payslips().then(setSlips).catch(() => {});
    api.me.leaves().then(setLeaves).catch(() => {});
    api.me.tasks().then(setTasks).catch(() => {});
    api.me.announcements().then(setAnns).catch(() => {});
    api.me.policies().then(setPols).catch(() => {});
  }, [month]);
  useEffect(() => { load(); }, [load]);

  async function check(kind: 'in' | 'out') {
    setBusy(true);
    try { await (kind === 'in' ? api.me.checkIn() : api.me.checkOut()); notify('success', kind === 'in' ? 'Checked in' : 'Checked out'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(false); }
  }

  async function requestLeave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.me.requestLeave({ type: lf.type, from: lf.from, to: lf.to, reason: lf.reason || undefined });
      setLeaveOpen(false); setLf({ type: 'casual', from: '', to: '', reason: '' });
      notify('success', 'Leave requested'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(false); }
  }

  async function reportTask(t: Task, status: string) {
    try { await api.me.reportTask(t.id, { status }); notify('success', 'Updated'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }

  async function readAnn(id: string) {
    try { await api.me.readAnnouncement(id); load(); } catch { /* ignore */ }
  }
  async function ackPolicy(id: string) {
    try { await api.me.acknowledgePolicy(id); notify('success', 'Acknowledged'); load(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
  }

  if (notLinked) {
    return (
      <div>
        <PageHeader eyebrow="Self-service" title="My workspace" icon={<UserCircle className="h-5 w-5" />} />
        <Card><CardBody className="text-center py-12">
          <UserCircle className="h-10 w-10 mx-auto text-ink-faint mb-3" />
          <p className="text-ink font-medium">Your login isn't linked to an employee record yet.</p>
          <p className="text-sm text-ink-muted mt-1 max-w-md mx-auto">{notLinked}</p>
        </CardBody></Card>
      </div>
    );
  }
  if (!summary) return <PageLoader />;

  const checkedIn = !!summary.today?.checkInAt;
  const checkedOut = !!summary.today?.checkOutAt;

  return (
    <div>
      <PageHeader
        eyebrow="Self-service"
        title={`Hi, ${summary.employee.name.split(' ')[0]}`}
        subtitle={`${summary.employee.designation ?? 'Employee'}${summary.employee.department ? ' · ' + summary.employee.department : ''} · ${summary.employee.empCode}`}
        icon={<UserCircle className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            {!checkedIn && <Button loading={busy} onClick={() => check('in')}><LogIn className="h-4 w-4" /> Check in</Button>}
            {checkedIn && !checkedOut && <Button variant="secondary" loading={busy} onClick={() => check('out')}><LogOut className="h-4 w-4" /> Check out</Button>}
            {checkedOut && <Badge tone="green">Done for today</Badge>}
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat icon={<CalendarCheck className="h-5 w-5" />} label="Present this month" value={summary.monthPresent} />
        <Stat icon={<ListChecks className="h-5 w-5" />} label="Open tasks" value={summary.openTasks} />
        <Stat icon={<Plane className="h-5 w-5" />} label="Pending leaves" value={summary.pendingLeaves} />
        <Stat icon={<FileText className="h-5 w-5" />} label="Latest net pay" value={summary.latestPayslip ? money(summary.latestPayslip.net) : '—'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card>
            <CardHeader title="My attendance" subtitle={month} />
            {att.length === 0 ? <CardBody><p className="text-sm text-ink-muted">No records this month.</p></CardBody> : (
              <Table>
                <THead><TH>Date</TH><TH>Status</TH><TH>In / Out</TH></THead>
                <tbody>
                  {att.slice(0, 12).map((a) => (
                    <TR key={a.id ?? a.date}>
                      <TD>{a.date}</TD>
                      <TD><Badge tone={TONE[a.status] ?? 'gray'}>{a.status}</Badge></TD>
                      <TD className="text-xs text-ink-muted">{a.checkInAt ? new Date(a.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}{a.checkOutAt ? ` – ${new Date(a.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Reveal>

        <Reveal delay={60}>
          <Card>
            <CardHeader title="My payslips" />
            {slips.length === 0 ? <CardBody><p className="text-sm text-ink-muted">No payslips yet.</p></CardBody> : (
              <Table>
                <THead><TH>Month</TH><TH className="text-right">Net</TH><TH></TH></THead>
                <tbody>
                  {slips.slice(0, 12).map((s) => (
                    <TR key={s.id}>
                      <TD>{s.month}</TD>
                      <TD className="text-right font-medium">{money(s.net)}</TD>
                      <TD className="text-right">{s.pdfUrl ? <a href={s.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline"><FileText className="h-3.5 w-3.5" /> PDF</a> : <span className="text-xs text-ink-faint">—</span>}</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Reveal>

        <Reveal delay={120}>
          <Card>
            <CardHeader title="My leave" action={<Button variant="secondary" className="py-1.5" onClick={() => setLeaveOpen(true)}><Plus className="h-4 w-4" /> Request</Button>} />
            <CardBody className="space-y-2">
              {leaves.length === 0 ? <p className="text-sm text-ink-muted">No leave requests.</p> : leaves.slice(0, 8).map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-lg border border-paper-border px-3 py-2">
                  <span className="text-sm text-ink capitalize">{l.type} · {l.days}d <span className="text-ink-faint">({l.from} → {l.to})</span></span>
                  <Badge tone={LEAVE_TONE[l.status] ?? 'gray'}>{l.status}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card>
            <CardHeader title="My tasks" />
            <CardBody className="space-y-2">
              {tasks.length === 0 ? <p className="text-sm text-ink-muted">No tasks assigned.</p> : tasks.filter((t) => t.status !== 'done').slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-paper-border px-3 py-2">
                  <span className="text-sm text-ink truncate">{t.title}{t.dueDate && <span className="block text-xs text-ink-faint">due {t.dueDate}</span>}</span>
                  <Select value={t.status} onChange={(e) => reportTask(t, e.target.value)} className="py-1 text-xs max-w-[130px]">
                    {['todo', 'in_progress', 'blocked', 'done'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </Select>
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={200}>
          <Card>
            <CardHeader title="Announcements" />
            <CardBody className="space-y-2">
              {anns.length === 0 ? <p className="text-sm text-ink-muted">Nothing new.</p> : anns.map((a) => (
                <div key={a.id} className={`rounded-lg border p-3 ${a.read ? 'border-paper-border' : 'border-brand-200 bg-brand-50/40'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink flex items-center gap-1.5"><Megaphone className="h-3.5 w-3.5 text-brand-600" />{a.title}</p>
                      {a.body && <p className="mt-0.5 text-xs text-ink-muted">{a.body}</p>}
                    </div>
                    {!a.read && <button onClick={() => readAnn(a.id)} className="text-xs text-brand-700 hover:underline shrink-0">Mark read</button>}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={240}>
          <Card>
            <CardHeader title="Company policies" />
            <CardBody className="space-y-2">
              {pols.length === 0 ? <p className="text-sm text-ink-muted">No policies to review.</p> : pols.map((p) => (
                <div key={p.id} className="rounded-lg border border-paper-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5 text-ink-faint" />{p.title} <span className="text-xs text-ink-faint">v{p.version}</span></p>
                      {p.documentUrl && <a href={p.documentUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-700 hover:underline">Open document</a>}
                    </div>
                    {p.requiresAck && (p.acknowledged
                      ? <Badge tone="green"><Check className="h-3.5 w-3.5" /> Acknowledged</Badge>
                      : <Button variant="secondary" className="py-1.5" onClick={() => ackPolicy(p.id)}>Acknowledge</Button>)}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </Reveal>
      </div>

      <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Request leave"
        footer={<><Button variant="secondary" onClick={() => setLeaveOpen(false)}>Cancel</Button><Button form="leave-form" type="submit" loading={busy}>Request</Button></>}>
        <form id="leave-form" onSubmit={requestLeave} className="space-y-4">
          <Select label="Type" value={lf.type} onChange={(e) => setLf({ ...lf, type: e.target.value })}>
            <option value="casual">Casual</option><option value="sick">Sick</option><option value="earned">Earned</option><option value="unpaid">Unpaid</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="From" type="date" required value={lf.from} onChange={(e) => setLf({ ...lf, from: e.target.value })} />
            <Input label="To" type="date" required value={lf.to} onChange={(e) => setLf({ ...lf, to: e.target.value })} />
          </div>
          <Input label="Reason" value={lf.reason} onChange={(e) => setLf({ ...lf, reason: e.target.value })} placeholder="Optional" />
        </form>
      </Modal>
    </div>
  );
}
