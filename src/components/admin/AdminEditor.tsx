'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminField, AdminResource } from '@/lib/admin-resources';
import { slugify } from '@/lib/admin-resources';

function getValue(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, data);
}

function setValue(data: Record<string, unknown>, path: string, value: unknown) {
  const next = structuredClone(data);
  const keys = path.split('.');
  let cursor: Record<string, unknown> = next;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
    } else {
      const existing = cursor[key];
      cursor[key] = existing && typeof existing === 'object' ? existing : {};
      cursor = cursor[key] as Record<string, unknown>;
    }
  });
  return next;
}

function toDatetimeLocal(value: unknown) {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDateInput(value: unknown) {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function lines(value: unknown) {
  if (Array.isArray(value)) return value.map(String).join('\n');
  return typeof value === 'string' ? value : '';
}

function linksText(value: unknown) {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const row = item as { label?: string; href?: string };
      return `${row.label || ''} | ${row.href || ''}`;
    })
    .join('\n');
}

function usersText(value: unknown) {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const row = item as { role?: string; description?: string };
      return `${row.role || ''} | ${row.description || ''}`;
    })
    .join('\n');
}

function objectivesText(value: unknown) {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const row = item as { n?: string; title?: string; body?: string; accent?: string };
      return [row.n, row.title, row.body, row.accent].filter(Boolean).join(' || ');
    })
    .join('\n');
}

function pairsText(value: unknown) {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => (Array.isArray(item) ? item.join(' | ') : String(item)))
    .join('\n');
}

function parseLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parsePairs(value: string, keys: [string, string]) {
  return parseLines(value).map((line) => {
    const [left, ...rest] = line.split('|');
    return { [keys[0]]: left.trim(), [keys[1]]: rest.join('|').trim() };
  });
}

export default function AdminEditor({
  resource,
  id,
}: {
  resource: AdminResource;
  id?: string;
}) {
  const router = useRouter();
  const isNew = !id || id === 'new';

  const defaults = useMemo(() => {
    const initial: Record<string, unknown> = {};
    resource.fields.forEach((field) => {
      if (field.type === 'checkbox') initial[field.name] = true;
      if (field.type === 'number') initial[field.name] = 0;
    });
    return initial;
  }, [resource.fields]);

  // A new record starts from the field defaults immediately — there's no
  // fetch involved, so it's computed as the initial state rather than set
  // from an effect (which would flash an empty form for one render first).
  const [data, setData] = useState<Record<string, unknown>>(() => (isNew ? defaults : {}));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${resource.api}/${id}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load');
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, resource.api]);

  const update = (path: string, value: unknown) => {
    setData((current) => setValue(current, path, value));
    if (path === resource.titleField && isNew) {
      const slugField = resource.fields.find((field) => field.name === 'slug');
      if (slugField) {
        setData((current) => setValue(setValue(current, path, value), 'slug', slugify(String(value))));
      }
    }
  };

  const uploadImage = async (file: File, path: string) => {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    update(path, json.secure_url);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload: Record<string, unknown> = structuredClone(data);
      resource.fields.forEach((field) => {
        const value = getValue(payload, field.name);
        if (field.type === 'list') {
          setNested(payload, field.name, parseLines(typeof value === 'string' ? value : lines(value)));
        }
        if (field.type === 'links') {
          setNested(payload, field.name, parsePairs(typeof value === 'string' ? value : linksText(value), ['label', 'href']));
        }
        if (field.type === 'users') {
          setNested(payload, field.name, parsePairs(typeof value === 'string' ? value : usersText(value), ['role', 'description']));
        }
        if (field.type === 'objectives') {
          const rows = parseLines(typeof value === 'string' ? value : objectivesText(value)).map((line) => {
            const [n, title, body, accent] = line.split('||').map((part) => part.trim());
            return { n, title, body, accent: accent || 'primary' };
          });
          setNested(payload, field.name, rows);
        }
        if (field.type === 'pairs') {
          const rows = parseLines(typeof value === 'string' ? value : pairsText(value)).map((line) => {
            const [label, ...rest] = line.split('|');
            return [label.trim(), rest.join('|').trim()];
          });
          setNested(payload, field.name, rows);
        }
      });

      const res = await fetch(isNew ? resource.api : `${resource.api}/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      router.push(`/admin/${resource.key}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-on-surface-variant">Loading…</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="mb-6">
        <Link href={`/admin/${resource.key}`} className="text-sm text-university-deep-blue">
          Back to {resource.title.toLowerCase()}
        </Link>
        <h1 className="mt-2 font-headline text-2xl text-university-deep-blue">
          {isNew ? `New ${resource.singular.toLowerCase()}` : `Edit ${resource.singular.toLowerCase()}`}
        </h1>
      </div>

      <div className="space-y-4 rounded-xl border border-outline-variant bg-white p-5">
        {resource.fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            value={getValue(data, field.name)}
            onChange={(value) => update(field.name, value)}
            onUpload={(file) => uploadImage(file, field.name)}
          />
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-university-deep-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <Link href={`/admin/${resource.key}`} className="rounded-lg border border-outline-variant px-4 py-2 text-sm">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function setNested(data: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.');
  let cursor: Record<string, unknown> = data;
  keys.forEach((key, index) => {
    if (index === index && index === keys.length - 1) {
      cursor[key] = value;
    } else {
      if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
      cursor = cursor[key] as Record<string, unknown>;
    }
  });
}

function FieldControl({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: AdminField;
  value: unknown;
  onChange: (value: unknown) => void;
  onUpload: (file: File) => Promise<void>;
}) {
  const inputClass = 'mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-sm';

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="block text-sm font-medium">
        {field.label}
        <select className={inputClass} value={String(value || '')} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'image') {
    return (
      <label className="block text-sm font-medium">
        {field.label}
        <input className={inputClass} value={String(value || '')} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
        <input
          type="file"
          accept="image/*"
          className="mt-2 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file).catch((err) => alert(err.message));
          }}
        />
        {typeof value === 'string' && value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="mt-2 h-24 rounded-lg object-cover" />
        ) : null}
      </label>
    );
  }

  if (field.type === 'textarea' || field.type === 'list' || field.type === 'links' || field.type === 'users' || field.type === 'objectives' || field.type === 'pairs') {
    const display =
      field.type === 'textarea'
        ? String(value || '')
        : field.type === 'list'
          ? lines(value)
          : field.type === 'links'
            ? linksText(value)
            : field.type === 'users'
              ? usersText(value)
              : field.type === 'objectives'
                ? objectivesText(value)
                : pairsText(value);

    return (
      <label className="block text-sm font-medium">
        {field.label}
        <textarea
          className={`${inputClass} min-h-28`}
          required={field.required}
          value={typeof value === 'string' && (field.type !== 'textarea') ? value : display}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.hint ? <span className="mt-1 block text-xs text-on-surface-variant">{field.hint}</span> : null}
        {field.type === 'links' ? <span className="mt-1 block text-xs text-on-surface-variant">One per line: Label | https://…</span> : null}
        {field.type === 'users' ? <span className="mt-1 block text-xs text-on-surface-variant">One per line: Role | description</span> : null}
        {field.type === 'objectives' ? <span className="mt-1 block text-xs text-on-surface-variant">One per line: 01 || Title || Body || accent</span> : null}
        {field.type === 'pairs' ? <span className="mt-1 block text-xs text-on-surface-variant">One per line: Label | value</span> : null}
      </label>
    );
  }

  if (field.type === 'number') {
    return (
      <label className="block text-sm font-medium">
        {field.label}
        <input
          type="number"
          className={inputClass}
          value={value === undefined || value === null ? '' : Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    );
  }

  if (field.type === 'date' || field.type === 'datetime') {
    return (
      <label className="block text-sm font-medium">
        {field.label}
        <input
          type={field.type === 'date' ? 'date' : 'datetime-local'}
          required={field.required}
          className={inputClass}
          value={field.type === 'date' ? toDateInput(value) : toDatetimeLocal(value)}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
        />
      </label>
    );
  }

  return (
    <label className="block text-sm font-medium">
      {field.label}
      <input
        type="text"
        required={field.required}
        className={inputClass}
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint ? <span className="mt-1 block text-xs text-on-surface-variant">{field.hint}</span> : null}
    </label>
  );
}
