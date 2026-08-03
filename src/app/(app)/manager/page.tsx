'use client';
import { useEffect, useState, useCallback } from 'react';
import { Users, UserCheck, Plane, Clock, Check, X } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { ManagerDashboard, Employee } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';

const TONE: Record<string, 'green' | 'amber' | 'red' | 'gray' | 'blue'> = {
  present: 'green', half: 'amber', leave: 'blue', absent: 'gray',
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <div><p className="text-xs text-ink-faint">{label}</p><p className="text-xl font-semibold text-ink">{value}</p></div>
    </Card>
  );
}

export default function ManagerDashboardPage() {
  const { notify } = useToast();
  const [managerId, setManagerId] = useState('');
  const [managers, setManagers] = useState<Employee[]>([]);
  const [data, setData] = useState<ManagerDashboard | null>(null);

  const load = useCallback((mid: string) => {
    setData(null);
    api.attendance.managerDashboard(mid).then(setData).catch((e) => notify('error', e instanceof Error ? e.message : 'Could not load'));
  }, [notify]);

  useEffect(() => { api.employees.list('', '', '', 1, 200).then((p) => setManagers(p.items)).catch(() => {}); }, []);
  useEffect(() => { load(managerId); }, [managerId, load]);

  async function decide(id: string, decision: 'approved' | 'rejected') {
    try { await api.leaves.decide(id, decision); notify('success', `Leave ${decision}`); load(managerId); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not update'); }
  }

  return (
    <div>
      <PageHeader
        eyebrow="HR"
        title="Manager dashboard"
        subtitle="Your team's attendance today and leave requests awaiting a decision."
        icon={<Users className="h-5 w-5" />}
        action={
          <div className="w-56">
            <Select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
              <option value="">Whole organisation</option>
              {managers.map((m) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.empCode})</option>)}
            </Select>
          </div>
        }
      />

      {data === null ? <PageLoader /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Stat icon={<Users className="h-5 w-5" />} label="Team size" value={data.teamSize} />
            <Stat icon={<UserCheck className="h-5 w-5" />} label="Present today" value={data.presentToday} />
            <Stat icon={<Plane className="h-5 w-5" />} label="On leave today" value={data.onLeaveToday} />
            <Stat icon={<Clock className="h-5 w-5" />} label="Pending leaves" value={data.pendingLeaveCount} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <Card>
                <CardHeader title="Team — today" />
                {data.roster.length === 0 ? (
                  <EmptyState icon={<Users className="h-6 w-6" />} title="No team members" description="Assign employees to this manager to see their attendance here." />
                ) : (
                  <Table>
                    <THead><TH>Employee</TH><TH>Department</TH><TH>Today</TH><TH>In / Out</TH></THead>
                    <tbody>
                      {data.roster.map((r) => (
                        <TR key={r.employeeId}>
                          <TD className="text-ink font-medium">{r.name}<span className="block text-xs text-ink-faint font-mono">{r.empCode}</span></TD>
                          <TD>{r.department ?? '—'}</TD>
                          <TD><Badge tone={TONE[r.today.status] ?? 'gray'}>{r.today.status}</Badge></TD>
                          <TD className="text-xs text-ink-muted">{r.today.checkInAt ? new Date(r.today.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}{r.today.checkOutAt ? ` – ${new Date(r.today.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</TD>
                        </TR>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card>
                <CardHeader title="Pending leave requests" />
                <CardBody className="space-y-3">
                  {data.pendingLeaves.length === 0 ? (
                    <p className="text-sm text-ink-muted">No pending requests.</p>
                  ) : data.pendingLeaves.map((l) => (
                    <div key={l.id} className="rounded-xl border border-paper-border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink capitalize">{l.type} · {l.days}d</span>
                        <span className="text-xs text-ink-faint">{l.from} → {l.to}</span>
                      </div>
                      {l.reason && <p className="mt-1 text-xs text-ink-muted">{l.reason}</p>}
                      <div className="mt-2 flex gap-2">
                        <Button variant="secondary" className="py-1.5" onClick={() => decide(l.id, 'approved')}><Check className="h-4 w-4" /> Approve</Button>
                        <button onClick={() => decide(l.id, 'rejected')} className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:underline"><X className="h-4 w-4" /> Reject</button>
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Reveal>
          </div>
        </>
      )}
    </div>
  );
}
