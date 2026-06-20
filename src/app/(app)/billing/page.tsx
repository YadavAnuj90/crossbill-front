'use client';
import { useEffect, useState } from 'react';
import { CreditCard, Check, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { BillingOverview, Plan } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

export default function BillingPage() {
  const { notify } = useToast();
  const [data, setData] = useState<BillingOverview | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function load() { api.billing.overview().then(setData).catch(() => notify('error', 'Could not load billing')); }
  useEffect(load, []);

  async function upgrade(plan: Plan) {
    if (plan.priceInr <= 0) return;
    setBusy(plan.id);
    try {
      const { shortUrl } = await api.billing.checkout(plan.id);
      window.open(shortUrl, '_blank');
      notify('info', 'Complete the payment in the new tab — your plan activates automatically.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not start checkout');
    } finally { setBusy(null); }
  }

  const currentId = data?.currentPlan?.id ?? 'free';

  return (
    <div>
      <PageHeader eyebrow="Setup" title="Billing & subscription" subtitle="Manage your Crossbill plan and payment method." icon={<CreditCard className="h-5 w-5" />} />

      {data === null ? (
        <div className="grid gap-4 sm:grid-cols-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}</div>
      ) : (
        <>
          <Reveal>
            <Card className="mb-6 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100"><Sparkles className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm text-ink-muted">Current plan</p>
                  <p className="font-semibold text-ink text-lg">{data.currentPlan?.name ?? 'Free'}{data.currentPlan && data.currentPlan.priceInr > 0 && <span className="text-ink-muted font-normal text-sm"> · ₹{data.currentPlan.priceInr}/mo</span>}</p>
                </div>
              </div>
              {data.planActivatedAt && <p className="text-xs text-ink-faint">Active since {formatDate(data.planActivatedAt)}</p>}
            </Card>
          </Reveal>

          {!data.configured && (
            <Reveal>
              <Card className="mb-6 border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-ink-muted">Razorpay isn’t connected yet — add your keys to the API <code className="font-mono text-xs bg-paper-card px-1 py-0.5 rounded">.env</code> to enable paid upgrades.</p>
              </Card>
            </Reveal>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {data.plans.map((plan, i) => {
              const isCurrent = plan.id === currentId;
              const featured = plan.id === 'pro';
              return (
                <Reveal key={plan.id} delay={i * 60}>
                  <Card className={cn('relative h-full p-6 flex flex-col', featured && 'ring-2 ring-brand-300')}>
                    {featured && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-3 py-0.5 text-[11px] font-semibold text-white shadow-sm">Most popular</span>}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-ink text-lg">{plan.name}</h3>
                      {isCurrent && <Badge tone="green">Current</Badge>}
                    </div>
                    <p className="text-sm text-ink-muted mt-0.5">{plan.tagline}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{plan.priceInr === 0 ? 'Free' : <>₹{plan.priceInr}<span className="text-base font-normal text-ink-muted">/mo</span></>}</p>
                    <ul className="mt-4 space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-ink-soft"><Check className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" /> {f}</li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      {isCurrent ? (
                        <Button variant="secondary" className="w-full" disabled>Current plan</Button>
                      ) : plan.priceInr === 0 ? (
                        <Button variant="secondary" className="w-full" disabled>—</Button>
                      ) : (
                        <Button className="w-full" loading={busy === plan.id} disabled={!data.configured} onClick={() => upgrade(plan)}>
                          Upgrade <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-ink-faint max-w-xl mx-auto">Payments are processed securely by Razorpay. Your plan activates automatically once payment succeeds.</p>
        </>
      )}
    </div>
  );
}
