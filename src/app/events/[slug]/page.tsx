import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { serialize } from '@/lib/serialize';
import type { EventType } from '@/lib/api-types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const all = await api.getEvents({ when: 'all' as any });
  const event = all.find((e: EventType) => e.slug === slug);
  if (!event) return { title: 'Event not found — MCAAI' };
  return { title: `${event.title} — MCAAI`, description: event.summary ?? '' };
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const all = await api.getEvents({ when: 'all' as any });
  const event = all.find((e: EventType) => e.slug === slug);
  if (!event) notFound();

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-8 py-12">
      <h1 className="font-headline-lg text-3xl mb-4">{event.title}</h1>
      <div className="text-sm text-on-surface-variant mb-6">
        {event.start_date && new Date(event.start_date).toLocaleString()} {event.location ? `• ${event.location}` : ''}
      </div>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: event.body ?? event.summary ?? '' }} />
      </div>
    </div>
  );
}
