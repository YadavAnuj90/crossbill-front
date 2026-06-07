'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
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
          'flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300',
          scrolled ? 'glass shadow-lift' : 'border border-transparent',
        )}>
          <Link href="/"><Logo /></Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors">
                {n.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <button className="md:hidden p-2 text-ink" onClick={() => setOpen((o) => !o)} aria-label="Menu">
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
