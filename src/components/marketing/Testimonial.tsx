import { Reveal } from '@/components/motion/Reveal';

export function Testimonial() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <figure className="card relative overflow-hidden p-8 sm:p-12 text-center">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/60 blur-3xl" />
            <div className="relative">
              <p className="text-2xl sm:text-[1.7rem] font-medium leading-snug tracking-tight text-ink">
                “I billed a US client in USD and Crossbill made the whole GST &amp; FEMA trail
                <span className="text-gradient-brand"> correct on the first try</span> — no CA, no spreadsheet, no second-guessing.”
              </p>
              <figcaption className="mt-7 flex items-center justify-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">RS</span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-ink">Rohan S.</span>
                  <span className="block text-xs text-ink-muted">Freelance developer · Bengaluru</span>
                </span>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
