import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Aurora } from '@/components/motion/Aurora';
import { Reveal } from '@/components/motion/Reveal';

export function CTA() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-12 bg-noise">
            <Aurora />
            <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-30" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
One app for <span className="text-gradient-vivid animate-gradient-x">every invoice</span> you raise
              </h2>
              <p className="mt-4 text-white/65 text-lg">
Bill a US client in USD or an Indian client in INR — Crossbill gets the GST, FEMA and export
                paperwork right, automatically. In under a minute.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px]">Get started free <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/login" className="btn-glass px-6 py-3.5 text-[15px]">Sign in</Link>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/55">
                {['Gapless numbering', 'FIRC tracking', 'CA-ready exports', 'No card required'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> {t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
