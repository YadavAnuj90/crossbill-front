'use client';
import Link from 'next/link';
import { ShieldCheck, ArrowUp, Heart } from 'lucide-react';
import { financialYearOf } from '@/lib/compliance';

export function AppFooter() {
  const fy = financialYearOf(new Date());
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-paper-border/70">
      <div className="px-5 sm:px-8 py-5 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-2 font-medium text-ink-muted">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700">
              <svg width="11" height="11" viewBox="0 0 32 32" fill="none">
                <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Crossbill
          </span>
          <span className="text-paper-border">·</span>
          <span>© {year} Anujali Technologies</span>
          <span className="hidden sm:inline text-paper-border">·</span>
          <span className="hidden sm:inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> FY {fy}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-xs">
          <Link href="/privacy" className="text-ink-faint hover:text-ink transition-colors">Privacy</Link>
          <Link href="/terms" className="text-ink-faint hover:text-ink transition-colors">Terms</Link>
          <Link href="/contact" className="text-ink-faint hover:text-ink transition-colors">Support</Link>
          <span className="text-paper-border">·</span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
            Operational
          </span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="grid h-7 w-7 place-items-center rounded-lg border border-paper-border bg-white text-ink-muted hover:text-ink hover:bg-paper transition"><ArrowUp className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <p className="pb-5 text-center text-[11px] text-ink-faint flex items-center justify-center gap-1.5">
        Built with <Heart className="h-3 w-3 text-brand-500 fill-brand-500" /> by Anujali Technologies · Made in India 🇮🇳
      </p>
    </footer>
  );
}
