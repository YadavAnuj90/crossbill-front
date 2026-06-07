'use client';
import Link from 'next/link';
import { ShieldCheck, BookOpen, LifeBuoy, Github, ArrowUpRight } from 'lucide-react';
import { financialYearOf } from '@/lib/compliance';

const LINKS: { heading: string; items: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: 'Product',
    items: [
      { label: 'Invoices', href: '/invoices' },
      { label: 'Clients', href: '/clients' },
      { label: 'Filing & reports', href: '/reports' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Business profile', href: '/profile' },
      { label: 'Team', href: '/team' },
      { label: 'Settings & billing', href: '/settings' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Help centre', href: '#' },
      { label: 'GST & FEMA guide', href: '#' },
      { label: 'What’s new', href: '#' },
    ],
  },
];

export function AppFooter() {
  const fy = financialYearOf(new Date());
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-paper-border">
      <div className="px-5 sm:px-8 py-8 max-w-6xl w-full mx-auto">
        <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand + compliance */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
                  <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-semibold text-ink tracking-tight">Crossbill</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted max-w-xs">
              Crossbill assists with documentation and calculation. It is not a substitute for professional
              tax advice — compliance templates should be reviewed by a practising CA.
            </p>
            <p className="mt-3 text-xs font-medium text-ink-soft">
              Built by <span className="text-brand-700">Anujali Technologies</span>.
            </p>
            <div className="mt-4 flex items-center gap-3 text-ink-faint">
              <a href="#" className="hover:text-ink transition-colors" aria-label="Docs"><BookOpen className="h-4 w-4" /></a>
              <a href="#" className="hover:text-ink transition-colors" aria-label="Support"><LifeBuoy className="h-4 w-4" /></a>
              <a href="#" className="hover:text-ink transition-colors" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow mb-3">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link href={it.href} className="group inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors">
                      {it.label}
                      {it.external && <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-paper-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-ink-faint">
            <span>© {year} Anujali Technologies Pvt. Ltd.</span>
            <span className="hidden sm:inline text-paper-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> FY {fy}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-2 text-ink-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              All systems operational
            </span>
            <span className="text-paper-border hidden sm:inline">·</span>
            <a href="#" className="text-ink-faint hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="text-ink-faint hover:text-ink transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
