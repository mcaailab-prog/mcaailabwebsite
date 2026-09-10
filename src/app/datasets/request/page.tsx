import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import DatasetRequestForm from '@/components/forms/DatasetRequestForm';

export default async function DatasetRequestPage({
  searchParams,
}: {
  searchParams?: Promise<{ dataset?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const datasetSlug = params.dataset;

  let dataset = null;

  if (datasetSlug) {
    const raw = await api.getDatasets();
    const datasets = JSON.parse(JSON.stringify(raw));
    dataset = datasets.find((item: any) => item.slug === datasetSlug || item.id === datasetSlug) ?? null;
  }

  if (datasetSlug && !dataset) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition hover:text-sky-700">
          Home
        </Link>
        <span>/</span>
        <Link href="/datasets" className="transition hover:text-sky-700">
          Datasets
        </Link>
        {dataset && (
          <>
            <span>/</span>
            <Link href={`/datasets/${dataset.slug}`} className="transition hover:text-sky-700">
              {dataset.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="font-medium text-slate-700">Request access</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">
            Dataset access
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {dataset ? `Request access to ${dataset.name}` : 'Request dataset access'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Share your details, intended use, and institutional affiliation so our team can review access appropriately.
          </p>

          {dataset && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Selected dataset</p>
              <p className="mt-2 text-lg font-semibold text-slate-800">{dataset.name}</p>
              <p className="mt-1 text-sm text-slate-600">{dataset.language ?? 'Research dataset'}</p>
            </div>
          )}
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <DatasetRequestForm dataset={dataset ?? undefined} />
        </div>
      </div>
    </div>
  );
}
