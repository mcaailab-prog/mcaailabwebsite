'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { AdminResource } from '@/lib/admin-resources';

type Item = Record<string, unknown> & { id?: string; _id?: string };

function itemId(item: Item) {
  return String(item.id || item._id || '');
}

export default function AdminList({ resource }: { resource: AdminResource }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(resource.api, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resource.api]);

  const remove = async (id: string) => {
    if (!confirm(`Delete this ${resource.singular.toLowerCase()}?`)) return;
    const res = await fetch(`${resource.api}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((current) => current.filter((item) => itemId(item) !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl text-university-deep-blue">{resource.title}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{items.length} records</p>
        </div>
        <Link
          href={`/admin/${resource.key}/new`}
          className="rounded-lg bg-university-deep-blue px-4 py-2 text-sm font-semibold text-white"
        >
          Add {resource.singular.toLowerCase()}
        </Link>
      </div>

      {loading ? <p className="text-sm text-on-surface-variant">Loading…</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
        {items.map((item, index) => (
          <div
            key={itemId(item) || index}
            className="flex flex-col gap-3 border-b border-outline-variant px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{String(item[resource.titleField] || 'Untitled')}</p>
              {resource.subtitleField ? (
                <p className="text-sm text-on-surface-variant">{String(item[resource.subtitleField] || '')}</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/${resource.key}/${itemId(item)}`}
                className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => remove(itemId(item))}
                className="rounded-lg border border-error/30 px-3 py-1.5 text-sm text-error"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-on-surface-variant">No records yet.</p>
        ) : null}
      </div>
    </div>
  );
}
