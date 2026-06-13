import { Marquee } from '@/components/motion/Marquee';

const ITEMS = ['r/developersIndia', 'LinkedIn', 'X / Twitter', 'Wise', 'Razorpay', 'Stripe', 'Upwork', 'Toptal'];

export function LogoCloud() {
  return (
    <section className="py-10 border-y border-white/[0.06]">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35 mb-6">Trusted by exporters billing clients worldwide</p>
      <Marquee>
        {ITEMS.map((t) => (
          <span key={t} className="mx-8 text-lg font-semibold text-white/30 whitespace-nowrap">{t}</span>
        ))}
      </Marquee>
    </section>
  );
}
