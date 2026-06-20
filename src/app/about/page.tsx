import Link from 'next/link';
import {
  ArrowRight, Target, ShieldCheck, Sparkles, MapPin, Heart, Zap, Linkedin, Twitter,
  Quote, Rocket, Users, Flag, Code2, Building2, Globe,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
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

const TIMELINE = [
  { icon: Flag, tag: 'Mar 2026', title: 'The rules changed', body: 'The Finance Act deleted Section 13(8)(b) of the IGST Act — turning a huge class of Indian services into zero-rated exports. A massive group became eligible for tax-free foreign revenue overnight.' },
  { icon: Code2, tag: 'The spark', title: 'We’d felt the pain', body: 'Raising USD invoices, chasing FIRC proofs, tracking FEMA deadlines, emailing a CA to double-check everything. So we built the tool we wished existed.' },
  { icon: Globe, tag: 'Crossbill', title: 'Export, done right', body: 'Auto-filled export declarations, captured exchange rates, FEMA aging, and one-click GSTR-1 6A — the compliance trail, automatic.' },
  { icon: Building2, tag: 'Today', title: 'Export + domestic', body: 'Crossbill now handles both sides — export invoices for foreign clients and domestic GST invoices for Indian ones — with the hard tax logic computed for you.' },
];

const FOUNDERS = [
  {
    initials: 'AY', name: 'Anuj Yadav', role: 'Founder', glow: 'brand' as const,
    accent: 'from-brand-400 to-emerald-600', focus: ['Product', 'Engineering', 'Compliance'],
    bio: 'A developer who got tired of juggling spreadsheets, bank portals and CA emails every time a foreign client paid. Anuj started Crossbill to make export & GST compliance disappear into the background — so builders can get back to building.',
  },
  {
    initials: 'AY', name: 'Anjali Yadav', role: 'CEO & Head of Operations', glow: 'blue' as const,
    accent: 'from-cyan-400 to-teal-600', focus: ['Strategy', 'Operations', 'Customer success'],
    bio: 'Anjali leads Anujali Technologies’ strategy and operations — turning a focused product into a dependable company, and making sure compliance is something customers never have to think about, only rely on.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden text-ink">
      <LandingNav />

      {/* Hero — airy periwinkle sky */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-[#c8cdf4] via-[#aeb8ef] to-[#9aa6ec]" />
          <div className="absolute left-[40%] top-[24%] h-[40rem] w-[56rem] -translate-x-1/2 rounded-full bg-[#e7eafb]/70 blur-[130px]" />
          <div className="absolute right-[-8rem] top-[16%] h-[28rem] w-[30rem] rounded-full bg-[#bcc6ff]/60 blur-[140px]" />
          <div className="absolute left-[-6rem] bottom-[18%] h-[26rem] w-[28rem] rounded-full bg-[#7c8bff]/35 blur-[140px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#eceefb]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 pt-36 pb-32 text-center">
          <Reveal><span className="chip-soft"><Sparkles className="h-3.5 w-3.5 text-brand-600" /> Anujali Technologies Pvt. Ltd.</span></Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-[2.7rem] sm:text-6xl font-semibold tracking-[-0.02em] leading-[1.04] text-[#11131c]">
              The compliance layer for
              <br className="hidden sm:block" />{' '}
              <span className="text-gradient-brand">India’s service economy</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#2a2d3d]/80 leading-relaxed">
              We’re a small, focused team building Crossbill — the dead-simple way for Indian developers
              and agencies to invoice anyone, anywhere, and stay GST &amp; FEMA compliant without thinking about it.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#0d0f16] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(13,15,22,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">Start free <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#11131c]/15 bg-paper-card/40 px-7 py-3.5 text-[15px] font-semibold text-[#11131c] backdrop-blur-sm transition-colors hover:bg-paper-card/70">Get in touch</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission strip */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center justify-center gap-2"><span className="accent-bar" /> Our mission</p>
            <p className="text-2xl sm:text-3xl font-medium tracking-tight text-ink leading-snug">
              To make compliance something Indian businesses <span className="text-gradient-brand">rely on, never worry about</span> —
              so every developer and agency can bill the world with confidence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story timeline */}
      <section className="py-20 bg-paper-card/40 border-y border-black/[0.06]">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="max-w-2xl">
            <span className="chip-soft mb-4">Our story</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Born from a real, recurring pain</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.title} delay={i * 70}>
                <SpotlightCard glow="brand" className="h-full">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><t.icon className="h-5 w-5" /></span>
                      <span className="badge bg-paper text-ink-muted border border-paper-border">{t.tag}</span>
                    </div>
                    <h3 className="mt-4 font-semibold text-ink">{t.title}</h3>
                    <p className="mt-2 text-sm text-ink-muted leading-relaxed">{t.body}</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-paper-card px-6 py-12 shadow-card ring-1 ring-black/[0.02] sm:px-12">
              <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.04]" />
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#bcc6ff]/30 blur-3xl" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { v: 2, suffix: '-in-1', l: 'Export + domestic GST' },
                  { v: 60, suffix: 's', l: 'To a compliant invoice' },
                  { v: 100, suffix: '%', l: 'Focused on one job' },
                  { v: 0, suffix: ' worry', l: 'Compliance you rely on' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-gradient-brand tabular-nums">
                      <AnimatedCounter value={s.v} suffix={s.suffix} />
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <span className="chip-soft mb-4">What we believe</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Principles we build by</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <SpotlightCard glow="brand" className="h-full">
                  <div className="p-6">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><v.icon className="h-5 w-5" /></div>
                    <h3 className="mt-4 font-semibold text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.body}</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative py-24 bg-paper-card/40 border-y border-black/[0.06]">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="chip-soft mb-4"><Users className="h-3.5 w-3.5 text-brand-600" /> Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Meet the founders</h2>
            <p className="mt-3 text-ink-muted text-lg">
              <span className="font-semibold text-ink">Anuj</span> &amp; <span className="font-semibold text-ink">Anjali</span> Yadav lead
              <span className="text-gradient-brand font-semibold"> Anujali</span> Technologies — a partnership in name and in work.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.name} delay={i * 90}>
                <SpotlightCard glow={f.glow} className="h-full">
                  <span className={`absolute inset-x-0 top-0 z-[2] h-1 bg-gradient-to-r ${f.accent}`} />
                  <div className="p-7">
                    <div className="flex items-center gap-4">
                      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br ${f.accent} text-white text-lg font-semibold shadow-lift ring-4 ring-white transition-transform duration-300 group-hover:scale-105`}>
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
                      {f.focus.map((t) => <span key={t} className="badge bg-paper text-ink-muted border border-paper-border">{t}</span>)}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-paper-border pt-4">
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">Connect</span>
                      <div className="flex items-center gap-2">
                        <a href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-paper-border bg-paper-card text-ink-muted hover:text-ink hover:bg-paper transition" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                        <a href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-paper-border bg-paper-card text-ink-muted hover:text-ink hover:bg-paper transition" aria-label="X"><Twitter className="h-4 w-4" /></a>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <figure className="mt-8 relative overflow-hidden rounded-3xl border border-black/[0.06] bg-paper-card p-8 sm:p-10 text-center shadow-card ring-1 ring-black/[0.02]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-200/50 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#bcc6ff]/40 blur-3xl" />
              <Quote className="relative mx-auto h-7 w-7 text-brand-500" />
              <blockquote className="relative mt-4 text-xl sm:text-2xl font-medium leading-snug tracking-tight text-ink max-w-2xl mx-auto">
                “The builder is the user. We felt this pain every month — so we’re obsessed with making it
                <span className="text-gradient-brand"> simply disappear</span> for everyone who bills a client.”
              </blockquote>
              <figcaption className="relative mt-5 text-sm text-ink-muted">— Anuj &amp; Anjali Yadav, Anujali Technologies</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* CTA — brand gradient band */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 px-6 py-16 text-center shadow-[0_30px_70px_-25px_rgba(5,150,105,0.6)] sm:px-12">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-paper-card/15 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
              <div className="absolute inset-0 bg-grid-light mask-fade-b opacity-[0.12]" />
              <div className="relative mx-auto max-w-2xl">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-paper-card/15 text-white ring-1 ring-white/25 backdrop-blur-sm"><Rocket className="h-6 w-6" /></span>
                <h2 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                  Come build a <span className="text-white/90 underline decoration-white/40 decoration-2 underline-offset-4">compliant</span> business
                </h2>
                <p className="mt-4 text-white/80 text-lg">Whether you bill a US client in USD or an Indian client in INR — we’ll get the paperwork right.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-paper-card px-6 py-3.5 text-[15px] font-semibold text-brand-700 shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.98]">Start free <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-paper-card/10 px-6 py-3.5 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-paper-card/20">Back to home</Link>
                </div>
                <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/70"><Heart className="h-3.5 w-3.5 text-white" /> Built with care in India</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
