'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, PenLine, Eraser, CheckCircle2, AlertTriangle, Loader2, FileText, Camera, MapPin, X, Fingerprint, KeyRound } from 'lucide-react';
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

  // ── Aadhaar gate ──
  const [aOk, setAOk] = useState(false);
  const [aStep, setAStep] = useState<'enter' | 'otp'>('enter');
  const [aadhaar, setAadhaar] = useState('');
  const [aRef, setARef] = useState('');
  const [aOtp, setAOtp] = useState('');
  const [aDevOtp, setADevOtp] = useState<string | null>(null);
  const [aBusy, setABusy] = useState(false);
  const [aErr, setAErr] = useState<string | null>(null);

  async function aInit() {
    setAErr(null);
    if (!/^\d{12}$/.test(aadhaar.replace(/\s/g, ''))) { setAErr('Enter a valid 12-digit Aadhaar number'); return; }
    setABusy(true);
    try {
      const r = await api.agreements.aadhaarInit(token, aadhaar.replace(/\s/g, ''));
      if (r.alreadyVerified) { setAOk(true); return; }
      setARef(r.referenceId); setADevOtp(r.devOtp ?? null); setAStep('otp');
    } catch (e) { setAErr(e instanceof Error ? e.message : 'Could not send OTP'); }
    finally { setABusy(false); }
  }
  async function aVerify() {
    setAErr(null);
    if (!aOtp.trim()) { setAErr('Enter the OTP'); return; }
    setABusy(true);
    try { await api.agreements.aadhaarVerify(token, aRef, aOtp.trim()); setAOk(true); }
    catch (e) { setAErr(e instanceof Error ? e.message : 'Incorrect OTP'); }
    finally { setABusy(false); }
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  // ── fraud-prevention evidence ──
  const [selfie, setSelfie] = useState<string | null>(null);
  const [camOn, setCamOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  function getGeo(): Promise<{ lat: number; lng: number; accuracy: number } | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
      );
    });
  }

  async function openCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream; setCamOn(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); } }, 50);
    } catch { setError('Could not access the camera. You can still sign without a selfie.'); }
  }
  function closeCam() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null; setCamOn(false);
  }
  function snap() {
    const v = videoRef.current; if (!v) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth || 320; c.height = v.videoHeight || 240;
    c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height);
    setSelfie(c.toDataURL('image/jpeg', 0.7));
    closeCam();
  }
  useEffect(() => () => closeCam(), []);

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
      const geo = await getGeo();
      const res = await api.agreements.sign(token, {
        signedName: signedName.trim(), signatureImage, consent, otp: otp || undefined,
        lat: geo?.lat, lng: geo?.lng, accuracy: geo?.accuracy,
        selfie: selfie ?? undefined,
      });
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
          <div className="rounded-2xl bg-paper-card p-10 text-center shadow-card"><Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-600" /></div>
        ) : done ? (
          <div className="rounded-2xl bg-paper-card p-10 text-center shadow-card">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-brand-50 text-brand-600 mb-4"><CheckCircle2 className="h-7 w-7" /></span>
            <h1 className="text-xl font-semibold text-ink">Signed — thank you!</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Your electronic signature has been recorded with a full audit trail.</p>
            {done.url && <a href={done.url} target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-flex"><FileText className="h-4 w-4" /> View signed PDF</a>}
          </div>
        ) : error && !view ? (
          <div className="rounded-2xl bg-paper-card p-10 text-center shadow-card">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-amber-50 text-amber-600 mb-4"><AlertTriangle className="h-7 w-7" /></span>
            <h1 className="text-lg font-semibold text-ink">{error}</h1>
          </div>
        ) : view && view.aadhaarRequired && !view.aadhaarVerified && !aOk ? (
          <div className="rounded-2xl bg-paper-card p-6 shadow-card max-w-md mx-auto">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 mb-4"><Fingerprint className="h-6 w-6" /></span>
            <h1 className="text-xl font-semibold text-ink">Verify your identity</h1>
            <p className="mt-1 text-sm text-ink-muted">This document — <strong>{view.title}</strong> — is protected. Verify with Aadhaar OTP to open and sign it.</p>

            {aStep === 'enter' ? (
              <div className="mt-5 space-y-3">
                <div>
                  <label className="label">Aadhaar number</label>
                  <input value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} inputMode="numeric" maxLength={12} className="field font-mono tracking-widest" placeholder="12-digit Aadhaar" />
                  <p className="hint mt-1.5">We only store the last 4 digits. Your full Aadhaar and OTP are never saved.</p>
                </div>
                {aErr && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> {aErr}</p>}
                <button onClick={aInit} disabled={aBusy} className="btn-primary w-full justify-center">{aBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Send OTP</button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div>
                  <label className="label">Enter OTP</label>
                  <input value={aOtp} onChange={(e) => setAOtp(e.target.value)} inputMode="numeric" maxLength={6} className="field font-mono tracking-widest" placeholder="6-digit OTP" />
                  {aDevOtp && <p className="hint mt-1.5">Sandbox mode — your test OTP is <strong className="font-mono">{aDevOtp}</strong>.</p>}
                </div>
                {aErr && <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> {aErr}</p>}
                <div className="flex gap-2">
                  <button onClick={aVerify} disabled={aBusy} className="btn-primary flex-1 justify-center">{aBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Verify &amp; open</button>
                  <button onClick={() => { setAStep('enter'); setAOtp(''); }} className="btn-secondary">Back</button>
                </div>
              </div>
            )}
          </div>
        ) : view ? (
          <div className="space-y-5">
            {(view.aadhaarRequired || aOk) && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200"><ShieldCheck className="h-3.5 w-3.5" /> Aadhaar verified</div>
            )}
            <div className="rounded-2xl bg-paper-card p-6 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">{view.category}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{view.title}</h1>
              <p className="mt-1 text-sm text-ink-muted">From {view.sellerName ?? 'the sender'} · for {view.signerName ?? 'you'}</p>
              <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-paper-border bg-paper/40 p-4 text-sm text-ink-soft whitespace-pre-wrap leading-relaxed">{view.body || 'No additional terms provided.'}</div>
            </div>

            <div className="rounded-2xl bg-paper-card p-6 shadow-card space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Selfie verification <span className="text-ink-faint font-normal">(recommended)</span></label>
                  {selfie && <button type="button" onClick={() => setSelfie(null)} className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"><X className="h-3.5 w-3.5" /> Retake</button>}
                </div>
                {selfie ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selfie} alt="selfie" className="h-28 rounded-xl border border-paper-border object-cover" />
                ) : camOn ? (
                  <div className="space-y-2">
                    <video ref={videoRef} playsInline muted className="h-40 w-full rounded-xl bg-ink/5 object-cover" />
                    <div className="flex gap-2">
                      <button type="button" onClick={snap} className="btn-primary text-sm"><Camera className="h-4 w-4" /> Capture</button>
                      <button type="button" onClick={closeCam} className="btn-ghost text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={openCam} className="btn-secondary text-sm"><Camera className="h-4 w-4" /> Take a selfie</button>
                )}
                <p className="hint mt-1.5">Your location and a selfie strengthen the signature&apos;s authenticity. Both are optional.</p>
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
          <div className="rounded-2xl bg-paper-card p-10 text-center shadow-card"><p className="text-ink-muted">{error ?? 'Nothing to sign.'}</p></div>
        )}
      </div>
    </div>
  );
}
