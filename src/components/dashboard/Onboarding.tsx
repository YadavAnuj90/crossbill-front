'use client';
import Link from 'next/link';
import { Check, ArrowRight, Building2, Users, FileText, Sparkles, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Profile } from '@/lib/types';

interface Step {
  done: boolean;
  title: string;
  desc: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div className="relative grid h-14 w-14 shrink-0 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e9e8e3" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none" stroke="url(#ring-grad)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <span className="text-[13px] font-semibold text-brand-700 tabular-nums">{pct}%</span>
    </div>
  );
}

/** Premium onboarding timeline shown until the workspace is set up + first invoice exists. */
export function Onboarding({ user, hasClients, hasInvoices }: {
  user: Profile | null; hasClients: boolean; hasInvoices: boolean;
}) {
  const profileDone = Boolean(user?.gstin && user?.legalName && user?.lutNumber && user?.bankAccount);

  const steps: Step[] = [
    { done: profileDone, title: 'Complete your business profile', desc: 'GSTIN, legal name, LUT and bank details power the auto-filled compliance fields.', href: '/profile', cta: 'Set up profile', icon: <Building2 className="h-4 w-4" /> },
    { done: hasClients, title: 'Add your first foreign client', desc: 'Name, country and address — that’s the whole setup.', href: '/clients', cta: 'Add client', icon: <Users className="h-4 w-4" /> },
    { done: hasInvoices, title: 'Create your first export invoice', desc: 'The declaration, SAC and INR equivalent fill themselves.', href: '/invoices/new', cta: 'New invoice', icon: <FileText className="h-4 w-4" /> },
  ];
  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);
  const allDone = completed === steps.length;
  const currentIdx = steps.findIndex((s) => !s.done);

  return (
    <div className="card overflow-hidden">
      {/* header */}
      <div className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-paper-border bg-gradient-to-br from-white via-white to-[#eef0fb] px-5 py-4">
        <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            {allDone ? <PartyPopper className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </span>
          <div>
            <h3 className="font-semibold text-ink">{allDone ? "You're all set" : 'Get started'}</h3>
            <p className="text-sm text-ink-muted mt-0.5">{allDone ? 'Your workspace is fully configured.' : `${completed} of ${steps.length} steps · finish setup to start billing`}</p>
          </div>
        </div>
        <ProgressRing pct={pct} />
      </div>

      {/* timeline */}
      <ol className="relative p-3 sm:p-4">
        {steps.map((s, i) => {
          const current = i === currentIdx;
          return (
            <li key={i} className="relative">
              {i < steps.length - 1 && (
                <span aria-hidden className="absolute left-[1.9rem] top-[3.4rem] bottom-1 z-0 w-px bg-gradient-to-b from-paper-border to-transparent" />
              )}
              <div className={cn(
                'group relative z-[1] flex items-center gap-4 rounded-2xl p-3 transition-all duration-200',
                current ? 'bg-brand-50/70 ring-1 ring-inset ring-brand-200' : 'hover:bg-paper/70',
              )}>
                <span className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold ring-1 transition-transform duration-300 group-hover:scale-105',
                  s.done
                    ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white ring-brand-600 shadow-sm'
                    : current
                      ? 'bg-white text-brand-700 ring-brand-300 shadow-sm'
                      : 'bg-white text-ink-faint ring-paper-border',
                )}>
                  {s.done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn('font-medium flex items-center gap-2', s.done ? 'text-ink-faint line-through' : 'text-ink')}>
                    {s.title}
                    {current && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">Next</span>}
                  </p>
                  <p className="text-sm text-ink-muted mt-0.5">{s.desc}</p>
                </div>
                {s.done ? (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200"><Check className="h-3 w-3" /> Done</span>
                ) : (
                  <Link href={s.href} className={cn('shrink-0 py-2 text-[13px]', current ? 'btn-primary' : 'btn-secondary')}>
                    {s.icon} {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
