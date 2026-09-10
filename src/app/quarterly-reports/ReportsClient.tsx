'use client';

import Link from 'next/link';
import type { QuarterlyReportType } from '@/lib/api-types';

export default function ReportsClient({ reports = [] }: { reports?: QuarterlyReportType[] }) {
  const grouped: Record<number, QuarterlyReportType[]> = {};
  for (const r of reports) {
    grouped[r.year] = grouped[r.year] || [];
    grouped[r.year].push(r);
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20">
      <h1 className="font-headline-lg text-3xl mb-6">Quarterly Reports</h1>

      {Object.keys(grouped).sort((a,b) => Number(b) - Number(a)).map((year) => (
        <section key={year} className="mb-8">
          <h2 className="font-semibold text-xl mb-4">{year}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[Number(year)].map((r) => (
              <article key={r.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold"><Link href={`/quarterly-reports/${r.slug}`}>{r.title}</Link></h3>
                <p className="text-sm text-on-surface-variant">Q{r.quarter}</p>
                <p className="mt-2 text-sm">{r.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
