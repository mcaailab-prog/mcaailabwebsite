import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiCheckCircle, FiLayers, FiShield, FiUsers } from 'react-icons/fi';
import { api } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.getInnovationBySlug(slug);
  if (!product) {
    return { title: 'Innovation project — MCAAI' };
  }
  return {
    title: `${product.name} — MCAAI`,
    description: product.summary || product.description,
  };
}

export default async function InnovationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.getInnovationBySlug(slug);
  if (!product) notFound();

  return (
    <div className="bg-white text-slate-800">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link href="/innovations" className="transition hover:text-slate-700">Innovations</Link>
            <span>/</span>
            <span className="font-medium text-slate-700">{product.name}</span>
          </nav>
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-sky-700">{product.category}</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">{product.subtitle}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {product.date ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <FiCalendar className="text-sky-700" />
                  {product.date}
                </span>
              ) : null}
              {product.access_url ? (
                <a
                  href={product.access_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-university-deep-blue px-3 py-1.5 text-white"
                >
                  Access the system <FiArrowRight />
                </a>
              ) : (
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
                  Request access
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">Overview</h2>
              <p className="text-base leading-8 text-slate-700">{product.summary}</p>
              <p className="mt-5 text-base leading-8 text-slate-700">{product.overview}</p>
            </section>

            {(product.features || []).length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-bold text-slate-900">Key features</h2>
                <div className="space-y-4">
                  {product.features?.map((feature) => (
                    <div key={feature} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mt-0.5 rounded-full bg-sky-100 p-2 text-sky-700">
                        <FiCheckCircle className="text-sm" />
                      </div>
                      <p className="text-sm leading-7 text-slate-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {(product.users || []).length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-bold text-slate-900">Users of the system</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {product.users?.map(({ role, description }) => (
                    <div key={role} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{role}</p>
                      <p className="text-sm leading-7 text-slate-700">{description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {(product.useCases || []).length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-bold text-slate-900">Use cases</h2>
                <ul className="space-y-3">
                  {product.useCases?.map((item) => (
                    <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full" />
                      <span className="text-sm leading-7 text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(product.frontend || []).length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-bold text-slate-900">Front-end design</h2>
                <ul className="space-y-3">
                  {product.frontend?.map((item) => (
                    <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <FiLayers className="mt-1 shrink-0 text-sky-700" />
                      <span className="text-sm leading-7 text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(product.backend || []).length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-bold text-slate-900">Back-end features</h2>
                <ul className="space-y-3">
                  {product.backend?.map((item) => (
                    <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <FiShield className="mt-1 shrink-0 text-sky-700" />
                      <span className="text-sm leading-7 text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            {(product.details || []).length > 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Project details</h3>
                <dl className="space-y-4">
                  {product.details?.map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{label}</dt>
                      <dd className="mt-2 text-sm font-medium text-slate-800">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Built for real-world language access</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                These systems are designed to create practical, community-grounded AI infrastructure with strong governance, quality checks, and productive data workflows.
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-sky-700">
                <FiUsers />
                Community-first AI delivery
              </div>
            </div>

            <Link
              href="/innovations"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              <FiArrowLeft />
              Back to innovations
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
