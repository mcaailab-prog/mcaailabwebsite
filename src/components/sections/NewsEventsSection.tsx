import Link from 'next/link';
import { FaNewspaper, FaCalendarAlt, FaTrophy, FaArrowRight } from 'react-icons/fa';
import type { PostType } from '@/lib/api-types';

export default function NewsEventsSection({ posts = [] }: { posts?: PostType[] }) {
  if (!posts.length) return null;

  const displayed = posts.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-3">
              Stay Informed
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-university-deep-blue">
              Latest News & Events
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 font-label-sm text-label-sm text-primary hover:text-mcaai-teal transition-colors"
          >
            View all
            <FaArrowRight size={14} />
          </Link>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group border border-outline-variant/50 rounded-xl overflow-hidden hover:shadow-md hover:border-mcaai-teal transition-all duration-300 flex flex-col"
            >
              {/* Cover image */}
              {post.cover_image && (
                <div className="aspect-video overflow-hidden bg-surface-container">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">

                {/* Category row */}
                <div className="flex items-center gap-2 mb-3">
                  {post.category === 'news' && (
                    <FaNewspaper size={14} className="text-mcaai-teal shrink-0" />
                  )}
                  {post.category === 'event' && (
                    <FaCalendarAlt size={14} className="text-mcaai-teal shrink-0" />
                  )}
                  {post.category === 'award' && (
                    <FaTrophy size={14} className="text-university-gold shrink-0" />
                  )}

                  <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">
                    {post.category}
                  </span>

                  <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
                    {post.published_date ? new Date(post.published_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }) : ''}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-headline-lg text-[18px] text-university-deep-blue mb-3 leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Body snippet — stripped of HTML tags for the card preview */}
                <p className="font-body-md text-on-surface-variant text-[14px] line-clamp-3 flex-1">
                  {post.body?.replace(/<[^>]*>/g, '') ?? ''}
                </p>

                {/* Footer row */}
                <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  {post.author && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      By {post.author}
                    </span>
                  )}
                  <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 ml-auto group-hover:gap-2 transition-all">
                    Read more
                    <FaArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile CTA ── */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-label-sm text-label-sm text-primary hover:text-mcaai-teal transition-colors"
          >
            View all news
            <FaArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}