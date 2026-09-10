'use client';

import { FormEvent, useState } from 'react';

export default function CareerApplicationForm({
  trackSlug = '',
  trackName = '',
}: {
  trackSlug?: string;
  trackName?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    affiliation: '',
    qualifications: '',
    motivation: '',
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          track_slug: trackSlug,
          track_name: trackName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setStatus({ type: 'success', message: 'Application received. The MCAAI team will be in touch.' });
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        affiliation: '',
        qualifications: '',
        motivation: '',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Submission failed' });
    } finally {
      setBusy(false);
    }
  };

  const field = 'mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-sm';

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
      <label className="text-sm">
        First name
        <input className={field} required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
      </label>
      <label className="text-sm">
        Last name
        <input className={field} required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
      </label>
      <label className="text-sm">
        Email
        <input type="email" className={field} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="text-sm">
        Phone
        <input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </label>
      <label className="text-sm md:col-span-2">
        Affiliation
        <input className={field} value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} />
      </label>
      <label className="text-sm md:col-span-2">
        Qualifications
        <textarea className={`${field} min-h-24`} value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
      </label>
      <label className="text-sm md:col-span-2">
        Motivation
        <textarea className={`${field} min-h-28`} required value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
      </label>
      {status ? (
        <p className={`md:col-span-2 text-sm ${status.type === 'success' ? 'text-secondary' : 'text-error'}`}>
          {status.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-primary px-5 py-3 text-[13px] font-medium text-on-primary disabled:opacity-60"
      >
        {busy ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  );
}
