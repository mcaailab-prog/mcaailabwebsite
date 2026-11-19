import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiLayers, FiShield, FiUsers } from 'react-icons/fi';
import InnovationsCatalog, { type InnovationCatalogItem } from './InnovationsCatalog';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function InnovationsPage() {
  const products = await api.getInnovations();
  const categoryCount = new Set(products.map((product) => product.category).filter(Boolean)).size;
  const catalogProducts: InnovationCatalogItem[] = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    date: product.date,
    subtitle: product.subtitle,
    description: product.description,
    summary: product.summary,
    impact: product.impact,
    stack: product.stack,
    access_url: product.access_url,
  }));

  return (
    <div className="bg-background text-on-surface">
      <section className="relative overflow-hidden border-b border-outline-variant/60 bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Maseno Centre for Applied Artificial Intelligence</p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-university-deep-blue sm:text-5xl lg:text-6xl">
                From applied research to practical AI tools.
              </h1>
              <p className="mt-5 max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
                Explore MCAAI innovations for speech collection, multilingual localization, and other community-centered AI workflows.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition hover:bg-university-deep-blue"
                >
                  Browse innovations <FiArrowRight aria-hidden="true" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-3 font-semibold text-primary transition hover:bg-surface-container"
                >
                  Discuss collaboration
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
              <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-4">
                <p className="text-sm font-semibold text-on-surface-variant">Published innovations</p>
                <p className="mt-1 font-headline text-3xl font-bold text-university-deep-blue">{products.length}</p>
              </div>
              <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-4">
                <p className="text-sm font-semibold text-on-surface-variant">Product categories</p>
                <p className="mt-1 font-headline text-3xl font-bold text-primary">{categoryCount}</p>
              </div>
              <div className="rounded-xl bg-university-deep-blue p-4 text-on-primary">
                <p className="text-sm font-semibold text-primary-fixed">Explore the catalog</p>
                <p className="mt-1 text-sm leading-6 text-surface-container-high">
                  Open a product page for its workflows, features, and details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InnovationsCatalog products={catalogProducts} />

      <section className="bg-surface-container-lowest py-16 sm:py-20" id="approach">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Research to product</p>
            <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">
              Tools shaped around real workflows.
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              MCAAI products pair focused tasks with quality checks and role-aware collaboration.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: FiUsers,
                title: 'Community-centered',
                description: 'Build workflows around the people contributing, translating, and reviewing the work.',
              },
              {
                icon: FiLayers,
                title: 'Purpose-built workflows',
                description: 'Support distinct tasks such as voice recording, keyword translation, and sentence localization.',
              },
              {
                icon: FiShield,
                title: 'Quality built in',
                description: 'Use audio validation, dictionary checks, translation memory, and proofreader review where they fit.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-outline-variant/60 bg-background p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <Icon aria-hidden="true" className="text-xl" />
                </span>
                <h3 className="mt-5 font-headline text-xl font-semibold text-university-deep-blue">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl bg-primary p-7 text-on-primary sm:p-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-fixed">Work with MCAAI</p>
              <h2 className="mt-3 font-headline text-3xl font-semibold sm:text-4xl">
                Explore a platform or start a conversation.
              </h2>
              <p className="mt-4 leading-7 text-primary-fixed">
                Contact the team to discuss product access, research, or collaboration opportunities.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-5 py-3 font-semibold text-primary transition hover:bg-surface-container"
              >
                Contact MCAAI <FiArrowRight aria-hidden="true" />
              </Link>
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-lg border border-on-primary/40 px-5 py-3 font-semibold text-on-primary transition hover:bg-on-primary/10"
              >
                <FiCheckCircle aria-hidden="true" /> View catalog
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
