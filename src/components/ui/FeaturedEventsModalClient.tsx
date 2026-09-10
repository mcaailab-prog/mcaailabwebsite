'use client';

import { useEffect, useState } from 'react';
import FeaturedEventsModal from './FeaturedEventsModal';
import type { EventType } from '@/lib/api-types';

export default function FeaturedEventsModalClient() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const searchParams = new URLSearchParams({ when: 'featured' });
        const res = await fetch(`/api/events?${searchParams.toString()}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to load upcoming featured event');
        }
        const data: EventType[] = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Featured events modal failed to load', error);
        setEvents([]);
      } finally {
        setLoaded(true);
      }
    };

    fetchEvents();
  }, []);

  if (!loaded) return null;
  return <FeaturedEventsModal events={events} />;
}
