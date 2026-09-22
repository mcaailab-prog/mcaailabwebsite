import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { TeamMemberType, PublicationType, ProjectType } from '@/lib/api-types';
import { notFound } from 'next/navigation';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import { FiArrowLeft, FiMail, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { FaGoogleScholar } from 'react-icons/fa6';

// ── Buffer → base64 data URL ─────────────────────────────────────────────────
// `value` is declared as `string` on these types but MongoDB can hand back a
// raw binary blob (or its JSON-serialised form) for legacy records, so it's
// accepted as `unknown` and narrowed rather than trusted.
function isSerializedBuffer(value: unknown): value is { type: 'Buffer'; data: number[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).type === 'Buffer' &&
    Array.isArray((value as Record<string, unknown>).data)
  );
}

function bufferToUrl(value: unknown, mime = 'image/jpeg'): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Uint8Array || Buffer.isBuffer(value))
    return `data:${mime};base64,${Buffer.from(value).toString('base64')}`;
  if (isSerializedBuffer(value))
    return `data:${mime};base64,${Buffer.from(value.data).toString('base64')}`;
  return null;
}

function serializeMember(m: TeamMemberType): TeamMemberType {
  return { ...m, photo: bufferToUrl(m.photo) ?? '' };
}
function serializePublication(p: PublicationType): PublicationType {
  return { ...p, pdf_file: bufferToUrl(p.pdf_file, 'application/pdf') ?? p.pdf_file };
}
function serializeProject(p: ProjectType): ProjectType {
  return { ...p, team_members: p.team_members?.map((m) => serializeMember(m)) };
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() ?? '';
}

function injectLeadImageIntoBio(bio: string | null | undefined, photo: string | null | undefined, name: string) {
  if (!bio || !photo) return bio ?? '';

  const safeName = name.replace(/"/g, '&quot;');
  const safePhoto = photo.replace(/"/g, '&quot;');
  const imageMarkup = `
    <div class="mb-4 overflow-hidden sm:float-right sm:ml-6 sm:max-w-[220px] sm:w-[38%]">
      <img
        src="${safePhoto}"
        alt="${safeName}"
        class="w-full h-auto rounded-2xl border border-[#bec8cb]/40 object-cover shadow-sm"
      />
    </div>
  `;

  return bio.replace(/<p\b[^>]*>/i, (match) => `${imageMarkup}${match}`);
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const teamMembers = await api.getTeamMembers();
  const m = teamMembers.find((m: TeamMemberType) => m.slug === slug);
  return {
    title: m ? `${m.name} — MCAAI` : 'Team Member — MCAAI',
    description: m
      ? `Learn about ${m.name}, ${m.title} at MCAAI.`
      : 'Learn about our team members and their research contributions.',
  };
}

// ── Status badge styles ───────────────────────────────────────────────────────
const PROJECT_STATUS: Record<string, string> = {
  ongoing:   'bg-emerald-100 text-emerald-700',
  active:    'bg-blue-100    text-blue-700',
  completed: 'bg-purple-100  text-purple-700',
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function TeamMemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [rawMembers, rawPublications, rawProjects] = await Promise.all([
    api.getTeamMembers(),
    api.getPublications(),
    api.getProjects(),
  ]);

  const teamMembers      = rawMembers.map(serializeMember);
  const allPublications  = rawPublications.map(serializePublication);
  const allProjects      = rawProjects.map(serializeProject);

  const member = teamMembers.find((m: TeamMemberType) => m.slug === slug);
  if (!member) notFound();

  const memberPublications: PublicationType[] = allPublications.filter(
    (pub: PublicationType) =>
      pub.authors?.toLowerCase().split(/[,;&]/).some((a) =>
        a.trim().toLowerCase().includes(
          member.name.toLowerCase().split(' ')[0].toLowerCase()
        )
      )
  );

  const memberProjects: ProjectType[] = allProjects.filter((p: ProjectType) =>
    p.team_members?.some((m) => m.id === member.id || m.slug === member.slug)
  );

  const hasPhoto = !!member.photo;

  return (
    <div className="w-full bg-[#f7fafb]">

      {/* ══════════════════════════════════════════════════════════════════
          HERO — photo fills the entire section
          Gradient: transparent at top → university-deep-blue at bottom
          so the name + metadata sit on a legible dark base.
          University-gold (#FDB813) used for the name and accent elements.
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[480px] md:min-h-[560px] flex flex-col justify-end overflow-hidden">

        {/* ── Photo / fallback ─────────────────────────────────────────── */}
        {hasPhoto ? (
          <img
            src={member.photo ?? ''}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          /* Fallback: deep-blue with node-graph texture */
          <>
            <div className="absolute inset-0" style={{ background: '#002266' }} />
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full opacity-[0.08]"
              viewBox="0 0 800 560"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <g stroke="#72C6D5" strokeWidth="1">
                <line x1="80"  y1="120" x2="240" y2="80"  />
                <line x1="240" y1="80"  x2="420" y2="160" />
                <line x1="420" y1="160" x2="600" y2="100" />
                <line x1="420" y1="160" x2="380" y2="320" />
                <line x1="600" y1="100" x2="720" y2="200" />
                <line x1="380" y1="320" x2="200" y2="400" />
                <line x1="380" y1="320" x2="540" y2="420" />
                <line x1="540" y1="420" x2="720" y2="200" />
              </g>
              <g fill="#72C6D5">
                <circle cx="80"  cy="120" r="5" />
                <circle cx="240" cy="80"  r="8" />
                <circle cx="420" cy="160" r="6" />
                <circle cx="600" cy="100" r="5" />
                <circle cx="720" cy="200" r="5" />
                <circle cx="380" cy="320" r="6" />
                <circle cx="200" cy="400" r="5" />
                <circle cx="540" cy="420" r="5" />
              </g>
            </svg>
          </>
        )}

        {/* ── Gradient layers ──────────────────────────────────────────── */}
        {/*
          Layer 1 (bottom): opaque university-deep-blue base — text always legible
          Layer 2 (mid):    semi-transparent fade so the photo bleeds through
          Layer 3 (top):    very subtle vignette so the back-link is readable
          No gold in the overlay — gold is reserved for text to stay intentional.
        */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              /* strong base — deep blue anchors the bottom */
              'linear-gradient(to top, #002266 0%, rgba(0,34,102,0.92) 18%, rgba(0,34,102,0.65) 40%, rgba(0,34,102,0.15) 68%, transparent 100%)',
              /* left-side brand wash */
              'linear-gradient(to right, rgba(0,22,80,0.4) 0%, transparent 55%)',
            ].join(', '),
          }}
        />

        {/* Teal glow top-right — references AI brand */}
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(114,198,213,0.12) 0%, transparent 70%)' }}
        />

        {/* ── Back link — floated top-left ─────────────────────────────── */}
        <div className="absolute top-6 left-4 sm:left-8 lg:left-16 z-10">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-[13px] font-semibold font-montserrat transition-colors text-white/75 hover:text-white group"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <FiArrowLeft
              size={13}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Team
          </Link>
        </div>

        {/* ── Name block — sits on the dark gradient ───────────────────── */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pb-10 pt-28">

          {/* Role label — teal, small caps */}
          <p
            className="font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{ color: '#72C6D5' }}
          >
            {member.title}
          </p>

          {/* Name — university-gold, the hero typographic moment */}
          <h1
            className="font-montserrat font-bold leading-[1.04] mb-5"
            style={{
              fontSize: 'clamp(32px, 6vw, 60px)',
              letterSpacing: '-0.025em',
              color: '#FDB813',                     /* university-gold */
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            {member.name}
          </h1>

          {/* Contact / social row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-montserrat font-semibold text-[13px] transition-all hover:opacity-90"
                style={{ background: '#FDB813', color: '#002266' }}
              >
                <FiMail size={13} />
                {member.email}
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-montserrat font-semibold text-[13px] transition-all hover:bg-white"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <FiExternalLink size={13} />
                LinkedIn
              </a>
            )}
            {member.google_scholar && (
              <a
                href={member.google_scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-montserrat font-semibold text-[13px] transition-all hover:bg-white"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <FaGoogleScholar size={13} />
                Google Scholar
              </a>
            )}
          </div>
        </div>

        {/* Gold accent rule at the very bottom of the hero */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] z-10"
          style={{
            background: 'linear-gradient(to right, #FDB813 0%, rgba(253,184,19,0.4) 50%, transparent 100%)',
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* ── Left: Bio + Research Focus ─────────────────────────────── */}
          <div className="space-y-6">

            {/* Biography */}
            <div className="bg-white border border-[#bec8cb]/40 rounded-2xl p-6 sm:p-8">
              <h2
                className="font-montserrat font-bold text-[18px] mb-5 pb-4 border-b border-[#bec8cb]/40"
                style={{ color: '#003399' }}
              >
                Biography
              </h2>
              <RichTextRenderer
                content={injectLeadImageIntoBio(member.bio, member.photo, member.name)}
                className="
                  text-[14px] sm:text-[15px] text-[#3e484b] leading-relaxed
                  [&_p]:mb-4 [&_p:last-child]:mb-0
                  [&_h3]:font-montserrat [&_h3]:font-bold [&_h3]:text-[#003399] [&_h3]:text-[16px] [&_h3]:mt-6 [&_h3]:mb-2
                  [&_strong]:font-semibold [&_strong]:text-[#003399]
                  [&_a]:text-[#72C6D5] [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-[#003399]
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4
                  [&_em]:italic
                "
              />
            </div>

            {/* Research Focus */}
            <div className="bg-white border border-[#bec8cb]/40 rounded-2xl p-6 sm:p-8">
              <h2
                className="font-montserrat font-bold text-[18px] mb-5 pb-4 border-b border-[#bec8cb]/40"
                style={{ color: '#003399' }}
              >
                Research Focus
              </h2>
              <RichTextRenderer
                content={member.research_interests}
                className="
                  text-[14px] sm:text-[15px] text-[#3e484b] leading-relaxed
                  [&_p]:mb-3 [&_p:last-child]:mb-0
                  [&_strong]:font-semibold [&_strong]:text-[#003399]
                  [&_a]:text-[#72C6D5] [&_a]:underline [&_a]:underline-offset-2
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
                "
              />
            </div>
          </div>

          {/* ── Right: Publications + Projects ─────────────────────────── */}
          <div className="space-y-5">

            {/* Publications */}
            <div className="bg-white border border-[#bec8cb]/40 rounded-2xl p-5 sm:p-6">
              <h3
                className="font-montserrat font-bold text-[12px] uppercase tracking-widest mb-4"
                style={{ color: '#003399' }}
              >
                Publications
              </h3>

              {memberPublications.length > 0 ? (
                <ul className="space-y-4">
                  {memberPublications.map((pub) => (
                    <li
                      key={pub.id}
                      className="pl-3 border-l-2"
                      style={{ borderColor: '#72C6D5' }}
                    >
                      <p className="font-montserrat font-semibold text-[13px] leading-snug text-[#003399]">
                        {pub.title}
                      </p>
                      <p className="text-[11px] text-[#3e484b]/65 mt-0.5 leading-relaxed">
                        {pub.authors}
                        {pub.venue && ` · ${pub.venue}`}
                        {pub.year  && ` · ${pub.year}`}
                      </p>
                      <div className="flex gap-3 mt-1.5 flex-wrap">
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold hover:underline transition-colors"
                            style={{ color: '#72C6D5' }}
                          >
                            DOI ↗
                          </a>
                        )}
                        {pub.pdf_file && (
                          <a
                            href={pub.pdf_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold hover:underline transition-colors"
                            style={{ color: '#72C6D5' }}
                          >
                            PDF ↗
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-[#3e484b]/55 italic">
                  No publications on record yet.
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="bg-white border border-[#bec8cb]/40 rounded-2xl p-5 sm:p-6">
              <h3
                className="font-montserrat font-bold text-[12px] uppercase tracking-widest mb-4"
                style={{ color: '#003399' }}
              >
                Projects
              </h3>

              {memberProjects.length > 0 ? (
                <ul className="space-y-3">
                  {memberProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group flex items-start gap-3 p-3 rounded-xl border border-[#bec8cb]/40 hover:border-[#72C6D5]/50 hover:shadow-sm transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-montserrat font-semibold text-[13px] leading-snug group-hover:text-[#006875] transition-colors truncate"
                            style={{ color: '#003399' }}
                          >
                            {project.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {project.sector && (
                              <span className="text-[11px] text-[#3e484b]/55 capitalize">
                                {project.sector}
                              </span>
                            )}
                            {project.status && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                  PROJECT_STATUS[project.status] ?? 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {project.status}
                              </span>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-[11px] text-[#3e484b]/55 mt-1 line-clamp-2 leading-relaxed">
                              {stripHtml(String(project.description))}
                            </p>
                          )}
                        </div>
                        <FiArrowRight
                          size={13}
                          className="shrink-0 mt-0.5 text-[#bec8cb] group-hover:text-[#72C6D5] transition-colors"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-[#3e484b]/55 italic">
                  No projects on record yet.
                </p>
              )}
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-5 sm:p-6 text-center overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #002266 0%, #003399 60%, #005580 100%)' }}
            >
              {/* Gold glow */}
              <div
                className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(253,184,19,0.18) 0%, transparent 70%)' }}
              />
              <div className="relative z-10">
                <p className="font-montserrat font-bold text-white text-[14px] mb-1">
                  Collaborate with {member.name.split(' ')[0]}
                </p>
                <p className="text-white/55 text-[12px] mb-4 leading-relaxed">
                  Interested in this research? Reach out directly or explore partnership opportunities with MCAAI.
                </p>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-montserrat font-bold text-[13px] transition-all hover:opacity-90"
                    style={{ background: '#FDB813', color: '#002266' }}
                  >
                    <FiMail size={13} />
                    Send Email
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-montserrat font-bold text-[13px] transition-all hover:opacity-90"
                    style={{ background: '#FDB813', color: '#002266' }}
                  >
                    Get in Touch
                    <FiArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/team"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#bec8cb]/40 text-[13px] font-semibold font-montserrat text-[#3e484b] hover:border-[#72C6D5] hover:text-[#003399] transition-all"
            >
              <FiArrowLeft size={13} />
              All Team Members
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}