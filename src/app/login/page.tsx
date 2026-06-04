'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { AuthShell } from '@/components/layout/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleButton } from '@/components/ui/GoogleButton';

export default function LoginPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Crossbill workspace."
      footer={<>New here? <Link href="/register" className="text-brand-700 font-medium hover:underline">Create an account</Link></>}
    >
      <GoogleButton label="Continue with Google" />
      <div className="my-5 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-paper-border" /> or <span className="h-px flex-1 bg-paper-border" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
        <Input label="Password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit" loading={loading} className="w-full">Sign in</Button>
      </form>
    </AuthShell>
  );
}
