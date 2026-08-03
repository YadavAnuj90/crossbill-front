'use client';
import { useEffect, useState, useCallback } from 'react';
import { Calculator, Download, FileCode2, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { JournalEntry, AccountingStatus } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, THead, TH, TR, TD } from '@/components/ui/Table';
import { Reveal } from '@/components/motion/Reveal';

const inr = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function AccountingPage() {
  const { notify } = useToast();
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [status, setStatus] = useState<AccountingStatus | null>(null);
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback((p: string) => {
    setEntries(null);
    api.accounting.journal(p).then(setEntries).catch((e) => { setEntries([]); notify('error', e instanceof Error ? e.message : 'Could not load journal'); });
  }, [notify]);

  useEffect(() => { api.accounting.status().then(setStatus).catch(() => {}); }, []);
  useEffect(() => { load(period); }, [period, load]);

  async function sync() {
    setBusy(true);
    try { const r = await api.accounting.sync(period); notify('success', `Pushed ${r.pushed} journal entries`); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Sync failed'); }
    finally { setBusy(false); }
  }

  const wrap = (fn: () => Promise<void>) => async () => {
    try { await fn(); } catch (err) { notify('error', err instanceof Error ? err.message : 'Download failed'); }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Finance"
        title="Accounting export & sync"
        subtitle="Double-entry journals from payroll + sales — export to Tally / CSV or push to your accounting software."
        icon={<Calculator className="h-5 w-5" />}
        action={status && (status.configured
          ? <Badge tone="green"><CheckCircle2 className="h-3.5 w-3.5" /> {status.provider} connected</Badge>
          : <Badge tone="amber">Export-only (no provider)</Badge>)}
      />

      <Reveal>
        <Card className="mb-6">
          <CardBody className="flex flex-wrap items-end gap-3">
            <div className="w-40"><Input label="Period" type="month" value={period} onChange={(e) => setPeriod(e.target.value)} /></div>
            <Button variant="secondary" onClick={wrap(() => api.accounting.downloadTally(period))}><FileCode2 className="h-4 w-4" /> Tally XML</Button>
            <Button variant="secondary" onClick={wrap(() => api.accounting.downloadLedger(period))}><Download className="h-4 w-4" /> Ledger CSV</Button>
            <Button onClick={sync} loading={busy} disabled={!status?.configured} title={status?.configured ? '' : 'Connect a provider to enable sync'}><RefreshCw className="h-4 w-4" /> Sync to {status?.provider ?? 'provider'}</Button>
          </CardBody>
        </Card>
      </Reveal>

      <Reveal delay={60}>
        <Card>
          <CardHeader title={`Journal — ${period}`} subtitle="Debits and credits (payroll + sales vouchers)" />
          {entries === null ? (
            <CardBody><p className="text-sm text-ink-muted">Loading…</p></CardBody>
          ) : entries.length === 0 ? (
            <EmptyState icon={<Calculator className="h-6 w-6" />} title="Nothing to post" description="No payroll slips or invoices found for this period." />
          ) : (
            <Table>
              <THead><TH>Voucher</TH><TH>Date</TH><TH>Account</TH><TH className="text-right">Debit</TH><TH className="text-right">Credit</TH></THead>
              <tbody>
                {entries.flatMap((e) => e.lines.map((l, i) => (
                  <TR key={`${e.reference}-${i}`}>
                    <TD><span className="font-mono text-xs">{i === 0 ? e.reference : ''}</span></TD>
                    <TD>{i === 0 ? e.date : ''}</TD>
                    <TD className="text-ink">{l.account}</TD>
                    <TD className="text-right font-mono">{l.debit ? inr(l.debit) : ''}</TD>
                    <TD className="text-right font-mono">{l.credit ? inr(l.credit) : ''}</TD>
                  </TR>
                )))}
              </tbody>
            </Table>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
