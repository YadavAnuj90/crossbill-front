'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Send, ShieldCheck, FileText, Copy, Check, Clock, AlertTriangle, FileSignature,
  MapPin, Camera, ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Agreement } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { waShareUrl } from '@/lib/share';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/motion/Reveal';
import { LifecyclePanel } from '@/components/agreements/LifecyclePanel';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  draft: 'gray', sent: 'blue', viewed: 'amber', signed: 'green', declined: 'red', voided: 'gray',
};

export default function AgreementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { notify } = useToast();
  const [a, setA] = useState<Agreement | null>(null);
  const [open, setOpen] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [aadhaarRequired, setAadhaarRequired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => { api.agreements.get(id).then(setA).catch(() => notify('error', 'Agreement not found')); }, [id, notify]);
  useEffect(() => { load(); }, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.agreements.send(id, { signerName: signerName.trim(), signerEmail: signerEmail.trim(), aadhaarRequired });
      setSignUrl(res.signUrl); setOpen(false); notify('success', 'Sent for signature'); load();
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not send'); }
    finally { setBusy(false); }
  }

  async function copyLink() {
    if (!signUrl) return;
    await navigator.clipboard.writeText(signUrl).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  if (!a) return <PageLoader />;
  const canSend = a.status === 'draft' || a.status === 'declined';

  return (
    <div>
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"><ArrowLeft className="h-4 w-4" /> Agreements</Link>
      <PageHeader
        eyebrow={a.category.toUpperCase()}
        title={a.title}
        subtitle={a.signerName ? `Signer: ${a.signerName} · ${a.signerEmail}` : 'Not sent yet'}
        icon={<FileSignature className="h-5 w-5" />}
        action={
          <div className="flex items-center gap-2">
            {canSend && <Button onClick={() => { setSignerName(a.clientName ?? ''); setOpen(true); }}><Send className="h-4 w-4" /> Send for signature</Button>}
            {a.signedPdfUrl && <a href={a.signedPdfUrl} target="_blank" rel="noreferrer" className="btn-primary"><FileText className="h-4 w-4" /> Signed PDF</a>}
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <Badge tone={STATUS_TONE[a.status] ?? 'gray'}>{a.status === 'signed' && <ShieldCheck className="h-3.5 w-3.5" />} {a.status}</Badge>
        {a.signedAt && <span className="text-xs text-ink-faint">Signed {formatDate(a.signedAt)}{a.signerIp ? ` · IP ${a.signerIp}` : ''}</span>}
      </div>

      {signUrl && (
        <Reveal>
          <Card className="mb-6 border-brand-200 bg-brand-50/50 p-4">
            <p className="text-sm font-medium text-ink mb-2">Signing link ready — share it with {a.signerName}:</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="flex-1 min-w-[200px] truncate rounded-lg bg-paper-card px-3 py-2 text-xs font-mono text-ink-soft border border-paper-border">{signUrl}</code>
              <Button variant="secondary" onClick={copyLink}>{copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}</Button>
              <a href={waShareUrl(`Please review & sign "${a.title}": ${signUrl}`)} target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp</a>
            </div>
          </Card>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Card>
            <CardHeader title="Document" />
            <CardBody>
              <div className="max-h-[420px] overflow-auto whitespace-pre-wrap text-sm text-ink-soft leading-relaxed">{a.body || 'No body text.'}</div>
            </CardBody>
            {a.signatureImage && (
              <CardBody className="border-t border-paper-border">
                <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">Signature</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.signatureImage} alt="signature" className="max-h-20" />
                <p className="mt-1 text-sm font-medium text-ink">{a.signedName}</p>
              </CardBody>
            )}
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-fit">
            <CardHeader title="Audit trail" subtitle="Tamper-evident signing history" />
            <CardBody>
              {a.auditTrail.length === 0 ? (
                <p className="text-sm text-ink-muted">No activity yet.</p>
              ) : (
                <ol className="relative border-l border-paper-border pl-5 space-y-4">
                  {a.auditTrail.map((ev, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[23px] grid h-4 w-4 place-items-center rounded-full bg-brand-100 ring-2 ring-white"><Clock className="h-2.5 w-2.5 text-brand-600" /></span>
                      <p className="text-sm font-medium text-ink capitalize">{ev.event}</p>
                      {ev.detail && <p className="text-xs text-ink-muted">{ev.detail}</p>}
                      <p className="text-[11px] text-ink-faint">{formatDate(ev.at)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </CardBody>
          </Card>
        </Reveal>

        {a.status === 'signed' && (
          <Reveal delay={120}>
            <Card className="h-fit lg:col-start-2">
              <CardHeader title="Verification & evidence" subtitle="Fraud-prevention checks captured at signing" />
              <CardBody className="space-y-3 text-sm">
                {a.verifyCode && (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-3 py-2 ring-1 ring-inset ring-brand-200">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-brand-700">Verify code</p>
                      <p className="font-mono text-ink font-semibold">{a.verifyCode}</p>
                    </div>
                    <Link href={`/verify/${a.verifyCode}`} target="_blank" className="btn-secondary text-sm py-1.5"><ExternalLink className="h-4 w-4" /> Open verifier</Link>
                  </div>
                )}
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-ink-faint" /><span className="text-ink-muted w-28">Email OTP</span><span className="text-ink-soft">{a.otpRequired ? 'Verified' : 'Not required'}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink-faint" /><span className="text-ink-muted w-28">Geofence</span><span className={a.geoFenceStatus === 'outside' ? 'text-amber-600 font-medium' : 'text-ink-soft'}>{a.geoFenceStatus === 'ok' ? 'Within allowed area' : a.geoFenceStatus === 'outside' ? 'Outside allowed area' : 'Not captured'}</span></div>
                {a.signerLat != null && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink-faint" /><span className="text-ink-muted w-28">Location</span><span className="text-ink-soft font-mono text-xs">{a.signerLat.toFixed(4)}, {a.signerLng?.toFixed(4)} (±{a.signerGeoAccuracy ?? '?'}m)</span></div>}
                {a.selfieImage && (
                  <div>
                    <p className="text-ink-muted flex items-center gap-2 mb-1.5"><Camera className="h-4 w-4 text-ink-faint" /> Selfie</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.selfieImage} alt="signer selfie" className="h-28 rounded-xl border border-paper-border object-cover" />
                  </div>
                )}
              </CardBody>
            </Card>
          </Reveal>
        )}
      </div>

      <div className="mt-6 max-w-3xl">
        <LifecyclePanel agreement={a} onChange={setA} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Send for signature"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button form="send-form" type="submit" loading={busy}>Send</Button></>}>
        <form id="send-form" onSubmit={send} className="space-y-4">
          <p className="text-sm text-ink-muted flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> The signer gets a secure link. If email is configured they'll also receive a one-time passcode.</p>
          <Input label="Signer name" required value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Anita Rao" />
          <Input label="Signer email" type="email" required value={signerEmail} onChange={(e) => setSignerEmail(e.target.value)} placeholder="anita@foo.com" />
          <label className="flex items-start gap-2.5 text-sm text-ink-soft cursor-pointer rounded-xl border border-paper-border p-3">
            <input type="checkbox" checked={aadhaarRequired} onChange={(e) => setAadhaarRequired(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-paper-border text-brand-600" />
            <span><span className="font-medium text-ink">Require Aadhaar OTP</span> — the signer must verify their Aadhaar before they can open and sign this document.</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
