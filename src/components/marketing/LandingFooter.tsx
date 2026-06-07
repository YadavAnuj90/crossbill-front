import Link from 'next/link';
import { Logo } from './Logo';

const COLS = [
  { h: 'Product', items: [['Features', '#features'], ['How it works', '#how'], ['Pricing', '#pricing']] },
  { h: 'Company', items: [['About', '#'], ['Blog', '#'], ['Contact', '#']] },
  { h: 'Legal', items: [['Privacy', '#'], ['Terms', '#'], ['Compliance', '#']] },
];

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-paper-border bg-white/50">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-ink-muted max-w-xs leading-relaxed">
              Correct USD export invoicing and GST/FEMA compliance, built for Indian developers and
              small agencies billing foreign clients.
            </p>
            <p className="mt-4 text-sm font-medium text-ink-soft">Built by <span className="text-brand-700">Anujali Technologies</span>.</p>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <p className="eyebrow mb-3">{c.h}</p>
              <ul className="space-y-2.5">
                {c.items.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-sm text-ink-muted hover:text-ink transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-paper-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <span>© {year} Anujali Technologies Pvt. Ltd.</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
