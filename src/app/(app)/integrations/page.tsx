'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Blocks, CreditCard, BookOpen, Calculator, RefreshCw, Landmark, Mail, ArrowUpRight,
  Zap, KeyRound, Clock, PenLine, Stamp, Check,
} from 'lucide-react';
import api from '@/lib/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type Status = 'connected' | 'action' | 'soon';

interface Integration {
  key: string;
  name: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
  tone: string;
  href?: string;
}

const ITEMS: Integration[] = [
  { key: 'razorpay', name: 'Razorpay', category: 'Payments & billing', desc: 'Payment links on invoices, auto-reconciliation and subscription billing.', icon: <CreditCard className="h-5 w-5" />, tone: 'from-blue-500 to-indigo-600', href: '/payments' },
  { key: 'aadhaar', name: 'Aadhaar eSign / DSC', category: 'Signatures', desc: 'Aadhaar-OTP & DSC signatures via a GSP/ASP (Digio, Protean, SignDesk). Native eSign already works without this.', icon: <PenLine className="h-5 w-5" />, tone: 'from-blue-500 to-cyan-600', href: '/agreements' },
  { key: 'estamp', name: 'Digital eStamp', category: 'Stamping', desc: 'Pay state stamp duty online and affix it to agreements (SHCIL).', icon: <Stamp className="h-5 w-5" />, tone: 'from-amber-500 to-yellow-600' },
  { key: 'stripe', name: 'Stripe', category: 'Payments', desc: 'Collect international card payments and sync settlements.', icon: <CreditCard className="h-5 w-5" />, tone: 'from-violet-500 to-purple-600' },
  { key: 'zoho', name: 'Zoho Books', category: 'Accounting', desc: 'Push invoices and credit/debit notes into your books.', icon: <BookOpen className="h-5 w-5" />, tone: 'from-rose-500 to-red-600' },
  { key: 'tally', name: 'Tally', category: 'Accounting', desc: 'Export vouchers as Tally-ready XML for your accountant.', icon: <Calculator className="h-5 w-5" />, tone: 'from-amber-500 to-orange-600' },
  { key: 'quickbooks', name: 'QuickBooks', category: 'Accounting', desc: 'Two-way sync of customers, invoices and payments.', icon: <RefreshCw className="h-5 w-5" />, tone: 'from-emerald-500 to-green-600' },
  { key: 'gst', name: 'GST Portal', category: 'Filing', desc: 'File GSTR-1 and validate GSTINs without leaving Crossbill.', icon: <Landmark className="h-5 w-5" />, tone: 'from-cyan-500 to-teal-600' },
  { key: 'email', name: 'Email (Resend / SMTP)', category: 'Notifications', desc: 'Send invoices and FEMA reminders from your own domain.', icon: <Mail className="h-5 w-5" />, tone: 'from-slate-500 to-slate-700' },
];

function StatusPill({ status }: { status: Status }) {
  if (status === 'connected')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
        <Check className="h-3 w-3" /> Connected
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
  const [aadhaar, setAadhaar] = useState<Status>('soon');
  const [estamp, setEstamp] = useState<Status>('soon');

  useEffect(() => {
    api.payments.status()
      .then((s) => setRazorpay(s.configured ? 'connected' : 'action'))
      .catch(() => setRazorpay('action'));
    api.agreements.esignStatus()
      .then((s) => { setAadhaar(s.aadhaarEsign ? 'connected' : 'action'); setEstamp(s.eStamp ? 'connected' : 'action'); })
      .catch(() => { setAadhaar('action'); setEstamp('action'); });
  }, []);

  function statusOf(key: string): Status {
    if (key === 'razorpay') return razorpay;
    if (key === 'aadhaar') return aadhaar;
    if (key === 'estamp') return estamp;
    return 'soon';
  }

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

      <Reveal>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {SUMMARY.map((s) => (
            <div key={s.label} className={cn('flex items-center gap-3 rounded-2xl border border-paper-border bg-paper-card px-4 py-3 shadow-card')}>
              <span className={cn('grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset', s.tone)}>{s.icon}</span>
              <div>
                <p className="text-xl font-semibold text-ink leading-none">{s.value}</p>
                <p className="text-xs text-ink-muted mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it, i) => {
          const status = statusOf(it.key);
          return (
            <Reveal key={it.key} delay={i * 40}>
              <Card className="h-full p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <span className={cn('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm', it.tone)}>{it.icon}</span>
                  <StatusPill status={status} />
                </div>
                <h3 className="mt-3.5 font-semibold text-ink">{it.name}</h3>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mt-0.5">{it.category}</p>
                <p className="mt-2 text-sm text-ink-muted leading-snug flex-1">{it.desc}</p>
                <div className="mt-4">
                  {status === 'connected' && it.href ? (
                    <Link href={it.href} className="btn-secondary w-full justify-center">Manage <ArrowUpRight className="h-4 w-4" /></Link>
                  ) : status === 'action' ? (
                    <button className="btn-secondary w-full justify-center" disabled>Add keys to enable</button>
                  ) : (
                    <button className="btn-secondary w-full justify-center opacity-60" disabled>Coming soon</button>
                  )}
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint max-w-xl mx-auto leading-relaxed">
        Razorpay payments and native eSign are live now. Aadhaar-grade eSign and eStamp connect via a provider key — they’ll switch on here the moment their credentials are added.
      </p>
    </div>
  );
}
