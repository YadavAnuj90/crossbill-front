'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV = [
  { label: 'Features', href: '/features' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Contact', href: '/contact' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cn('mx-auto max-w-6xl px-4 transition-all duration-300', scrolled ? 'mt-2.5' : 'mt-0')}>
        <nav className={cn(
          'flex items-center justify-between rounded-2xl px-4 py-2.5 backdrop-blur-xl transition-all duration-300',
          scrolled
            ? 'border border-black/[0.06] bg-paper-card/80 shadow-[0_8px_30px_-12px_rgba(60,72,170,0.35)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]'
            : 'border border-transparent',
        )}>
          <Link href="/"><Logo /></Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors">
                {n.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="btn text-sm text-ink-soft hover:bg-black/[0.05] dark:hover:bg-white/[0.06]">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <button className="md:hidden p-2 text-ink" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl border border-black/[0.06] bg-paper-card/95 backdrop-blur-xl p-3 shadow-lift animate-fade-in dark:border-white/[0.08] dark:bg-[#0e1320]/95">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">{n.label}</a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/login" className="btn border border-black/[0.08] text-ink-soft text-sm">Sign in</Link>
              <Link href="/register" className="btn-primary text-sm">Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
