import { Metadata } from 'next';
import { api } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { MdScience, MdFolderOpen, MdDescription, MdSchool, MdArrowForward, MdMail, MdCheckCircle, MdDataset, MdFormatQuote } from 'react-icons/md';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Research Work - MCAAI',
  description: 'Explore the research focus areas of the Maseno Centre for Applied Artificial Intelligence.',
};

export default async function ResearchPage() {
  const researchAreas = await api.getResearchAreas();

  const areaList = researchAreas.slice(0, 6);

  return (
    <div className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-on-surface">Research</span>
        </nav>

        <h1 className="mb-6 font-display-xl text-headline-lg text-primary md:text-display-xl">
          Research
        </h1>

        <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          MCAAI advances applied AI research across language access, disability inclusion, data governance,
          and ethical technologies that support African communities. Our work connects research, field
          implementation, partnerships, and open publication to create practical impact.
        </p>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-16 md:px-margin-desktop">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/research"
            className="rounded-2xl border border-outline-variant bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-full bg-primary/10 p-2 text-primary">
              <MdScience size={20} />
            </div>
            <h2 className="mb-3 font-headline-lg text-[22px] text-primary">Our research areas</h2>
            <p className="text-[14px] leading-6 text-on-surface-variant">
              Explore MCAAI’s research agenda across language access, disability inclusion, data
              governance, and applied AI innovation for African communities.
            </p>
          </Link>

          <Link
            href="/research/publications"
            className="rounded-2xl border border-outline-variant bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-full bg-primary/10 p-2 text-primary">
              <MdDescription size={20} />
            </div>
            <h2 className="mb-3 font-headline-lg text-[22px] text-primary">Publications</h2>
            <p className="text-[14px] leading-6 text-on-surface-variant">
              Read peer-reviewed papers, reports, and research outputs produced by MCAAI teams and
              partners across the African AI ecosystem.
            </p>
          </Link>

          <Link
            href="/research/collaborations"
            className="rounded-2xl border border-outline-variant bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-full bg-primary/10 p-2 text-primary">
              <MdSchool size={20} />
            </div>
            <h2 className="mb-3 font-headline-lg text-[22px] text-primary">Collaborations</h2>
            <p className="text-[14px] leading-6 text-on-surface-variant">
              Learn about the collaborative partnerships and coordination frameworks shaping inclusive,
              community-led AI innovation across Africa.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-16 md:px-margin-desktop">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">Research agenda</p>
            <h2 className="font-headline-lg text-[28px] text-primary md:text-[34px]">Focus areas</h2>
          </div>
          <span className="hidden text-[12px] text-on-surface-variant md:inline-block">
            {researchAreas.length} active areas
          </span>
        </div>

        <div className="space-y-4">
          {areaList.map((area) => (
            <div key={area.id} className="rounded-2xl border border-outline-variant bg-white p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-outline">
                    {area.category?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Research'}
                  </p>
                  <h3 className="font-headline-lg text-[20px] text-primary">{area.title}</h3>
                </div>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                    area.status === 'ongoing'
                      ? 'bg-secondary-container text-secondary'
                      : area.status === 'active'
                        ? 'bg-primary-container/10 text-primary'
                        : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {area.status ? area.status.charAt(0).toUpperCase() + area.status.slice(1) : 'Active'}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-[14px] leading-6 text-on-surface-variant md:text-[15px]">
                {area.summary}
              </p>
            </div>
          ))}

          {researchAreas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-10 text-center text-on-surface-variant">
              No research areas available yet.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-20 md:px-margin-desktop">
        <div className="rounded-3xl bg-primary p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr] md:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-fixed-dim">Why it matters</p>
              <h2 className="mb-4 font-headline-lg text-[28px] text-white md:text-[34px]">
                Research that supports real-world inclusion and public benefit
              </h2>
              <p className="max-w-2xl text-[15px] leading-7 text-white/80 md:text-[16px]">
                Our interdisciplinary work combines language technology, data governance, assistive AI,
                and policy engagement to ensure technology is not only innovative, but also accountable,
                equitable, and grounded in African realities.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
              {[
                { value: researchAreas.length || 0, label: 'research areas' },
                { value: '14+', label: 'active projects' },
                { value: '28+', label: 'publications' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-[28px] font-bold text-white">{stat.value}</div>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}