'use client';
import { useState } from 'react';
import {
  MessageCircle, Phone, Mail, ArrowRight, MapPin, Clock, Send, Building2, Check,
} from 'lucide-react';
import { LandingNav } from '@/components/marketing/LandingNav';
import { LandingFooter } from '@/components/marketing/LandingFooter';
import { PageHero } from '@/components/marketing/PageHero';
import { Reveal } from '@/components/motion/Reveal';

const PHONE = '8851520832';
const PHONE_INTL = '+918851520832';
const EMAIL = 'ay6258147@gmail.com';

const METHODS = [
  {
    icon: MessageCircle, label: 'WhatsApp', value: '+91 88515 20832',
    desc: 'Quickest way to reach us — usually a reply within minutes.',
    href: `https://wa.me/918851520832`, cta: 'Chat on WhatsApp',
    tone: 'from-green-400 to-green-600', ext: true,
  },
  {
    icon: Phone, label: 'Call us', value: '+91 88515 20832',
    desc: 'Prefer to talk? Give us a ring during business hours.',
    href: `tel:${PHONE_INTL}`, cta: 'Call now',
    tone: 'from-blue-400 to-blue-600', ext: false,
  },
  {
    icon: Mail, label: 'Email', value: EMAIL,
    desc: 'For detailed questions, partnerships or support.',
    href: `mailto:${EMAIL}`, cta: 'Send an email',
    tone: 'from-brand-400 to-emerald-600', ext: false,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Compose a mailto so the message reaches the inbox without a backend.
    const subject = encodeURIComponent(`Crossbill enquiry from ${form.name || 'website'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <PageHero
        eyebrow={<><MessageCircle className="h-3.5 w-3.5 text-brand-300" /> Contact</>}
        title="Let’s"
        accent="talk"
        intro="Questions, feedback, partnerships, or help getting set up — we’d genuinely love to hear from you."
      />

      {/* Contact methods */}
      <section className="py-20 -mt-4">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-5 md:grid-cols-3">
            {METHODS.map((m, i) => (
              <Reveal key={m.label} delay={i * 80}>
                <a
                  href={m.href} target={m.ext ? '_blank' : undefined} rel={m.ext ? 'noreferrer' : undefined}
                  className="card card-hover group relative h-full overflow-hidden p-7 flex flex-col"
                >
                  <span className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${m.tone} opacity-10 blur-2xl`} />
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${m.tone} text-white shadow-lift`}><m.icon className="h-6 w-6" /></div>
                  <p className="mt-4 text-sm text-ink-faint">{m.label}</p>
                  <p className="mt-0.5 text-lg font-semibold text-ink">{m.value}</p>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">{m.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    {m.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-5 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <Reveal>
            <div className="card p-7">
              <h2 className="text-xl font-semibold tracking-tight text-ink">Send us a message</h2>
              <p className="text-sm text-ink-muted mt-1">We’ll get back to you within one business day.</p>
              {sent ? (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white"><Check className="h-5 w-5" /></span>
                  <p className="text-sm text-brand-900">Your email app should have opened with the message ready to send. Thanks for reaching out!</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="Anuj Yadav" />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" placeholder="you@studio.com" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field min-h-[140px] resize-y" placeholder="How can we help?" />
                  </div>
                  <button type="submit" className="btn-primary"><Send className="h-4 w-4" /> Send message</button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={80}>
            <div className="space-y-4">
              <div className="card p-6">
                <div className="flex items-center gap-2.5 mb-3"><Building2 className="h-4 w-4 text-brand-600" /><h3 className="font-semibold text-ink">Anujali Technologies Pvt. Ltd.</h3></div>
                <p className="text-sm text-ink-muted leading-relaxed">The team behind Crossbill — building the compliance layer for India’s service economy.</p>
              </div>
              <div className="card p-6 space-y-4">
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-brand-600 mt-0.5" /><div><p className="text-sm font-medium text-ink">Devakipur, Unchadih</p><p className="text-sm text-ink-muted">Jaunpur, Uttar Pradesh – 222204, India 🇮🇳</p></div></div>
                <div className="flex items-start gap-3"><Clock className="h-4 w-4 text-brand-600 mt-0.5" /><div><p className="text-sm font-medium text-ink">Mon–Fri, 10am–6pm IST</p><p className="text-sm text-ink-muted">WhatsApp is fastest outside these hours.</p></div></div>
                <div className="flex items-start gap-3"><Mail className="h-4 w-4 text-brand-600 mt-0.5" /><div><p className="text-sm font-medium text-ink">{EMAIL}</p><p className="text-sm text-ink-muted">+91 88515 20832</p></div></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
