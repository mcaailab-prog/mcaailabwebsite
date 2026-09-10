import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import CollaborationView from '@/components/collaborations/CollaborationView';
import { MdArrowForward } from 'react-icons/md';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Collaborations — MCAAI',
  description: 'Collaborative partnerships shaping inclusive, community-led AI innovation across Africa.',
};

export default async function CollaborationsPage() {
  const collaborations = await api.getCollaborations();

  if (collaborations.length === 1) {
    return <CollaborationView collaboration={collaborations[0]} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/research" className="transition-colors hover:text-primary">Research</Link>
          <span>/</span>
          <span className="text-on-surface">Collaborations</span>
        </nav>
        <h1 className="mb-6 font-display-xl text-headline-lg text-primary md:text-display-xl">Collaborations</h1>
        <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          Learn about the collaborative partnerships and coordination frameworks shaping inclusive, community-led AI innovation across Africa.
        </p>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-24 md:px-margin-desktop">
        {collaborations.map((item) => (
          <Link
            key={item.slug}
            href={`/research/collaborations/${item.slug}`}
            className="group relative -ml-6 flex flex-col gap-3 border-t border-outline-variant py-8 pl-6 last:border-b hover:bg-university-deep-blue/[0.04]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-outline">{item.partner}</p>
            <h2 className="font-headline-lg text-[22px] text-on-surface group-hover:text-university-deep-blue">{item.title}</h2>
            <p className="max-w-2xl text-[14px] leading-7 text-on-surface-variant">{item.summary}</p>
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-university-deep-blue">
              View collaboration <MdArrowForward size={14} />
            </span>
          </Link>
        ))}
        {collaborations.length === 0 ? (
          <p className="py-16 text-center text-on-surface-variant">No collaborations published yet.</p>
        ) : null}
      </section>
    </div>
  );
}
