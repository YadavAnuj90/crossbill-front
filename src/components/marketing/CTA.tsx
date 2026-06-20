import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export function CTA() {
  return (
    <section className="pb-24 pt-4">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 px-6 py-16 text-center shadow-[0_30px_70px_-25px_rgba(5,150,105,0.6)] sm:px-12 dark:from-emerald-500 dark:via-emerald-600 dark:to-emerald-700">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-paper-card/15 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.12]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-white leading-tight">
                One app for <span className="text-white/90 underline decoration-white/40 decoration-2 underline-offset-4">every invoice</span> you raise
              </h2>
              <p className="mt-4 text-white/80 text-lg">
                Bill a US client in USD or an Indian client in INR — Crossbill gets the GST, FEMA and export
                paperwork right, automatically. In under a minute.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-paper-card px-6 py-3.5 text-[15px] font-semibold text-brand-700 shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.98] dark:bg-white dark:text-emerald-700">Get started free <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-paper-card/10 px-6 py-3.5 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-paper-card/20">Sign in</Link>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/75">
                {['Gapless numbering', 'FIRC tracking', 'CA-ready exports', 'No card required'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-white" /> {t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
