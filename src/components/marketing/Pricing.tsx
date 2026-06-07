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
          <span className="badge bg-brand-50 text-brand-700 mb-4">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Simple, honest pricing</h2>
          <p className="mt-3 text-ink-muted text-lg">Start free. Upgrade when invoicing foreign clients becomes a habit.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 items-start">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div className={cn(
                'relative rounded-3xl p-7 h-full',
                p.highlight ? 'bg-gradient-to-b from-ink to-[#16202b] text-white shadow-glow ring-1 ring-brand-500/30' : 'card',
              )}>
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-brand-500 text-white shadow">Most popular</span>}
                <p className={cn('text-sm', p.highlight ? 'text-brand-200' : 'text-ink-muted')}>{p.tag}</p>
                <h3 className={cn('mt-1 text-lg font-semibold', p.highlight ? 'text-white' : 'text-ink')}>{p.name}</h3>
                <p className="mt-4 flex items-end gap-1">
                  <span className={cn('text-4xl font-semibold tracking-tight', p.highlight ? 'text-white' : 'text-ink')}>{p.price}</span>
                  <span className={cn('mb-1 text-sm', p.highlight ? 'text-white/50' : 'text-ink-faint')}>/mo</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className={cn('flex items-center gap-2.5 text-sm', p.highlight ? 'text-white/80' : 'text-ink-soft')}>
                      <Check className={cn('h-4 w-4 shrink-0', p.highlight ? 'text-brand-300' : 'text-brand-600')} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={cn('mt-7 w-full', p.highlight ? 'btn-primary' : 'btn-secondary')}>
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
