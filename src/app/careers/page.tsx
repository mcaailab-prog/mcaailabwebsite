import Link from 'next/link';
import { api } from '@/lib/api';
import CareerApplicationForm from '@/components/forms/CareerApplicationForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Careers - MCAAI',
  description: 'Explore opportunities to join MCAAI and help build applied AI for social and institutional impact.',
};

export default async function CareersPage() {
  const tracks = await api.getCareerTracks();

  return (
    <div className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-on-surface">Careers</span>
        </nav>

        <div className="max-w-4xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">
            Opportunities
          </p>
          <h1 className="mb-5 font-display-xl text-headline-lg text-university-deep-blue md:text-display-xl flex items-center gap-3">
            Careers
          </h1>
          <p className="text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
            We are building a multidisciplinary team of researchers, engineers, designers, and public-interest
            partners working at the intersection of AI, inclusion, and social impact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-20 md:px-margin-desktop">
        {tracks.length > 0 ? (
          <div className="mb-10 grid gap-6 lg:grid-cols-2">
            {tracks.map((track) => (
              <Link
                key={track.slug}
                href={`/careers/${track.slug}`}
                className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 hover:border-university-deep-blue"
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">
                  {track.is_accepting ? 'Open' : 'Track'}
                </p>
                <h2 className="mb-3 text-[24px] text-primary">{track.name}</h2>
                <p className="text-[14px] leading-7 text-on-surface-variant">{track.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Role type</p>
              <h2 className="mb-3 text-[24px] text-primary">Research</h2>
              <p className="text-[14px] leading-7 text-on-surface-variant">
                Support applied AI research, field studies, and evidence generation across language, data, and inclusion.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Role type</p>
              <h2 className="mb-3 text-[24px] text-primary">Engineering</h2>
              <p className="text-[14px] leading-7 text-on-surface-variant">
                Build responsible tools, product prototypes, and robust systems that support public-interest technology.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Role type</p>
              <h2 className="mb-3 text-[24px] text-primary">Partnerships</h2>
              <p className="text-[14px] leading-7 text-on-surface-variant">
                Work with institutions, communities, and collaborators to shape inclusive AI programs and initiatives.
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 md:p-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Join us</p>
          <h2 className="mb-4 text-[28px] text-primary">We are growing.</h2>
          <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[16px]">
            We welcome applicants with interest in AI for development, responsible technology, research operations,
            and social impact implementation. If you are passionate about building practical, inclusive, and accountable AI,
            we would love to hear from you.
          </p>
          <CareerApplicationForm />
        </div>
      </section>
    </div>
  );
}
