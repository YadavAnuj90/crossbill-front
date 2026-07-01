'use client';
import { ReactNode } from 'react';
import { Sparkles, ArrowUpRight, Bell } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { useToast } from '@/lib/toast-context';

export interface SoonFeature {
  icon: ReactNode;
  title: string;
  desc: string;
}

export function ComingSoon({
  eyebrow, title, subtitle, icon, tagline, features, footnote, tone = 'from-brand-500 to-brand-700',
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  tagline: string;
  features: SoonFeature[];
  footnote?: string;
  tone?: string;
}) {
  const { notify } = useToast();
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} icon={icon} />

      <Reveal>
        <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${tone} p-7 sm:p-9 text-white`}>
          <span className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-paper-card/15 blur-3xl" />
          <span className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-paper-card/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-card/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Coming soon
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">{tagline}</h2>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => notify('success', `Thanks — we'll notify you the moment ${title} goes live.`)}
                className="inline-flex items-center gap-2 rounded-xl bg-paper-card px-5 py-2.5 text-sm font-semibold text-ink shadow-card transition hover:shadow-lift"
              >
                <Bell className="h-4 w-4" /> Notify me when it&apos;s ready
              </button>
              <a href="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white">
                Talk to us <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Card>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={60 + i * 40}>
            <Card className="h-full p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">{f.icon}</span>
              <h3 className="mt-3.5 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-muted leading-snug">{f.desc}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      {footnote && (
        <Reveal delay={240}>
          <p className="mt-6 text-center text-xs text-ink-faint max-w-xl mx-auto leading-relaxed">{footnote}</p>
        </Reveal>
      )}
    </div>
  );
}
