import Link from 'next/link';
import { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 11.5L16 16L23 20.5" stroke="#6ee7b7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-semibold text-ink tracking-tight">Crossbill</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-sm text-ink-muted text-center">{footer}</div>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex flex-col justify-center bg-ink px-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-60 w-60 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative max-w-md">
          <ShieldCheck className="h-10 w-10 text-brand-400" />
          <blockquote className="mt-6 text-2xl font-medium text-white leading-snug tracking-tight">
            “Invoice correctly, claim zero-rated export benefits, and stay compliant — in under a minute,
            without hiring a CA to babysit every invoice.”
          </blockquote>
          <p className="mt-6 text-sm text-white/50">
            Correct USD export invoicing and GST/FEMA compliance for Indian service exporters.
          </p>
        </div>
      </div>
    </div>
  );
}
