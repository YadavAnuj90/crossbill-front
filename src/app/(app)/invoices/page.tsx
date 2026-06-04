'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search } from 'lucide-react';
import api from '@/lib/api';
import type { Invoice, InvoiceStatus } from '@/lib/types';
import { formatMoney, formatDate, daysUntil } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { cn } from '@/lib/cn';

const FILTERS: ('all' | InvoiceStatus)[] = ['all', 'draft', 'sent', 'paid', 'overdue'];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [q, setQ] = useState('');

  useEffect(() => { api.invoices.list(1, 200).then((p) => setInvoices(p.items)).catch(() => setInvoices([])); }, []);

  const filtered = (invoices ?? []).filter((i) =>
    (filter === 'all' || i.status === filter) &&
    (q === '' || i.number.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Every export invoice, with its compliance trail and FEMA clock."
        action={<Link href="/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New invoice</Link>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1 p-1 rounded-xl bg-paper-card border border-paper-border">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors', filter === f ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:text-ink')}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search number…" className="field pl-9" />
        </div>
      </div>

      <Card>
        {invoices === null ? (
          <div className="p-5 space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FileText className="h-6 w-6" />} title={invoices.length === 0 ? 'No invoices yet' : 'No matches'} description={invoices.length === 0 ? 'Create your first compliant export invoice.' : 'Try a different filter or search term.'} action={invoices.length === 0 ? <Link href="/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New invoice</Link> : undefined} />
        ) : (
          <Table>
            <THead><TH>Number</TH><TH>Date</TH><TH>FY</TH><TH>Amount</TH><TH>FEMA due</TH><TH className="text-right">Status</TH></THead>
            <tbody>
              {filtered.map((inv) => {
                const d = daysUntil(inv.femaDueDate);
                const atRisk = inv.status !== 'paid' && d <= 90;
                return (
                  <TR key={inv.id} onClick={() => { window.location.href = `/invoices/${inv.id}`; }}>
                    <TD><span className="font-mono text-[13px] text-ink">{inv.number}</span></TD>
                    <TD>{formatDate(inv.invoiceDate)}</TD>
                    <TD><span className="font-mono text-xs text-ink-muted">{inv.financialYear}</span></TD>
                    <TD><span className="font-medium">{inv.currency} {parseFloat(inv.subtotal).toLocaleString()}</span><span className="text-ink-faint text-xs block">{formatMoney(inv.inrEquivalent)}</span></TD>
                    <TD>{inv.status === 'paid' ? <span className="text-ink-faint">—</span> : <span className={atRisk ? 'text-red-600 font-medium' : ''}>{formatDate(inv.femaDueDate)}{atRisk && <span className="block text-[11px]">{d}d left</span>}</span>}</TD>
                    <TD className="text-right"><StatusBadge status={inv.status} /></TD>
                  </TR>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
