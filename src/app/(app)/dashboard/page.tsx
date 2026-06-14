'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, Clock, IndianRupee, AlertTriangle, Plus, ArrowRight, ShieldCheck, ArrowUpRight, Users, CalendarDays,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Invoice } from '@/lib/types';
import { formatMoney, formatDate, daysUntil } from '@/lib/format';
import { financialYearOf } from '@/lib/compliance';
import { ComplianceBanner } from '@/components/layout/ComplianceBanner';
import { StatCard } from '@/components/dashboard/StatCard';
import { Onboarding } from '@/components/dashboard/Onboarding';
import { CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Reveal } from '@/components/motion/Reveal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [clientCount, setClientCount] = useState<number | null>(null);

  useEffect(() => {
    api.invoices.list(1, 100).then((p) => setInvoices(p.items)).catch(() => setInvoices([]));
    api.clients.list(1, 1).then((p) => setClientCount(p.meta.total)).catch(() => setClientCount(0));
  }, []);

  const unpaid = (invoices ?? []).filter((i) => i.status !== 'paid');
  const inrOutstanding = unpaid.reduce((s, i) => s + parseFloat(i.inrEquivalent || '0'), 0);
  const atRisk = unpaid.filter((i) => daysUntil(i.femaDueDate) <= 90);
  const firstName = user?.legalName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const isEmpty = invoices !== null && invoices.length === 0;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      {/* Hero header */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-white via-[#f4f7f6] to-[#eef0fb] px-6 py-8 sm:px-9 mb-6 shadow-card ring-1 ring-black/[0.02]">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-brand-300/25 blur-[90px]" />
          <div className="absolute -left-10 bottom-[-4rem] h-48 w-48 rounded-full bg-[#bcc6ff]/30 blur-[90px]" />
          <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.04]" />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-200/60"><ShieldCheck className="h-3.5 w-3.5" /> Export-compliant invoicing</span>
                <span className="badge bg-white text-ink-muted ring-1 ring-black/[0.05]"><CalendarDays className="h-3.5 w-3.5" /> {today} · FY {financialYearOf(new Date())}</span>
              </div>
              <h1 className="text-2xl sm:text-[30px] font-semibold tracking-tight text-ink">Welcome back, {firstName}</h1>
              <p className="mt-1.5 text-sm text-ink-muted max-w-md">Here’s the state of your export invoicing and FEMA compliance.</p>
            </div>
            <Link href="/invoices/new" className="btn-primary px-5 py-3 text-[15px] shrink-0 self-start sm:self-auto">
              <Plus className="h-4 w-4" /> New invoice
            </Link>
          </div>
        </div>
      </Reveal>

      <ComplianceBanner user={user} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: 'Total invoices', value: invoices ? invoices.length : <Skeleton className="h-7 w-12" />, icon: <FileText />, tone: 'brand' as const },
          { label: 'Unpaid', value: invoices ? unpaid.length : <Skeleton className="h-7 w-12" />, icon: <Clock />, tone: 'amber' as const, hint: invoices ? `${unpaid.length} awaiting payment` : undefined },
          { label: 'Outstanding (INR)', value: invoices ? formatMoney(inrOutstanding) : <Skeleton className="h-7 w-24" />, icon: <IndianRupee />, tone: 'blue' as const },
          { label: 'FEMA at risk', value: invoices ? atRisk.length : <Skeleton className="h-7 w-12" />, icon: <AlertTriangle />, tone: (atRisk.length ? 'red' : 'gray') as 'red' | 'gray', hint: '≤ 90 days to realisation' },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <StatCard label={s.label} value={s.value} icon={s.icon} tone={s.tone} hint={s.hint} />
          </Reveal>
        ))}
      </div>

      {/* Onboarding (empty) OR recent invoices */}
      <Reveal delay={80}>
        {isEmpty ? (
          <Onboarding user={user} hasClients={(clientCount ?? 0) > 0} hasInvoices={false} />
        ) : (
          <div className="card overflow-hidden">
            <CardHeader
              title="Recent invoices"
              action={<Link href="/invoices" className="text-sm text-brand-700 font-medium hover:underline flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}
            />
            {invoices === null ? (
              <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <Table>
                <THead><TH>Number</TH><TH>Date</TH><TH>Amount</TH><TH>FEMA due</TH><TH className="text-right">Status</TH></THead>
                <tbody>
                  {invoices.slice(0, 6).map((inv) => {
                    const d = daysUntil(inv.femaDueDate);
                    return (
                      <TR key={inv.id} onClick={() => { window.location.href = `/invoices/${inv.id}`; }}>
                        <TD><span className="font-mono text-[13px] text-ink">{inv.number}</span></TD>
                        <TD>{formatDate(inv.invoiceDate)}</TD>
                        <TD><span className="font-medium">{inv.currency} {parseFloat(inv.subtotal).toLocaleString()}</span><span className="text-ink-faint text-xs block">{formatMoney(inv.inrEquivalent)}</span></TD>
                        <TD>{inv.status === 'paid' ? <span className="text-ink-faint">—</span> : <span className={d <= 90 ? 'text-red-600 font-medium' : ''}>{formatDate(inv.femaDueDate)}</span>}</TD>
                        <TD className="text-right"><StatusBadge status={inv.status} /></TD>
                      </TR>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Reveal>

      {/* Quick links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/clients', title: 'Manage clients', desc: 'Your foreign billing contacts', icon: <Users className="h-5 w-5" /> },
          { href: '/reports', title: 'Filing & reports', desc: 'GSTR-1 6A for your CA', icon: <FileText className="h-5 w-5" /> },
          { href: '/profile', title: 'Business profile', desc: 'GSTIN, LUT & bank details', icon: <ShieldCheck className="h-5 w-5" /> },
        ].map((q, i) => (
          <Reveal key={q.href} delay={i * 70}>
            <SpotlightCard glow="brand">
              <Link href={q.href} className="absolute inset-0 z-[3]" aria-label={q.title} />
              <div className="relative flex items-center gap-4 p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{q.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink truncate">{q.title}</h3>
                  <p className="text-sm text-ink-muted truncate">{q.desc}</p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
