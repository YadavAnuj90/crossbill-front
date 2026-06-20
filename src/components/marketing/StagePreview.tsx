'use client';
import type { ReactNode, ReactElement } from 'react';
import {
  Check, MapPin, ShieldCheck, FileText, IndianRupee, ArrowUpRight,
  ScanFace, QrCode, Stamp, Plug, TrendingUp, Clock, BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Live product previews for the services showcase stage. Each feature renders a
 * compact, glassy "app window" mock so the right-hand stage feels like a real
 * product, not a caption. Tone-agnostic (white-on-glass) so it sits on any
 * coloured stage gradient.
 */

function Win({ label, accent = 'Live', children }: { label: string; accent?: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/15 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-1.5 text-[11px] font-medium text-white/70">{label}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" /> {accent}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Avatar({ t, i }: { t: string; i: number }) {
  const tints = ['bg-white/25', 'bg-emerald-300/30', 'bg-sky-300/30', 'bg-amber-300/30', 'bg-rose-300/30'];
  return <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white', tints[i % tints.length])}>{t}</span>;
}

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center gap-2.5 rounded-xl bg-white/10 px-2.5 py-2', className)}>{children}</div>;
}

const dim = 'text-white/60';
const bright = 'text-white';

/* ── Scenes ─────────────────────────────────────────────── */

function Employees() {
  const people = [
    { n: 'Priya Sharma', r: 'Engineering', a: 'PS' },
    { n: 'Rahul Verma', r: 'Design', a: 'RV' },
    { n: 'Aisha Khan', r: 'Sales', a: 'AK' },
  ];
  return (
    <Win label="People · 24 active">
      <div className="mock-stagger space-y-2">
        {people.map((p, i) => (
          <Row key={p.n}>
            <Avatar t={p.a} i={i} />
            <div className="min-w-0 flex-1">
              <p className={cn('text-xs font-semibold', bright)}>{p.n}</p>
              <p className={cn('text-[10px]', dim)}>{p.r}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Active</span>
          </Row>
        ))}
      </div>
    </Win>
  );
}

function Attendance() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const state = [1, 1, 1, 2, 1, 0, 0]; // 1 present, 2 leave, 0 off
  return (
    <Win label="Attendance · June 2026">
      <div className="mock-stagger grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="text-center">
            <p className="text-[9px] text-white/50">{d}</p>
            <div className={cn('mt-1 grid h-8 place-items-center rounded-lg text-[10px] font-bold',
              state[i] === 1 ? 'bg-emerald-300/30 text-white' : state[i] === 2 ? 'bg-amber-300/30 text-white' : 'bg-white/10 text-white/40')}>
              {state[i] === 1 ? <Check className="h-3.5 w-3.5" /> : state[i] === 2 ? 'L' : '·'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-[11px]">
        <span className={bright}><b>21</b> present</span>
        <span className="text-amber-200"><b>2</b> leave</span>
        <span className={dim}>96% this month</span>
      </div>
    </Win>
  );
}

function Payslip() {
  const lines = [['Basic', '₹60,000'], ['HRA', '₹24,000'], ['Deductions', '−₹6,400']];
  return (
    <Win label="Salary slip · June 2026">
      <div className="relative rounded-xl bg-white/10 p-3">
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-[26px] font-black uppercase tracking-widest text-white/[0.08] -rotate-12">Crossbill</span>
        <div className="mock-stagger relative space-y-1.5">
          {lines.map(([k, v]) => (
            <div key={k} className="flex justify-between text-[11px]"><span className={dim}>{k}</span><span className={bright}>{v}</span></div>
          ))}
          <div className="mt-1 flex justify-between border-t border-white/15 pt-1.5 text-xs font-bold"><span className={bright}>Net pay</span><span className="text-emerald-200">₹77,600</span></div>
        </div>
      </div>
      <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-white/70"><ShieldCheck className="h-3 w-3" /> Watermarked · tamper-evident PDF</p>
    </Win>
  );
}

function Letter() {
  return (
    <Win label="Offer letter · draft">
      <div className="rounded-xl bg-white/10 p-3">
        <p className={cn('text-xs font-semibold', bright)}>Letter of Offer</p>
        <div className="mt-2 space-y-1.5">
          {[92, 80, 86, 64].map((w, i) => <div key={i} className="h-1.5 rounded-full bg-white/25" style={{ width: `${w}%` }} />)}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <svg viewBox="0 0 90 30" className="h-7 w-24 text-white/80"><path d="M3 22 C 14 4, 22 4, 26 16 S 40 28, 48 12 64 6, 78 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-mock-draw" /></svg>
          <span className="animate-mock-stamp inline-flex items-center gap-1 rounded-full bg-emerald-300/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-100"><Check className="h-3 w-3" /> eSigned</span>
        </div>
      </div>
    </Win>
  );
}

function Checklist() {
  const items = [['Collect documents', true], ['Assign assets', true], ['Grant IT access', false], ['Welcome email', false]] as const;
  const done = items.filter((i) => i[1]).length;
  return (
    <Win label="Onboarding · Aarav N.">
      <div className="mock-stagger space-y-1.5">
        {items.map(([t, ok]) => (
          <Row key={t} className="py-1.5">
            <span className={cn('grid h-5 w-5 place-items-center rounded-md', ok ? 'bg-emerald-300/30 text-white' : 'border border-white/25')}>{ok && <Check className="h-3.5 w-3.5" />}</span>
            <span className={cn('text-[11px]', ok ? 'text-white' : dim)}>{t}</span>
          </Row>
        ))}
      </div>
      <div className="mt-2.5">
        <div className="flex justify-between text-[10px] text-white/70"><span>Progress</span><span>{done}/{items.length}</span></div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="animate-mock-bar h-full rounded-full bg-emerald-300" style={{ width: `${(done / items.length) * 100}%` }} /></div>
      </div>
    </Win>
  );
}

function Identity() {
  return (
    <Win label="Identity check" accent="Verifying">
      <div className="flex items-center gap-3">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-white/10">
          <ScanFace className="h-10 w-10 text-white/80" />
          {['-top-px -left-px', '-top-px -right-px', '-bottom-px -left-px', '-bottom-px -right-px'].map((c, i) => (
            <span key={i} className={cn('absolute h-4 w-4 border-emerald-300', c,
              i === 0 ? 'border-l-2 border-t-2 rounded-tl-lg' : i === 1 ? 'border-r-2 border-t-2 rounded-tr-lg' : i === 2 ? 'border-l-2 border-b-2 rounded-bl-lg' : 'border-r-2 border-b-2 rounded-br-lg')} />
          ))}
          <span className="absolute inset-x-2 top-2 h-0.5 rounded bg-emerald-300/80 shadow-[0_0_8px] shadow-emerald-300 animate-float-tiny" />
        </div>
        <div className="mock-stagger space-y-1.5 text-[11px]">
          <p className="inline-flex items-center gap-1.5 text-white"><Check className="h-3.5 w-3.5 text-emerald-300" /> Aadhaar OTP sent</p>
          <p className="inline-flex items-center gap-1.5 text-white"><Check className="h-3.5 w-3.5 text-emerald-300" /> Selfie captured</p>
          <p className="inline-flex items-center gap-1.5 text-white/60"><span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-emerald-300 animate-spin" /> Matching face…</p>
        </div>
      </div>
    </Win>
  );
}

function Geofence() {
  return (
    <Win label="Signing location">
      <div className="relative h-32 overflow-hidden rounded-xl bg-white/[0.07]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-emerald-300/70" />
        <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/15 animate-pulse" />
        <MapPin className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-[120%] text-white drop-shadow" fill="currentColor" />
      </div>
      <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-100"><Check className="h-3.5 w-3.5" /> Within allowed area · Mumbai, IN</p>
    </Win>
  );
}

function Verifier() {
  return (
    <Win label="Public verifier">
      <div className="flex flex-col items-center py-2 text-center">
        <span className="animate-mock-stamp grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/25"><BadgeCheck className="h-8 w-8 text-white" /></span>
        <p className="mt-2 text-sm font-semibold text-white">Authentic — signature verified</p>
        <p className="mt-1 rounded-lg bg-white/10 px-2.5 py-1 font-mono text-[11px] tracking-widest text-white/80">9F2A4C7E10</p>
      </div>
    </Win>
  );
}

function Consent() {
  const rows = [['Marketing emails', true], ['Data processing', true], ['Third-party share', false]] as const;
  return (
    <Win label="DPDP consent register">
      <div className="mock-stagger space-y-1.5">
        {rows.map(([t, on]) => (
          <Row key={t} className="py-1.5">
            <ShieldCheck className="h-4 w-4 text-white/70" />
            <span className={cn('flex-1 text-[11px]', bright)}>{t}</span>
            <span className={cn('relative h-4 w-7 rounded-full transition', on ? 'bg-emerald-300/70' : 'bg-white/20')}><span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all', on ? 'left-3.5' : 'left-0.5')} /></span>
          </Row>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-white/60">Lawful basis recorded · audit-ready</p>
    </Win>
  );
}

function Signature() {
  return (
    <Win label="eSign · audit trail" accent="Signed">
      <div className="rounded-xl bg-white/10 p-3">
        <p className={cn('text-[11px] font-semibold', bright)}>Master Services Agreement</p>
        <svg viewBox="0 0 200 44" className="mt-2 h-12 w-full text-white"><path d="M6 34 C 26 6, 38 6, 46 26 S 70 42, 86 16 110 6, 126 28 150 38, 168 14 186 8, 196 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-mock-draw" /></svg>
        <div className="mt-1.5 flex items-center justify-between border-t border-white/15 pt-1.5 text-[10px]">
          <span className="inline-flex items-center gap-1 text-emerald-200"><Check className="h-3 w-3" /> OTP verified</span>
          <span className={dim}>IP 103.21.x · 12:04 IST</span>
        </div>
      </div>
    </Win>
  );
}

function Templates() {
  const t = [['Offer letter', '12 sent'], ['NDA', '8 sent'], ['MSA', '5 sent']];
  return (
    <Win label="Templates · bulk send">
      <div className="mock-stagger space-y-1.5">
        {t.map(([n, s], i) => (
          <Row key={n}>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15"><FileText className="h-3.5 w-3.5 text-white" /></span>
            <span className={cn('flex-1 text-[11px] font-semibold', bright)}>{n}</span>
            <span className={cn('text-[10px]', dim)}>{s}</span>
          </Row>
        ))}
      </div>
    </Win>
  );
}

function Lifecycle() {
  const c = [['Acme Corp · MSA', 'Renews 12d', 'amber'], ['Globex · NDA', 'Active', 'emerald'], ['Initech · SOW', 'Renews 40d', 'white']] as const;
  return (
    <Win label="Contract lifecycle">
      <div className="mock-stagger space-y-1.5">
        {c.map(([n, s, tone]) => (
          <Row key={n}>
            <Clock className="h-4 w-4 text-white/70" />
            <span className={cn('flex-1 text-[11px]', bright)}>{n}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-semibold',
              tone === 'amber' ? 'bg-amber-300/25 text-amber-100' : tone === 'emerald' ? 'bg-emerald-300/25 text-emerald-100' : 'bg-white/15 text-white/80')}>{s}</span>
          </Row>
        ))}
      </div>
    </Win>
  );
}

function Invoice() {
  return (
    <Win label="Invoice · INV-0007">
      <div className="rounded-xl bg-white/10 p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn('text-[11px] font-semibold', bright)}>Acme Inc · US</p>
            <p className="text-[10px] text-white/55">Export · LUT</p>
          </div>
          <span className="rounded-full bg-emerald-300/25 px-2 py-0.5 text-[9px] font-semibold text-emerald-100">0% IGST</span>
        </div>
        <div className="mt-2.5 space-y-1 text-[11px]">
          <div className="flex justify-between"><span className={dim}>Subtotal</span><span className={bright}>$2,400.00</span></div>
          <div className="flex justify-between"><span className={dim}>FX · USD→INR</span><span className={bright}>83.42</span></div>
          <div className="flex justify-between border-t border-white/15 pt-1 font-bold"><span className={bright}>Total</span><span className="text-emerald-200">₹2,00,208</span></div>
        </div>
      </div>
    </Win>
  );
}

function Fema() {
  return (
    <Win label="FEMA realisation" accent="Tracking">
      <Row className="mb-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15"><Clock className="h-3.5 w-3.5 text-white" /></span><span className={cn('flex-1 text-[11px]', bright)}>INV-0007 · $2,400</span><span className="text-[10px] text-amber-200">11 mo</span></Row>
      <div className="h-2 overflow-hidden rounded-full bg-white/15"><div className="animate-mock-bar h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300" style={{ width: '92%' }} /></div>
      <p className="mt-2 text-[10px] text-white/65">Nudge sent · 30 days to deadline</p>
    </Win>
  );
}

function Fx() {
  const r = [['USD', '83.42', true], ['EUR', '90.15', true], ['GBP', '105.6', false]] as const;
  return (
    <Win label="Live FX · CBIC ref">
      <div className="mock-stagger space-y-1.5">
        {r.map(([c, v, up]) => (
          <Row key={c}>
            <span className={cn('grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-[10px] font-bold', bright)}>{c}</span>
            <span className={cn('flex-1 text-[11px]', dim)}>{c} → INR</span>
            <span className={cn('text-xs font-bold', bright)}>{v}</span>
            <TrendingUp className={cn('h-3.5 w-3.5', up ? 'text-emerald-300' : 'text-rose-300 rotate-180')} />
          </Row>
        ))}
      </div>
    </Win>
  );
}

function Bundle() {
  const f = ['GSTR-1.json', 'invoices.zip', 'FIRC-proofs.pdf'];
  return (
    <Win label="CA bundle · ready">
      <div className="mock-stagger space-y-1.5">
        {f.map((n) => (
          <Row key={n}><FileText className="h-4 w-4 text-white/70" /><span className={cn('flex-1 text-[11px]', bright)}>{n}</span><Check className="h-3.5 w-3.5 text-emerald-300" /></Row>
        ))}
      </div>
      <button className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/15 py-2 text-[11px] font-semibold text-white">Export ZIP <ArrowUpRight className="h-3.5 w-3.5" /></button>
    </Win>
  );
}

function Payment() {
  return (
    <Win label="Payment link">
      <div className="rounded-xl bg-white/10 p-3 text-center">
        <p className="text-[10px] text-white/60">Amount due</p>
        <p className="text-2xl font-bold text-white">₹48,000</p>
        <div className="mt-2 flex justify-center gap-1.5">
          {['UPI', 'Card', 'Netbanking'].map((m) => <span key={m} className="rounded-md bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-white/85">{m}</span>)}
        </div>
        <button className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-[11px] font-bold text-[#0d0f16]">Pay securely <ArrowUpRight className="h-3.5 w-3.5" /></button>
      </div>
    </Win>
  );
}

function Reconcile() {
  return (
    <Win label="Auto-reconciliation" accent="Synced">
      <Row>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15"><IndianRupee className="h-4 w-4 text-white" /></span>
        <div className="min-w-0 flex-1"><p className={cn('text-[11px] font-semibold', bright)}>INV-0012 · ₹48,000</p><p className="text-[10px] text-white/55">Razorpay webhook · verified</p></div>
        <span className="animate-mock-stamp inline-flex items-center gap-1 rounded-full bg-emerald-300/25 px-2 py-1 text-[10px] font-bold text-emerald-100"><Check className="h-3 w-3" /> Paid</span>
      </Row>
      <p className="mt-2 text-[10px] text-white/60">Marked paid automatically — no manual matching.</p>
    </Win>
  );
}

function WhatsApp() {
  return (
    <Win label="WhatsApp delivery">
      <div className="mock-stagger space-y-2">
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-300/25 px-3 py-2 text-[11px] text-white">Invoice INV-0007 · pay link 🔗<span className="mt-0.5 block text-right text-[9px] text-white/60">12:04 ✓✓</span></div>
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/12 px-3 py-2 text-[11px] text-white">Got it, paying now 👍</div>
      </div>
    </Win>
  );
}

function StampScene() {
  return (
    <Win label="Digital eStamp">
      <div className="rounded-xl bg-white/10 p-3">
        <div className="flex items-center gap-2"><Stamp className="h-5 w-5 text-white" /><span className={cn('text-[11px] font-semibold', bright)}>e-Stamp · ₹500</span></div>
        <div className="mt-2 space-y-1.5">{[88, 72, 80].map((w, i) => <div key={i} className="h-1.5 rounded-full bg-white/25" style={{ width: `${w}%` }} />)}</div>
        <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-100"><Check className="h-3 w-3" /> Stamp duty paid · affixed</p>
      </div>
    </Win>
  );
}

function QR() {
  // deterministic pseudo-random QR grid
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + (i % 5) * 3) % 3 === 0);
  return (
    <Win label="e-Invoice · IRN">
      <div className="flex items-center gap-3">
        <div className="grid shrink-0 grid-cols-7 gap-0.5 rounded-lg bg-white/90 p-1.5">
          {cells.map((on, i) => <span key={i} className={cn('h-2.5 w-2.5 rounded-[1px]', on ? 'bg-[#0d0f16]' : 'bg-transparent')} />)}
        </div>
        <div className="space-y-1.5 text-[11px]">
          <p className="inline-flex items-center gap-1.5 text-white"><QrCode className="h-3.5 w-3.5 text-emerald-300" /> IRN registered</p>
          <p className="font-mono text-[10px] text-white/70">a1b2…f9 · signed QR</p>
          <p className="inline-flex items-center gap-1 text-emerald-100"><Check className="h-3 w-3" /> GST portal ✓</p>
        </div>
      </div>
    </Win>
  );
}

function Integrations() {
  const apps = ['Zoho', 'Tally', 'QB', 'Stripe', 'GST', 'Email'];
  return (
    <Win label="Integrations">
      <div className="mock-stagger grid grid-cols-3 gap-2">
        {apps.map((a) => (
          <div key={a} className="flex items-center gap-1.5 rounded-xl bg-white/10 px-2 py-2"><Plug className="h-3.5 w-3.5 text-white/70" /><span className={cn('text-[10px] font-semibold', bright)}>{a}</span></div>
        ))}
      </div>
    </Win>
  );
}

function Generic() {
  return (
    <Win label="Crossbill">
      <div className="space-y-2">{[90, 78, 84].map((w, i) => <div key={i} className="h-2 rounded-full bg-white/25" style={{ width: `${w}%` }} />)}</div>
    </Win>
  );
}

const MAP: Record<string, () => ReactElement> = {
  'Export & domestic invoicing': Invoice,
  'Credit & debit notes': Invoice,
  'FEMA realisation tracker': Fema,
  'GSTR-1 & document bundle': Bundle,
  'Live FX rates': Fx,
  'Razorpay payment links': Payment,
  'Auto-reconciliation': Reconcile,
  'Subscription billing': Payment,
  'Employee records': Employees,
  'Attendance & leave': Attendance,
  'Payroll & salary slips': Payslip,
  'Offer, experience & relieving letters': Letter,
  'Onboarding & exit': Checklist,
  'Aadhaar-verified onboarding': Identity,
  'Native eSign + audit trail': Signature,
  'Templates & bulk send': Templates,
  'Contract lifecycle': Lifecycle,
  'Aadhaar eSign / DSC': Signature,
  'Geolocation & geofencing': Geofence,
  'Selfie & fraud checks': Identity,
  'Public eSign verifier': Verifier,
  'DPDP consent register': Consent,
  'WhatsApp delivery': WhatsApp,
  'Digital eStamping': StampScene,
  'e-Invoicing (IRN/QR)': QR,
  'Integrations': Integrations,
};

export function StagePreview({ title }: { title: string }) {
  const Scene = MAP[title] ?? Generic;
  return <Scene />;
}
