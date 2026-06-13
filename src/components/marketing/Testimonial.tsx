import { Reveal } from '@/components/motion/Reveal';
import { Quote } from 'lucide-react';

export function Testimonial() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <figure className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-8 sm:p-12 text-center shadow-card ring-1 ring-black/[0.02]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/15 blur-3xl" />
            <Quote className="relative mx-auto h-7 w-7 text-brand-500" />
            <p className="relative mt-4 text-2xl sm:text-[1.7rem] font-medium leading-snug tracking-tight text-ink">
              “I billed a US client in USD and Crossbill made the whole GST &amp; FEMA trail
              <span className="text-gradient-brand"> correct on the first try</span> — no CA, no spreadsheet, no second-guessing.”
            </p>
            <figcaption className="relative mt-7 flex items-center justify-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold text-sm">RS</span>
              <span className="text-left">
                <span className="block text-sm font-semibold text-ink">Rohan S.</span>
                <span className="block text-xs text-ink-faint">Freelance developer · Bengaluru</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
