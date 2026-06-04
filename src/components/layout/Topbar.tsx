'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';

export function Topbar() {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-paper-border bg-paper/80 backdrop-blur px-5 py-3">
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <ShieldCheck className="h-4 w-4 text-brand-600" />
        <span className="hidden sm:inline">Export-compliant invoicing</span>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <button onClick={() => router.push('/invoices/new')} className="btn-primary py-2 px-3.5 text-[13px]">
          <Plus className="h-4 w-4" /> New invoice
        </button>

        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-paper">
            <Avatar name={user?.legalName || user?.email || '?'} />
            <ChevronDown className="h-4 w-4 text-ink-faint" />
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="card absolute right-0 mt-2 w-60 z-20 shadow-lift py-1.5 animate-fade-in">
                <div className="px-3.5 py-2 border-b border-paper-border">
                  <p className="text-sm font-medium text-ink truncate">{user?.legalName || 'Your workspace'}</p>
                  <p className="text-xs text-ink-muted truncate">{user?.email}</p>
                </div>
                <Link href="/profile" onClick={() => setMenu(false)} className="block px-3.5 py-2 text-sm text-ink-soft hover:bg-paper">
                  Business profile
                </Link>
                <Link href="/settings" onClick={() => setMenu(false)} className="block px-3.5 py-2 text-sm text-ink-soft hover:bg-paper">
                  Settings
                </Link>
                <button onClick={() => { setMenu(false); logout(); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
