import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaNewspaper, FaCalendarAlt, FaTrophy, FaUser, FaClock } from 'react-icons/fa';
import { api } from '@/lib/api';
import type { PostType } from '@/lib/api-types';
import RichTextRenderer from '@/components/ui/RichTextRenderer';

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await api.getPosts();
  const post  = posts.find((p: PostType) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found — MCAAI',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: `${post.title} — MCAAI`,
    description: post.body?.replace(/<[^>]*>/g, '').slice(0, 160) ?? 'Read our latest news and events.',
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getCategoryMeta(category: string) {
  switch (category) {
    case 'news':
      return { icon: FaNewspaper,   label: 'News',   color: 'text-mcaai-teal',       bg: 'bg-mcaai-teal/10'       };
    case 'event':
      return { icon: FaCalendarAlt, label: 'Event',  color: 'text-mcaai-teal',       bg: 'bg-mcaai-teal/10'       };
    case 'award':
      return { icon: FaTrophy,      label: 'Award',  color: 'text-university-gold',  bg: 'bg-university-gold/10'  };
    default:
      return { icon: FaNewspaper,   label: category, color: 'text-mcaai-teal',       bg: 'bg-mcaai-teal/10'       };
  }
}

function readingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts    = await api.getPosts();
  const post     = posts.find((p: PostType) => p.slug === slug);

  if (!post) notFound();

  const { icon: CategoryIcon, label: categoryLabel, color, bg } = getCategoryMeta(post.category);
  const minutes = readingTime(post.body ?? '');

  // Related posts — same category, exclude current
  const related = posts
    .filter((p: PostType) => p.category === post.category && p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="w-full bg-white">

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-university-deep-blue">

        {/* Cover image or gradient fallback */}
        {post.cover_image ? (
          <div className="absolute inset-0">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-university-deep-blue/60 via-university-deep-blue/80 to-university-deep-blue" />
          </div>
        ) : (
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-margin-mobile md:px-8 pt-10 pb-16">

          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors font-label-sm text-[13px] mb-8 group"
          >
            <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to News & Events
          </Link>

          {/* Category badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${bg} ${color}`}>
              <CategoryIcon size={11} />
              {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-white/60 font-label-sm text-[13px]">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <FaUser size={11} />
                {post.author}
              </span>
            )}
            {post.published_date && (
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt size={11} />
                {new Date(post.published_date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FaClock size={11} />
              {minutes} min read
            </span>
          </div>

        </div>
      </section>

      {/* ── Article body ── */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Content */}
            <article className="lg:col-span-8">
              <div >
                <RichTextRenderer content={post.body} />
              </div>

              {/* Author card */}
              {post.author && (
                <div className="mt-12 pt-8 border-t border-outline-variant/30">
                  <div className="flex items-center gap-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-lg">
                        {post.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-university-deep-blue text-[15px]">
                        {post.author}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                        Author of this article
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">

                {/* Article info card */}
                <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-6">
                  <h4 className="font-semibold text-university-deep-blue text-[14px] uppercase tracking-widest mb-4">
                    Article Info
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Category</span>
                      <span className={`font-label-sm text-label-sm font-semibold capitalize ${color}`}>
                        {categoryLabel}
                      </span>
                    </div>
                    {post.published_date && (
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Published</span>
                        <span className="font-label-sm text-label-sm text-on-surface">
                          {new Date(post.published_date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Reading time</span>
                      <span className="font-label-sm text-label-sm text-on-surface">{minutes} min</span>
                    </div>
                  </div>
                </div>

                {/* Back to news CTA */}
                <Link
                  href="/news"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold text-[13px] hover:bg-primary hover:text-on-primary transition-all duration-200"
                >
                  <FaArrowLeft size={12} />
                  All News & Events
                </Link>

              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="py-16 bg-surface-container-low border-t border-outline-variant/30">
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-8">
            <h2 className="font-headline-lg text-[22px] text-university-deep-blue mb-8 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-university-gold inline-block" />
              Related Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p: PostType) => (
                <Link
                  key={p.id}
                  href={`/news/${p.slug}`}
                  className="group bg-white rounded-xl border border-outline-variant/40 overflow-hidden hover:border-mcaai-teal hover:shadow-md transition-all duration-200"
                >
                  {p.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-label-sm text-label-sm text-on-surface-variant capitalize mb-2">
                      {p.category}
                    </p>
                    <h3 className="font-semibold text-[14px] text-university-deep-blue leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}