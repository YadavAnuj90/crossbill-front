'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, FileBarChart, Building2, UsersRound, Settings,
  CalendarClock, Sparkles, ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/fema', label: 'FEMA tracker', icon: CalendarClock },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/reports', label: 'Filing & reports', icon: FileBarChart },
  { href: '/team', label: 'Team', icon: UsersRound },
];

const SECONDARY = [
  { href: '/profile', label: 'Business profile', icon: Building2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const Item = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          active ? 'text-brand-700' : 'text-ink-muted hover:text-ink hover:bg-paper',
        )}
      >
        {active && (
          <>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100/40 ring-1 ring-inset ring-brand-200/50" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-brand-400 to-brand-600" />
          </>
        )}
        <Icon className={cn('relative h-[18px] w-[18px] transition-transform', active ? 'text-brand-600' : 'group-hover:scale-110')} />
        <span className="relative">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-paper-border/70 bg-white/60 backdrop-blur-xl px-3 py-5">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-7 group">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow transition-transform group-hover:scale-105">
          <svg width="19" height="19" viewBox="0 0 32 32" fill="none">
            <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="font-semibold text-ink text-[15px] tracking-tight">Crossbill</span>
      </Link>

      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Workspace</p>
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => <Item key={n.href} {...n} />)}
      </nav>

      <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Setup</p>
      <nav className="flex flex-col gap-1">
        {SECONDARY.map((n) => <Item key={n.href} {...n} />)}
      </nav>

      {/* Plan card */}
      <Link href="/settings" className="group mt-auto relative block overflow-hidden rounded-2xl border border-paper-border bg-gradient-to-br from-ink to-[#16202b] p-4 shadow-card transition-shadow hover:shadow-lift">
        <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/20 blur-2xl" />
        <div className="relative flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-300" />
          <span className="text-sm font-semibold text-white">Free plan</span>
        </div>
        <p className="relative mt-1.5 text-xs text-white/55 leading-snug">Upgrade to Pro for unlimited invoices, the FEMA tracker &amp; GSTR-1 export.</p>
        <span className="relative mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">Upgrade <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </Link>
    </aside>
  );
}
