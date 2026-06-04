// Display formatters.

export function formatMoney(amount: string | number, currency = 'INR'): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return '—';
  const symbol = currency === 'INR' ? '₹' : '';
  const formatted = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return symbol ? `${symbol}${formatted}` : `${currency} ${formatted}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysUntil(iso: string): number {
  const due = new Date(`${iso}T00:00:00Z`).getTime();
  return Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
  CA: 'Canada', AU: 'Australia', SG: 'Singapore', AE: 'UAE', NL: 'Netherlands',
  IE: 'Ireland', CH: 'Switzerland', SE: 'Sweden', JP: 'Japan',
};
export function countryName(code: string): string {
  return COUNTRY_NAMES[code?.toUpperCase()] ?? code;
}

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return '🌐';
  const cc = code.toUpperCase();
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
}
