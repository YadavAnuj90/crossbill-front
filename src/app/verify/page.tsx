'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search } from 'lucide-react';

export default function VerifyEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  return (
    <div className="min-h-screen bg-[#f6f7f9] grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-paper-card p-8 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
            <ShieldCheck className="h-4 w-4 text-white" />
          </span>
          <span className="font-semibold text-ink">Crossbill · eSign verifier</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Verify a signed document</h1>
        <p className="mt-1 text-sm text-ink-muted">Enter the verification code printed on the signed PDF to confirm it's authentic.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (code.trim()) router.push(`/verify/${code.trim().toUpperCase()}`); }} className="mt-5 flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 9F2A4C7E10" className="field font-mono tracking-widest uppercase" />
          <button type="submit" className="btn-primary shrink-0"><Search className="h-4 w-4" /> Verify</button>
        </form>
      </div>
    </div>
  );
}
