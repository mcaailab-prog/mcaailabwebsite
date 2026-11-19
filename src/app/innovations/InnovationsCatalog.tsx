'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FiArrowRight, FiGlobe, FiMic, FiSearch, FiLayers } from 'react-icons/fi';

export type InnovationCatalogItem = {
  slug: string;
  name: string;
  category?: string;
  date?: string;
  subtitle?: string;
  description?: string;
  summary?: string;
  impact?: string;
  stack?: string[];
  access_url?: string;
};

export default function InnovationsCatalog({ products }: { products: InnovationCatalogItem[] }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(
    () => Array.from(new Set(products.map(({ category }) => category).filter((category): category is string => Boolean(category)))),
    [products],
  );
  const filteredProducts = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const searchableContent = [
        product.name,
        product.category,
        product.description,
        product.summary,
        ...(product.stack || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase();

      return matchesCategory && (!searchTerm || searchableContent.includes(searchTerm));
    });
  }, [products, query, selectedCategory]);

  return (
    <section className="bg-neutral-surface py-16 sm:py-20" id="catalog">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary">MCAAI product catalog</p>
            <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">
              Explore our innovations
            </h2>
            <p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
              Search products by name, category, or capability, then open a detail page to learn more.
            </p>
          </div>
          <p aria-live="polite" className="shrink-0 text-sm font-semibold text-on-surface-variant">
            Showing {filteredProducts.length} of {products.length} innovations
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-sm sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search innovations</span>
            <FiSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, capabilities, or categories"
              className="w-full rounded-xl border border-outline-variant bg-background py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div aria-label="Filter by product category" className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-university-deep-blue text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              All innovations
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-university-deep-blue text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredProducts.map((product) => {
              const ProductIcon =
                product.slug === 'smartvoice-system'
                  ? FiMic
                  : product.slug === 'tafsiri'
                    ? FiGlobe
                    : FiLayers;

              return (
                <article
                  key={product.slug}
                  className="group flex flex-col justify-between rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm transition hover:border-primary hover:shadow-md sm:p-8"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-primary">{product.category}</span>
                      {product.date ? (
                        <span className="text-xs text-outline">{product.date}</span>
                      ) : null}
                    </div>
                    <div className="mt-5 flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                        <ProductIcon aria-hidden="true" className="text-xl" />
                      </span>
                      <div>
                        <h3 className="font-headline text-2xl font-semibold text-university-deep-blue transition group-hover:text-primary">
                          {product.name}
                        </h3>
                        {product.subtitle ? (
                          <p className="mt-1 text-sm font-semibold text-on-surface-variant">{product.subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-on-surface-variant">
                      {product.description || product.summary}
                    </p>
                    {product.impact ? (
                      <div className="mt-5 rounded-xl bg-surface-container-low p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-primary">Impact</p>
                        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{product.impact}</p>
                      </div>
                    ) : null}
                    {(product.stack || []).length > 0 ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {product.stack?.map((item) => (
                          <li key={item} className="rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-5">
                    <Link
                      href={`/innovations/${product.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-university-deep-blue"
                    >
                      Explore {product.name} <FiArrowRight aria-hidden="true" />
                    </Link>
                    {product.access_url ? (
                      <a
                        href={product.access_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Visit platform
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest px-6 py-14 text-center">
            <h3 className="font-headline text-xl font-semibold text-university-deep-blue">No matching innovations</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Try another search term or choose a different category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              className="mt-5 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
