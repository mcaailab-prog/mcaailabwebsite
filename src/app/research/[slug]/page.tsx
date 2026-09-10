import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import RichTextRenderer from '@/components/ui/RichTextRenderer';
import type { PublicationType, ProjectType, ResearchAreaType, TeamMemberType } from '@/lib/api-types';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const matchesResearchArea = (area: ResearchAreaType, slug: string) =>
  area.slug === slug || (area.title && slugify(area.title) === slug);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params as { slug: string };
  const researchAreas = await api.getResearchAreas();
  const researchArea = researchAreas.find((area) => matchesResearchArea(area, slug));

  if (!researchArea) {
    return {
      title: 'Research Area - MCAAI',
      description: 'Discover research areas at MCAAI.',
    };
  }

  return {
    title: `${researchArea.title} - MCAAI Research`,
    description: researchArea.summary,
  };
}

export default async function ResearchAreaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params as { slug: string };

  const [researchAreas, allProjects, allPublications] = await Promise.all([
    api.getResearchAreas(),
    api.getProjects(),
    api.getPublications(),
  ]);

  const researchArea = researchAreas.find((area) => matchesResearchArea(area, slug));

  if (!researchArea) {
    notFound();
  }

  const relatedProjects = allProjects.filter((project) =>
    project.research_areas?.some(
      (area) =>
        area.id === researchArea.id ||
        area.slug === researchArea.slug ||
        slugify(area.title) === slug
    )
  );

  const relatedTeamMembers = relatedProjects
    .flatMap((project) => project.team_members ?? [])
    .reduce<TeamMemberType[]>((members, member) => {
      if (!members.some((existing) => existing.id === member.id || existing.slug === member.slug)) {
        members.push(member);
      }
      return members;
    }, []);

  const relatedPublications = allPublications.filter((publication) =>
    publication.research_areas?.some(
      (area) =>
        area.id === researchArea.id ||
        area.slug === researchArea.slug ||
        slugify(area.title) === slug
    )
  );

  return (
    <div className="w-full">
      {/* Back to Research Link */}
      <div className="mb-8">
        <Link
          href="/research"
          className="inline-flex items-center text-[#65C1CF] hover:text-[darken(#65C1CF,10%)]"
        >
          ← Back to Research Areas
        </Link>
      </div>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#65C1CF]/10 rounded-full flex items-center justify-center text-[#65C1CF] shrink-0">
                {/* Category-based icon */}
                {researchArea.category === 'nlp_low_resource' && (
                  <span className="text-2xl">🗣️</span>
                )}
                {researchArea.category === 'disability_inclusion' && (
                  <span className="text-2xl">♿</span>
                )}
                {researchArea.category === 'data_governance' && (
                  <span className="text-2xl">📊</span>
                )}
                {researchArea.category === 'applied_ai' && (
                  <span className="text-2xl">⚙️</span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {researchArea.title}
                </h1>
                <p className="text-lg text-[#65C1CF]">
                  {researchArea.category
                    .replace('_', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Research Area Image */}
            <div className="relative">
              {researchArea.cover_image ? (
                <img
                  src={researchArea.cover_image}
                  alt={`${researchArea.title} cover`}
                  className="rounded-lg shadow-lg object-cover w-full h-[400px]"
                />
              ) : (
                <div className="w-full h-[400px] bg-[#65C1CF]/20 rounded-lg flex items-center justify-center">
                  <span className="text-5xl text-[#65C1CF]/50">🔬</span>
                </div>
              )}
            </div>

            {/* Research Area Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Summary
                  </h3>
                  <RichTextRenderer
                    content={researchArea.summary}
                    className="prose prose-lg text-gray-700"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Full Description
                  </h3>
                  <div className="prose prose-lg text-gray-700">
                    {/* Use RichTextRenderer for full_description content */}
                    <RichTextRenderer content={researchArea.full_description} className="prose prose-lg" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    researchArea.status === 'ongoing'
                      ? 'bg-green-100 text-green-800'
                      : researchArea.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {researchArea.status.charAt(0).toUpperCase() + researchArea.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#d9e7f6] bg-[#f5fbff] p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">Projects</p>
                <p className="text-3xl font-semibold text-slate-900">{relatedProjects.length}</p>
                <p className="mt-2 text-sm text-slate-600">Active research projects in this area</p>
              </div>
              <div className="rounded-3xl border border-[#e8f2e8] bg-[#f3fbf3] p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">Collaborators</p>
                <p className="text-3xl font-semibold text-slate-900">{relatedTeamMembers.length}</p>
                <p className="mt-2 text-sm text-slate-600">Researchers working on this area</p>
              </div>
              <div className="rounded-3xl border border-[#f3ebff] bg-[#f9f5ff] p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">Publications</p>
                <p className="text-3xl font-semibold text-slate-900">{relatedPublications.length}</p>
                <p className="mt-2 text-sm text-slate-600">Recent publications tagged to this area</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">Related Projects</h3>
              {relatedProjects.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {relatedProjects.map((project) => (
                    <div key={project.id} className="group rounded-3xl border border-[#d9e7f6] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-xs uppercase tracking-[0.25em] text-[#3e78b8]">{project.sector.replace(/_/g, ' ').toUpperCase()}</span>
                        <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">{project.status}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">{project.title}</h4>
                      <RichTextRenderer
                        content={project.description}
                        className="text-sm leading-6 text-slate-600 line-clamp-3 prose prose-sm"
                      />
                      <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]">
                        View project
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No related projects have been tagged yet.</p>
              )}
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">Research Collaborators</h3>
              {relatedTeamMembers.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedTeamMembers.map((member) => (
                    <div key={member.id} className="rounded-3xl border border-[#e8f2e8] bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-[#eef6ff] flex items-center justify-center text-2xl text-[#2563eb]">
                          {member.name.split(' ').map((n) => n[0]).join('')}</div>
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.title}</p>
                        </div>
                      </div>
                      <RichTextRenderer
                        content={member.research_interests ?? member.bio}
                        className="text-sm text-slate-600 line-clamp-3 prose prose-sm"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No collaborators have been linked yet.</p>
              )}
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">Recent Publications</h3>
              {relatedPublications.length > 0 ? (
                <div className="space-y-4">
                  {relatedPublications.map((publication) => (
                    <article key={publication.id} className="rounded-3xl border border-[#f3ebff] bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <p className="text-sm font-semibold text-[#6b21a8] uppercase tracking-[0.24em]">{publication.year}</p>
                        {publication.doi ? (
                          <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6b21a8] hover:text-[#4c1d95]">
                            DOI ↗
                          </a>
                        ) : null}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">{publication.title}</h4>
                      <RichTextRenderer
                        content={publication.abstract}
                        className="text-sm text-slate-600 mb-3 line-clamp-2 prose prose-sm"
                      />
                      <p className="text-sm text-slate-500">{publication.authors}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No related publications have been added yet.</p>
              )}
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}