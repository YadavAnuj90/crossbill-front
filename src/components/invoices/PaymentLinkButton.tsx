'use client';
import { useEffect, useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Invoice, Payment } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export function PaymentLinkButton({ invoice }: { invoice: Invoice }) {
  const { notify } = useToast();
  const [link, setLink] = useState<Payment | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.payments.listForInvoice(invoice.id)
      .then((ps) => setLink(ps.find((p) => p.status === 'created' || p.status === 'paid') ?? null))
      .catch(() => {});
  }, [invoice.id]);

  if (invoice.status === 'paid') return null;

  async function create() {
    setBusy(true);
    try {
      const pay = await api.payments.createLink(invoice.id);
      setLink(pay);
      await navigator.clipboard.writeText(pay.shortUrl).catch(() => {});
      setCopied(true); setTimeout(() => setCopied(false), 1500);
      notify('success', 'Payment link created & copied');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not create link');
    } finally { setBusy(false); }
  }

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link.shortUrl).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  return link
    ? <Button variant="secondary" onClick={copy}>{copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy pay link</>}</Button>
    : <Button variant="secondary" loading={busy} onClick={create}><Link2 className="h-4 w-4" /> Payment link</Button>;
}
