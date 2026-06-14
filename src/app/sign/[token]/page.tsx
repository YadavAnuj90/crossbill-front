'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, PenLine, Eraser, CheckCircle2, AlertTriangle, Loader2, FileText } from 'lucide-react';
import api from '@/lib/api';
import type { SigningView } from '@/lib/types';

export default function SignPage() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<SigningView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedName, setSignedName] = useState('');
  const [otp, setOtp] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ url: string | null } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  useEffect(() => {
    api.agreements.forSigning(token)
      .then((v) => { setView(v); setSignedName(v.signerName ?? ''); if (v.status === 'signed') setDone({ url: v.signedPdfUrl }); })
      .catch((e) => setError(e instanceof Error ? e.message : 'This signing link is invalid or has expired'))
      .finally(() => setLoading(false));
  }, [token]);

  // ── canvas signature pad ──
  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  }
  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true; const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e); ctx.beginPath(); ctx.moveTo(x, y);
    canvasRef.current!.setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
    const { x, y } = pos(e); ctx.lineTo(x, y); ctx.stroke(); hasInk.current = true;
  }
  function end() { drawing.current = false; }
  function clear() { const c = canvasRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); hasInk.current = false; }

  async function resend() {
    try { await api.agreements.resendOtp(token); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not resend OTP'); }
  }

  async function submit() {
    setError(null);
    if (!signedName.trim()) { setError('Enter your full legal name'); return; }
    if (!hasInk.current) { setError('Please draw your signature'); return; }
    if (!consent) { setError('Tick the consent box to sign electronically'); return; }
    if (view?.otpRequired && !otp.trim()) { setError('Enter the OTP sent to your email'); return; }
    setBusy(true);
    try {
      const signatureImage = canvasRef.current!.toDataURL('image/png');
      const res = await api.agreements.sign(token, { signedName: signedName.trim(), signatureImage, consent, otp: otp || undefined });
      setDone({ url: res.signedPdfUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not record your signature');
    } finally { setBusy(false); }
  }

  async function decline() {
    if (!confirm('Decline to sign this document?')) return;
    try { await api.agreements.decline(token); setError('You declined this document.'); setView(null); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not decline'); }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 mb-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
            <svg width="17" height="17" viewBox="0 0 32 32" fill="none"><path d="M9 11.5L16 16L9 20.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 11.5L16 16L23 20.5" stroke="#a7f3d0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="font-semibold text-ink">Crossbill</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-ink-muted"><ShieldCheck className="h-4 w-4 text-brand-600" /> Secure e-signature</span>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card"><Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-600" /></div>
        ) : done ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-brand-50 text-brand-600 mb-4"><CheckCircle2 className="h-7 w-7" /></span>
            <h1 className="text-xl font-semibold text-ink">Signed — thank you!</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Your electronic signature has been recorded with a full audit trail.</p>
            {done.url && <a href={done.url} target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-flex"><FileText className="h-4 w-4" /> View signed PDF</a>}
          </div>
        ) : error && !view ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-amber-50 text-amber-600 mb-4"><AlertTriangle className="h-7 w-7" /></span>
            <h1 className="text-lg font-semibold text-ink">{error}</h1>
          </div>
        ) : view ? (
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">{view.category}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{view.title}</h1>
              <p className="mt-1 text-sm text-ink-muted">From {view.sellerName ?? 'the sender'} · for {view.signerName ?? 'you'}</p>
              <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-paper-border bg-paper/40 p-4 text-sm text-ink-soft whitespace-pre-wrap leading-relaxed">{view.body || 'No additional terms provided.'}</div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
              <h2 className="font-semibold text-ink flex items-center gap-2"><PenLine className="h-4 w-4 text-brand-600" /> Sign</h2>

              <div>
                <label className="label">Full legal name</label>
                <input value={signedName} onChange={(e) => setSignedName(e.target.value)} className="field" placeholder="Your name" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Draw your signature</label>
                  <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"><Eraser className="h-3.5 w-3.5" /> Clear</button>
                </div>
                <canvas
                  ref={canvasRef} width={560} height={170}
                  onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}
                  className="w-full touch-none rounded-xl border border-dashed border-paper-border bg-paper/30 cursor-crosshair"
                />
              </div>

              {view.otpRequired && (
                <div>
                  <label className="label">Email OTP</label>
                  <div className="flex gap-2">
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" maxLength={6} className="field font-mono tracking-widest" placeholder="123456" />
                    <button type="button" onClick={resend} className="btn-secondary shrink-0">Resend</button>
                  </div>
                </div>
              )}

              <label className="flex items-start gap-2.5 text-sm text-ink-soft cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-paper-border text-brand-600" />
                <span>I agree to sign this document electronically and that my electronic signature is legally binding under the IT Act, 2000.</span>
              </label>

              {error && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> {error}</p>}

              <div className="flex items-center gap-3 pt-1">
                <button onClick={submit} disabled={busy} className="btn-primary">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Sign document</button>
                <button onClick={decline} className="btn-ghost text-sm">Decline</button>
              </div>
            </div>

            <p className="text-center text-xs text-ink-faint">Your name, signature, IP address and timestamps are recorded as a tamper-evident audit trail.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card"><p className="text-ink-muted">{error ?? 'Nothing to sign.'}</p></div>
        )}
      </div>
    </div>
  );
}
