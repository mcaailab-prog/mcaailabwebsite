'use client';

import { useMemo, useState } from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import type { EventType } from '@/lib/api-types';

export default function FeaturedEventsModal({ events }: { events: EventType[] }) {
  const selectedEvent = useMemo(() => {
    if (!events?.length) return null;
    return events[0] ?? null;
  }, [events]);

  // `events` is only ever passed in already-resolved (the parent withholds
  // rendering this component until its fetch completes), so the dismissed
  // flag can be read once, synchronously, as the initial state instead of
  // via an effect that would open the modal a render late.
  const [isOpen, setIsOpen] = useState(() => {
    if (!selectedEvent) return false;
    try {
      const dismissed =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('featuredEventModalDismissed') === 'true';
      return !dismissed;
    } catch {
      return true;
    }
  });

  const handleClose = () => {
    try {
      if (typeof window !== 'undefined') sessionStorage.setItem('featuredEventModalDismissed', 'true');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  if (!isOpen || !selectedEvent) return null;

  const eventDate = selectedEvent.start_date ? new Date(selectedEvent.start_date) : selectedEvent.published_date ? new Date(selectedEvent.published_date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close featured event"
        >
          <FiX size={20} />
        </button>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] p-6 sm:p-8">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full  px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-mcaai-green">
              Featured event
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              {selectedEvent.title}
            </h2>
            {formattedDate && (
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#003399]/80">
                {formattedDate}
              </p>
            )}
            <p className="text-sm leading-7 text-slate-600">
              { 'Join us for this important MCAAI event — details and updates can be found on the event page.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`/events/${selectedEvent.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#003399] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#002266]"
              >
                Read event details
                <FiExternalLink size={16} />
              </a>
              
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] bg-slate-100 shadow-sm">
            {selectedEvent.cover_image ? (
              <img
                src={selectedEvent.cover_image}
                alt={selectedEvent.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center bg-slate-200 text-slate-500">
                No event image available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
