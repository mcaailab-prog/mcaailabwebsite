# HAIDI + ADDN

HAIDI is part of the MCAAI Next.js application:

- `/projects/haidi` is the HAIDI home page (about, events, publications, partners and collaboration).
- `/projects/haidi/explorer` is the ADDN Data Explorer (datasets, innovations, organisations and publications).

Use the development, build and deployment commands from the repository root. HAIDI's image assets
are stored in the repository-level `public/haidi/` directory and referenced with `/haidi/...` URLs.

## Editing content

| What | File |
| --- | --- |
| Events (upcoming, past, "New" label, featured recap) | `lib/events.ts` |
| Publications, reports, policy briefs (tabs) | `lib/publications.ts` |
| Home page text, partners, principal investigators | `components/HaidiHome.tsx` |
| Home page styling | `components/haidi-home.css` |
| Explorer datasets, ventures, organisations | `lib/data.ts` |

**Events:** add an object to `EVENTS`. Upcoming vs past is automatic from the date (an event moves
to "Past events" the day after it ends). A "New" label shows for 30 days after `addedOn`
(change `NEW_LABEL_DAYS`, or force it with `isNew: true/false`). Set `featured: true` on a past
event to make it the large highlight card, and add `recapLink` for a "View recap" link.

**Publications:** add an object to `PUBLICATIONS` with `type` of `"publication"`, `"report"` or
`"brief"`. It appears under "All" and its own tab; newest first.
