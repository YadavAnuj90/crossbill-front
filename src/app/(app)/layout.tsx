'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PageLoader } from '@/components/ui/Spinner';

/** Authenticated app shell — redirects to /login if there is no session. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading) return <div className="min-h-screen grid place-items-center"><PageLoader label="Loading your workspace…" /></div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-5 py-7 sm:px-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
