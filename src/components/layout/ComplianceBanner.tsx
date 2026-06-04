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
      className="group flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 mb-6 transition-colors hover:bg-amber-100/70"
    >
      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
      <p className="text-sm text-amber-900 flex-1">
        Complete your business profile to issue fully compliant invoices — missing{' '}
        <span className="font-medium">{missing.join(', ')}</span>.
      </p>
      <ArrowRight className="h-4 w-4 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
