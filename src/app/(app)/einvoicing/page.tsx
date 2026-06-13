'use client';
import { QrCode, BadgeCheck, Truck, ShieldCheck } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function EInvoicingPage() {
  return (
    <ComingSoon
      eyebrow="Workspace"
      title="e-Invoicing"
      subtitle="Generate IRN and signed QR codes for B2B invoices, straight from Crossbill."
      icon={<QrCode className="h-5 w-5" />}
      tone="from-cyan-500 to-brand-700"
      tagline="IRN & QR codes, the moment you raise a B2B invoice."
      features={[
        { icon: <BadgeCheck className="h-5 w-5" />, title: 'IRN registration', desc: 'Auto-register eligible B2B invoices on the IRP and embed the Invoice Reference Number.' },
        { icon: <ShieldCheck className="h-5 w-5" />, title: 'Signed QR code', desc: 'Every e-invoice carries the government-signed QR — audit-ready and verifiable.' },
        { icon: <Truck className="h-5 w-5" />, title: 'e-Way bill linkage', desc: 'Generate the e-way bill alongside the e-invoice wherever it applies.' },
      ]}
      footnote="e-Invoicing is mandatory once your aggregate turnover crosses the GST threshold. Crossbill will handle IRP registration through a GSP once your credentials are connected."
    />
  );
}
