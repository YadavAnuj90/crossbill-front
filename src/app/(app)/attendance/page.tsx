'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, LogIn, LogOut, Clock, Users, Plane } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Employee, Attendance, AttendanceSummary } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  present: 'green', half: 'amber', leave: 'blue', absent: 'gray',
};
function time(iso: string | null) { return iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'; }

export default function AttendancePage() {
  const { notify } = useToast();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [today, setToday] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [busy, setBusy] = useState<string | null>(null);

  function loadBoard() {
    api.employees.list('', '', 'active').then((p) => setEmployees(p.items)).catch(() => setEmployees([]));
    api.attendance.today().then(setToday).catch(() => setToday([]));
  }
  useEffect(loadBoard, []);
  useEffect(() => { api.attendance.summary(month).then(setSummary).catch(() => setSummary(null)); }, [month]);

  const byEmp = useMemo(() => {
    const m: Record<string, Attendance> = {};
    today.forEach((a) => { m[a.employeeId] = a; });
    return m;
  }, [today]);
  const empName = useMemo(() => {
    const m: Record<string, string> = {};
    (employees ?? []).forEach((e) => { m[e.id] = `${e.firstName} ${e.lastName ?? ''}`.trim(); });
    return m;
  }, [employees]);

  async function checkIn(e: Employee) {
    setBusy(e.id);
    try { await api.attendance.checkIn(e.id); notify('success', `${e.firstName} checked in`); loadBoard(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(null); }
  }
  async function checkOut(e: Employee) {
    setBusy(e.id);
    try { await api.attendance.checkOut(e.id); notify('success', `${e.firstName} checked out`); loadBoard(); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Failed'); }
    finally { setBusy(null); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="People & HR"
        title="Attendance"
        subtitle="Mark daily attendance and review the monthly summary."
        icon={<CalendarCheck className="h-5 w-5" />}
        action={<Link href="/leave" className="btn-secondary"><Plane className="h-4 w-4" /> Leave</Link>}
      />

      <Reveal>
        <Card className="mb-6">
          <CardHeader title="Today" subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} />
          {employees === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : employees.length === 0 ? (
            <EmptyState icon={<Users className="h-6 w-6" />} title="No active employees" description="Add employees first to mark their attendance.">
              <Link href="/employees" className="btn-primary mt-6">Go to employees</Link>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Employee</TH><TH>Check in</TH><TH>Check out</TH><TH>Status</TH><TH className="text-right">Action</TH></THead>
              <tbody>
                {employees.map((e) => {
                  const a = byEmp[e.id];
                  return (
                    <TR key={e.id}>
                      <TD><div className="flex items-center gap-3"><Avatar name={`${e.firstName} ${e.lastName ?? ''}`} /><span className="font-medium text-ink">{e.firstName} {e.lastName}</span></div></TD>
                      <TD><span className="inline-flex items-center gap-1.5 text-sm"><Clock className="h-3.5 w-3.5 text-ink-faint" /> {time(a?.checkInAt ?? null)}</span></TD>
                      <TD>{time(a?.checkOutAt ?? null)}</TD>
                      <TD>{a ? <Badge tone={STATUS_TONE[a.status] ?? 'gray'}>{a.status}</Badge> : <span className="text-ink-faint text-sm">—</span>}</TD>
                      <TD className="text-right">
                        {!a?.checkInAt ? (
                          <Button variant="secondary" loading={busy === e.id} onClick={() => checkIn(e)}><LogIn className="h-4 w-4" /> Check in</Button>
                        ) : !a?.checkOutAt ? (
                          <Button variant="secondary" loading={busy === e.id} onClick={() => checkOut(e)}><LogOut className="h-4 w-4" /> Check out</Button>
                        ) : (
                          <span className="text-sm text-ink-muted">{Math.round((a.workedMinutes / 60) * 10) / 10}h</span>
                        )}
                      </TD>
                    </TR>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>

      <Reveal delay={80}>
        <Card>
          <CardHeader title="Monthly summary" action={<input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="field max-w-[170px] py-1.5" />} />
          {!summary || summary.byEmployee.length === 0 ? (
            <div className="p-6 text-sm text-ink-muted">No attendance recorded for {month}.</div>
          ) : (
            <>
              <div className="px-5 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Present (days)', value: summary.totals.present, tone: 'text-brand-600 bg-brand-50 ring-brand-200' },
                  { label: 'Half days', value: summary.totals.half, tone: 'text-amber-600 bg-amber-50 ring-amber-200' },
                  { label: 'On leave', value: summary.totals.leave, tone: 'text-blue-600 bg-blue-50 ring-blue-200' },
                  { label: 'Hours worked', value: summary.totals.workedHours, tone: 'text-ink bg-paper ring-paper-border' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl px-3 py-2.5 ring-1 ring-inset ${s.tone}`}><p className="text-xl font-semibold leading-none">{s.value}</p><p className="text-xs mt-1 opacity-80">{s.label}</p></div>
                ))}
              </div>
              <Table>
                <THead><TH>Employee</TH><TH className="text-right">Present</TH><TH className="text-right">Half</TH><TH className="text-right">Leave</TH><TH className="text-right">Hours</TH></THead>
                <tbody>
                  {summary.byEmployee.map((r) => (
                    <TR key={r.employeeId}>
                      <TD className="text-ink">{empName[r.employeeId] ?? r.employeeId}</TD>
                      <TD className="text-right">{r.present}</TD>
                      <TD className="text-right">{r.half}</TD>
                      <TD className="text-right">{r.leave}</TD>
                      <TD className="text-right font-medium">{r.workedHours}h</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
