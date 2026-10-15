/**
 * HAIDI events.
 *
 * HOW TO ADD AN EVENT: add an object to EVENTS below. That's it.
 *  - Upcoming vs past is worked out automatically from `date` / `endDate`
 *    (an event moves to "Past events" the day after it ends).
 *  - The "New" label shows automatically for an upcoming event for NEW_LABEL_DAYS
 *    days after `addedOn`. Set `isNew: true` / `false` to force it on/off.
 *  - For past events, set `featured: true` to show one as the large highlight card,
 *    and add `recapLink` to show a "View recap" link.
 *
 * Dates are plain "YYYY-MM-DD" strings.
 * The entries below are SAMPLES: replace them with real events before deploying.
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

export const EVENTS: HaidiEvent[] = [
  // ---- Upcoming (samples) ----
  {
    id: "webinar-disability-data-ai",
    title: "[Sample] Community Webinar: Disability Data and AI in Africa",
    date: "2026-11-12",
    time: "14:00 EAT",
    location: "Online",
    format: "Online",
    description: "An open conversation with researchers, OPDs and innovators on what it takes to make disability data discoverable and responsibly usable.",
    link: "https://forms.gle/73bKa4jU8VfdeHRx9",
    addedOn: "2026-10-10",
  },
  {
    id: "annual-convening",
    title: "[Sample] HAIDI Annual Convening",
    date: "2026-12-03",
    endDate: "2026-12-04",
    location: "Venue to be confirmed",
    format: "Hybrid",
    description: "Two days bringing the HAIDI and ADDN community together to share progress, datasets and partnerships.",
    addedOn: "2026-08-20",
  },
  {
    id: "workshop-ethical-governance",
    title: "[Sample] Workshop: Ethical Disability Data Governance",
    date: "2027-01-21",
    time: "10:00 EAT",
    location: "Online",
    format: "Online",
    description: "A practical workshop on consent, privacy and participation of persons with disabilities in data collection and AI development.",
    addedOn: "2026-10-12",
  },

  // ---- Past (samples) ----
  {
    id: "addn-launch",
    title: "[Sample] ADDN Launch: Enhancing Inclusiveness with AI",
    date: "2026-06-18",
    location: "Venue to be confirmed",
    format: "Hybrid",
    description: "The launch of the African Disability Data Network, introducing the platform, founding partners and the Data Explorer to the wider community.",
    recapLink: "https://example.com/addn-launch-recap",
    featured: true,
  },
  {
    id: "sign-language-roundtable",
    title: "[Sample] Sign Language Datasets Roundtable",
    date: "2026-04-09",
    location: "Online",
    format: "Online",
    description: "Dataset builders and Deaf community organisations compared approaches to African sign language data.",
    recapLink: "https://example.com/sign-language-recap",
  },
  {
    id: "policy-dialogue",
    title: "[Sample] Inclusive AI Policy Dialogue",
    date: "2025-11-20",
    location: "Venue to be confirmed",
    format: "In person",
    description: "Policymakers and OPDs discussed how to embed disability inclusion in national AI strategies.",
  },
  {
    id: "speech-data-workshop",
    title: "[Sample] Non-Standard Speech Data Workshop",
    date: "2025-09-05",
    location: "Online",
    format: "Online",
    description: "A working session on collecting and governing speech datasets that reflect diverse vocal expression.",
    recapLink: "https://example.com/speech-workshop-recap",
  },
];

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
export const upcomingEvents = (today: string) =>
  EVENTS.filter((e) => isUpcoming(e, today)).sort((a, b) => a.date.localeCompare(b.date));

/** Most recent first. */
export const pastEvents = (today: string) =>
  EVENTS.filter((e) => !isUpcoming(e, today)).sort((a, b) => b.date.localeCompare(a.date));

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
