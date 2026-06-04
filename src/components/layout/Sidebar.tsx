'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, FileBarChart, Building2, UsersRound, Settings,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
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

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-paper-border bg-paper-card/60 px-3 py-5">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-7">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 11.5L16 16L23 20.5" stroke="#6ee7b7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="font-semibold text-ink text-[15px] tracking-tight">Crossbill</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn('nav-item', isActive(href) && 'nav-item-active')}>
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-5">
        <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-ink-faint">Setup</p>
        {SECONDARY.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn('nav-item', isActive(href) && 'nav-item-active')}>
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
