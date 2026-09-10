import Link from 'next/link';
import { MdArrowForward, MdFolderOpen } from 'react-icons/md';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects - MCAAI',
  description: 'A landing page for the eight flagship MCAAI project portfolios spanning language technology, inclusion, and AI for social impact.',
};

export default async function ProjectsPage() {
  const projects = await api.getProjects();

  return (
    <div className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/research" className="transition-colors hover:text-primary">Research</Link>
          <span>/</span>
          <span className="text-on-surface">Projects</span>
        </nav>
        <h1 className="mb-6 font-display-xl text-headline-lg text-primary md:text-display-xl flex items-center gap-3">
          <MdFolderOpen /> Projects
        </h1>

        <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          MCAAI’s project registry brings together our flagship programmes in language access, disability inclusion, inclusive AI governance, and applied machine learning for African communities and institutions.
        </p>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-24 md:px-margin-desktop">
        <div className="mb-2 flex items-baseline justify-between border-b border-outline-variant pb-4">
          <p className="text-[13px] text-on-surface-variant">
            {projects.length} projects
          </p>
        </div>

        <div>
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative -ml-6 flex flex-col gap-5 border-t border-outline-variant py-8 pl-6 transition-colors duration-300 last:border-b hover:bg-university-deep-blue/[0.04] md:flex-row md:items-center md:gap-8 md:py-9"
            >
              <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-university-deep-blue transition-transform duration-300 group-hover:scale-y-100" />

              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-surface-container md:h-24 md:w-32">
                {project.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.cover_image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.14em] text-outline-variant">
                    Image
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded bg-text-rich-black/60 px-2 py-1 text-[11px] leading-none text-on-primary backdrop-blur-sm">
                  {project.status}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="font-headline-lg text-[22px] leading-snug text-on-surface transition-colors duration-300 group-hover:text-university-deep-blue md:text-[25px]">
                  {project.title}
                </h2>
                <p className="mt-2 max-w-2xl text-[14px] leading-7 text-on-surface-variant md:text-[15px]">
                  {project.subtitle}
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-university-deep-blue md:w-36 md:justify-end">
                View project
                <MdArrowForward
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}

          {projects.length === 0 ? (
            <p className="py-16 text-center text-on-surface-variant">No projects published yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
