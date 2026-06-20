'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Globe, Coins, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LogoMark } from '@/components/brand/Logo';

const TRUST = [
  { icon: ShieldCheck, label: 'GST & FEMA' },
  { icon: Globe, label: 'Export ready' },
  { icon: Coins, label: '0% IGST' },
];

const FLOATERS = [
  { icon: Coins, cls: 'left-[14%] top-[22%]', d: '0s' },
  { icon: Globe, cls: 'right-[16%] top-[28%]', d: '-1.2s' },
  { icon: ShieldCheck, cls: 'left-[20%] bottom-[20%]', d: '-2.1s' },
  { icon: Sparkles, cls: 'right-[18%] bottom-[24%]', d: '-0.6s' },
];

/** Fintech-style circular welcome shown once, right after the user logs in or signs up. */
export function WelcomeSplash() {
  const { user } = useAuth();
  const [mode, setMode] = useState<null | 'new' | 'returning'>(null);
  const [leaving, setLeaving] = useState(false);
  const [fill, setFill] = useState(false);

  // pick up the one-shot flag set during login/register
  useEffect(() => {
    let flag: string | null = null;
    try { flag = sessionStorage.getItem('cb_welcome'); if (flag) sessionStorage.removeItem('cb_welcome'); } catch {}
    if (flag === 'new') setMode('new');
    else if (flag === 'returning') setMode('returning');
  }, []);

  // animate progress + auto-dismiss
  useEffect(() => {
    if (!mode) return;
    const raf = requestAnimationFrame(() => setFill(true));
    const t1 = setTimeout(() => setLeaving(true), 3000);
    const t2 = setTimeout(() => setMode(null), 3500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [mode]);

  if (!mode) return null;

  const firstName = user?.legalName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const dismiss = () => { setLeaving(true); setTimeout(() => setMode(null), 450); };

  return (
    <div
      className={cn('fixed inset-0 z-[100] grid place-items-center overflow-hidden transition-all duration-500', leaving ? 'pointer-events-none opacity-0' : 'opacity-100')}
      role="dialog"
      aria-label="Welcome"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-[#e9ebf8]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#eef0fb] via-[#e7eafa] to-[#eceefb]" />
      <div className="absolute left-1/2 top-1/3 h-[40rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#c7cffb]/50 blur-[150px]" />
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />

      {/* floating fintech icons */}
      {FLOATERS.map((f, i) => (
        <span key={i} className={cn('animate-float-tiny absolute hidden sm:grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-paper-card/70 text-brand-600 shadow-lift backdrop-blur', f.cls)} style={{ animationDelay: f.d }}>
          <f.icon className="h-5 w-5" />
        </span>
      ))}

      {/* the round welcome note */}
      <div className="animate-pop-in relative mx-5 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/70 bg-paper-card/70 px-8 py-12 text-center shadow-[0_40px_100px_-35px_rgba(60,72,170,0.55)] backdrop-blur-xl">
        <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-300/25 blur-3xl" />
        <span className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#bcc6ff]/35 blur-3xl" />

        {/* emblem */}
        <div className="relative mx-auto mb-8 grid h-40 w-40 place-items-center">
          <span className="absolute h-40 w-40 rounded-full border border-brand-300/40 animate-ping" style={{ animationDuration: '2.6s' }} />
          <span className="absolute h-36 w-36 rounded-full border-2 border-dashed border-brand-400/40 animate-spin-slow" />
          <span className="absolute h-28 w-28 rounded-full border border-brand-200" />
          <span className="absolute h-24 w-24 rounded-full bg-brand-400/40 blur-2xl animate-glow-breathe" />
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-paper-card shadow-glow ring-1 ring-black/5">
            <LogoMark className="h-12 w-auto" flip="always" />
          </span>
        </div>

        <p className="animate-pop-in inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700" style={{ animationDelay: '0.1s' }}>
          <Sparkles className="h-3 w-3" /> {mode === 'new' ? 'Account created' : 'Export-compliant workspace'}
        </p>

        <h1 className="animate-pop-in mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-[#11131c]" style={{ animationDelay: '0.18s' }}>
          {mode === 'new' ? 'Welcome to Crossbill,' : 'Welcome back,'}
          <br />
          <span className="text-gradient-brand">{firstName}</span>
        </h1>

        <p className="animate-pop-in mt-3 text-sm text-ink-muted" style={{ animationDelay: '0.26s' }}>
          {mode === 'new'
            ? 'Your compliant billing workspace is ready to go.'
            : 'Your invoicing and FEMA compliance, all in one place.'}
        </p>

        <div className="animate-pop-in mt-7 flex items-center justify-center gap-2" style={{ animationDelay: '0.34s' }}>
          {TRUST.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-paper-card px-2.5 py-1.5 text-[11px] font-medium text-ink-soft shadow-sm">
              <t.icon className="h-3.5 w-3.5 text-brand-600" /> {t.label}
            </span>
          ))}
        </div>

        <button onClick={dismiss} className="btn-primary animate-pop-in mt-8 w-full justify-center py-3" style={{ animationDelay: '0.42s' }}>
          Enter dashboard <ArrowRight className="h-4 w-4" />
        </button>

        {/* auto-advance progress */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-[width] ease-linear"
            style={{ width: fill ? '100%' : '0%', transitionDuration: '3000ms' }}
          />
        </div>
      </div>
    </div>
  );
}
