'use client';
import { useEffect, useState } from 'react';
import { Building2, BadgeCheck, Clock, ShieldX, Save, Send, ShieldQuestion } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Company, UpdateCompanyInput } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';

const STATUS: Record<string, { label: string; tone: string; icon: React.ReactNode; note: string }> = {
  unsubmitted: { label: 'Not submitted', tone: 'bg-paper text-ink-muted ring-paper-border', icon: <ShieldQuestion className="h-5 w-5" />, note: 'Fill in your company details and submit for verification.' },
  pending: { label: 'Pending review', tone: 'bg-amber-50 text-amber-700 ring-amber-200', icon: <Clock className="h-5 w-5" />, note: 'Your details are under review. We’ll update this status shortly.' },
  verified: { label: 'Verified', tone: 'bg-brand-50 text-brand-700 ring-brand-200', icon: <BadgeCheck className="h-5 w-5" />, note: 'Your company is verified — the verified badge appears on your documents.' },
  rejected: { label: 'Rejected', tone: 'bg-red-50 text-red-600 ring-red-200', icon: <ShieldX className="h-5 w-5" />, note: 'Verification was rejected. Fix the noted issues and resubmit.' },
};

export default function CompanyPage() {
  const { notify } = useToast();
  const [c, setC] = useState<Company | null>(null);
  const [form, setForm] = useState<UpdateCompanyInput>({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function hydrate(co: Company) {
    setC(co);
    setForm({
      name: co.name ?? '', gstin: co.gstin ?? '', pan: co.pan ?? '',
      registeredAddress: co.registeredAddress ?? '', logoUrl: co.logoUrl ?? '', website: co.website ?? '',
      ownerName: co.ownerName ?? '', ownerEmail: co.ownerEmail ?? '', ownerMobile: co.ownerMobile ?? '',
    });
  }
  useEffect(() => { api.company.get().then((co) => co && hydrate(co)).catch(() => notify('error', 'Could not load company')); }, []);

  async function save() {
    setSaving(true);
    try { const co = await api.company.update(form); if (co) hydrate(co); notify('success', 'Company details saved'); }
    catch (e) { notify('error', e instanceof Error ? e.message : 'Could not save'); }
    finally { setSaving(false); }
  }
  async function submit() {
    setSubmitting(true);
    try { const co = await api.company.update(form); if (co) await api.company.submit().then((x) => x && hydrate(x)); notify('success', 'Submitted for verification'); }
    catch (e) { notify('error', e instanceof Error ? e.message : 'Could not submit'); }
    finally { setSubmitting(false); }
  }

  if (!c) return <PageLoader />;
  const st = STATUS[c.verificationStatus] ?? STATUS.unsubmitted;
  const canSubmit = c.verificationStatus === 'unsubmitted' || c.verificationStatus === 'rejected';

  return (
    <div>
      <PageHeader
        eyebrow="Setup"
        title="Company verification"
        subtitle="Your registered business details and verification status."
        icon={<Building2 className="h-5 w-5" />}
        action={<Button variant="secondary" onClick={save} loading={saving}><Save className="h-4 w-4" /> Save</Button>}
      />

      <Reveal>
        <Card className={`mb-6 p-5 flex flex-wrap items-center justify-between gap-4 ring-1 ring-inset ${st.tone}`}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper-card/70">{st.icon}</span>
            <div>
              <p className="text-sm font-semibold">Status · {st.label}</p>
              <p className="text-xs opacity-80 mt-0.5">{c.verificationNotes || st.note}</p>
              {c.verifiedAt && <p className="text-[11px] opacity-70 mt-0.5">Verified {formatDate(c.verifiedAt)}</p>}
            </div>
          </div>
          {canSubmit && <Button onClick={submit} loading={submitting}><Send className="h-4 w-4" /> Submit for verification</Button>}
        </Card>
      </Reveal>

      <Reveal delay={60}>
        <Card>
          <CardHeader title="Company details" />
          <CardBody className="space-y-4">
            <Input label="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Software Exports Pvt Ltd" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} placeholder="27ABCDE1234F1Z5" hint="15-character GSTIN" />
              <Input label="PAN" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" />
            </div>
            <div>
              <label className="label">Registered address</label>
              <textarea className="field min-h-[64px] resize-y" value={form.registeredAddress} onChange={(e) => setForm({ ...form, registeredAddress: e.target.value })} placeholder="Street, city, state, PIN" maxLength={600} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://acme.com" />
              <Input label="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://…/logo.png" hint="Used on documents (S3 upload coming)" />
            </div>
          </CardBody>
        </Card>
      </Reveal>

      <Reveal delay={120}>
        <Card className="mt-6">
          <CardHeader title="Owner / authorised signatory" />
          <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Owner name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Full name" />
            <Input label="Owner email" type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} placeholder="owner@acme.com" />
            <Input label="Owner mobile" value={form.ownerMobile} onChange={(e) => setForm({ ...form, ownerMobile: e.target.value })} placeholder="+91…" />
          </CardBody>
        </Card>
      </Reveal>
    </div>
  );
}
