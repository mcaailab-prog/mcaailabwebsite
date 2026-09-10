"use client"
import { useEffect } from 'react';

export default function PerformanceGuardClient() {
  useEffect(() => {
    if (typeof performance === 'undefined' || typeof performance.measure !== 'function') return;

    try {
      const origMeasure = performance.measure.bind(performance);
      // Wrap performance.measure to guard against negative timestamps (dev tooling bug).
      // Keep behavior minimal: clamp negative start/end to 0 and swallow errors.
      // This runs only in the browser.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (performance as any).measure = function (name: any, startOrOptions: any, end?: any) {
        try {
          if (startOrOptions && typeof startOrOptions === 'object') {
            const s = Number(startOrOptions.start);
            const e = Number(startOrOptions.end);
            if (!Number.isFinite(s) || s < 0) startOrOptions.start = Math.max(0, s || 0);
            if (!Number.isFinite(e) || e < 0) startOrOptions.end = Math.max(0, e || 0);
          } else if (typeof startOrOptions === 'number') {
            if (!Number.isFinite(startOrOptions) || startOrOptions < 0) startOrOptions = Math.max(0, startOrOptions || 0);
            if (typeof end === 'number' && (!Number.isFinite(end) || end < 0)) end = Math.max(0, end || 0);
          }
          return origMeasure(name, startOrOptions, end);
        } catch (err) {
          // Swallow issues from third-party instrumentation in dev
          // to avoid breaking the app render.
          // eslint-disable-next-line no-console
          console.warn('performance.measure ignored error:', err);
        }
      };
    } catch (err) {
      // ignore
    }
  }, []);

  return null;
}
