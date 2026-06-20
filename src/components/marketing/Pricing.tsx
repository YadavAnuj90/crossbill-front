import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

const PLANS = [
  { name: 'Free', price: '₹0', tag: 'For getting started', highlight: false, features: ['Up to ~10 invoices', 'Auto-filled compliance', 'PDF export', 'Single user'] },
  { name: 'Pro', price: '₹249', tag: 'For active freelancers', highlight: true, features: ['Unlimited invoices', 'FEMA aging tracker', 'GSTR-1 6A export', 'Custom branding', 'Priority email support'] },
  { name: 'Agency', price: '₹799', tag: 'For teams & CAs', highlight: false, features: ['Everything in Pro', 'Team members + RBAC', 'CA invite (read-only)', 'Multi-currency dashboards'] },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="chip-soft mb-4">Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.02em] text-ink">Simple, honest pricing</h2>
          <p className="mt-3 text-ink-muted text-lg">Start free. Upgrade when invoicing foreign clients becomes a habit.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 items-start">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div className={cn(
                'relative h-full overflow-hidden rounded-3xl p-7 bg-paper-card shadow-card ring-1 ring-black/[0.02] dark:bg-white/[0.03] dark:ring-white/[0.04]',
                p.highlight ? 'border-2 border-brand-400 shadow-[0_24px_60px_-24px_rgba(5,150,105,0.45)] dark:border-brand-400 dark:bg-gradient-to-b dark:from-white/[0.07] dark:to-white/[0.02]' : 'border border-black/[0.06] dark:border-white/[0.08]',
              )}>
                {p.highlight && <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-lg bg-brand-500 px-3 py-1 text-[11px] font-semibold text-white shadow">Most popular</span>}
                {p.highlight && <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/15 blur-3xl" />}
                <p className="relative text-sm text-ink-faint">{p.tag}</p>
                <h3 className="relative mt-1 text-lg font-semibold text-ink">{p.name}</h3>
                <p className="relative mt-4 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-ink">{p.price}</span>
                  <span className="mb-1 text-sm text-ink-faint">/mo</span>
                </p>
                <ul className="relative mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink-soft">
                      <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={cn('relative mt-7 w-full', p.highlight ? 'btn-primary' : 'btn-secondary')}>
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
