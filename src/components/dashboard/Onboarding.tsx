'use client';
import Link from 'next/link';
import { Check, ArrowRight, Building2, Users, FileText } from 'lucide-react';
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

/** Professional onboarding checklist shown until the workspace is set up + first invoice exists. */
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

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-paper-border">
        <div>
          <h3 className="font-semibold text-ink">Get started</h3>
          <p className="text-sm text-ink-muted mt-0.5">{completed} of {steps.length} steps complete</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-28 rounded-full bg-paper-border overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-brand-700 tabular-nums">{pct}%</span>
        </div>
      </div>

      <ol className="divide-y divide-paper-border/70">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-4 px-5 py-4">
            <span className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold',
              s.done ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-paper-border text-ink-faint',
            )}>
              {s.done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn('font-medium', s.done ? 'text-ink-faint line-through' : 'text-ink')}>{s.title}</p>
              <p className="text-sm text-ink-muted mt-0.5">{s.desc}</p>
            </div>
            {!s.done && (
              <Link href={s.href} className="btn-secondary shrink-0 py-2 text-[13px]">
                {s.icon} {s.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
