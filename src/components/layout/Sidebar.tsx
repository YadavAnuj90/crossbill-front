'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, FileBarChart, Building2, UsersRound, Settings, Sparkles, CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth-context';

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
  const { user } = useAuth();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-paper-border bg-white/70 backdrop-blur px-3 py-5">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-7">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="font-semibold text-ink text-[15px] tracking-tight">Crossbill</span>
      </Link>

      <p className="eyebrow px-3 pb-2">Workspace</p>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn('nav-item', isActive(href) && 'nav-item-active')}>
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </nav>

      <p className="eyebrow px-3 pb-2 pt-6">Setup</p>
      <nav className="flex flex-col gap-1">
        {SECONDARY.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn('nav-item', isActive(href) && 'nav-item-active')}>
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Plan card */}
      <Link href="/settings" className="mt-auto block rounded-2xl border border-paper-border bg-gradient-to-br from-paper to-white p-4 hover:shadow-card transition-shadow">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-semibold text-ink">Free plan</span>
        </div>
        <p className="mt-1 text-xs text-ink-muted leading-snug">Upgrade to Pro for unlimited invoices, the FEMA tracker and GSTR-1 export.</p>
        <span className="mt-2.5 inline-block text-xs font-semibold text-brand-700">Upgrade →</span>
      </Link>
    </aside>
  );
}
