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
import { Reveal } from '@/components/motion/Reveal';

function recentFYs(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < 4; i++) out.push(financialYearOf(new Date(Date.UTC(now.getUTCFullYear() - i, now.getUTCMonth(), 1))));
  return Array.from(new Set(out));
}

export default function ReportsPage() {
  const { notify } = useToast();
  const [fy, setFy] = useState(financialYearOf(new Date()));
  const [bundleFy, setBundleFy] = useState(financialYearOf(new Date()));
  const [busy, setBusy] = useState(false);
  const [busyBundle, setBusyBundle] = useState(false);

  async function exportGstr() {
    setBusy(true);
    try { const { url } = await api.reports.gstr6a(fy); notify('success', 'GSTR-1 6A statement generated'); window.open(url, '_blank'); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not generate export'); }
    finally { setBusy(false); }
  }

  async function downloadBundle() {
    setBusyBundle(true);
    try { await api.reports.downloadBundle(bundleFy); notify('success', 'Document bundle downloaded'); }
    catch (err) { notify('error', err instanceof Error ? err.message : 'Could not generate the bundle'); }
    finally { setBusyBundle(false); }
  }

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Filing & reports" subtitle="One-click exports your CA can file directly." icon={<FileBarChart className="h-5 w-5" />} />
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <Card className="h-full">
            <CardHeader title={<span className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-brand-600" /> GSTR-1 Table 6A</span>} subtitle="Export-of-services statement, formatted for the GST offline tool." />
            <CardBody className="space-y-4">
              <Select label="Financial year" value={fy} onChange={(e) => setFy(e.target.value)}>
                {recentFYs().map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
              <Button onClick={exportGstr} loading={busy} className="w-full"><Download className="h-4 w-4" /> Generate 6A statement</Button>
              <p className="hint">The 6A format must be verified against the current GST template and signed off by your CA before filing.</p>
            </CardBody>
          </Card>
        </Reveal>
        <Reveal delay={80}>
          <Card className="h-full">
            <CardHeader title={<span className="flex items-center gap-2"><Package className="h-4 w-4 text-brand-600" /> Document bundle</span>} subtitle="Invoices + FIRC/e-FIRA + LUT reference, zipped for your CA." />
            <CardBody className="space-y-4">
              <Select label="Financial year" value={bundleFy} onChange={(e) => setBundleFy(e.target.value)}>
                {recentFYs().map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
              <Button onClick={downloadBundle} loading={busyBundle} className="w-full"><Download className="h-4 w-4" /> Download bundle (.zip)</Button>
              <p className="hint">Packages every invoice PDF, captured FIRC files, a CSV manifest and your LUT reference for the year into one download.</p>
            </CardBody>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
