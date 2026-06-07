'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, IndianRupee, Clock, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import type { Invoice, InvoiceStatus } from '@/lib/types';
import { formatMoney, formatDate, daysUntil } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { MiniStat } from '@/components/ui/MiniStat';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

const FILTERS: ('all' | InvoiceStatus)[] = ['all', 'draft', 'sent', 'paid', 'overdue'];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [q, setQ] = useState('');

  useEffect(() => { api.invoices.list(1, 200).then((p) => setInvoices(p.items)).catch(() => setInvoices([])); }, []);

  const all = invoices ?? [];
  const unpaid = all.filter((i) => i.status !== 'paid');
  const inrOutstanding = unpaid.reduce((s, i) => s + parseFloat(i.inrEquivalent || '0'), 0);
  const atRisk = unpaid.filter((i) => daysUntil(i.femaDueDate) <= 90).length;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const f of FILTERS.slice(1)) c[f] = all.filter((i) => i.status === f).length;
    return c;
  }, [all]);

  const filtered = all.filter((i) =>
    (filter === 'all' || i.status === filter) &&
    (q === '' || i.number.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Invoices"
        subtitle="Every export invoice, with its compliance trail and FEMA clock."
        icon={<FileText className="h-5 w-5" />}
        action={<Link href="/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New invoice</Link>}
      />

      {/* Summary strip */}
      <Reveal>
        <Card className="mb-5 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-paper-border/70 overflow-hidden">
          <MiniStat label="Total" value={invoices ? all.length : '—'} icon={<FileText className="h-4 w-4" />} tone="brand" />
          <MiniStat label="Unpaid" value={invoices ? unpaid.length : '—'} icon={<Clock className="h-4 w-4" />} tone="amber" />
          <MiniStat label="Outstanding" value={invoices ? formatMoney(inrOutstanding) : '—'} icon={<IndianRupee className="h-4 w-4" />} tone="blue" />
          <MiniStat label="FEMA at risk" value={invoices ? atRisk : '—'} icon={<AlertTriangle className="h-4 w-4" />} tone={atRisk ? 'red' : 'gray'} />
        </Card>
      </Reveal>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1 p-1 rounded-xl bg-white border border-paper-border shadow-card">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors', filter === f ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:text-ink')}>
              {f}
              {invoices && <span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', filter === f ? 'bg-brand-100 text-brand-700' : 'bg-paper text-ink-faint')}>{counts[f] ?? 0}</span>}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search number…" className="field pl-9" />
        </div>
      </div>

      <Reveal delay={60}>
        <Card>
          {invoices === null ? (
            <div className="p-5 space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<FileText className="h-6 w-6" />} title={all.length === 0 ? 'No invoices yet' : 'No matches'} description={all.length === 0 ? 'Create your first compliant export invoice.' : 'Try a different filter or search term.'} action={all.length === 0 ? <Link href="/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New invoice</Link> : undefined} />
          ) : (
            <Table>
              <THead><TH>Number</TH><TH>Date</TH><TH>FY</TH><TH>Amount</TH><TH>FEMA due</TH><TH className="text-right">Status</TH></THead>
              <tbody>
                {filtered.map((inv) => {
                  const d = daysUntil(inv.femaDueDate);
                  const atRiskRow = inv.status !== 'paid' && d <= 90;
                  return (
                    <TR key={inv.id} onClick={() => { window.location.href = `/invoices/${inv.id}`; }}>
                      <TD><div className="flex items-center gap-2"><span className="font-mono text-[13px] text-ink">{inv.number}</span><span className={cn('h-1.5 w-1.5 rounded-full', inv.type === 'domestic' ? 'bg-blue-500' : 'bg-brand-500')} title={inv.type === 'domestic' ? 'Domestic GST' : 'Export'} /></div></TD>
                      <TD>{formatDate(inv.invoiceDate)}</TD>
                      <TD><span className="font-mono text-xs text-ink-muted">{inv.financialYear}</span></TD>
                      <TD><span className="font-medium">{inv.currency} {parseFloat(inv.subtotal).toLocaleString()}</span><span className="text-ink-faint text-xs block">{formatMoney(inv.inrEquivalent)}</span></TD>
                      <TD>{inv.status === 'paid' ? <span className="text-ink-faint">—</span> : <span className={atRiskRow ? 'text-red-600 font-medium' : ''}>{formatDate(inv.femaDueDate)}{atRiskRow && <span className="block text-[11px]">{d}d left</span>}</span>}</TD>
                      <TD className="text-right"><StatusBadge status={inv.status} /></TD>
                    </TR>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
