import Link from 'next/link';
import { FiUsers, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, type ProjectType } from '@/lib/api';

export const dynamic = 'force-dynamic';

const OUTCOME_SEQUENCE = [
  { key: 'aim', label: 'Aim' },
  { key: 'context', label: 'Context' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'success', label: 'Success' },
] as const;

function yearLabel(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return String(date.getFullYear());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await api.getProjectBySlug(slug);
  if (!project) {
    return { title: 'Project — MCAAI' };
  }
  return {
    title: `${project.title} — MCAAI`,
    description: project.subtitle || project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await api.getProjectBySlug(slug);
  if (!project) notFound();

  const allMembers = await api.getTeamMembers();
  const names = [project.lead_name, ...(project.member_names || [])].filter(Boolean) as string[];
  const members = allMembers.filter(
    (member) => names.includes(member.name) || names.includes(member.slug),
  );
  const leadMember = members.find(
    (member) => member.name === project.lead_name || member.slug === project.lead_name,
  ) ?? null;
  const supportingMembers = members.filter((member) => member.id !== leadMember?.id);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      <section className="bg-university-deep-blue">
        <div className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-8 lg:px-16">
          <nav className="flex items-center gap-1.5 text-[12px] text-white/60">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/projects" className="transition-colors hover:text-white">Projects</Link>
            <span>/</span>
            <span className="text-white/85">{project.short_title || project.title}</span>
          </nav>

          <div className="pt-10 pb-12">
            <h1 className="font-display-xl text-headline-lg-mobile sm:text-headline-lg text-white max-w-3xl">
              {project.title}
            </h1>
            {project.subtitle ? (
              <p className="mt-4 text-[16px] text-white/75 max-w-2xl leading-relaxed">
                {project.subtitle}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded border border-white/20 px-3 py-1 text-[12px] font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-mcaai-green" />
                {project.status}{yearLabel(project.start_date) ? ` · started ${yearLabel(project.start_date)}` : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="h-[3px] bg-university-gold" />
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-8 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div>
            <h2 className="font-display text-[13px] font-semibold uppercase tracking-wide text-university-deep-blue mb-3">
              Overview
            </h2>
            <p className="text-[15px] text-on-surface-variant leading-relaxed max-w-[68ch]">
              {project.description}
            </p>

            {hasOutcome(project) ? (
              <>
                <h2 className="mt-10 font-display text-[13px] font-semibold uppercase tracking-wide text-university-deep-blue mb-5">
                  Project logic
                </h2>
                <ol className="relative">
                  {OUTCOME_SEQUENCE.map((step, i) => {
                    const value = project.outcome?.[step.key];
                    if (!value) return null;
                    const isLast = i === OUTCOME_SEQUENCE.length - 1;
                    return (
                      <li key={step.key} className="relative pl-12 pb-8 last:pb-0">
                        {!isLast && (
                          <span aria-hidden="true" className="absolute left-[15px] top-8 bottom-0 w-px bg-outline-variant" />
                        )}
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-university-gold text-[12px] font-semibold text-university-deep-blue"
                        >
                          {i + 1}
                        </span>
                        <p className="font-display text-[15px] font-semibold text-on-surface mb-1.5">{step.label}</p>
                        <p className="text-[15px] text-on-surface-variant leading-relaxed max-w-[68ch]">{value}</p>
                      </li>
                    );
                  })}
                </ol>
              </>
            ) : null}

            {(project.focus || []).length > 0 ? (
              <>
                <h2 className="mt-2 font-display text-[13px] font-semibold uppercase tracking-wide text-university-deep-blue mb-4">
                  Focus areas
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {project.focus?.map((item) => (
                    <li key={item} className="rounded border border-outline-variant px-3 py-1 text-[13px] text-on-surface-variant">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="border border-outline-variant rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <FiUsers size={14} />
                <span className="text-[12px] font-semibold uppercase tracking-wide">Team</span>
              </div>
              {leadMember ? (
                <Link href={`/team/${leadMember.slug}`} className="flex items-center gap-3 group mb-1">
                  {leadMember.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={leadMember.photo} alt={leadMember.name} className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-[14px] font-semibold text-university-deep-blue">
                      {leadMember.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-[14px] text-on-surface group-hover:text-university-deep-blue">{leadMember.name}</div>
                    <div className="text-[12px] text-outline">Project lead</div>
                  </div>
                </Link>
              ) : project.lead_name ? (
                <p className="text-[14px] text-on-surface-variant">{project.lead_name} · Project lead</p>
              ) : (
                <p className="text-[14px] text-on-surface-variant">Team details coming soon.</p>
              )}

              {supportingMembers.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-outline-variant space-y-3">
                  {supportingMembers.map((member) => (
                    <Link key={member.id} href={`/team/${member.slug}`} className="flex items-center gap-3 group">
                      {member.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.photo} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-[12px] font-semibold text-university-deep-blue">
                          {member.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[13px] text-on-surface group-hover:text-university-deep-blue">{member.name}</div>
                        <div className="text-[11px] text-outline">{member.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (project.member_names || []).length > 0 ? (
                <ul className="mt-4 space-y-1 text-[13px] text-on-surface-variant">
                  {project.member_names?.filter((name) => name !== project.lead_name).map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            {(project.funder_names || []).length > 0 ? (
              <div className="border border-outline-variant rounded-lg p-5">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-on-surface-variant">Funders</span>
                <div className="mt-4 space-y-3">
                  {project.funder_names?.map((funder) => (
                    <div key={funder} className="flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 rounded bg-surface-container flex items-center justify-center text-[12px] font-semibold text-university-deep-blue">
                        {funder.charAt(0)}
                      </div>
                      <div className="font-medium text-[13px] text-on-surface">{funder}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {(project.links || []).length > 0 ? (
              <div className="border border-outline-variant rounded-lg p-5">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-on-surface-variant">Related links</span>
                <div className="mt-4 space-y-2">
                  {project.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between text-[13px] text-on-surface-variant hover:text-university-deep-blue"
                    >
                      {link.label}
                      <FiExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <Link
              href="/projects"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-outline-variant text-[13px] font-medium text-on-surface-variant hover:border-university-deep-blue hover:text-university-deep-blue"
            >
              <FiArrowLeft size={13} />
              All projects
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

function hasOutcome(project: ProjectType) {
  return Boolean(project.outcome?.aim || project.outcome?.context || project.outcome?.tasks || project.outcome?.success);
}
