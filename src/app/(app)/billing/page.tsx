'use client';
import { CreditCard, IndianRupee, FileText, TrendingUp } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function BillingPage() {
  return (
    <ComingSoon
      eyebrow="Setup"
      title="Billing & subscription"
      subtitle="Manage your Crossbill plan, usage and payment method."
      icon={<CreditCard className="h-5 w-5" />}
      tone="from-amber-500 to-brand-700"
      tagline="Simple, transparent plans for every stage of your studio."
      features={[
        { icon: <TrendingUp className="h-5 w-5" />, title: 'Plans & usage', desc: 'See your current plan, invoice volume this month, and exactly what each tier unlocks.' },
        { icon: <IndianRupee className="h-5 w-5" />, title: 'Razorpay billing', desc: 'Upgrade, downgrade or cancel anytime — pay securely by card, UPI or netbanking.' },
        { icon: <FileText className="h-5 w-5" />, title: 'Tax invoices', desc: 'Download GST tax invoices for your own Crossbill subscription payments.' },
      ]}
      footnote="Crossbill is free while in preview. Paid plans bill through Razorpay; you'll always see the price and GST before you confirm."
    />
  );
}
