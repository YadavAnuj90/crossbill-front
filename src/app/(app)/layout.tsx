'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { WelcomeSplash } from '@/components/layout/WelcomeSplash';
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
      {/* Ambient app background — airy periwinkle canvas, matched to the landing page */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#e9ebf8]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef0fb] via-[#e7eafa] to-[#eceefb]" />
        <div className="absolute inset-0 bg-grid opacity-[0.04] [mask-image:radial-gradient(120%_80%_at_50%_0%,#000,transparent_75%)]" />
        <div className="absolute right-[-6rem] top-[-4rem] h-[34rem] w-[34rem] rounded-full bg-[#c7cffb]/45 blur-[140px]" />
        <div className="absolute left-24 bottom-[-6rem] h-[30rem] w-[30rem] rounded-full bg-brand-300/20 blur-[130px]" />
        <div className="absolute left-1/2 top-1/3 h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#bcc6ff]/30 blur-[140px]" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-5 py-7 sm:px-8 max-w-6xl w-full mx-auto">{children}</main>
        <AppFooter />
      </div>
      <WelcomeSplash />
    </div>
  );
}
