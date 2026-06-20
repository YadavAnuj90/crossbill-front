'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck, ShieldX, Loader2, CheckCircle2, MapPin, Mail, Clock, FileText, Camera, AlertTriangle,
} from 'lucide-react';
import api from '@/lib/api';
import type { VerifyResult } from '@/lib/types';

function fmt(iso?: string | null) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default function VerifyResultPage() {
  const { code } = useParams<{ code: string }>();
  const [res, setRes] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.agreements.verify(code).then(setRes).catch(() => setRes({ found: false })).finally(() => setLoading(false));
  }, [code]);

  const fenceTone = res?.geoFenceStatus === 'outside' ? 'text-amber-600' : 'text-ink-soft';

  return (
    <div className="min-h-screen bg-[#f6f7f9] py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-2 mb-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700"><ShieldCheck className="h-4 w-4 text-white" /></span>
          <span className="font-semibold text-ink">Crossbill · eSign verifier</span>
          <Link href="/verify" className="ml-auto text-sm text-brand-700 hover:underline">Verify another</Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-paper-card p-10 text-center shadow-card"><Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-600" /></div>
        ) : !res?.found ? (
          <div className="rounded-2xl bg-paper-card p-10 text-center shadow-card">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-red-50 text-red-600 mb-4"><ShieldX className="h-7 w-7" /></span>
            <h1 className="text-lg font-semibold text-ink">No signed document found</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Code <span className="font-mono">{code}</span> doesn't match any signed agreement. Double-check the code on the PDF.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-paper-card p-7 shadow-card">
            <div className="flex items-center gap-3 pb-4 border-b border-paper-border">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><CheckCircle2 className="h-6 w-6" /></span>
              <div>
                <p className="text-sm font-semibold text-brand-700">Authentic — signature verified</p>
                <p className="text-xs text-ink-muted">This document was electronically signed via Crossbill.</p>
              </div>
            </div>

            <h1 className="mt-4 text-lg font-semibold text-ink">{res.title}</h1>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">{res.category}</p>

            <dl className="mt-4 space-y-2.5 text-sm">
              <Row icon={<FileText className="h-4 w-4" />} label="Between" value={`${res.sellerName ?? '—'}  ·  ${res.signerName ?? '—'}`} />
              <Row icon={<Mail className="h-4 w-4" />} label="Signer email" value={res.signerEmail ?? '—'} />
              <Row icon={<Clock className="h-4 w-4" />} label="Signed at" value={fmt(res.signedAt)} />
              <Row icon={<ShieldCheck className="h-4 w-4" />} label="IP address" value={res.signerIp ?? '—'} />
              <Row icon={<ShieldCheck className="h-4 w-4" />} label="Email OTP" value={res.otpVerified ? 'Verified' : 'Not required'} />
              <Row icon={<MapPin className="h-4 w-4" />} label="Geofence" value={res.geoFenceStatus === 'ok' ? 'Within allowed area' : res.geoFenceStatus === 'outside' ? 'Outside allowed area' : 'Not captured'} valueClass={fenceTone} />
              <Row icon={<Camera className="h-4 w-4" />} label="Selfie" value={res.selfieCaptured ? 'Captured' : 'Not captured'} />
            </dl>

            {res.geoFenceStatus === 'outside' && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> This document was signed from outside the sender's allowed signing area — review before relying on it.</p>
            )}

            {res.signedPdfUrl && <a href={res.signedPdfUrl} target="_blank" rel="noreferrer" className="btn-primary mt-5 inline-flex"><FileText className="h-4 w-4" /> View signed PDF</a>}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-ink-faint mt-0.5">{icon}</span>
      <span className="text-ink-muted w-28 shrink-0">{label}</span>
      <span className={valueClass ?? 'text-ink-soft'}>{value}</span>
    </div>
  );
}
