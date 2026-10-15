"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Today's date in the visitor's timezone as YYYY-MM-DD. */
const localToday = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

/**
 * Today's date, read in the browser.
 * Returns null during the server render / hydration, then the real date.
 * Doing it this way means upcoming/past events are always right for the visitor,
 * even though the page itself is built once and cached (no stale "build date").
 */
export function useToday(): string | null {
  return useSyncExternalStore<string | null>(subscribe, localToday, () => null);
}
