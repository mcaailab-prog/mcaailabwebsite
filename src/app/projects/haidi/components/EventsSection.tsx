"use client";

import { useEffect, useState } from "react";
import {
  dayOf, formatEventDates, isNewEvent, monthOf, pastEvents, upcomingEvents,
  type HaidiEvent,
} from "../lib/events";
import { useToday } from "../lib/useToday";

const PAST_INITIAL = 3;

type DatabaseEvent = {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  start_date: string;
  end_date?: string;
  time?: string;
  location?: string;
  is_online?: boolean;
  format?: "In person" | "Online" | "Hybrid";
  description?: string;
  summary?: string;
  body?: string;
  link?: string;
  recap_link?: string;
  featured?: boolean;
  is_featured?: boolean;
  status?: "upcoming" | "ongoing" | "past" | "featured";
  added_on?: string;
  is_new?: boolean;
  createdAt?: string;
};

const toIsoDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const mapDatabaseEvent = (event: DatabaseEvent): HaidiEvent | null => {
  const date = toIsoDate(event.start_date);
  if (!event.title || !date) return null;

  const endDate = toIsoDate(event.end_date);
  const format = event.format ?? (event.is_online ? "Online" : "In person");

  return {
    id: event.id ?? event._id ?? event.slug ?? `${event.title}-${date}`,
    title: event.title,
    date,
    endDate,
    time: event.time || undefined,
    location: event.location || (format === "Online" ? "Online" : ""),
    format,
    description: event.description || event.summary || event.body || "",
    link: event.link || undefined,
    recapLink: event.recap_link || undefined,
    featured: event.featured ?? event.is_featured ?? event.status === "featured",
    addedOn: toIsoDate(event.added_on) ?? toIsoDate(event.createdAt),
    isNew: event.is_new,
  };
};

function EventCard({ event, today }: { event: HaidiEvent; today: string }) {
  const isNew = isNewEvent(event, today);
  return (
    <article className={`event-card${isNew ? " is-new" : ""}`}>
      <div className="event-card-top">
        <div className="event-date" aria-hidden="true">
          <span className="day">{dayOf(event.date)}</span>
          <span className="mon">{monthOf(event.date)}</span>
        </div>
        <div className="event-badges">
          {isNew && <span className="badge-new">New</span>}
          <span className="event-format">{event.format}</span>
        </div>
      </div>
      <h3>{event.title}</h3>
      <p className="event-when">
        {formatEventDates(event)}
        {event.time ? ` · ${event.time}` : ""}
      </p>
      <p className="event-where">{event.location}</p>
      <p className="event-desc">{event.description}</p>
      {event.link && (
        <a className="event-link" href={event.link} target="_blank" rel="noopener noreferrer">
          Register / learn more →
        </a>
      )}
    </article>
  );
}

export default function EventsSection() {
  const today = useToday();
  const [showAllPast, setShowAllPast] = useState(false);
  const [events, setEvents] = useState<HaidiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events?when=all&category=haidi", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load events");
        }
        if (!cancelled) {
          setEvents(
            Array.isArray(data)
              ? data.map(mapDatabaseEvent).filter((event): event is HaidiEvent => event !== null)
              : []
          );
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load events");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = today ? upcomingEvents(today, events) : [];
  const past = today ? pastEvents(today, events) : [];
  const featured = past.find((e) => e.featured) ?? past[0];
  const others = past.filter((e) => e !== featured);
  const visibleOthers = showAllPast ? others : others.slice(0, PAST_INITIAL);

  return (
    <section id="events">
      <div className="container">
        <div className="tag">Events</div>
        <h2>Join us, or catch up on what you missed</h2>
        <p style={{ maxWidth: 620 }}>
          Webinars, workshops and convenings bringing together researchers, OPDs, innovators and
          policymakers working on disability-inclusive AI in Africa.
        </p>

        {!today || loading ? (
          <div className="events-placeholder" aria-hidden="true" />
        ) : loadError ? (
          <div className="events-empty">
            <strong>Events could not be loaded.</strong>
            <p>{loadError}</p>
          </div>
        ) : (
          <>
            {/* UPCOMING */}
            <div className="events-subhead">
              <h3>Upcoming events</h3>
              {upcoming.length > 0 && <span className="events-count">{upcoming.length}</span>}
            </div>
            {upcoming.length > 0 ? (
              <div className="events-grid">
                {upcoming.map((e) => <EventCard key={e.id} event={e} today={today} />)}
              </div>
            ) : (
              <div className="events-empty">
                <strong>No upcoming events right now.</strong>
                <p>New events are announced here first. Express your interest below to hear about them.</p>
                <a href="#collaborate" className="btn btn-primary">Express Interest</a>
              </div>
            )}

            {/* PAST */}
            {featured && (
              <>
                <div className="events-subhead" style={{ marginTop: 56 }}>
                  <h3>Past events</h3>
                  <span className="events-count">{past.length}</span>
                </div>

                <article className="past-featured">
                  <span className="featured-label">Featured event</span>
                  <h3>{featured.title}</h3>
                  <p className="past-meta">
                    {formatEventDates(featured)} · {featured.location} · {featured.format}
                  </p>
                  <p>{featured.description}</p>
                  {featured.recapLink && (
                    <a className="btn btn-primary" href={featured.recapLink} target="_blank" rel="noopener noreferrer">
                      View recap →
                    </a>
                  )}
                </article>

                {others.length > 0 && (
                  <div className="past-grid">
                    {visibleOthers.map((e) => (
                      <article className="past-card" key={e.id}>
                        <span className="past-date">{formatEventDates(e)}</span>
                        <h4>{e.title}</h4>
                        <p>{e.location} · {e.format}</p>
                        {e.recapLink && (
                          <a className="event-link" href={e.recapLink} target="_blank" rel="noopener noreferrer">
                            View recap →
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {others.length > PAST_INITIAL && (
                  <div className="past-more">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowAllPast((v) => !v)} aria-expanded={showAllPast}>
                      {showAllPast ? "Show fewer" : `Show all past events (${others.length + 1})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
