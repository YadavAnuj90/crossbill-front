import { ReactNode } from 'react';
import { Aurora } from '@/components/motion/Aurora';
import { Reveal } from '@/components/motion/Reveal';

export function PageHero({ eyebrow, title, accent, intro, children }: {
  eyebrow: ReactNode; title: string; accent?: string; intro: string; children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white bg-noise">
      <Aurora className="opacity-80" />
      <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.14]" />
      <div className="absolute inset-0 spotlight" />
      <div className="relative mx-auto max-w-4xl px-5 pt-36 pb-24 text-center">
        <Reveal><span className="glow-chip">{eyebrow}</span></Reveal>
        <Reveal delay={80}>
          <h1 className="mt-7 text-[2.5rem] sm:text-[3.6rem] font-semibold tracking-tight leading-[1.05]">
            {title}{accent && <> <span className="text-gradient-vivid animate-gradient-x">{accent}</span></>}
          </h1>
        </Reveal>
        <Reveal delay={160}><p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">{intro}</p></Reveal>
        {children && <Reveal delay={240}><div className="mt-9">{children}</div></Reveal>}
      </div>
    </section>
  );
}
