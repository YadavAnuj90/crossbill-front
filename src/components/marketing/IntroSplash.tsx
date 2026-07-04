'use client';
import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/brand/Logo';
import { cn } from '@/lib/cn';

/**
 * Fast branded intro shown on the first landing visit of a session: the Crossbill
 * mark + tagline + a loading bar, then it fades out to reveal the page.
 */
export function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('cb_intro_seen'); } catch { /* ignore */ }
    if (seen) { setVisible(false); return; }
    try { sessionStorage.setItem('cb_intro_seen', '1'); } catch { /* ignore */ }

    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => setLeaving(true), 8300);
    const t2 = setTimeout(() => setVisible(false), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => { if (!visible) document.body.style.overflow = ''; }, [visible]);

  if (!visible) return null;
  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#070b14] transition-opacity duration-500 ease-out',
        leaving && 'pointer-events-none opacity-0',
      )}
    >
      {/* ambient brand glows */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/15 blur-[130px]" />
      <span className="pointer-events-none absolute right-[12%] top-[22%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
      <span className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05] [mask-image:radial-gradient(60%_50%_at_50%_50%,#000,transparent)]" />

      <div className="animate-cb-stage relative flex flex-col items-center">
        <div className="flex items-center gap-3.5">
          <LogoMark className="h-12 w-auto sm:h-14" flip="always" />
          <span className="text-[2.75rem] font-semibold tracking-[-0.04em] text-white sm:text-6xl">
            Cross<span className="text-brand-400">bill</span>
          </span>
        </div>
        <p className="mt-5 text-center text-sm font-medium tracking-wide text-white/55 sm:text-base">
          Your billing copilot for cross-border work.
        </p>
        <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full rounded-full bg-gradient-to-r from-brand-400 to-cyan-400 animate-cb-progress" style={{ animationDuration: '8.2s' }} />
        </div>
      </div>
    </div>
  );
}
