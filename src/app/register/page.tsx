'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { AuthShell } from '@/components/layout/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleButton } from '@/components/ui/GoogleButton';

export default function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { notify('error', 'Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(email, password, legalName || undefined);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Sign up failed');
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start invoicing foreign clients compliantly — free."
      footer={<>Already have an account? <Link href="/login" className="text-brand-700 font-medium hover:underline">Sign in</Link></>}
    >
      <GoogleButton label="Sign up with Google" />
      <div className="my-5 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-paper-border" /> or <span className="h-px flex-1 bg-paper-border" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Legal / business name" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Acme Dev Studio" hint="You can change this later in your profile." />
        <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
        <Input label="Password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        <Button type="submit" loading={loading} className="w-full">Create account</Button>
      </form>
      <p className="mt-5 text-xs text-ink-faint text-center leading-relaxed">
        By continuing you agree that Crossbill assists with documentation and calculation, and is not a
        substitute for professional tax advice.
      </p>
    </AuthShell>
  );
}
