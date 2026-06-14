'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import type { AgingInvoice, FemaBucket } from '@/lib/types';
import { FEMA_BUCKETS, agingProgress } from '@/lib/compliance';
import { formatMoney, formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

const ORDER: FemaBucket[] = ['overdue', 'critical', 'urgent', 'watch', 'ontrack'];

type Glow = 'brand' | 'amber' | 'red' | 'blue' | 'gray' | 'violet';
const BUCKET_GLOW: Record<FemaBucket, Glow> = {
  overdue: 'red', critical: 'red', urgent: 'amber', watch: 'blue', ontrack: 'brand',
};

export default function FemaTrackerPage() {
  const [rows, setRows] = useState<AgingInvoice[] | null>(null);
  const [active, setActive] = useState<FemaBucket | 'all'>('all');

  useEffect(() => { api.invoices.femaAging().then(setRows).catch(() => setRows([])); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows?.length ?? 0 };
    for (const b of ORDER) c[b] = (rows ?? []).filter((r) => r.aging.bucket === b).length;
    return c;
  }, [rows]);

  const filtered = (rows ?? []).filter((r) => active === 'all' || r.aging.bucket === active);

  return (
    <div>
      <PageHeader
        eyebrow="Compliance"
        title="FEMA tracker"
        subtitle="Export proceeds must be realised within one year of the invoice date. Stay ahead of every deadline."
        icon={<CalendarClock className="h-5 w-5" />}
      />

      {/* Bucket summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Reveal>
          <SpotlightCard glow="brand" onClick={() => setActive('all')} className="cursor-pointer p-4 text-left">
            {active === 'all' && <span aria-hidden className="pointer-events-none absolute inset-0 z-[2] rounded-2xl ring-2 ring-inset ring-brand-400" />}
            <p className="text-sm text-ink-muted">All unpaid</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{rows ? counts.all : '—'}</p>
          </SpotlightCard>
        </Reveal>
        {ORDER.map((b, i) => (
          <Reveal key={b} delay={(i + 1) * 60}>
            <SpotlightCard glow={BUCKET_GLOW[b]} onClick={() => setActive(b)} className="cursor-pointer p-4 text-left">
              {active === b && <span aria-hidden className="pointer-events-none absolute inset-0 z-[2] rounded-2xl ring-2 ring-inset ring-brand-400" />}
              <span className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', FEMA_BUCKETS[b].dot)} />
                <p className="text-sm text-ink-muted">{FEMA_BUCKETS[b].label}</p>
              </span>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{rows ? counts[b] : '—'}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={80}>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            rows.length === 0 ? (
              <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="All clear" description="No unpaid invoices are pending FEMA realisation. Nice and compliant." />
            ) : (
              <EmptyState icon={<ShieldCheck className="h-6 w-6" />} title={`Nothing in “${FEMA_BUCKETS[active as FemaBucket]?.label}”`} description="Try another risk bucket." />
            )
          ) : (
            <div className="divide-y divide-paper-border/70">
              {filtered.map((r) => {
                const meta = FEMA_BUCKETS[r.aging.bucket];
                const pct = Math.round(agingProgress(r.aging.daysToDue) * 100);
                return (
                  <Link key={r.id} href={`/invoices/${r.id}`} className="group flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-brand-50/40 hover:shadow-[inset_2px_0_0_0_#34d399]">
                    <span className={cn('hidden sm:grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3', meta.tone)}>
                      <CalendarClock className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[13px] text-ink">{r.number}</span>
                        <span className={cn('badge border text-[11px]', meta.tone)}>{meta.label}</span>
                      </div>
                      {/* aging bar */}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1.5 flex-1 max-w-xs rounded-full bg-paper-border overflow-hidden">
                          <div className={cn('h-full rounded-full', meta.bar)} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-ink-muted whitespace-nowrap">
                          {r.aging.daysToDue > 0 ? `${r.aging.daysToDue} days left` : `${Math.abs(r.aging.daysToDue)} days overdue`}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium text-ink">{r.currency} {parseFloat(r.subtotal).toLocaleString()}</p>
                      <p className="text-xs text-ink-faint">{formatMoney(r.inrEquivalent)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-faint">Due</p>
                      <p className="text-sm text-ink-soft">{formatDate(r.femaDueDate)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-faint shrink-0 transition group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
