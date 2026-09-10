import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import CareerApplicationForm from '@/components/forms/CareerApplicationForm';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = await api.getCareerTrackBySlug(slug);
  return { title: track ? `${track.name} — Careers` : 'Career track — MCAAI' };
}

export default async function CareerTrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = await api.getCareerTrackBySlug(slug);
  if (!track) notFound();

  return (
    <div className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/careers" className="transition-colors hover:text-primary">Careers</Link>
          <span>/</span>
          <span className="text-on-surface">{track.name}</span>
        </nav>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">
          {track.is_accepting ? 'Applications open' : 'Career track'}
        </p>
        <h1 className="mb-5 font-display-xl text-headline-lg text-university-deep-blue md:text-display-xl">{track.name}</h1>
        <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          {track.description}
        </p>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-20 md:px-margin-desktop">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant bg-white p-6">
            <h2 className="mb-3 text-[20px] text-primary">Qualifications</h2>
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-7 text-on-surface-variant">
              {(track.qualifications || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-outline-variant bg-white p-6">
            <h2 className="mb-3 text-[20px] text-primary">Selection criteria</h2>
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-7 text-on-surface-variant">
              {(track.selection_criteria || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-outline-variant bg-white p-6 md:p-8">
          <h2 className="mb-2 text-[24px] text-primary">Apply</h2>
          <p className="text-sm text-on-surface-variant">
            {track.window_open || track.window_close
              ? `Application window: ${track.window_open ? new Date(track.window_open).toLocaleDateString() : 'open'} – ${track.window_close ? new Date(track.window_close).toLocaleDateString() : 'until filled'}.`
              : 'Submit an application for this track.'}
          </p>
          <CareerApplicationForm trackSlug={track.slug} trackName={track.name} />
        </div>
      </section>
    </div>
  );
}
