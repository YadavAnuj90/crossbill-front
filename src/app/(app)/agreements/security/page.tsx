'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Trash2, Save, ShieldCheck, Crosshair } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/lib/toast-context';
import type { Geofence } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';

export default function SecurityPage() {
  const { notify } = useToast();
  const [fences, setFences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.agreements.getGeofences().then((f) => setFences(f)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function set(i: number, patch: Partial<Geofence>) {
    setFences((fs) => fs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }
  function add() { setFences((fs) => [...fs, { label: '', lat: 0, lng: 0, radiusKm: 50 }]); }
  function remove(i: number) { setFences((fs) => fs.filter((_, idx) => idx !== i)); }

  function applyMyLocation(i: number) {
    if (!('geolocation' in navigator)) { notify('error', 'Geolocation not available'); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => set(i, { lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5) }),
      () => notify('error', 'Could not get your location'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function save() {
    const clean = fences.filter((f) => f.label.trim() && f.radiusKm > 0);
    setSaving(true);
    try {
      const saved = await api.agreements.setGeofences(clean);
      setFences(saved); notify('success', 'Geofences saved');
    } catch (err) { notify('error', err instanceof Error ? err.message : 'Could not save'); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <Link href="/agreements" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"><ArrowLeft className="h-4 w-4" /> Agreements</Link>
      <PageHeader
        eyebrow="Fraud prevention"
        title="Signing security"
        subtitle="Restrict where documents can be signed from. Signers outside every allowed area are flagged."
        icon={<ShieldCheck className="h-5 w-5" />}
        action={<Button onClick={save} loading={saving}><Save className="h-4 w-4" /> Save</Button>}
      />

      <Reveal>
        <Card>
          <CardHeader title="Allowed signing areas (geofences)" subtitle="Leave empty to allow signing from anywhere." action={<button onClick={add} className="btn-ghost text-sm py-1.5"><Plus className="h-4 w-4" /> Add area</button>} />
          <CardBody>
            {loading ? (
              <p className="text-sm text-ink-muted">Loading…</p>
            ) : fences.length === 0 ? (
              <p className="text-sm text-ink-muted">No geofences — signing is allowed from anywhere. Add an area to restrict it.</p>
            ) : (
              <div className="space-y-3">
                {fences.map((f, i) => (
                  <div key={i} className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr_auto] gap-2 items-center">
                    <input className="field py-2 text-sm" placeholder="Label (e.g. India)" value={f.label} onChange={(e) => set(i, { label: e.target.value })} />
                    <input className="field py-2 text-sm" type="number" step="0.00001" placeholder="Latitude" value={f.lat} onChange={(e) => set(i, { lat: parseFloat(e.target.value) })} />
                    <input className="field py-2 text-sm" type="number" step="0.00001" placeholder="Longitude" value={f.lng} onChange={(e) => set(i, { lng: parseFloat(e.target.value) })} />
                    <input className="field py-2 text-sm" type="number" step="1" placeholder="Radius km" value={f.radiusKm} onChange={(e) => set(i, { radiusKm: parseFloat(e.target.value) })} />
                    <div className="flex items-center gap-1">
                      <button onClick={() => applyMyLocation(i)} title="Use my location" className="btn-ghost p-2"><Crosshair className="h-4 w-4" /></button>
                      <button onClick={() => remove(i)} className="btn-ghost p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-ink-faint flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Example: India ≈ lat 22.5, lng 79, radius 1800 km. Use the crosshair to drop your current location.</p>
          </CardBody>
        </Card>
      </Reveal>
    </div>
  );
}
