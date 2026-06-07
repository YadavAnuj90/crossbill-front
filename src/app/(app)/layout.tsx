'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AppFooter } from '@/components/layout/AppFooter';
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
    <div className="relative flex min-h-screen">
      {/* Ambient app background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-[0.6]" />
        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-300/15 blur-[130px]" />
        <div className="absolute left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-emerald-200/10 blur-[120px]" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-5 py-7 sm:px-8 max-w-6xl w-full mx-auto">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}
