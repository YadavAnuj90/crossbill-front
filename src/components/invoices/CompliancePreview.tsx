'use client';
import { ShieldCheck, Globe, CalendarClock, Coins } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { formatMoney, formatDate } from '@/lib/format';
import {
  financialYearOf, femaDueDate, renderDeclaration, previewFxRate, PLACE_OF_SUPPLY_EXPORT,
} from '@/lib/compliance';

interface Props {
  user: Profile | null;
  currency: string;
  invoiceDate: string;
  subtotal: number;
}

/**
 * Live mirror of the backend compliance engine — shows the user exactly what will be stamped
 * on the invoice before they submit. Authoritative values are recomputed server-side.
 */
export function CompliancePreview({ user, currency, invoiceDate, subtotal }: Props) {
  const dateObj = new Date(`${invoiceDate}T00:00:00Z`);
  const valid = !Number.isNaN(dateObj.getTime());
  const fy = valid ? financialYearOf(dateObj) : '—';
  const fema = valid ? formatDate(femaDueDate(dateObj).toISOString().slice(0, 10)) : '—';
  const onLut = Boolean(user?.lutNumber);
  const declaration = renderDeclaration({ onLut, lutArn: user?.lutArn, lutFy: user?.lutFy });
  const rate = previewFxRate(currency);
  const inr = subtotal * rate;

  const Row = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-paper-border/70 last:border-0">
      <span className="text-brand-600 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-faint">{label}</p>
        <div className="text-sm text-ink-soft mt-0.5">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="card overflow-hidden sticky top-20">
      <div className="bg-brand-600 px-5 py-4 flex items-center gap-2.5">
        <ShieldCheck className="h-5 w-5 text-white" />
        <div>
          <p className="text-sm font-semibold text-white">Compliance preview</p>
          <p className="text-xs text-brand-100">Auto-filled — you don’t set these.</p>
        </div>
      </div>
      <div className="px-5 py-1">
        <Row icon={<Globe className="h-4 w-4" />} label="Place of supply">{PLACE_OF_SUPPLY_EXPORT}</Row>
        <Row icon={<ShieldCheck className="h-4 w-4" />} label={onLut ? 'Export declaration (under LUT)' : 'Export declaration (with IGST)'}>
          <span className="leading-snug">{declaration}</span>
        </Row>
        <Row icon={<Coins className="h-4 w-4" />} label={`Exchange rate (preview · ${currency})`}>
          <span className="font-mono">1 {currency} = ₹{rate.toFixed(2)}</span>
          <span className="text-ink-faint text-xs block">Real CBIC/RBI rate captured on submit</span>
        </Row>
        <Row icon={<CalendarClock className="h-4 w-4" />} label="Financial year · FEMA realisation due">
          <span className="font-mono">{fy}</span> · due {fema}
        </Row>
      </div>
      <div className="bg-paper px-5 py-4 border-t border-paper-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Subtotal</span>
          <span className="font-medium">{currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-ink-muted text-sm">INR equivalent (est.)</span>
          <span className="font-semibold text-ink">{formatMoney(inr)}</span>
        </div>
      </div>
    </div>
  );
}
