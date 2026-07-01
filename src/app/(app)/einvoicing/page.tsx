'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QrCode, FileText } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { EInvoice } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

export default function EInvoicingPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState<EInvoice[] | null>(null);
  const [status, setStatus] = useState<{ provider: string; sandbox: boolean } | null>(null);

  useEffect(() => {
    api.einvoice.list().then((p) => setRows(p.items)).catch((err) => { setRows([]); notify('error', err instanceof Error ? err.message : 'Could not load e-invoices'); });
    api.einvoice.status().then(setStatus).catch(() => {});
  }, [notify]);

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="e-Invoicing"
        subtitle="GST-valid IRNs and signed QR codes for your B2B invoices — registered on the IRP."
        icon={<QrCode className="h-5 w-5" />}
        action={status && <Badge tone="blue">Provider: {status.provider}{status.sandbox ? ' · Sandbox' : ''}</Badge>}
      />

      <Reveal>
        <Card>
          {rows === null ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<QrCode className="h-6 w-6" />} title="No e-invoices yet" description="Open any invoice and generate its IRN — registered e-invoices will appear here with their signed QR.">
              <Link href="/invoices"><Button className="mt-6"><FileText className="h-4 w-4" /> Go to invoices</Button></Link>
            </EmptyState>
          ) : (
            <Table>
              <THead><TH>Invoice #</TH><TH>Date</TH><TH>IRN</TH><TH>Status</TH><TH className="text-right">Total</TH></THead>
              <tbody>
                {rows.map((e) => (
                  <TR key={e.id}>
                    <TD><Link href={`/invoices/${e.invoiceId}`} className="font-medium text-brand-700 hover:underline">{e.invoiceNumber}</Link></TD>
                    <TD>{formatDate(e.invoiceDate)}</TD>
                    <TD><span className="block max-w-[220px] truncate font-mono text-xs" title={e.irn}>{e.irn}</span></TD>
                    <TD>{e.status === 'generated' ? <Badge tone="green">Generated</Badge> : <Badge tone="red">Cancelled</Badge>}</TD>
                    <TD className="text-right font-medium">{e.currency} {parseFloat(e.totalValue).toLocaleString()}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
