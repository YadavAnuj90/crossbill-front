'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, ChevronDown, Search, Bell, Building2, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';

export function Topbar() {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-paper-border/70 bg-white/65 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-2.5">
        {/* Search */}
        <div className="relative hidden sm:block w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            placeholder="Search invoices, clients…"
            className="w-full rounded-xl border border-paper-border bg-white/70 pl-9 pr-12 py-2 text-sm placeholder:text-ink-faint focus:border-brand-400 focus:shadow-focus outline-none transition"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-paper-border bg-paper px-1.5 py-0.5 text-[10px] font-medium text-ink-faint">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-paper-border bg-white/60 px-3 py-1.5 text-xs text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Export-compliant
          </span>

          <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-paper-border bg-white/60 text-ink-muted hover:text-ink hover:bg-paper transition" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500 ring-2 ring-white" />
          </button>

          <button onClick={() => router.push('/invoices/new')} className="btn-primary py-2 px-3.5 text-[13px]">
            <Plus className="h-4 w-4" /> New invoice
          </button>

          <div className="relative">
            <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-xl border border-transparent px-1.5 py-1 hover:border-paper-border hover:bg-white/60 transition">
              <Avatar name={user?.legalName || user?.email || '?'} />
              <ChevronDown className="h-4 w-4 text-ink-faint" />
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <div className="card absolute right-0 mt-2 w-64 z-20 shadow-lift py-1.5 animate-fade-in">
                  <div className="flex items-center gap-3 px-3.5 py-3 border-b border-paper-border">
                    <Avatar name={user?.legalName || user?.email || '?'} className="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{user?.legalName || 'Your workspace'}</p>
                      <p className="text-xs text-ink-muted truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-soft hover:bg-paper"><Building2 className="h-4 w-4 text-ink-faint" /> Business profile</Link>
                  <Link href="/settings" onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-soft hover:bg-paper"><Settings className="h-4 w-4 text-ink-faint" /> Settings</Link>
                  <div className="my-1 border-t border-paper-border" />
                  <button onClick={() => { setMenu(false); logout(); }} className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign out</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
