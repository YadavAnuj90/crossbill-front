import Link from 'next/link';
import {
  ArrowRight, Target, ShieldCheck, Sparkles, MapPin, Heart, Zap, Linkedin, Twitter,
  Quote, Rocket, Users,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { Aurora } from '@/components/motion/Aurora';
import { Reveal } from '@/components/motion/Reveal';
import { AnimatedCounter } from '@/components/motion/AnimatedCounter';

export const metadata = {
  title: 'About — Anujali Technologies',
  description: 'The team behind Crossbill — building the compliance layer for India’s service economy.',
};

const VALUES = [
  { icon: Target, title: 'Ruthlessly focused', body: 'We do one thing — correct invoicing and its compliance trail — and do it better than anything generic.' },
  { icon: ShieldCheck, title: 'Compliance you can trust', body: 'Templates and tax logic built to be audit-ready, reviewed against the law, never guessed.' },
  { icon: Zap, title: 'Fast & delightful', body: 'A compliant invoice in under a minute. Software should feel effortless, even when the rules aren’t.' },
  { icon: MapPin, title: 'India-first', body: 'Built in India, for Indian developers and agencies billing the world — and now, billing India too.' },
];

const FOUNDERS = [
  {
    initials: 'AY', name: 'Anuj Yadav', role: 'Founder',
    accent: 'from-brand-400 to-emerald-600', focus: ['Product', 'Engineering', 'Compliance'],
    bio: 'A developer who got tired of juggling spreadsheets, bank portals and CA emails every time a foreign client paid. Anuj started Crossbill to make export & GST compliance disappear into the background — so builders can get back to building.',
  },
  {
    initials: 'AY', name: 'Anjali Yadav', role: 'CEO & Head of Operations',
    accent: 'from-cyan-400 to-teal-600', focus: ['Strategy', 'Operations', 'Customer success'],
    bio: 'Anjali leads Anujali Technologies’ strategy and operations — turning a focused product into a dependable company, and making sure compliance is something customers never have to think about, only rely on.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white bg-noise">
        <Aurora className="opacity-80" />
        <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.15]" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative mx-auto max-w-4xl px-5 pt-36 pb-28 text-center">
          <Reveal><span className="glow-chip"><Sparkles className="h-3.5 w-3.5 text-brand-300" /> Anujali Technologies Pvt. Ltd.</span></Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-[2.6rem] sm:text-6xl font-semibold tracking-tight leading-[1.05]">
              The compliance layer for
              <br className="hidden sm:block" />{' '}
              <span className="text-gradient-vivid animate-gradient-x">India’s service economy</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
              We’re a small, focused team building Crossbill — the dead-simple way for Indian developers
              and agencies to invoice anyone, anywhere, and stay GST &amp; FEMA compliant without thinking about it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="relative py-24">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <span className="badge bg-brand-50 text-brand-700 mb-4">Our story</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Born from a real, recurring pain</h2>
          </Reveal>
          <div className="mt-6 space-y-5 text-ink-muted text-lg leading-relaxed">
            <Reveal delay={60}><p>
              In March 2026, the Finance Act deleted Section 13(8)(b) of the IGST Act — turning a huge class
              of Indian IT, agency and freelancer services into <span className="text-ink font-medium">zero-rated exports</span>.
              Overnight, a massive group of service exporters became eligible for tax-free foreign revenue. Most didn’t
              know the rules, and the paperwork to claim the benefit was fiddly and unforgiving.
            </p></Reveal>
            <Reveal delay={120}><p>
              We’d lived that pain ourselves — raising USD invoices, chasing FIRC proofs, tracking FEMA deadlines,
              and emailing a CA to double-check every detail. So we built the tool we wished existed: one that gets
              the export declaration, exchange rate, SAC code and compliance trail right, automatically.
            </p></Reveal>
            <Reveal delay={180}><p>
              Today Crossbill handles both sides of the business — <span className="text-ink font-medium">export invoices</span> for
              foreign clients and <span className="text-ink font-medium">domestic GST invoices</span> for Indian ones — with the
              hard tax logic computed for you. The goal never changes: make compliance something you rely on, never worry about.
            </p></Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-8">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="gborder shadow-glow">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-[#0f1620] px-6 py-12 sm:px-12 bg-noise">
                <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-30" />
                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { v: 2, suffix: '-in-1', l: 'Export + domestic GST' },
                    { v: 60, suffix: 's', l: 'To a compliant invoice' },
                    { v: 100, suffix: '%', l: 'Focused on one job' },
                    { v: 1, suffix: '', l: 'Mission: zero compliance worry' },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient-vivid tabular-nums">
                        <AnimatedCounter value={s.v} suffix={s.suffix} />
                      </div>
                      <p className="mt-2 text-sm text-white/55">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <span className="badge bg-brand-50 text-brand-700 mb-4">What we believe</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Principles we build by</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="card card-hover group relative h-full overflow-hidden p-6">
                  <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-200/40 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-200/50"><v.icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 font-semibold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative py-24 bg-white/50 border-y border-paper-border/70">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="badge bg-paper text-ink-muted border border-paper-border mb-4"><Users className="h-3.5 w-3.5" /> Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Meet the founders</h2>
            <p className="mt-3 text-ink-muted text-lg">
              <span className="font-semibold text-ink">Anuj</span> &amp; <span className="font-semibold text-ink">Anjali</span> Yadav lead
              <span className="text-gradient-brand font-semibold"> Anujali</span> Technologies — a partnership in name and in work.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.name} delay={i * 90}>
                <div className="card card-hover relative h-full overflow-hidden">
                  <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.accent}`} />
                  <div className="p-7">
                    <div className="flex items-center gap-4">
                      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br ${f.accent} text-white text-lg font-semibold shadow-lift ring-4 ring-white`}>
                        {f.initials}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-ink">{f.name}</h3>
                        <p className="text-sm font-medium text-brand-700">{f.role}</p>
                        <p className="text-xs text-ink-faint mt-0.5">Anujali Technologies Pvt. Ltd.</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm text-ink-muted leading-relaxed">{f.bio}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {f.focus.map((t) => (
                        <span key={t} className="badge bg-paper text-ink-muted border border-paper-border">{t}</span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-paper-border pt-4">
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">Connect</span>
                      <div className="flex items-center gap-2">
                        <a href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-paper-border bg-white text-ink-muted hover:text-ink hover:bg-paper transition" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                        <a href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-paper-border bg-white text-ink-muted hover:text-ink hover:bg-paper transition" aria-label="X"><Twitter className="h-4 w-4" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Founder quote */}
          <Reveal delay={120}>
            <figure className="mt-8 card relative overflow-hidden p-8 sm:p-10 text-center">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/60 blur-3xl" />
              <Quote className="relative mx-auto h-7 w-7 text-brand-400" />
              <blockquote className="relative mt-4 text-xl sm:text-2xl font-medium leading-snug tracking-tight text-ink max-w-2xl mx-auto">
                “The builder is the user. We felt this pain every month — so we’re obsessed with making it
                <span className="text-gradient-brand"> simply disappear</span> for everyone who bills a client.”
              </blockquote>
              <figcaption className="relative mt-5 text-sm text-ink-muted">— Anujali Technologies</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-12 bg-noise">
              <Aurora />
              <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-30" />
              <div className="relative mx-auto max-w-2xl">
                <Rocket className="mx-auto h-8 w-8 text-brand-300" />
                <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                  Come build a <span className="text-gradient-vivid animate-gradient-x">compliant</span> business
                </h2>
                <p className="mt-4 text-white/65 text-lg">Whether you bill a US client in USD or an Indian client in INR — we’ll get the paperwork right.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/register" className="btn-primary px-6 py-3.5 text-[15px] shadow-glow">Start free <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/" className="btn-glass px-6 py-3.5 text-[15px]">Back to home</Link>
                </div>
                <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/45"><Heart className="h-3.5 w-3.5 text-brand-300" /> Built with care in India</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
