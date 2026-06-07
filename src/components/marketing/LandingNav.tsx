'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV = [
  { label: 'Features', href: '/features' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Contact', href: '/contact' },
];

function Logo({ light }: { light: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
          <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={cn('font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>Crossbill</span>
    </span>
  );
}

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = !scrolled; // top = over dark hero

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cn('mx-auto max-w-6xl px-4 transition-all duration-300', scrolled ? 'mt-2.5' : 'mt-0')}>
        <nav className={cn(
          'flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300',
          scrolled ? 'glass shadow-lift' : 'glass-dark',
        )}>
          <Link href="/"><Logo light={dark} /></Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                dark ? 'text-white/75 hover:text-white hover:bg-white/10' : 'text-ink-muted hover:text-ink hover:bg-ink/5')}>
                {n.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className={cn('btn text-sm', dark ? 'text-white/85 hover:bg-white/10' : 'btn-ghost')}>Sign in</Link>
            <Link href="/register" className="btn-primary text-sm">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <button className={cn('md:hidden p-2', dark ? 'text-white' : 'text-ink')} onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden glass mt-2 rounded-2xl p-3 shadow-lift animate-fade-in">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-ink/5">{n.label}</a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/login" className="btn-secondary text-sm">Sign in</Link>
              <Link href="/register" className="btn-primary text-sm">Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
