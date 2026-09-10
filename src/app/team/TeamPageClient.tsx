"use client";

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import type { TeamMemberType } from '@/lib/api-types';
import { FiMail, FiExternalLink, FiArrowRight, FiUser, FiSearch, FiX } from 'react-icons/fi';
import { FaGoogleScholar } from 'react-icons/fa6';
// ── Safe HTML renderer (zero external deps) ──────────────────────────────────
// Uses the browser's native Sanitizer API where available, with a manual
// allowlist fallback via DOMParser — no dompurify / react-html-parser needed.
const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 's', 'br', 'p',
  'ul', 'ol', 'li', 'a', 'span', 'code', 'pre',
]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  '*': new Set(['class']),
};

function sanitizeHTML(raw: string): string {
  // Native Sanitizer API (Chrome 116+, Firefox 135+)
  if (typeof window !== 'undefined' && 'Sanitizer' in window) {
    const sanitizer = new (window as any).Sanitizer({
      allowElements: [...ALLOWED_TAGS],
      allowAttributes: { href: ['a'], target: ['a'], rel: ['a'], class: ['*'] },
    });
    const el = document.createElement('div');
    (el as any).setHTML(raw, { sanitizer });
    return el.innerHTML;
  }

  // Fallback: parse with DOMParser, walk the tree, strip disallowed nodes/attrs
  if (typeof window === 'undefined') return raw; // SSR: trust the DB, render as-is
  const doc = new DOMParser().parseFromString(raw, 'text/html');

  function clean(node: Node) {
    const children = [...node.childNodes];
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
          // Replace disallowed element with its text content
          node.replaceChild(document.createTextNode(el.textContent ?? ''), el);
          continue;
        }
        // Strip disallowed attributes
        [...el.attributes].forEach((attr) => {
          const allowed = ALLOWED_ATTRS[tag] ?? new Set();
          const global = ALLOWED_ATTRS['*'] ?? new Set();
          if (!allowed.has(attr.name) && !global.has(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
        // Force external links to be safe
        if (tag === 'a') {
          const href = el.getAttribute('href') ?? '';
          if (href.startsWith('javascript:') || href.startsWith('data:')) {
            el.removeAttribute('href');
          }
          el.setAttribute('rel', 'noopener noreferrer');
        }
        clean(el);
      } else {
        node.removeChild(child);
      }
    }
  }

  clean(doc.body);
  return doc.body.innerHTML;
}

function SafeHTML({
  html,
  className,
}: {
  html: string | null | undefined;
  className?: string;
}) {
  if (!html) return null;
  const clean = sanitizeHTML(html);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

// ── Hero background decoration ────────────────────────────────────────────────
function HeroDecoration() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Dot-grid */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.18 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#003399" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Large faint ring — top right */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          border: '56px solid #003399',
          opacity: 0.05,
        }}
      />
      {/* Small accent ring — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '8%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          border: '32px solid #72C6D5',
          opacity: 0.1,
        }}
      />

      {/* Diagonal accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '18%',
          width: '3px',
          height: '100%',
          background: 'linear-gradient(to bottom, #86C440 0%, transparent 100%)',
          opacity: 0.25,
          transform: 'skewX(-6deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 'calc(18% + 10px)',
          width: '1px',
          height: '100%',
          background: 'linear-gradient(to bottom, #FDB813 0%, transparent 80%)',
          opacity: 0.18,
          transform: 'skewX(-6deg)',
        }}
      />

      {/* Scattered small squares */}
      {[
        { top: '22%', left: '62%', size: 10, color: '#72C6D5', opacity: 0.22 },
        { top: '55%', left: '78%', size: 6, color: '#86C440', opacity: 0.3 },
        { top: '70%', left: '48%', size: 8, color: '#FDB813', opacity: 0.2 },
        { top: '15%', left: '88%', size: 12, color: '#003399', opacity: 0.12 },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: s.color,
            opacity: s.opacity,
            transform: 'rotate(30deg)',
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────
export default function TeamPageClient({ teamMembers }: { teamMembers: TeamMemberType[] }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const leadership = useMemo(
    () =>
      teamMembers.filter((m) => {
        const title = m.title?.toLowerCase() ?? '';
        return (
          title.includes('lead') ||
          title.includes('senior') ||
          title.includes('director')
        );
      }),
    [teamMembers],
  );

  const associates = useMemo(
    () => teamMembers.filter((m) => !leadership.includes(m)),
    [teamMembers, leadership],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null; // null = show normal split layout
    return teamMembers.filter((m) => {
      const title = m.title?.toLowerCase() ?? '';
      return (
        m.name.toLowerCase().includes(q) ||
        title.includes(q) ||
        (m.research_interests ?? '').toLowerCase().includes(q) ||
        (m.bio ?? '').toLowerCase().includes(q)
      );
    });
  }, [query, teamMembers]);

  const isSearching = filtered !== null;

  return (
    <div className="w-full bg-[#f7fafb]">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{ position: 'relative', overflow: 'hidden', background: '#f0f4fb' }}
        className="pt-14 pb-14 px-4 sm:px-8 lg:px-16"
      >
        <HeroDecoration />

        <div className="max-w-[1280px] mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div className="max-w-2xl">
            <span className="font-montserrat text-[11px] font-bold text-[#86C440] uppercase tracking-widest mb-3 block">
              The People Behind the Research
            </span>
            <h1 className="font-montserrat text-[36px] sm:text-[48px] lg:text-[56px] leading-tight font-bold text-[#003399] mb-4 sm:mb-5">
              Our Team
            </h1>
            <p className="text-[15px] sm:text-[18px] leading-[26px] sm:leading-[28px] text-[#3e484b] max-w-xl mb-8">
              MCAAI is built by a community of researchers, engineers, and language advocates
              united by a single mission — ensuring Africa shapes its own AI future.
            </p>

            {/* Search bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                border: '1.5px solid #bec8cb',
                borderRadius: '12px',
                padding: '10px 16px',
                gap: '10px',
                maxWidth: '480px',
                boxShadow: '0 2px 12px rgba(0,51,153,0.07)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={() => {
                // style override via ref if needed
              }}
            >
              <FiSearch size={18} color="#72C6D5" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by name, role, or research area…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  color: '#1a2332',
                  fontFamily: 'inherit',
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ lineHeight: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  aria-label="Clear search"
                >
                  <FiX size={16} color="#bec8cb" />
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}
            className="mt-10 pt-10 border-t border-[#bec8cb]/40"
          >
            {[
              { value: String(teamMembers.length), label: 'Team Members' },
              { value: '4', label: 'Research Tracks' },
              { value: '12+', label: 'Partner Institutions' },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 700,
                    color: '#003399',
                    fontSize: 'clamp(22px, 5vw, 36px)',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: 'clamp(9px, 2vw, 12px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#3e484b',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search Results ────────────────────────────────────────────────── */}
      {isSearching && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-montserrat text-[20px] sm:text-[28px] font-semibold text-[#003399] shrink-0">
              Search Results
            </h2>
            <div className="flex-1 h-px bg-[#bec8cb]/50" />
            <span className="font-montserrat text-[12px] text-[#3e484b] uppercase tracking-wide shrink-0">
              {filtered!.length} found
            </span>
          </div>

          {filtered!.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #bec8cb40',
              }}
            >
              <FiUser size={48} color="#bec8cb" style={{ margin: '0 auto 16px' }} />
              <p className="font-montserrat font-semibold text-[#003399] text-[16px] mb-2">
                No members found
              </p>
              <p className="text-[#3e484b] text-[13px]">
                Try a different name, role, or research area.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered!.map((m) =>
                leadership.includes(m) ? (
                  <LeaderCard key={m.id} member={m} />
                ) : (
                  <AssociateCard key={m.id} member={m} />
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Leadership ────────────────────────────────────────────────────── */}
      {!isSearching && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-montserrat text-[20px] sm:text-[28px] font-semibold text-[#003399] shrink-0">
              Leadership & Senior Researchers
            </h2>
            <div className="flex-1 h-px bg-[#bec8cb]/50" />
            <span className="hidden sm:block font-montserrat text-[12px] text-[#3e484b] uppercase tracking-wide shrink-0">
              {leadership.length} members
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {leadership.map((m) => (
              <LeaderCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      )}

      {/* ── Research Associates ───────────────────────────────────────────── */}
      {!isSearching && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-montserrat text-[20px] sm:text-[28px] font-semibold text-[#003399] shrink-0">
              Research Associates
            </h2>
            <div className="flex-1 h-px bg-[#bec8cb]/50" />
            <span className="hidden sm:block font-montserrat text-[12px] text-[#3e484b] uppercase tracking-wide shrink-0">
              {associates.length} members
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {associates.map((m) => (
              <AssociateCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      )}

      {/* ── Join CTA ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
        <div className="bg-[#003399] rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-montserrat text-[11px] font-bold text-[#72C6D5] uppercase tracking-widest mb-3">
              Join the Centre
            </p>
            <h3 className="font-montserrat text-[24px] sm:text-[32px] font-bold text-white mb-3">
              Work With Us
            </h3>
            <p className="text-white/70 text-[14px] sm:text-[16px] max-w-lg leading-relaxed">
              MCAAI welcomes postgraduate students, visiting researchers, and industry
              collaborators. If you are passionate about AI for African communities, we want to
              hear from you.
            </p>
          </div>
          <div className="flex flex-row sm:flex-col md:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/contact"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#FDB813] text-[#003399] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-montserrat font-bold hover:bg-[#FDB813]/90 transition-all whitespace-nowrap text-sm sm:text-base"
            >
              Get in Touch
              <FiArrowRight size={16} />
            </Link>
            <Link
              href="/research"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-montserrat font-bold hover:bg-white/10 transition-all whitespace-nowrap text-sm sm:text-base"
            >
              Our Research
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Leader Card ───────────────────────────────────────────────────────────────
function LeaderCard({ member }: { member: TeamMemberType }) {
  return (
    <div className="group relative bg-white border border-[#bec8cb]/40 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="h-1 w-full bg-[#003399] group-hover:bg-[#72C6D5] transition-colors duration-300" />

      {/* Photo */}
      <div className="relative h-44 sm:h-52 bg-[#ebeeef] overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiUser size={56} className="text-[#bec8cb]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-montserrat font-bold text-[15px] sm:text-[16px] text-[#003399] mb-1 group-hover:text-[#006875] transition-colors">
          {member.name}
        </h3>
        <p className="text-[10px] sm:text-[11px] font-semibold text-[#72C6D5] uppercase tracking-wide mb-3 leading-tight">
          {member.title}
        </p>

        {/* HTML-parsed research interests */}
        <SafeHTML
          html={member.research_interests}
          className="text-[12px] sm:text-[13px] text-[#3e484b] leading-relaxed line-clamp-3 flex-grow prose-sm"
        />

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#bec8cb]/30">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-[#3e484b] hover:text-[#003399] transition-colors"
              title={member.email}
            >
              <FiMail size={16} />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3e484b] hover:text-[#003399] transition-colors"
              title="LinkedIn"
            >
              <FiExternalLink size={16} />
            </a>
          )}
          {member.google_scholar && (
            <a
              href={member.google_scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3e484b] hover:text-[#003399] transition-colors"
              title="Google Scholar"
            >
              <FaGoogleScholar size={14} />
            </a>
          )}
          <Link
            href={`/team/${member.slug}`}
            className="ml-auto text-[11px] font-semibold text-[#72C6D5] hover:text-[#003399] transition-colors inline-flex items-center gap-1"
          >
            Profile <FiArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Associate Card ────────────────────────────────────────────────────────────
function AssociateCard({ member }: { member: TeamMemberType }) {
  const title = member.title ?? '';
  const track = title.includes('—') ? title.split('—')[1].trim() : title;

  return (
    <div className="group bg-white border border-[#bec8cb]/40 rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ebeeef] flex items-center justify-center shrink-0 overflow-hidden">
          {member.photo ? (
            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <FiUser size={20} className="text-[#bec8cb]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-montserrat font-semibold text-[13px] sm:text-[14px] text-[#003399] leading-tight truncate group-hover:text-[#006875] transition-colors">
            {member.name}
          </p>
          <p className="text-[10px] font-bold text-[#72C6D5] uppercase tracking-wide mt-0.5 truncate">
            {track}
          </p>
        </div>
      </div>

      {/* HTML-parsed bio */}
      <SafeHTML
        html={member.bio}
        className="text-[12px] text-[#3e484b] leading-relaxed line-clamp-3 flex-grow prose-sm"
      />

      <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-[#bec8cb]/30">
        <div className="flex gap-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-[#bec8cb] hover:text-[#003399] transition-colors"
              title={member.email}
            >
              <FiMail size={14} />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bec8cb] hover:text-[#003399] transition-colors"
            >
              <FiExternalLink size={14} />
            </a>
          )}
          {member.google_scholar && (
            <a
              href={member.google_scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bec8cb] hover:text-[#003399] transition-colors"
            >
              <FaGoogleScholar size={13} />
            </a>
          )}
        </div>
        <Link
          href={`/team/${member.slug}`}
          className="text-[10px] font-semibold text-[#bec8cb] group-hover:text-[#72C6D5] transition-colors inline-flex items-center gap-1"
        >
          Profile <FiArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}