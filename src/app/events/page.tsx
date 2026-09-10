import type { Metadata } from 'next';
import EventsClient from '@/app/events/EventsClient';
import { api } from '@/lib/api';
import { serialize } from '@/lib/serialize';
import type { EventType } from '@/lib/api-types';

export const metadata: Metadata = {
  title: 'Events — MCAAI',
  description: 'Upcoming and past events from MCAAI',
};

export default async function EventsPage() {
  const upcomingRaw = await api.getEvents({ when: 'upcoming' });
  const pastRaw = await api.getEvents({ when: 'past' });
  const upcoming = serialize(upcomingRaw) as EventType[];
  const past = serialize(pastRaw) as EventType[];

  return <EventsClient upcoming={upcoming} past={past} />;
}
