'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Blocks, CreditCard, BookOpen, Calculator, RefreshCw, Landmark, Mail, ArrowUpRight,
  Zap, Sparkles, KeyRound, Clock,
} from 'lucide-react';
import api from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/motion/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { cn } from '@/lib/cn';

type Glow = 'brand' | 'amber' | 'red' | 'blue' | 'gray' | 'violet';

type Status = 'connected' | 'action' | 'soon';

interface Integration {
  key: string;
  name: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
  tone: string;
  glow: Glow;
  href?: string;
}

const ITEMS: Integration[] = [
  { key: 'razorpay', name: 'Razorpay', category: 'Payments & billing', desc: 'Payment links on invoices, auto-reconciliation and subscription billing.', icon: <CreditCard className="h-5 w-5" />, tone: 'from-blue-500 to-indigo-600', glow: 'blue', href: '/payments' },
  { key: 'stripe', name: 'Stripe', category: 'Payments', desc: 'Collect international card payments and sync settlements.', icon: <CreditCard className="h-5 w-5" />, tone: 'from-violet-500 to-purple-600', glow: 'violet' },
  { key: 'zoho', name: 'Zoho Books', category: 'Accounting', desc: 'Push invoices and credit/debit notes into your books.', icon: <BookOpen className="h-5 w-5" />, tone: 'from-rose-500 to-red-600', glow: 'red' },
  { key: 'tally', name: 'Tally', category: 'Accounting', desc: 'Export vouchers as Tally-ready XML for your accountant.', icon: <Calculator className="h-5 w-5" />, tone: 'from-amber-500 to-orange-600', glow: 'amber' },
  { key: 'quickbooks', name: 'QuickBooks', category: 'Accounting', desc: 'Two-way sync of customers, invoices and payments.', icon: <RefreshCw className="h-5 w-5" />, tone: 'from-emerald-500 to-green-600', glow: 'brand' },
  { key: 'gst', name: 'GST Portal', category: 'Filing', desc: 'File GSTR-1 and validate GSTINs without leaving Crossbill.', icon: <Landmark className="h-5 w-5" />, tone: 'from-cyan-500 to-teal-600', glow: 'blue' },
  { key: 'email', name: 'Email (Resend / SMTP)', category: 'Notifications', desc: 'Send invoices and FEMA reminders from your own domain.', icon: <Mail className="h-5 w-5" />, tone: 'from-slate-500 to-slate-700', glow: 'gray' },
];

function StatusPill({ status }: { status: Status }) {
  if (status === 'connected')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
        <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" /></span>
        Connected
      </span>
    );
  if (status === 'action')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
        <KeyRound className="h-3 w-3" /> Add keys
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink-faint ring-1 ring-inset ring-paper-border">
      <Clock className="h-3 w-3" /> Coming soon
    </span>
  );
}

export default function IntegrationsPage() {
  const [razorpay, setRazorpay] = useState<Status>('soon');

  useEffect(() => {
    api.payments.status()
      .then((s) => setRazorpay(s.configured ? 'connected' : 'action'))
      .catch(() => setRazorpay('action'));
  }, []);

  const statusOf = (key: string): Status => (key === 'razorpay' ? razorpay : 'soon');

  const live = ITEMS.filter((i) => statusOf(i.key) === 'connected').length;
  const setup = ITEMS.filter((i) => statusOf(i.key) === 'action').length;
  const soon = ITEMS.filter((i) => statusOf(i.key) === 'soon').length;

  const SUMMARY = [
    { label: 'Live', value: live, icon: <Zap className="h-4 w-4" />, tone: 'text-brand-600 bg-brand-50 ring-brand-200' },
    { label: 'Needs setup', value: setup, icon: <KeyRound className="h-4 w-4" />, tone: 'text-amber-600 bg-amber-50 ring-amber-200' },
    { label: 'Coming soon', value: soon, icon: <Clock className="h-4 w-4" />, tone: 'text-ink-muted bg-paper ring-paper-border' },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Setup"
        title="Integrations"
        subtitle="Connect Crossbill to the accounting, payment and filing tools you already use."
        icon={<Blocks className="h-5 w-5" />}
      />

      {/* Summary band */}
      <Reveal>
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-white via-[#f4f7f6] to-[#eef0fb] px-5 py-5 shadow-card ring-1 ring-black/[0.02] sm:px-7">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-300/25 blur-[80px]" />
          <div className="absolute -left-10 bottom-[-3rem] h-40 w-40 rounded-full bg-[#bcc6ff]/30 blur-[80px]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow"><Sparkles className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-ink">{ITEMS.length} integrations</p>
                <p className="text-xs text-ink-muted">Razorpay is live — the rest light up the moment their credentials land.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {SUMMARY.map((s) => (
                <div key={s.label} className={cn('flex items-center gap-2 rounded-2xl px-3 py-2 ring-1 ring-inset', s.tone)}>
                  {s.icon}
                  <span className="text-lg font-semibold tabular-nums leading-none">{s.value}</span>
                  <span className="text-[11px] font-medium opacity-80 leading-none">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it, i) => {
          const status = statusOf(it.key);
          const liveCard = status === 'connected' || status === 'action';
          return (
            <Reveal key={it.key} delay={i * 50}>
              <SpotlightCard glow={it.glow} className="h-full">
                {liveCard && <span aria-hidden className="pointer-events-none absolute inset-0 z-[2] rounded-2xl ring-2 ring-inset ring-brand-200/70" />}

                <div className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between">
                    <span className={cn('grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6', it.tone)}>{it.icon}</span>
                    <StatusPill status={status} />
                  </div>

                  <h3 className="mt-4 font-semibold text-ink">{it.name}</h3>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{it.category}</p>
                  <p className="mt-2 flex-1 text-sm text-ink-muted leading-snug">{it.desc}</p>

                  <div className="mt-4">
                    {status === 'connected' && it.href ? (
                      <Link href={it.href} className="btn-primary w-full justify-center">Manage <ArrowUpRight className="h-4 w-4" /></Link>
                    ) : status === 'action' ? (
                      <button className="btn-secondary w-full justify-center border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" title="Add RAZORPAY_KEY_ID / SECRET to the API .env"><KeyRound className="h-4 w-4" /> Add keys in .env</button>
                    ) : (
                      <button className="btn-secondary w-full justify-center text-ink-faint" disabled>Coming soon</button>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}

        {/* Request integration card */}
        <Reveal delay={ITEMS.length * 50}>
          <a
            href="mailto:hello@crossbill.app?subject=Integration%20request"
            className="group flex h-full min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-paper-border bg-white/40 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:bg-white"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-paper text-ink-muted ring-1 ring-inset ring-paper-border transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
              <Blocks className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">Need another tool?</p>
              <p className="mt-0.5 text-sm text-ink-muted">Tell us what to build next.</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">Request integration <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </a>
        </Reveal>
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint max-w-xl mx-auto leading-relaxed">
        Razorpay is live now. Each remaining integration connects via OAuth or an API key you provide — they’ll switch on here the moment their credentials are added.
      </p>
    </div>
  );
}
