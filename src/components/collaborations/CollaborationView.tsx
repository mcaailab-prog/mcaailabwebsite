import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import type { CollaborationType } from '@/lib/api';

export default function CollaborationView({ collaboration }: { collaboration: CollaborationType }) {
  const paragraphs = (collaboration.contribution_body || '').split('\n\n').filter(Boolean);

  return (
    <div className="w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/research" className="transition-colors hover:text-primary">Research</Link>
          <span>/</span>
          <Link href="/research/collaborations" className="transition-colors hover:text-primary">Collaborations</Link>
          <span>/</span>
          <span className="text-on-surface">{collaboration.partner || collaboration.title}</span>
        </nav>

        <h1 className="mb-6 font-display-xl text-headline-lg text-primary md:text-display-xl">
          {collaboration.title}
        </h1>
        <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          {collaboration.summary}
        </p>
      </section>

      <section className="border-b border-outline-variant/30 bg-surface-container-lowest py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">
            <div>
              <span className="mb-4 block font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-mcaai-green">
                {collaboration.partner || 'Collaboration'}
              </span>
              <p className="max-w-xl text-[15px] leading-relaxed text-on-surface-variant">
                {collaboration.body}
              </p>
            </div>
            {collaboration.cover_image ? (
              <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={collaboration.cover_image} alt={collaboration.title} className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {(collaboration.objectives || []).length > 0 ? (
        <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
          <div className="mb-12">
            <span className="mb-3 block font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-mcaai-teal">
              Strategic Framework
            </span>
            <h2 className="font-montserrat font-bold text-primary" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', lineHeight: 1.15 }}>
              Objectives
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {collaboration.objectives?.map((obj) => (
              <div
                key={obj.n + obj.title}
                className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-7"
                style={{ borderLeft: `3px solid var(--color-${obj.accent || 'primary'})` }}
              >
                <span className="mb-4 block font-montserrat text-[11px] font-bold uppercase tracking-widest" style={{ color: `var(--color-${obj.accent || 'primary'})` }}>
                  {obj.n}
                </span>
                <h3 className="mb-3 font-montserrat text-[17px] font-bold leading-snug text-primary">{obj.title}</h3>
                <p className="text-[14px] leading-relaxed text-on-surface-variant">{obj.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(collaboration.contribution_heading || collaboration.contribution_body) ? (
        <section className="bg-surface-container-low py-16 sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="grid lg:grid-cols-[1fr_440px] gap-12 items-center">
              <div>
                <span className="mb-3 block font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-mcaai-teal">
                  MCAAI&apos;s Contribution
                </span>
                <h2 className="mb-5 font-montserrat font-bold text-primary" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', lineHeight: 1.15 }}>
                  {collaboration.contribution_heading}
                </h2>
                {paragraphs.map((text) => (
                  <p key={text.slice(0, 24)} className="mb-6 max-w-lg text-[15px] leading-relaxed text-on-surface-variant">
                    {text}
                  </p>
                ))}
                <div className="mt-8 flex flex-wrap gap-3">
                  {collaboration.related_project_slug ? (
                    <Link
                      href={`/projects/${collaboration.related_project_slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-montserrat text-[13px] font-bold text-white"
                    >
                      Related project <FiArrowRight size={13} />
                    </Link>
                  ) : null}
                  {(collaboration.links || []).map((link) => {
                    const external = /^https?:\/\//i.test(link.href);
                    const className = 'inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-surface-container-lowest px-5 py-2.5 font-montserrat text-[13px] font-bold text-primary';
                    return external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {link.label} <FiArrowUpRight size={13} />
                      </a>
                    ) : (
                      <Link key={link.href} href={link.href} className={className}>
                        {link.label} <FiArrowUpRight size={13} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {collaboration.stat_value ? (
                <div
                  className="relative overflow-hidden rounded-2xl p-8"
                  style={{ background: 'linear-gradient(135deg, var(--color-university-deep-blue) 0%, var(--color-primary) 100%)' }}
                >
                  <p className="mb-1 font-montserrat font-bold text-university-gold" style={{ fontSize: 'clamp(48px, 8vw, 72px)', lineHeight: 1 }}>
                    {collaboration.stat_value}
                  </p>
                  <p className="font-montserrat font-bold text-white text-[16px] mb-3">{collaboration.stat_label}</p>
                  <p className="text-white/55 text-[13px] leading-relaxed">{collaboration.stat_description}</p>
                  {(collaboration.evidence_items || []).length > 0 ? (
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      {collaboration.evidence_items?.map((item) => (
                        <div key={item} className="flex items-start gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#86C440' }} />
                          <span className="text-[13px] text-white/60">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {(collaboration.cta_heading || collaboration.cta_body) ? (
        <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
          <div
            className="rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ background: 'linear-gradient(135deg, #002266 0%, #003399 60%, #005580 100%)' }}
          >
            <div className="max-w-lg">
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-[#86C440] mb-3">Get Involved</p>
              <h3 className="font-montserrat font-bold text-white mb-3" style={{ fontSize: 'clamp(20px, 3vw, 32px)', lineHeight: 1.15 }}>
                {collaboration.cta_heading}
              </h3>
              <p className="text-white/60 text-[14px] leading-relaxed">{collaboration.cta_body}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-mcaai-green px-6 py-3.5 font-montserrat text-[14px] font-bold text-white"
            >
              Get in Touch <FiArrowRight size={14} />
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
