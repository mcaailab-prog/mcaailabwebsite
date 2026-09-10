import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { QuarterlyReportType } from '@/lib/api-types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const all = await api.getQuarterlyReports();
  const rpt = all.find((r: QuarterlyReportType) => r.slug === slug);
  if (!rpt) return { title: 'Report not found — MCAAI' };
  return { title: `${rpt.title} — MCAAI`, description: rpt.summary ?? '' };
}

export async function generateStaticParams() {
  const reports = await api.getQuarterlyReports();
  return reports.map((report) => ({ slug: report.slug }));
}

export default async function ReportDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const all = await api.getQuarterlyReports();
  const rpt = all.find((r: QuarterlyReportType) => r.slug === slug);
  if (!rpt) notFound();

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-8 py-12">
      {rpt.cover_image ? (
        <div className="mb-8 overflow-hidden rounded-3xl shadow-sm">
          <img
            src={rpt.cover_image}
            alt={rpt.title}
            className="w-full h-[360px] object-cover"
          />
        </div>
      ) : null}
      <h1 className="font-headline-lg text-3xl mb-4">{rpt.title}</h1>
      <div className="text-sm text-on-surface-variant mb-6">Q{rpt.quarter} • {rpt.year}</div>
      {rpt.pdf_url ? (
        <a className="text-primary underline mb-6 block" href={rpt.pdf_url} target="_blank" rel="noreferrer">Download PDF</a>
      ) : null}
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: rpt.body ?? rpt.summary ?? '' }} />
      </div>
    </div>
  );
}
