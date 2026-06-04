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
