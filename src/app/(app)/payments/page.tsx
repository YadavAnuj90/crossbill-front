'use client';
import { Wallet, Link2, RefreshCcw, Globe } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function PaymentsPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="Payments"
      subtitle="Collect payments on your invoices and reconcile them automatically."
      icon={<Wallet className="h-5 w-5" />}
      tone="from-brand-500 to-emerald-700"
      tagline="Get paid faster — and let Crossbill reconcile it for you."
      features={[
        { icon: <Link2 className="h-5 w-5" />, title: 'Payment links', desc: 'Attach a secure Razorpay or Stripe pay link to any invoice — clients pay by card, UPI or netbanking.' },
        { icon: <RefreshCcw className="h-5 w-5" />, title: 'Auto-reconciliation', desc: 'Incoming payments match to the right invoice and mark it paid automatically — no manual ticking off.' },
        { icon: <Globe className="h-5 w-5" />, title: 'Multi-currency settlement', desc: 'Collect from foreign clients and track the INR settlement against your FEMA realisation timeline.' },
      ]}
      footnote="Activating Payments needs your Razorpay and/or Stripe API keys. Once connected, links and reconciliation switch on instantly — no other setup required."
    />
  );
}
