'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { TeamMemberType } from '@/lib/api-types';
import { FiArrowRight } from 'react-icons/fi';

export default function TeamSnapshotSection({ members = [] }: { members?: TeamMemberType[] }) {
  // Show first 2 members (ordered by the `order` field from the DB)
  const featured = members.slice(0, 2);

  if (!featured.length) return null;

  return (
    <section className="py-10 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-3">
              The People Behind the Research
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-university-deep-blue">
              Our Team
            </h2>
          </div>
          <Link
            href="/team"
            className="hidden md:flex items-center gap-2 font-label-sm text-label-sm text-primary hover:text-mcaai-teal transition-colors"
          >
            Meet everyone
            <FiArrowRight size={16} />
          </Link>
        </div>

        {/* ── Member cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featured.map((member) => (
            <Link
              key={member.id}
              href="/team"
              className="group bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden hover:border-mcaai-teal hover:shadow-md transition-all duration-200"
            >
              {/* Photo */}
              <div className="relative w-full aspect-square bg-surface-container-high overflow-hidden">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-3xl font-bold text-primary">
                      {member.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name + title */}
              <div className="p-3">
                <p className="font-body-md text-[13px] font-semibold text-on-surface leading-tight">
                  {member.name}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 leading-tight line-clamp-2">
                  {member.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile CTA ── */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 font-label-sm text-label-sm text-primary hover:text-mcaai-teal transition-colors"
          >
            Meet everyone
            <FiArrowRight size={16} />
          </Link>
        </div>

        {/* ── Desktop CTA ── */}
        <div className="mt-10 hidden md:flex justify-center">
          <Link
            href="/team"
            className="px-8 py-3 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            View Full Team →
          </Link>
        </div>

      </div>
    </section>
  );
}