import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function InnovationsPage() {
  const products = await api.getInnovations();

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-sky-700">Home</Link>
          <span>/</span>
          <span className="font-medium text-slate-700">Innovations</span>
        </nav>

        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-university-deep-blue sm:text-5xl">
            Innovation products at MCAAI
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            We build practical language technologies that strengthen data quality, inclusion, and local digital access across Kenyan communities.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <article key={product.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="text-2xl font-bold text-university-deep-blue">{product.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
              {product.impact ? (
                <div className="mt-5 rounded-2xl bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Impact</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{product.impact}</p>
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {(product.stack || []).map((item) => (
                  <span key={item} className="bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={`/innovations/${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-mcaai-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  learn more
                  <FiArrowRight className="text-base" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {products.length === 0 ? (
          <p className="py-16 text-center text-slate-500">No innovation products published yet.</p>
        ) : null}
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-3xl bg-university-deep-blue p-8 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Research-to-product</p>
              <h3 className="mt-2 text-2xl font-bold">Turn ideas into tools that serve communities.</h3>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-university-deep-blue"
            >
              Collaborate with us
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
