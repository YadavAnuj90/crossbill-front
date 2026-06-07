// Client-side mirror of the backend compliance engine — used for the live invoice preview
// BEFORE submission. The authoritative values are always recomputed server-side.

export const PLACE_OF_SUPPLY_EXPORT = 'Outside India (export of services)';

export function financialYearOf(date: Date): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const startYear = m >= 3 ? y : y - 1;
  const endYY = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}-${endYY}`;
}

export function femaDueDate(invoiceDate: Date): Date {
  const d = new Date(invoiceDate);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d;
}

export function renderDeclaration(opts: { onLut: boolean; lutArn?: string | null; lutFy?: string | null }): string {
  if (!opts.onLut) {
    return (
      'Supply meant for export with payment of Integrated Goods and Services Tax (IGST), ' +
      'eligible for refund of IGST paid.'
    );
  }
  return (
    'Supply meant for export under LUT (Letter of Undertaking) without payment of ' +
    `Integrated Goods and Services Tax (IGST). LUT ARN: ${opts.lutArn ?? 'N/A'}, FY: ${opts.lutFy ?? 'N/A'}.`
  );
}

// Indicative FX rates for the preview only (matches backend stub). Real rate is captured on submit.
const PREVIEW_FX: Record<string, number> = { USD: 83.5, EUR: 90.2, GBP: 105.7, AUD: 55.4, CAD: 61.2, SGD: 62.0, AED: 22.7 };
export function previewFxRate(currency: string): number {
  return PREVIEW_FX[currency.toUpperCase()] ?? 83.0;
}

import type { FemaBucket } from './types';

export function femaBucket(daysToDue: number): FemaBucket {
  if (daysToDue <= 0) return 'overdue';
  if (daysToDue <= 30) return 'critical';
  if (daysToDue <= 60) return 'urgent';
  if (daysToDue <= 90) return 'watch';
  return 'ontrack';
}

/** 0..1 progress through the 1-year FEMA realisation window. */
export function agingProgress(daysToDue: number): number {
  return Math.min(1, Math.max(0, (365 - daysToDue) / 365));
}

export const FEMA_BUCKETS: Record<FemaBucket, { label: string; tone: string; bar: string; dot: string }> = {
  overdue:  { label: 'Overdue',  tone: 'text-red-700 bg-red-50 border-red-200',       bar: 'bg-red-500',    dot: 'bg-red-500' },
  critical: { label: 'Critical', tone: 'text-red-700 bg-red-50 border-red-200',       bar: 'bg-red-500',    dot: 'bg-red-500' },
  urgent:   { label: 'Urgent',   tone: 'text-amber-700 bg-amber-50 border-amber-200', bar: 'bg-amber-500',  dot: 'bg-amber-500' },
  watch:    { label: 'Watch',    tone: 'text-blue-700 bg-blue-50 border-blue-200',    bar: 'bg-blue-500',   dot: 'bg-blue-500' },
  ontrack:  { label: 'On track', tone: 'text-brand-700 bg-brand-50 border-brand-200', bar: 'bg-brand-500',  dot: 'bg-brand-500' },
};

// ── Domestic GST (client-side mirror for the live preview) ──
export interface GstPreview {
  taxType: 'IGST' | 'CGST_SGST';
  intra: boolean;
  cgst: number; sgst: number; igst: number;
  taxTotal: number; grandTotal: number;
}

export function computeGstPreview(
  lines: { lineTotal: number; gstRate: number }[],
  supplierState: string | null,
  clientState: string | null,
): GstPreview {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const tax = lines.reduce((s, l) => s + (l.lineTotal * l.gstRate) / 100, 0);
  const intra = Boolean(supplierState && clientState && supplierState === clientState);
  if (intra) {
    const half = tax / 2;
    return { taxType: 'CGST_SGST', intra, cgst: half, sgst: tax - half, igst: 0, taxTotal: tax, grandTotal: subtotal + tax };
  }
  return { taxType: 'IGST', intra, cgst: 0, sgst: 0, igst: tax, taxTotal: tax, grandTotal: subtotal + tax };
}
