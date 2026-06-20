'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { HeroAmbience } from '@/components/marketing/HeroAmbience';
import { LogoMark } from '@/components/brand/Logo';

const TRUSTED = ['Wise', 'Razorpay', 'Stripe', 'Upwork', 'Toptal'];

/** Codex-style hero: airy gradient canvas, big app icon, bold title, single dark CTA. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Airy light gradient canvas, scoped to the hero and fading into the dark body below */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-[#aeb8f0] bg-gradient-to-b from-[#c8cdf4] via-[#a9b4ee] to-[#8e9cea] dark:bg-[#070b14] dark:from-[#0b1020] dark:via-[#080c16] dark:to-[#06090f]" />
        <div className="absolute left-[42%] top-[28%] h-[42rem] w-[58rem] -translate-x-1/2 rounded-full bg-[#e7eafb]/70 blur-[130px] dark:bg-indigo-500/20" />
        <div className="absolute left-[-6rem] bottom-[18%] h-[30rem] w-[34rem] rounded-full bg-[#7c8bff]/40 blur-[140px] dark:bg-emerald-500/15" />
        <div className="absolute right-[-8rem] top-[20%] h-[28rem] w-[30rem] rounded-full bg-[#bcc6ff]/60 blur-[140px] dark:bg-cyan-500/12" />
        {/* smooth handoff into the light body */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#eceefb] dark:to-[#06090f]" />
      </div>

      {/* Drifting clouds, twinkling stars, fluttering butterflies */}
      <HeroAmbience />

      <div className="relative mx-auto max-w-4xl px-5 pt-44 pb-48 text-center">
        {/* App mark — floats cleanly on the background with a soft glow (no panel). */}
        <Reveal>
          <div className="relative mx-auto grid h-28 w-28 place-items-center">
            <span aria-hidden className="absolute h-24 w-24 rounded-full bg-brand-400/25 blur-2xl dark:bg-brand-400/20" />
            <LogoMark className="relative h-16 w-auto" flip="always" />
          </div>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="mt-10 text-[3.4rem] sm:text-[5.4rem] font-semibold tracking-[-0.03em] leading-[0.98] text-[#11131c] dark:text-white">
            Crossbill
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-xl sm:text-2xl text-[#2a2d3d]/80 font-medium dark:text-ink-soft">
            Your billing copilot for cross-border work.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#0d0f16] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(13,15,22,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] dark:bg-white dark:text-[#0d0f16] dark:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.7)]"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#11131c]/15 bg-paper-card/40 px-7 py-3.5 text-[15px] font-semibold text-[#11131c] backdrop-blur-sm transition-colors hover:bg-paper-card/70 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
            >
              Sign in
            </Link>
          </div>
        </Reveal>

        {/* Trusted by */}
        <Reveal delay={340}>
          <p className="mt-24 text-sm font-medium text-[#2a2d3d]/60 dark:text-ink-muted">Trusted by exporters billing clients worldwide</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {TRUSTED.map((t) => (
              <span key={t} className="text-xl font-semibold text-[#1b1d2c] opacity-45 dark:text-white dark:opacity-50">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
