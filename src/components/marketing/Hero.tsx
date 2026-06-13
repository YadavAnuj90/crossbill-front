'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { HeroAmbience } from '@/components/marketing/HeroAmbience';

const TRUSTED = ['Wise', 'Razorpay', 'Stripe', 'Upwork', 'Toptal'];

/** Codex-style hero: airy gradient canvas, big app icon, bold title, single dark CTA. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Airy light gradient canvas, scoped to the hero and fading into the dark body below */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-[#aeb8f0] bg-gradient-to-b from-[#c8cdf4] via-[#a9b4ee] to-[#8e9cea]" />
        <div className="absolute left-[42%] top-[28%] h-[42rem] w-[58rem] -translate-x-1/2 rounded-full bg-[#e7eafb]/70 blur-[130px]" />
        <div className="absolute left-[-6rem] bottom-[18%] h-[30rem] w-[34rem] rounded-full bg-[#7c8bff]/40 blur-[140px]" />
        <div className="absolute right-[-8rem] top-[20%] h-[28rem] w-[30rem] rounded-full bg-[#bcc6ff]/60 blur-[140px]" />
        {/* smooth handoff into the light body */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#eceefb]" />
      </div>

      {/* Drifting clouds, twinkling stars, fluttering butterflies */}
      <HeroAmbience />

      <div className="relative mx-auto max-w-4xl px-5 pt-44 pb-48 text-center">
        {/* App icon — squircle tile */}
        <Reveal>
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-[1.75rem] bg-white shadow-[0_30px_60px_-15px_rgba(60,72,170,0.55)] ring-1 ring-black/5">
            <div className="grid h-[5.2rem] w-[5.2rem] place-items-center rounded-[1.3rem] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-inner">
              <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
                <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 11.5L16 16L23 20.5" stroke="#d1fae5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="mt-10 text-[3.4rem] sm:text-[5.4rem] font-semibold tracking-[-0.03em] leading-[0.98] text-[#11131c]">
            Crossbill
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-xl sm:text-2xl text-[#2a2d3d]/80 font-medium">
            Your billing copilot for cross-border work.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#0d0f16] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(13,15,22,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#11131c]/15 bg-white/40 px-7 py-3.5 text-[15px] font-semibold text-[#11131c] backdrop-blur-sm transition-colors hover:bg-white/70"
            >
              Sign in
            </Link>
          </div>
        </Reveal>

        {/* Trusted by */}
        <Reveal delay={340}>
          <p className="mt-24 text-sm font-medium text-[#2a2d3d]/60">Trusted by exporters billing clients worldwide</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {TRUSTED.map((t) => (
              <span key={t} className="text-xl font-semibold text-[#1b1d2c] opacity-45">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
