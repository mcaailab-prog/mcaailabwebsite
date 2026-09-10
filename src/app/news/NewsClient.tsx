'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FaNewspaper, FaCalendarAlt, FaTrophy, FaArrowRight, FaSearch } from 'react-icons/fa';
import type { PostType } from '@/lib/api-types';

// ── Category config ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: '',      label: 'All',    icon: null },
  { key: 'news',  label: 'News',   icon: FaNewspaper },
  { key: 'event', label: 'Events', icon: FaCalendarAlt },
  { key: 'award', label: 'Awards', icon: FaTrophy },
] as const;

function getCategoryIcon(category: string) {
  switch (category) {
    case 'news':  return <FaNewspaper   size={13} className="text-mcaai-teal shrink-0" />;
    case 'event': return <FaCalendarAlt size={13} className="text-mcaai-teal shrink-0" />;
    case 'award': return <FaTrophy      size={13} className="text-university-gold shrink-0" />;
    default:      return <FaNewspaper   size={13} className="text-mcaai-teal shrink-0" />;
  }
}

// ── Featured card ──────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: PostType }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group relative rounded-2xl overflow-hidden flex flex-col lg:flex-row border border-outline-variant/40 hover:border-mcaai-teal hover:shadow-xl transition-all duration-300 bg-white"
    >
      <div className="lg:w-1/2 aspect-video lg:aspect-auto min-h-[260px] bg-surface-container overflow-hidden relative">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-university-deep-blue to-mcaai-teal flex items-center justify-center">
            <FaNewspaper size={64} className="text-white/20" />
          </div>
        )}
        <span className="absolute top-4 left-4 bg-university-gold text-university-deep-blue text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Featured
        </span>
      </div>

      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          {getCategoryIcon(post.category)}
          <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">
            {post.category}
          </span>
          <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
            {post.published_date ? new Date(post.published_date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            }) : ''}
          </span>
        </div>

        <h2 className="font-headline-lg text-[24px] md:text-[28px] text-university-deep-blue mb-4 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h2>

        <p className="font-body-md text-on-surface-variant text-[15px] line-clamp-3 mb-6 leading-relaxed">
          {post.body?.replace(/<[^>]*>/g, '') ?? ''}
        </p>

        {post.author && (
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">
            By {post.author}
          </p>
        )}

        <span className="inline-flex items-center gap-2 text-primary font-semibold text-[14px] group-hover:gap-3 transition-all">
          Read full story <FaArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

// ── Regular card ───────────────────────────────────────────────────────────
function PostCard({ post }: { post: PostType }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group border border-outline-variant/50 rounded-xl overflow-hidden hover:shadow-md hover:border-mcaai-teal transition-all duration-300 flex flex-col bg-white"
    >
      <div className="aspect-video overflow-hidden bg-surface-container relative">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-university-deep-blue/80 to-mcaai-teal/60 flex items-center justify-center">
            {getCategoryIcon(post.category)}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {getCategoryIcon(post.category)}
          <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">
            {post.category}
          </span>
          <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
            {post.published_date ? new Date(post.published_date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            }) : ''}
          </span>
        </div>

        <h3 className="font-headline-lg text-[17px] text-university-deep-blue mb-3 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="font-body-md text-on-surface-variant text-[13px] line-clamp-3 flex-1 leading-relaxed">
          {post.body?.replace(/<[^>]*>/g, '') ?? ''}
        </p>

        <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
          {post.author && (
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[60%]">
              {post.author}
            </span>
          )}
          <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 ml-auto group-hover:gap-2 transition-all">
            Read more <FaArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main client component ──────────────────────────────────────────────────
export default function NewsClient({ posts }: { posts: PostType[] }) {
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchCat = !activeCategory || post.category === activeCategory;
      const q = search.toLowerCase().trim();
      const matchSearch = !q || [post.title, post.body, post.author]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, search]);

  const featured  = filtered[0];
  const remaining = filtered.slice(1);

  return (
    <div className="w-full">

      {/* ── Hero banner ── */}
      <section className="relative w-full py-20 overflow-hidden bg-university-deep-blue">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="font-label-sm text-label-sm text-university-gold uppercase tracking-widest block mb-4">
            Stay Informed
          </span>
          <h1 className="font-headline-lg text-4xl md:text-5xl font-bold text-white mb-6">
            News & Events
          </h1>
          <p className="font-body-lg text-body-lg text-white/70 max-w-2xl mx-auto mb-10">
            Stay updated with our latest announcements, research breakthroughs,
            event highlights, and award recognitions from MCAAI.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto flex items-center bg-white rounded-xl shadow-lg overflow-hidden px-4 gap-3">
            <FaSearch size={16} className="text-outline shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search news, events, awards…"
              className="flex-1 py-4 bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline-variant"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-outline hover:text-on-surface text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter pills ── */}
      <section className="bg-surface-container-low border-b border-outline-variant/30 sticky top-16 md:top-20 z-30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center gap-3 flex-wrap">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                activeCategory === key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-white border border-outline-variant text-on-surface-variant hover:border-mcaai-teal hover:text-mcaai-teal'
              }`}
            >
              {Icon && <Icon size={12} />}
              {label}
            </button>
          ))}
          <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <FaNewspaper size={48} className="text-outline-variant mx-auto mb-4" />
              <p className="font-headline-lg text-[20px] text-on-surface-variant mb-2">
                No results found
              </p>
              <p className="font-body-md text-on-surface-variant text-[14px]">
                Try adjusting your search or filter.
              </p>
              <button
                onClick={() => { setSearch(''); setActiveCategory(''); }}
                className="mt-6 text-primary font-semibold text-[14px] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {featured && <FeaturedCard post={featured} />}
              {remaining.length > 0 && (
                <div>
                  <h2 className="font-headline-lg text-[20px] text-university-deep-blue mb-6 flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-university-gold inline-block" />
                    More Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remaining.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}