/**
 * HAIDI events.
 *
 * Events are loaded from MongoDB through `/api/events`.
 *  - Upcoming vs past is worked out automatically from `date` / `endDate`
 *    (an event moves to "Past events" the day after it ends).
 *  - The "New" label shows automatically for an upcoming event for NEW_LABEL_DAYS
 *    days after `addedOn`. Set `isNew: true` / `false` to force it on/off.
 *  - For past events, set `featured: true` to show one as the large highlight card,
 *    and add `recapLink` to show a "View recap" link.
 *
 * Dates are plain "YYYY-MM-DD" strings.
 */

export type EventFormat = "In person" | "Online" | "Hybrid";

export interface HaidiEvent {
  id: string;
  title: string;
  /** Start date, YYYY-MM-DD */
  date: string;
  /** Optional end date for multi-day events, YYYY-MM-DD */
  endDate?: string;
  /** e.g. "14:00 EAT" */
  time?: string;
  location: string;
  format: EventFormat;
  description: string;
  /** Registration / details link (upcoming events) */
  link?: string;
  /** Recap, video or report link (past events) */
  recapLink?: string;
  /** Past events only: show as the large highlighted card */
  featured?: boolean;
  /** When this entry was added, YYYY-MM-DD. Drives the automatic "New" label. */
  addedOn?: string;
  /** Force the "New" label on or off, overriding the automatic rule. */
  isNew?: boolean;
}

/** How many days after `addedOn` an upcoming event keeps its "New" label. */
export const NEW_LABEL_DAYS = 30;

export const EVENTS: HaidiEvent[] = [];

// ---------- helpers ----------

const DAY_MS = 24 * 60 * 60 * 1000;

const toUTC = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** The last day of the event. */
export const eventEnd = (e: HaidiEvent) => e.endDate ?? e.date;

export const isUpcoming = (e: HaidiEvent, today: string) => eventEnd(e) >= today;

export const isNewEvent = (e: HaidiEvent, today: string) => {
  if (e.isNew !== undefined) return e.isNew && isUpcoming(e, today);
  if (!e.addedOn || !isUpcoming(e, today)) return false;
  const age = (toUTC(today) - toUTC(e.addedOn)) / DAY_MS;
  return age >= 0 && age <= NEW_LABEL_DAYS;
};

/** Soonest first. */
export const upcomingEvents = (today: string, events: HaidiEvent[] = EVENTS) =>
  events.filter((e) => isUpcoming(e, today)).sort((a, b) => a.date.localeCompare(b.date));

/** Most recent first. */
export const pastEvents = (today: string, events: HaidiEvent[] = EVENTS) =>
  events.filter((e) => !isUpcoming(e, today)).sort((a, b) => b.date.localeCompare(a.date));

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" });
const FULL = fmt({ day: "numeric", month: "short", year: "numeric" });
const DAY = fmt({ day: "numeric" });
const MON = fmt({ month: "short" });
const YEAR = fmt({ year: "numeric" });

export const dayOf = (iso: string) => DAY.format(toUTC(iso));
export const monthOf = (iso: string) => MON.format(toUTC(iso));
export const yearOf = (iso: string) => YEAR.format(toUTC(iso));

/** "12 Nov 2026" or "3 – 4 Dec 2026" */
export const formatEventDates = (e: HaidiEvent) => {
  if (!e.endDate || e.endDate === e.date) return FULL.format(toUTC(e.date));
  const sameMonth = monthOf(e.date) === monthOf(e.endDate) && yearOf(e.date) === yearOf(e.endDate);
  return sameMonth
    ? `${dayOf(e.date)} – ${FULL.format(toUTC(e.endDate))}`
    : `${FULL.format(toUTC(e.date))} – ${FULL.format(toUTC(e.endDate))}`;
};
