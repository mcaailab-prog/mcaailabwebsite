# ADDN – African Disability Datasets, Innovations and Hubs

The ADDN dashboard is a native route in the MCAAI Next.js application at `/projects/addn-next`.

## Run it

Run the host application from the repository root with `npm run dev`.

## Layout

```
src/app/projects/addn-next/
  layout.tsx          Nested route layout: Outfit font, Leaflet CSS, metadata
  page.tsx            Renders <Repository />
  addn.css            Styles scoped to .app-root
  _components/        Private route components
  _lib/               Private route data, types, and constants
```

To add or edit entries, change `src/app/projects/addn-next/_lib/data.ts`. The
types in `_lib/types.ts` validate regions and required fields.

## ADDN Home Link

The “Back to ADDN” and “ADDN Home” links use `/projects/addn-next`, the native
landing route for this dashboard.
