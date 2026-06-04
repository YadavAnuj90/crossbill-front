'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, Clock, IndianRupee, AlertTriangle, Plus, ArrowRight, Users,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Invoice } from '@/lib/types';
import { formatMoney, formatDate, daysUntil } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { ComplianceBanner } from '@/components/layout/ComplianceBanner';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';

export default function DashboardPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    api.invoices.list(1, 100).then((p) => setInvoices(p.items)).catch(() => setInvoices([]));
  }, []);

  const unpaid = (invoices ?? []).filter((i) => i.status !== 'paid');
  const inrOutstanding = unpaid.reduce((s, i) => s + parseFloat(i.inrEquivalent || '0'), 0);
  const atRisk = unpaid.filter((i) => daysUntil(i.femaDueDate) <= 90);

  return (
    <div>
      <PageHeader
        title={`Welcome${user?.legalName ? `, ${user.legalName.split(' ')[0]}` : ''}`}
        subtitle="Here’s the state of your export invoicing and compliance."
        action={<Link href="/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New invoice</Link>}
      />

      <ComplianceBanner user={user} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total invoices" value={invoices ? invoices.length : <Skeleton className="h-7 w-12" />} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Unpaid" value={invoices ? unpaid.length : <Skeleton className="h-7 w-12" />} icon={<Clock className="h-5 w-5" />} tone="amber" />
        <StatCard label="Outstanding (INR)" value={invoices ? formatMoney(inrOutstanding) : <Skeleton className="h-7 w-24" />} icon={<IndianRupee className="h-5 w-5" />} />
        <StatCard label="FEMA at risk" value={invoices ? atRisk.length : <Skeleton className="h-7 w-12" />} icon={<AlertTriangle className="h-5 w-5" />} tone={atRisk.length ? 'red' : 'gray'} hint="≤ 90 days to realisation" />
      </div>

      <Card>
        <CardHeader
          title="Recent invoices"
          action={<Link href="/invoices" className="text-sm text-brand-700 font-medium hover:underline flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}
        />
        {invoices === null ? (
          <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No invoices yet"
            description="Create your first compliant export invoice — the declaration, SAC and INR equivalent fill themselves."
            action={<Link href="/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New invoice</Link>}
          />
        ) : (
          <Table>
            <THead><TH>Number</TH><TH>Date</TH><TH>Amount</TH><TH>FEMA due</TH><TH className="text-right">Status</TH></THead>
            <tbody>
              {invoices.slice(0, 6).map((inv) => {
                const d = daysUntil(inv.femaDueDate);
                return (
                  <TR key={inv.id}>
                    <TD><Link href={`/invoices/${inv.id}`} className="font-mono text-[13px] text-ink hover:text-brand-700">{inv.number}</Link></TD>
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
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/clients" className="card p-5 flex items-center gap-4 hover:shadow-lift transition-shadow">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Users className="h-5 w-5" /></span>
          <div><h3 className="font-medium text-ink">Manage clients</h3><p className="text-sm text-ink-muted">Add the foreign clients you bill.</p></div>
          <ArrowRight className="h-4 w-4 text-ink-faint ml-auto" />
        </Link>
        <Link href="/reports" className="card p-5 flex items-center gap-4 hover:shadow-lift transition-shadow">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><FileText className="h-5 w-5" /></span>
          <div><h3 className="font-medium text-ink">Export for filing</h3><p className="text-sm text-ink-muted">GSTR-1 6A statement for your CA.</p></div>
          <ArrowRight className="h-4 w-4 text-ink-faint ml-auto" />
        </Link>
      </div>
    </div>
  );
}
