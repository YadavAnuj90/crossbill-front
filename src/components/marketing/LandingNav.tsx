'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV = [
  { label: 'Features', href: '/features' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ambient glow behind the bar */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-24 w-[46rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[70px] dark:bg-brand-500/15" />

      <div className={cn('relative mx-auto max-w-6xl px-4 transition-all duration-500', scrolled ? 'mt-3' : 'mt-4')}>
        {/* gradient-border wrapper */}
        <div className={cn(
          'rounded-2xl p-px transition-all duration-500',
          scrolled
            ? 'bg-gradient-to-r from-brand-400/60 via-black/[0.06] to-cyan-400/60 shadow-[0_10px_40px_-14px_rgba(16,185,129,0.35)] dark:via-white/10 dark:shadow-[0_10px_44px_-16px_rgba(0,0,0,0.7)]'
            : 'bg-gradient-to-r from-brand-400/25 via-transparent to-cyan-400/25',
        )}>
          <nav className={cn(
            'flex items-center justify-between rounded-[15px] px-4 py-2.5 backdrop-blur-2xl transition-all duration-500',
            scrolled
              ? 'bg-paper-card/80 dark:bg-[#0b0f1a]/75'
              : 'bg-paper-card/40 dark:bg-[#0b0f1a]/35',
          )}>
            <Link href="/" className="group inline-flex items-center transition-transform duration-300 hover:scale-[1.03]">
              <Logo />
            </Link>

            {/* desktop links with animated underline + active state */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV.map((n) => {
                const active = isActive(n.href);
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    className={cn(
                      'group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                      active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {n.label}
                    <span
                      className={cn(
                        'pointer-events-none absolute inset-x-2.5 -bottom-px h-[2px] origin-center rounded-full bg-gradient-to-r from-brand-400 to-cyan-400 transition-all duration-300',
                        active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100',
                      )}
                    />
                  </a>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07]">Sign in</Link>
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_-10px_rgba(16,185,129,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Get started</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <button className="md:hidden grid h-9 w-9 place-items-center rounded-lg text-ink transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07]" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>

        {open && (
          <div className="md:hidden mt-2 overflow-hidden rounded-2xl border border-black/[0.06] bg-paper-card/95 p-3 shadow-lift backdrop-blur-2xl animate-fade-in dark:border-white/[0.08] dark:bg-[#0b0f1a]/95">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className={cn('block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive(n.href) ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-ink-soft hover:bg-black/[0.04] dark:hover:bg-white/[0.06]')}>{n.label}</a>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <ThemeToggle />
              <Link href="/login" className="flex-1 rounded-xl border border-black/[0.08] py-2 text-center text-sm font-medium text-ink-soft dark:border-white/[0.1]">Sign in</Link>
              <Link href="/register" className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 py-2 text-center text-sm font-semibold text-white">Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
