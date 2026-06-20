'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut, Plus, ChevronDown, Search, Bell, Building2, Settings, ShieldCheck, Sparkles,
  CheckCircle2, CalendarClock, FileText, Command,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { initials } from '@/lib/format';
import { cn } from '@/lib/cn';

const NOTIFS = [
  { icon: Sparkles, tone: 'text-brand-600 bg-brand-50', title: 'Welcome to Crossbill', body: 'Your workspace is ready. Add a client to begin.', t: 'just now' },
  { icon: ShieldCheck, tone: 'text-blue-600 bg-blue-50', title: 'Complete your profile', body: 'Add GSTIN & LUT to unlock compliant invoices.', t: '1h' },
  { icon: CalendarClock, tone: 'text-amber-600 bg-amber-50', title: 'FEMA reminders are on', body: 'We’ll nudge you before realisation deadlines.', t: '1d' },
];

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setMenu(false); setBell(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close either dropdown when clicking anywhere outside of it.
  useEffect(() => {
    if (!menu && !bell) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (bell && bellRef.current && !bellRef.current.contains(t)) setBell(false);
      if (menu && menuRef.current && !menuRef.current.contains(t)) setMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menu, bell]);

  const name = user?.legalName || user?.email?.split('@')[0] || 'Your workspace';

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-paper-card/90 backdrop-blur-xl supports-[backdrop-filter]:bg-paper-card/75 shadow-[0_1px_3px_-1px_rgba(12,17,22,0.07)] dark:border-white/[0.06] dark:bg-[#0b1018]/80 dark:supports-[backdrop-filter]:bg-[#0b1018]/60 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_-16px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5">
        {/* Search / command bar */}
        <div className="group relative hidden sm:block w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint transition-colors group-focus-within:text-brand-600" />
          <input
            ref={searchRef}
            placeholder="Search invoices, clients…"
            className="w-full rounded-xl border border-paper-border bg-paper/70 pl-9 pr-16 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-all focus:border-brand-400 focus:bg-paper-card focus:shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded-md border border-paper-border bg-paper-card px-1.5 py-0.5 text-[10px] font-medium text-ink-faint group-focus-within:hidden sm:flex">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-brand-200/60 bg-brand-50/60 px-3 py-1.5 text-xs font-medium text-brand-700 dark:border-brand-400/25 dark:bg-brand-500/[0.12] dark:text-brand-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Export-compliant
          </span>

          {/* Notifications */}
          <div className="relative" ref={bellRef}>
            <button onClick={() => { setBell((b) => !b); setMenu(false); }} className={cn('relative grid h-9 w-9 place-items-center rounded-xl border bg-paper-card/70 transition', bell ? 'border-brand-300 text-brand-600' : 'border-paper-border text-ink-muted hover:text-ink hover:bg-paper')} aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
            </button>
            {bell && (
              <>
                <div className="card absolute right-0 mt-2 w-80 z-20 shadow-lift overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-paper-border">
                    <p className="text-sm font-semibold text-ink">Notifications</p>
                    <button className="text-xs text-brand-700 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFS.map((n) => (
                      <div key={n.title} className="flex gap-3 px-4 py-3 hover:bg-paper/60 transition-colors cursor-default">
                        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', n.tone)}><n.icon className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink">{n.title}</p>
                          <p className="text-xs text-ink-muted mt-0.5 leading-snug">{n.body}</p>
                        </div>
                        <span className="text-[11px] text-ink-faint shrink-0">{n.t}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/fema" onClick={() => setBell(false)} className="block px-4 py-2.5 text-center text-xs font-medium text-brand-700 hover:bg-paper border-t border-paper-border">View FEMA tracker</Link>
                </div>
              </>
            )}
          </div>

          <button onClick={() => router.push('/invoices/new')} className="btn-primary py-2 px-3.5 text-[13px] shadow-sm">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New invoice</span>
          </button>

          {/* Profile */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => { setMenu((m) => !m); setBell(false); }} className={cn('flex items-center gap-2 rounded-xl border px-1.5 py-1 transition', menu ? 'border-paper-border bg-paper-card' : 'border-transparent hover:border-paper-border hover:bg-paper-card/70')}>
              <span className="relative">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white text-xs font-semibold ring-2 ring-white dark:ring-white/15">{initials(name)}</span>
              </span>
              <ChevronDown className={cn('h-4 w-4 text-ink-faint transition-transform', menu && 'rotate-180')} />
            </button>
            {menu && (
              <>
                <div className="card absolute right-0 mt-2 w-64 z-20 shadow-lift py-1.5 overflow-hidden animate-fade-in">
                  <div className="px-3.5 py-3 border-b border-paper-border bg-gradient-to-br from-paper to-white dark:from-[#19212f] dark:to-[#10151f]">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white text-sm font-semibold">{initials(name)}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{name}</p>
                        <p className="text-xs text-ink-muted truncate">{user?.email}</p>
                      </div>
                    </div>
                    <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-500/[0.15] dark:text-brand-300"><Sparkles className="h-3 w-3" /> Free plan</span>
                  </div>
                  <Link href="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-soft hover:bg-paper transition-colors"><Building2 className="h-4 w-4 text-ink-faint" /> Business profile</Link>
                  <Link href="/invoices" onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-soft hover:bg-paper transition-colors"><FileText className="h-4 w-4 text-ink-faint" /> Invoices</Link>
                  <Link href="/settings" onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-soft hover:bg-paper transition-colors"><Settings className="h-4 w-4 text-ink-faint" /> Settings &amp; billing</Link>
                  <div className="my-1 border-t border-paper-border" />
                  <button onClick={() => { setMenu(false); logout(); }} className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-500/10"><LogOut className="h-4 w-4" /> Sign out</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
