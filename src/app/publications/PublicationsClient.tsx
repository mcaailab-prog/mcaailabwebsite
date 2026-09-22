'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { PublicationType } from '@/lib/api';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import {
  FiSearch, FiX, FiExternalLink, FiDownload,
  FiMessageSquare, FiLock, FiEye, FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';

// ─── helpers ────────────────────────────────────────────────────────────────

function getCategoryTag(pub: PublicationType): string {
  if (pub.publication_type) return pub.publication_type;
  if (pub.category) return pub.category;
  const venue = (pub.venue ?? '').toLowerCase();
  if (venue.includes('journal')) return 'Journal Article';
  if (venue.includes('conference') || venue.includes('workshop')) return 'Conference Paper';
  if (venue.includes('arxiv') || venue.includes('preprint')) return 'Preprint';
  if (venue.includes('technical') || venue.includes('report')) return 'Technical Report';
  return 'Research Paper';
}

function isOpenAccess(pub: PublicationType): boolean {
  return pub.is_open_access ?? true;
}

function getReadUrl(pub: PublicationType): string | null {
  if (pub.doi) return `https://doi.org/${pub.doi}`;
  if (pub.url) return pub.url;
  return null;
}

const PAGE_SIZE = 8;

// ─── publication list item ──────────────────────────────────────────────────

function PublicationItem({ pub }: { pub: PublicationType }) {
  const tag        = getCategoryTag(pub);
  const openAccess = isOpenAccess(pub);
  const readUrl    = getReadUrl(pub);
  const pdfUrl     = pub.pdf_file ?? null;
  const abstract   = pub.abstract ?? null;

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-6 flex flex-col gap-4 border-t-[3px] border-t-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* tag row + access badge */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
          {tag}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-outline-variant shrink-0">
          {openAccess
            ? <><FiEye size={13} /> Open Access</>
            : <><FiLock size={13} /> Institutional Access</>
          }
        </span>
      </div>

      {/* title */}
      <h3 className="font-headline-lg-mobile text-[20px] leading-tight text-primary font-semibold hover:underline cursor-pointer">
        {pub.title}
      </h3>

      {/* authors + venue */}
      <div>
        <p className="text-on-surface-variant font-body-md text-[14px]">{pub.authors}</p>
        <p className="text-outline font-body-md text-[13px] italic mt-0.5">
          {[pub.venue, pub.year].filter(Boolean).join(' • ')}
        </p>
      </div>

      {/* abstract — rendered via RichTextRenderer, clamped to 2 lines */}
      {abstract && (
        <div >
          <RichTextRenderer content={abstract} />
        </div>
      )}

      {/* action buttons */}
      <div className="flex items-center gap-3 mt-1 flex-wrap">
        {readUrl && (
          <a
            href={readUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded bg-tertiary text-on-tertiary hover:opacity-90 transition-opacity"
          >
            <FiExternalLink size={14} />
            {openAccess ? 'Read Online' : 'Request Access'}
          </a>
        )}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded border border-primary text-primary hover:bg-primary/5 transition-colors"
          >
            <FiDownload size={14} />
            PDF
          </a>
        )}
        {!readUrl && !pdfUrl && pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded bg-tertiary text-on-tertiary hover:opacity-90 transition-opacity"
          >
            <FiExternalLink size={14} />
            View DOI
          </a>
        )}
        <button
          className="p-2 rounded-full text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
          title="Cite this paper"
          aria-label="Cite this paper"
        >
          <FiMessageSquare size={16} />
        </button>
      </div>
    </article>
  );
}

// ─── main client component ───────────────────────────────────────────────────

export default function PublicationsClient({
  publications: initialPublications,
}: {
  publications: PublicationType[];
}) {
  const [allPublications] = useState<PublicationType[]>(initialPublications);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeYear,     setActiveYear]     = useState('');
  const [activeType,     setActiveType]     = useState('');
  const [sortBy,         setSortBy]         = useState('newest');
  const [page,           setPage]           = useState(1);

  const categories = useMemo(() => {
    const set = new Set(
      allPublications
        .map(p => p.category ?? '')
        .filter(Boolean)
    );
    return Array.from(set).sort();
  }, [allPublications]);

  const years = useMemo(() => {
    const set = new Set(allPublications.map(p => String(p.year)).filter(Boolean));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [allPublications]);

  const types = useMemo(() => {
    const set = new Set(allPublications.map(getCategoryTag));
    return Array.from(set).sort();
  }, [allPublications]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = allPublications.filter(pub => {
      if (activeCategory) {
        const cat = pub.category ?? '';
        if (cat !== activeCategory) return false;
      }
      if (activeYear && String(pub.year) !== activeYear) return false;
      if (activeType && getCategoryTag(pub) !== activeType) return false;
      if (q) {
        const haystack = [pub.title, pub.authors, pub.venue, pub.abstract]
          .filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'newest') result = [...result].sort((a, b) => Number(b.year) - Number(a.year));
    if (sortBy === 'az')     result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [allPublications, search, activeCategory, activeYear, activeType, sortBy]);

  // Reset to page 1 whenever a filter changes. Adjusted directly during
  // render (React's recommended alternative to an effect for this case)
  // rather than via a post-commit effect, so there's no stale-page flash.
  const filterKey = `${search}|${activeCategory}|${activeYear}|${activeType}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background antialiased">

      {/* ── hero header ── */}
      <section className="pt-10 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <nav className="text-[12px] text-outline mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/research" className="hover:text-primary transition-colors">Research</Link>
          <span>/</span>
          <span className="text-on-surface">Publications</span>
        </nav>

        <h1 className="font-display-xl text-headline-lg md:text-display-xl text-primary font-bold mb-6">
          Scientific Publications
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-8">
          Explore our repository of peer-reviewed articles, conference papers, and technical
          reports driving innovation in Applied AI, Natural Language Processing, and Ethical
          Technology within the East African context.
        </p>

        {/* search bar */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-2 flex items-center w-full max-w-4xl shadow-sm focus-within:border-primary focus-within:border-2 transition-all">
          <FiSearch className="text-outline ml-3 mr-2 shrink-0" size={18} />
          <input
            type="text"
            placeholder="Search publications…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border-none bg-transparent text-on-surface placeholder:text-outline-variant/60 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 ml-2 rounded hover:text-primary transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* filters */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="category-filter" className="block text-[12px] font-medium text-outline mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={activeCategory}
              onChange={e => setActiveCategory(e.target.value)}
              className="w-full border border-outline-variant/50 rounded px-3 py-2 bg-background text-on-surface focus:outline-none focus:border-primary focus:border-2"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="year-filter" className="block text-[12px] font-medium text-outline mb-1">
              Year
            </label>
            <select
              id="year-filter"
              value={activeYear}
              onChange={e => setActiveYear(e.target.value)}
              className="w-full border border-outline-variant/50 rounded px-3 py-2 bg-background text-on-surface focus:outline-none focus:border-primary focus:border-2"
            >
              <option value="">All Years</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="type-filter" className="block text-[12px] font-medium text-outline mb-1">
              Type
            </label>
            <select
              id="type-filter"
              value={activeType}
              onChange={e => setActiveType(e.target.value)}
              className="w-full border border-outline-variant/50 rounded px-3 py-2 bg-background text-on-surface focus:outline-none focus:border-primary focus:border-2"
            >
              <option value="">All Types</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* sort + top pagination */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label htmlFor="sort-by" className="text-[12px] font-medium text-outline mr-2">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-outline-variant/50 rounded px-3 py-2 bg-background text-on-surface focus:outline-none focus:border-primary focus:border-2"
            >
              <option value="newest">Newest First</option>
              <option value="az">Title A–Z</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded border border-outline-variant/50 hover:border-primary transition-colors disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[12px] text-outline-variant">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded border border-outline-variant/50 hover:border-primary transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {/* publications grid */}
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.length > 0 ? (
            paginated.map(pub => (
              <PublicationItem key={pub.id} pub={pub} />
            ))
          ) : (
            <p className="col-span-full text-center text-outline-variant py-12">
              No publications match your filters. Try adjusting your search.
            </p>
          )}
        </section>

        {/* bottom pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded border border-outline-variant/50 hover:border-primary transition-colors disabled:opacity-40"
            >
              Previous
            </button>
            <span className="mx-4 text-[12px] text-outline-variant self-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded border border-outline-variant/50 hover:border-primary transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {filtered.length === 0 && search && (
          <p className="mt-8 text-center text-outline-variant">
            No publications found for &ldquo;{search}&rdquo;. Try a different search.
          </p>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-university-deep-blue text-white p-12 md:p-16">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <span className="bg-university-gold text-university-deep-blue px-3 py-1 text-[10px] font-bold rounded mb-6 inline-block uppercase tracking-widest">
                Open Access
              </span>
              <h2 className="font-headline-lg text-[32px] leading-[38px] font-semibold text-white mb-4">
                Browse Our Publications
              </h2>
              <p className="text-white/70 text-[18px] leading-[28px] max-w-xl mb-8">
                Access peer-reviewed papers, datasets, and technical reports from our research
                teams. All MCAAI publications are available open-access to support the global
                research community.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  'Peer-reviewed journal articles & conference papers',
                  'Open datasets for African language NLP',
                  'Technical reports & policy briefs',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <FiCheckCircle className="text-university-gold shrink-0" />
                    <span className="text-[16px] leading-[24px]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 bg-white text-university-deep-blue px-8 py-4 rounded-lg font-bold hover:bg-mcaai-teal hover:text-white transition-all duration-200"
              >
                View All Publications
                <FiArrowRight size={16} />
              </Link>
            </div>

            {/* Stats */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              {[
                { value: '28+',  label: 'Publications' },
                { value: '6',    label: 'Open Datasets' },
                { value: '400+', label: 'Citations' },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl p-5 border border-white/20">
                  <p className="font-headline-lg text-[20px] font-bold text-white leading-none">
                    {s.value}
                  </p>
                  <p className="text-[12px] text-white/60 font-medium tracking-wide mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="font-headline-lg-mobile text-[24px] leading-[30px] text-primary font-semibold mb-6">
            Stay Updated with Our Latest Research
          </h3>
          <p className="text-body-md text-on-surface-variant mb-6">
            Subscribe to our newsletter for updates on new publications, research breakthroughs,
            and upcoming events from MCAAI.
          </p>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border border-outline-variant/50 rounded px-4 py-2 bg-background text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary focus:border-2"
            />
            <button
              type="button"
              className="px-6 py-2 bg-primary text-on-primary font-semibold rounded hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-xs text-outline-variant">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
}