'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Gauge, Users, CalendarCheck, Plane, FileSignature, BadgeCheck, Clock, ShieldX,
  Building2, ArrowUpRight, ShieldQuestion,
} from 'lucide-react';
import api from '@/lib/api';
import type { EmployeeStats, AttendanceStats, Company } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/motion/Reveal';

const VERIF: Record<string, { label: string; tone: string; icon: React.ReactNode }> = {
  unsubmitted: { label: 'Not submitted', tone: 'text-ink-muted bg-paper ring-paper-border', icon: <ShieldQuestion className="h-4 w-4" /> },
  pending: { label: 'Pending review', tone: 'text-amber-600 bg-amber-50 ring-amber-200', icon: <Clock className="h-4 w-4" /> },
  verified: { label: 'Verified', tone: 'text-brand-600 bg-brand-50 ring-brand-200', icon: <BadgeCheck className="h-4 w-4" /> },
  rejected: { label: 'Rejected', tone: 'text-red-600 bg-red-50 ring-red-200', icon: <ShieldX className="h-4 w-4" /> },
};

export default function HrOverviewPage() {
  const [emp, setEmp] = useState<EmployeeStats | null>(null);
  const [att, setAtt] = useState<AttendanceStats | null>(null);
  const [docs, setDocs] = useState<number | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    api.employees.stats().then(setEmp).catch(() => setEmp(null));
    api.attendance.stats().then(setAtt).catch(() => setAtt(null));
    api.agreements.list(1, 1).then((p) => setDocs(p.meta.total)).catch(() => setDocs(null));
    api.company.get().then(setCompany).catch(() => {});
  }, []);

  const loading = !emp || !att;
  const v = VERIF[company?.verificationStatus ?? 'unsubmitted'] ?? VERIF.unsubmitted;

  const TILES = [
    { label: 'Employees', value: emp?.total ?? 0, sub: `${emp?.active ?? 0} active`, icon: <Users className="h-5 w-5" />, tone: 'from-brand-400 to-brand-600', href: '/employees' },
    { label: 'Present today', value: att?.presentToday ?? 0, sub: 'checked in', icon: <CalendarCheck className="h-5 w-5" />, tone: 'from-blue-500 to-indigo-600', href: '/attendance' },
    { label: 'Pending leaves', value: att?.pendingLeaves ?? 0, sub: 'awaiting approval', icon: <Plane className="h-5 w-5" />, tone: 'from-amber-500 to-orange-600', href: '/leave' },
    { label: 'Documents shared', value: docs ?? 0, sub: 'agreements', icon: <FileSignature className="h-5 w-5" />, tone: 'from-violet-500 to-purple-600', href: '/agreements' },
  ];

  return (
    <div>
      <PageHeader eyebrow="People & HR" title="HR overview" subtitle="Your team and document compliance at a glance." icon={<Gauge className="h-5 w-5" />} />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map((t, i) => (
              <Reveal key={t.label} delay={i * 50}>
                <Link href={t.href} className="group block">
                  <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex items-start justify-between">
                      <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm ${t.tone}`}>{t.icon}</span>
                      <ArrowUpRight className="h-4 w-4 text-ink-faint opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-ink leading-none">{t.value}</p>
                    <p className="mt-1.5 text-sm text-ink-muted">{t.label} <span className="text-ink-faint">· {t.sub}</span></p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <Card>
                <CardHeader title="Headcount by department" />
                <CardBody>
                  {!emp || emp.byDepartment.length === 0 ? (
                    <p className="text-sm text-ink-muted">No employees yet. <Link href="/employees" className="text-brand-700 hover:underline">Add your team →</Link></p>
                  ) : (
                    <div className="space-y-3">
                      {emp.byDepartment.map((d) => {
                        const pct = emp.total ? Math.round((d.count / emp.total) * 100) : 0;
                        return (
                          <div key={d.department}>
                            <div className="flex items-center justify-between text-sm mb-1"><span className="text-ink-soft inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-ink-faint" /> {d.department}</span><span className="text-ink-muted">{d.count}</span></div>
                            <div className="h-2 rounded-full bg-paper overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${pct}%` }} /></div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card className="h-fit">
                <CardHeader title="Company verification" />
                <CardBody className="space-y-3">
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${v.tone}`}>{v.icon} {v.label}</div>
                  <p className="text-sm text-ink-muted">{company?.verificationStatus === 'verified' ? 'Your verified badge appears on issued documents.' : 'Complete your company details to get the verified badge.'}</p>
                  <Link href="/company" className="btn-secondary w-full justify-center">Manage company <ArrowUpRight className="h-4 w-4" /></Link>
                  <div className="pt-2 grid grid-cols-3 gap-2 text-center">
                    {[['Onboarding', emp?.onboarding ?? 0], ['On notice', emp?.onNotice ?? 0], ['Exited', emp?.exited ?? 0]].map(([l, n]) => (
                      <div key={l as string} className="rounded-lg bg-paper py-2"><p className="text-lg font-semibold text-ink">{n as number}</p><p className="text-[11px] text-ink-muted">{l as string}</p></div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Reveal>
          </div>
        </>
      )}
    </div>
  );
}
