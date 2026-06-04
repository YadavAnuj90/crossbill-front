'use client';
import { Check, Sparkles, Crown, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

const PLANS = [
  { id: 'free', name: 'Free', price: '₹0', icon: Sparkles, current: true, features: ['Up to ~10 invoices', 'Basic PDF', 'Single user'] },
  { id: 'pro', name: 'Pro', price: '₹249', icon: Crown, highlight: true, features: ['Unlimited invoices', 'FEMA aging tracker', 'GSTR-1 6A export', 'Custom branding'] },
  { id: 'agency', name: 'Agency', price: '₹799', icon: Users, features: ['Everything in Pro', 'Team members + RBAC', 'CA invite (read-only)', 'Priority support'] },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { notify } = useToast();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Plan, billing and account." />

      <Card className="mb-6">
        <CardHeader title="Plan & billing" subtitle="Billed in INR via Razorpay. Upgrade or downgrade anytime." />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.id} className={cn('rounded-2xl border p-5 relative', p.highlight ? 'border-brand-400 bg-brand-50/40' : 'border-paper-border')}>
                  {p.highlight && <Badge tone="green" className="absolute -top-2.5 right-4">Popular</Badge>}
                  <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-brand-600" /><span className="font-semibold text-ink">{p.name}</span>{p.current && <Badge tone="gray">Current</Badge>}</div>
                  <p className="mt-3 text-2xl font-semibold text-ink">{p.price}<span className="text-sm font-normal text-ink-faint">/mo</span></p>
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-ink-soft"><Check className="h-4 w-4 text-brand-600 shrink-0" /> {f}</li>)}
                  </ul>
                  <Button variant={p.highlight ? 'primary' : 'secondary'} disabled={p.current} onClick={() => notify('info', 'Razorpay checkout arrives in the Monetise phase')} className="w-full mt-5">
                    {p.current ? 'Current plan' : `Upgrade to ${p.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Account" />
        <CardBody className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{user?.email}</p>
            <p className="text-xs text-ink-muted mt-0.5">Signed in as {user?.role}</p>
          </div>
          <Button variant="danger" onClick={logout}>Sign out</Button>
        </CardBody>
      </Card>
    </div>
  );
}
