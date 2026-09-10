'use client';

import Link from 'next/link';
import type { EventType } from '@/lib/api-types';

export default function EventsClient({ upcoming = [], past = [] }: { upcoming?: EventType[]; past?: EventType[] }) {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
      <h1 className="font-headline-lg text-3xl mb-6">Events</h1>

      <section className="mb-12">
        <h2 className="font-semibold text-xl mb-4">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((e) => (
              <li key={e.id} className="p-4 border rounded-lg">
                <Link href={`/events/${e.slug}`} className="font-semibold text-primary">{e.title}</Link>
                <div className="text-sm text-on-surface-variant">{e.start_date && new Date(e.start_date).toLocaleString()}</div>
                <p className="mt-2 text-sm">{e.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-xl mb-4">Past Events</h2>
        {past.length === 0 ? (
          <p>No past events.</p>
        ) : (
          <ul className="space-y-4">
            {past.map((e) => (
              <li key={e.id} className="p-4 border rounded-lg">
                <Link href={`/events/${e.slug}`} className="font-semibold text-primary">{e.title}</Link>
                <div className="text-sm text-on-surface-variant">{e.start_date && new Date(e.start_date).toLocaleDateString()}</div>
                <p className="mt-2 text-sm">{e.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
