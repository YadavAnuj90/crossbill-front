import { Marquee } from '@/components/motion/Marquee';

const ITEMS = ['r/developersIndia', 'LinkedIn', 'X / Twitter', 'Wise', 'Razorpay', 'Stripe', 'Upwork', 'Toptal'];

export function LogoCloud() {
  return (
    <section className="py-10 border-y border-paper-border/70 bg-white/40">
      <p className="text-center eyebrow mb-6">Trusted by exporters billing clients worldwide</p>
      <Marquee>
        {ITEMS.map((t) => (
          <span key={t} className="mx-8 text-lg font-semibold text-ink-faint/80 whitespace-nowrap">{t}</span>
        ))}
      </Marquee>
    </section>
  );
}
