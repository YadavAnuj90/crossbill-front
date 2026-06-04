'use client';
import { useState } from 'react';
import { FileBarChart, Download, FileSpreadsheet, Package } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import { financialYearOf } from '@/lib/compliance';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function recentFYs(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear() - i, now.getUTCMonth(), 1));
    out.push(financialYearOf(d));
  }
  return Array.from(new Set(out));
}

export default function ReportsPage() {
  const { notify } = useToast();
  const [fy, setFy] = useState(financialYearOf(new Date()));
  const [busy, setBusy] = useState(false);

  async function exportGstr() {
    setBusy(true);
    try {
      const { url } = await api.reports.gstr6a(fy);
      notify('success', 'GSTR-1 6A statement generated');
      window.open(url, '_blank');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Could not generate export');
    } finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader title="Filing & reports" subtitle="One-click exports your CA can file directly." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-brand-600" /> GSTR-1 Table 6A</span>} subtitle="Export-of-services statement, formatted for the GST offline tool." />
          <CardBody className="space-y-4">
            <Select label="Financial year" value={fy} onChange={(e) => setFy(e.target.value)}>
              {recentFYs().map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
            <Button onClick={exportGstr} loading={busy} className="w-full"><Download className="h-4 w-4" /> Generate 6A statement</Button>
            <p className="hint">The 6A format must be verified against the current GST template and signed off by your CA before filing.</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Package className="h-4 w-4 text-brand-600" /> Document bundle</span>} subtitle="Invoices + FIRC/e-FIRA + LUT reference, zipped for your CA." />
          <CardBody className="space-y-4">
            <div className="rounded-xl bg-paper border border-paper-border p-4 text-sm text-ink-muted flex items-center gap-3">
              <FileBarChart className="h-5 w-5 text-ink-faint" />
              Bundle assembly arrives with the Filing phase — it packages every export document for a financial year into one download.
            </div>
            <Button variant="secondary" disabled className="w-full">Coming soon</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
