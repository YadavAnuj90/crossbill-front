'use client';
import { Blocks, BookOpen, RefreshCw, CreditCard, Landmark, Mail, FileSpreadsheet } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function IntegrationsPage() {
  return (
    <ComingSoon
      eyebrow="Setup"
      title="Integrations"
      subtitle="Connect Crossbill to the accounting, payment and filing tools you already use."
      icon={<Blocks className="h-5 w-5" />}
      tone="from-indigo-500 to-brand-700"
      tagline="Connect Crossbill to the tools you already run on."
      features={[
        { icon: <BookOpen className="h-5 w-5" />, title: 'Zoho Books & Tally', desc: 'Push invoices and credit/debit notes straight into your books of account.' },
        { icon: <RefreshCw className="h-5 w-5" />, title: 'QuickBooks', desc: 'Two-way sync of customers, invoices and payments.' },
        { icon: <CreditCard className="h-5 w-5" />, title: 'Stripe & Razorpay', desc: 'Bring in payment data for reconciliation and your own subscription billing.' },
        { icon: <Landmark className="h-5 w-5" />, title: 'GST Portal', desc: 'File GSTR-1 and validate GSTINs without leaving Crossbill.' },
        { icon: <Mail className="h-5 w-5" />, title: 'Email (Resend / SMTP)', desc: 'Send invoices and FEMA reminders from your own domain.' },
        { icon: <FileSpreadsheet className="h-5 w-5" />, title: 'Exports', desc: 'One-click GSTR-1, Tally XML and CSV exports for your CA.' },
      ]}
      footnote="Each integration connects via OAuth or an API key you provide. Connected tools appear here as live connections you can pause or revoke anytime."
    />
  );
}
