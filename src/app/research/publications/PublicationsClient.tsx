'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { PublicationType } from '@/lib/api';
import { FiSearch, FiX, FiExternalLink, FiDownload, FiMessageSquare, FiLock, FiEye } from 'react-icons/fi';

// ─── helpers ────────────────────────────────────────────────────────────────

function getCategoryTag(pub: PublicationType): string {
  if ((pub as any).publication_type) return (pub as any).publication_type;
  if ((pub as any).category) return (pub as any).category;
  const venue = (pub.venue ?? '').toLowerCase();
  if (venue.includes('journal')) return 'Journal Article';
  if (venue.includes('conference') || venue.includes('workshop')) return 'Conference Paper';
  if (venue.includes('arxiv') || venue.includes('preprint')) return 'Preprint';
  if (venue.includes('technical') || venue.includes('report')) return 'Technical Report';
  return 'Research Paper';
}

function isOpenAccess(pub: PublicationType): boolean {
  return (pub as any).is_open_access ?? (pub as any).open_access ?? true;
}

function getReadUrl(pub: PublicationType): string | null {
  if (pub.doi) return `https://doi.org/${pub.doi}`;
  if ((pub as any).url) return (pub as any).url;
  return null;
}

const PAGE_SIZE = 8;

// ─── publication list item ───────────────────────────────────────────────────

function PublicationItem({ pub }: { pub: PublicationType }) {
  const tag = getCategoryTag(pub);
  const openAccess = isOpenAccess(pub);
  const readUrl = getReadUrl(pub);
  const pdfUrl = (pub as any).pdf_file ?? null;

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-6 flex flex-col gap-4 border-t-[3px] border-t-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* tag row + access badge */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
          {tag}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-outline-variant shrink-0">
          {openAccess ? (
            <><FiEye size={13} /> Open Access</>
          ) : (
            <><FiLock size={13} /> Institutional Access</>
          )}
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

      {/* abstract snippet */}
      {(pub as any).abstract && (
        <p className="text-on-surface-variant text-[13px] line-clamp-2">
          {(pub as any).abstract}
        </p>
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

// ─── page ────────────────────────────────────────────────────────────────────

export default function PublicationsClient({
  publications: initialPublications,
}: {
  publications: PublicationType[];
}) {
  const [allPublications] = useState<PublicationType[]>(initialPublications);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeYear, setActiveYear] = useState('');
  const [activeType, setActiveType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(
      allPublications.map(p => (p as any).category ?? (p as any).research_area ?? '')
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

  // Top contributors — derived from author names with publication counts
  const topContributors = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const pub of allPublications) {
      const firstAuthor = pub.authors?.split(',')[0]?.trim();
      if (firstAuthor) counts[firstAuthor] = (counts[firstAuthor] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  }, [allPublications]);

  // Featured publication — first open-access one with a read URL
  const featured = useMemo(
    () => allPublications.find(p => isOpenAccess(p) && getReadUrl(p)) ?? allPublications[0],
    [allPublications]
  );

  // Filtering + sorting
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = allPublications.filter(pub => {
      if (activeCategory) {
        const cat = (pub as any).category ?? (pub as any).research_area ?? '';
        if (cat !== activeCategory) return false;
      }
      if (activeYear && String(pub.year) !== activeYear) return false;
      if (activeType && getCategoryTag(pub) !== activeType) return false;
      if (q) {
        const haystack = [pub.title, pub.authors, pub.venue, (pub as any).abstract]
          .filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'newest') result = [...result].sort((a, b) => Number(b.year) - Number(a.year));
    if (sortBy === 'az') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [allPublications, search, activeCategory, activeYear, activeType, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, activeYear, activeType, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background antialiased">

      {/* ── hero header ──────────────────────────────────────────────────── */}
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-none bg-transparent focus:ring-0 text-on-surface placeholder:text-outline-variant font-body-md text-body-md h-12 outline-none"
            placeholder="Search papers by keyword, author, or year…"
            type="text"
          />
          {search && (
            <button onClick={() => setSearch('')} className="mr-2 text-outline hover:text-on-surface">
              <FiX size={16} />
            </button>
          )}
          <button className="bg-tertiary text-on-tertiary h-10 px-5 rounded text-[14px] font-medium hover:opacity-90 transition-opacity shrink-0">
            Search
          </button>
        </div>
      </section>

      {/* ── filter bar ───────────────────────────────────────────────────── */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-10">
        <div className="flex flex-wrap gap-3 items-center bg-surface-container p-4 rounded-lg border border-outline-variant/50">
          <div className="flex items-center gap-2 border-r border-outline-variant pr-4 mr-1">
            <span className="text-outline text-[13px] font-semibold">Filters:</span>
          </div>

          {categories.length > 0 && (
            <select
              value={activeCategory}
              onChange={e => setActiveCategory(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded text-on-surface text-[13px] py-2 px-3 focus:ring-primary focus:border-primary"
            >
              <option value="">Research Area: All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          <select
            value={activeYear}
            onChange={e => setActiveYear(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded text-on-surface text-[13px] py-2 px-3 focus:ring-primary focus:border-primary"
          >
            <option value="">Year: All</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={activeType}
            onChange={e => setActiveType(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded text-on-surface text-[13px] py-2 px-3 focus:ring-primary focus:border-primary"
          >
            <option value="">Type: All</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] text-outline">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border-none text-primary text-[12px] font-semibold focus:ring-0 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="az">A – Z</option>
            </select>
          </div>

          {/* result count */}
          <span className="text-[12px] text-outline border-l border-outline-variant pl-3 ml-1">
            {filtered.length === allPublications.length
              ? `${allPublications.length} papers`
              : `${filtered.length} of ${allPublications.length}`}
          </span>
        </div>
      </section>

      {/* ── main grid ────────────────────────────────────────────────────── */}
      <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── publication list ── */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-[15px] font-medium text-on-surface-variant mb-2">
                  No publications match your search
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory(''); setActiveYear(''); setActiveType(''); }}
                  className="text-[13px] text-primary hover:underline mt-2"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              paginated.map(pub => <PublicationItem key={pub.id} pub={pub} />)
            )}

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-outline-variant rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded text-[13px] font-medium transition-colors ${
                        p === page
                          ? 'bg-primary text-on-primary'
                          : 'border border-outline-variant hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                {totalPages > 7 && <span className="text-outline-variant">…</span>}
                {totalPages > 7 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container text-on-surface-variant text-[13px]"
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-outline-variant rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* ── right sidebar ── */}
          <aside className="lg:col-span-4 flex flex-col gap-6">

            {/* Top Contributors */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6">
              <h4 className="font-headline-lg-mobile text-[20px] text-primary font-semibold mb-4 border-b border-outline-variant/30 pb-3">
                Top Contributors
              </h4>
              <div className="flex flex-col gap-4">
                {topContributors.length > 0
                  ? topContributors.map(({ name, count }) => (
                    <div key={name} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-variant border-2 border-primary-container shrink-0 flex items-center justify-center text-primary font-bold text-[16px]">
                        {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-[14px]">{name}</p>
                        <p className="text-[12px] text-primary font-medium mt-0.5">{count} Publication{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))
                  : (
                    ['Dr. Lilian Wanzare', 'Dr. Collins J. Amol', 'Prof. Mercy Achieng'].map(name => (
                      <div key={name} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-variant border-2 border-primary-container shrink-0 flex items-center justify-center text-primary font-bold text-[15px]">
                          {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-[14px]">{name}</p>
                          <p className="text-[11px] text-outline-variant">MCAAI Researcher</p>
                        </div>
                      </div>
                    ))
                  )
                }
              </div>
            </div>

            {/* Impact stat */}
            <div className="bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 text-[100px] font-bold leading-none select-none">
                AI
              </div>
              <div className="relative z-10">
                <h4 className="font-headline-lg-mobile text-lg font-medium text-primary-fixed mb-1">
                  Research Impact
                </h4>
                <p className="text-[52px] font-bold leading-none text-on-primary mb-2">
                  {allPublications.length}+
                </p>
                <p className="text-primary-container text-[13px] mb-4">
                  Published papers advancing applied AI in East Africa.
                </p>
                <Link
                  href="/research"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold hover:text-primary-fixed transition-colors"
                >
                  View full research portfolio →
                </Link>
              </div>
            </div>

            {/* Featured publication */}
            {featured && (
              <div className="rounded-xl overflow-hidden shadow-sm relative group cursor-pointer border border-outline-variant/30">
                <div className="h-48 w-full bg-surface-container-high flex items-center justify-center">
                  <span className="text-outline-variant text-[13px]">Featured publication</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/80 to-transparent" />
                <div className="absolute bottom-0 p-5 w-full">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-primary text-on-primary mb-3">
                    Featured
                  </span>
                  <h4 className="font-headline-lg-mobile text-on-secondary text-[15px] font-semibold leading-tight mb-2 group-hover:text-primary-fixed transition-colors line-clamp-3">
                    {featured.title}
                  </h4>
                  {getReadUrl(featured) && (
                    <a
                      href={getReadUrl(featured)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-fixed text-[12px] font-semibold hover:underline flex items-center gap-1"
                    >
                      Read paper <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}

          </aside>
        </div>
      </main>
    </div>
  );
}