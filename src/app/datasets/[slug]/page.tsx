import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { DatasetType } from '@/lib/api';
import { notFound } from 'next/navigation';
import {
  FiLock, FiUnlock, FiArrowLeft,
  FiDatabase, FiFileText, FiTag, FiExternalLink
} from 'react-icons/fi';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import DatasetRequestAction from '@/components/datasets/DatasetRequestAction';
import { canOpenDataset } from '@/lib/datasets';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = await api.getDatasets();
  const datasets: DatasetType[] = JSON.parse(JSON.stringify(raw));
  const dataset = datasets.find((d) => d.slug === slug);

  if (!dataset) {
    return {
      title: 'Dataset Not Found - MCAAI',
      description: 'The requested dataset could not be found.',
    };
  }

  return {
    title: `${dataset.name} - MCAAI Datasets`,
    description: dataset.description?.slice(0, 160) ?? 'Learn about our datasets and how to access them.',
  };
}

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const raw = await api.getDatasets();
  const datasets: DatasetType[] = JSON.parse(JSON.stringify(raw));
  const dataset = datasets.find((d) => d.slug === slug);

  if (!dataset) notFound();

  const isOpen = !dataset.requires_request;
  const licenseDisplay = 'CC BY';

  return (
    <div className="w-full pb-20">
      <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-8 lg:px-16">
        <Link
          href="/datasets"
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
        >
          <FiArrowLeft size={15} />
          Back to Datasets
        </Link>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 pb-14 pt-10 sm:px-8 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr] lg:items-start">
          <div className="min-w-0">
            

            <h1 className="mb-5 text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-[52px]">
              {dataset.name}
            </h1>

            <div className="mb-8 max-w-3xl text-base leading-8 text-on-surface-variant">
              <RichTextRenderer content={dataset.description} className="prose prose-lg max-w-none" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: <FiDatabase size={16} />, label: 'Size', value: dataset.size_description },
                { icon: <FiFileText size={16} />, label: 'Format', value: dataset.format },
                { icon: <FiTag size={16} />, label: 'License', value: licenseDisplay },
              ]
                .filter((meta) => Boolean(meta.value))
                .map((meta) => (
                  <div
                    key={meta.label}
                    className="rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      {meta.icon}
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-on-surface">{meta.value}</p>
                  </div>
                ))}
            </div>

            {dataset.associated_project && (
              <div className="mt-8 rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-5 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  Associated Project
                </p>
                <p className="text-lg font-medium text-primary">
                  {typeof dataset.associated_project === 'object'
                    ? dataset.associated_project.title ?? 'View Project'
                    : 'View Project'}
                </p>
              </div>
            )}
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-5 shadow-sm lg:sticky lg:top-24">
              <div className="mb-5 border-b border-outline-variant/80 pb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  {isOpen ? <FiUnlock size={16} /> : <FiLock size={16} />}
                  <span>{isOpen ? 'Open access dataset' : 'Request required'}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {isOpen
                    ? canOpenDataset(dataset)
                      ? 'This dataset is openly available. Use the link below to open the repository.'
                      : 'This dataset is available under the published license. Contact the team if you need help locating the files.'
                    : 'This dataset is subject to access review. Requests are typically reviewed within a few business days.'}
                </p>
              </div>

              <div className="space-y-3">
                <DatasetRequestAction dataset={dataset} />

                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-transparent px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary"
                >
                  <FiExternalLink size={14} />
                  Contact the team
                </Link>
              </div>

              <p className="mt-5 text-[12px] leading-relaxed text-on-surface-variant">
                Governed by the{' '}
                <Link href="/data-sovereignty" className="text-primary underline-offset-2 hover:underline">
                  NOODL Open Data License
                </Link>
                . Terms apply to any downstream use or re-sharing.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-16">
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-primary">More datasets</h2>
          <div className="h-px flex-1 bg-outline-variant/70" />
          <Link href="/datasets" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary">
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasets
            .filter((d) => d.slug !== dataset.slug)
            .slice(0, 3)
            .map((related) => (
              <article
                key={related.id}
                className="group rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary"
              >
                <Link
                  href={'/datasets/' + related.slug}
                  className="mb-2 inline-block text-base font-semibold leading-snug text-primary transition-colors hover:text-primary/80"
                >
                  {related.name}
                </Link>
                <div className="line-clamp-2 text-sm leading-relaxed text-on-surface-variant [&_p]:mb-0 [&_p]:leading-relaxed [&_a]:text-primary [&_a]:underline-offset-2 [&_a]:hover:underline">
                  <RichTextRenderer
                    content={related.description}
                    className="prose prose-sm max-w-none [&_p]:mb-0 [&_p]:leading-relaxed [&_a]:text-primary [&_a]:underline-offset-2 [&_a]:hover:underline"
                  />
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}