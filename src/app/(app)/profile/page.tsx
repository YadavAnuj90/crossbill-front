'use client';
import { useEffect, useState } from 'react';
import { Building2, Landmark, FileCheck2, Save } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import type { Profile } from '@/lib/types';
import { SAC_CODES } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';

type Form = Partial<Profile>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(user ?? null); }, [user]);

  if (!form) return <PageLoader />;
  const set = (k: keyof Profile, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const patch: Form = {
        legalName: form?.legalName || undefined,
        gstin: form?.gstin || undefined,
        address: form?.address || undefined,
        defaultSac: form?.defaultSac || undefined,
        bankAccount: form?.bankAccount || undefined,
        bankIfsc: form?.bankIfsc || undefined,
        lutNumber: form?.lutNumber || undefined,
        lutFy: form?.lutFy || undefined,
        lutArn: form?.lutArn || undefined,
      };
      const updated = await api.profile.update(patch);
      setUser(updated);
      notify('success', 'Business profile saved');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave}>
      <PageHeader
        eyebrow="Setup"
        title="Business profile"
        subtitle="These details auto-fill your export invoices — fill them once."
        icon={<Building2 className="h-5 w-5" />}
        action={<Button type="submit" loading={saving}><Save className="h-4 w-4" /> Save changes</Button>}
      />

      <div className="space-y-6">
        <Reveal>
          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-600" /> Identity</span>} subtitle="Your registered legal entity and GST identity." />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Input label="Legal / business name" value={form.legalName ?? ''} onChange={(e) => set('legalName', e.target.value)} placeholder="Acme Dev Studio LLP" />
              <Input label="GSTIN" value={form.gstin ?? ''} onChange={(e) => set('gstin', e.target.value.toUpperCase())} placeholder="27ABCDE1234F1Z5" hint="15-character GST identification number." />
              <div className="sm:col-span-2">
                <label className="label">Registered address</label>
                <textarea className="field min-h-[80px] resize-y" value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} placeholder="Street, city, state, PIN" />
              </div>
              <Select label="Default SAC code" value={form.defaultSac ?? ''} onChange={(e) => set('defaultSac', e.target.value)} hint="Applied to new invoice items; overridable per line.">
                <option value="">Select a SAC code…</option>
                {SAC_CODES.map((s) => <option key={s.code} value={s.code}>{s.code} — {s.description}</option>)}
              </Select>
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-brand-600" /> LUT (Letter of Undertaking)</span>} subtitle="Lets you invoice at 0% IGST. Renew at the start of each financial year (April)." />
            <CardBody className="grid gap-4 sm:grid-cols-3">
              <Input label="LUT number" value={form.lutNumber ?? ''} onChange={(e) => set('lutNumber', e.target.value)} placeholder="LUT/2026-27/..." />
              <Input label="Financial year" value={form.lutFy ?? ''} onChange={(e) => set('lutFy', e.target.value)} placeholder="2026-27" />
              <Input label="ARN" value={form.lutArn ?? ''} onChange={(e) => set('lutArn', e.target.value)} placeholder="AD270426..." />
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card>
            <CardHeader title={<span className="flex items-center gap-2"><Landmark className="h-4 w-4 text-brand-600" /> Bank details</span>} subtitle="Used on invoices for inward remittance. Stored encrypted." />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Input label="Account number" value={form.bankAccount ?? ''} onChange={(e) => set('bankAccount', e.target.value)} placeholder="0000 0000 0000" />
              <Input label="IFSC" value={form.bankIfsc ?? ''} onChange={(e) => set('bankIfsc', e.target.value.toUpperCase())} placeholder="HDFC0001234" />
            </CardBody>
          </Card>
        </Reveal>
      </div>
    </form>
  );
}
