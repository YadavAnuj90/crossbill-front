'use client';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { Profile } from '@/lib/types';

/** Nudges the user to finish the profile fields required for compliant invoices. */
export function ComplianceBanner({ user }: { user: Profile | null }) {
  if (!user) return null;
  const missing: string[] = [];
  if (!user.gstin) missing.push('GSTIN');
  if (!user.legalName) missing.push('legal name');
  if (!user.lutNumber) missing.push('LUT details');
  if (!user.bankAccount) missing.push('bank details');
  if (missing.length === 0) return null;

  return (
    <Link
      href="/profile"
      className="group relative mb-6 flex items-center gap-3.5 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/30 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-14px_rgba(245,158,11,0.5)]"
    >
      <span className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-amber-300/25 blur-2xl" />
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 ring-1 ring-amber-200">
        <AlertTriangle className="h-[18px] w-[18px]" />
      </span>
      <p className="relative flex-1 text-sm text-amber-900">
        Complete your business profile to issue fully compliant invoices — missing{' '}
        <span className="font-semibold">{missing.join(', ')}</span>.
      </p>
      <span className="relative hidden shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform group-hover:translate-x-0.5 sm:inline-flex">
        Complete now <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
