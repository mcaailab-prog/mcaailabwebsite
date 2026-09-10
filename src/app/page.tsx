import Link from 'next/link';
import { FiMic, FiVideo, FiGlobe } from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa';
import { Icon } from '@/lib/icons';
import { api } from '@/lib/api';
import { serialize } from '@/lib/serialize';
import {MdDescription,MdCheckCircle,MdArrowForward, MdDataset, MdFormatQuote} from 'react-icons/md';

import HeroSection from '@/components/sections/Herosection';
import ThreePillars from '@/components/sections/ThreePillars';
import PartnershipsSection from '@/components/sections/PartnershipsSection';
import PartnerWithUsSection from '@/components/sections/PartnerWithUsSection';
import DatasetRequestModalTrigger from '@/components/sections/DatasetRequestModalTrigger';
import NewsEventsSection from '@/components/sections/NewsEventsSection';
import TeamSnapshotSection from '@/components/sections/TeamSnapshotSection';
import type { QuarterlyReportType } from '@/lib/api-types';

export default async function Home() {
  const [partners, posts, members, reports] = await Promise.allSettled([
    api.getPartners(),
    api.getPosts(),
    api.getTeamMembers(),
    api.getQuarterlyReports(),
  ]);

  // serialize() strips Buffer/Uint8Array/ObjectId fields so data is safe
  // to pass from this Server Component into any Client Component as props
  const partnersData = serialize(partners.status === 'fulfilled' ? partners.value : []);
  const postsData    = serialize(posts.status    === 'fulfilled' ? posts.value    : []);
  const reportsData  = serialize(reports.status   === 'fulfilled' ? reports.value   : []);
        
  const teamMembers = await api.getTeamMembers();
  const plainMembers = JSON.parse(JSON.stringify(teamMembers));

  return (
    <div className="w-full overflow-x-hidden bg-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <HeroSection />
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section className="bg-university-deep-blue py-8 relative">
        <div className="max-w-container-max mx-auto px-2 md:px-margin-desktop">
          <div className="overflow-x-auto flex flex-row items-center justify-center gap-3 flex-nowrap md:justify-between">

            <div className="flex items-center gap-1">
              <span className="flex items-center justify-center h-10 w-10 text-mcaai-green shrink-0">
                <FiMic className="text-[32px]" />
              </span>
              <div className="flex flex-col">
                <span className="text-university-gold text-sm sm:text-base font-bold leading-none md:text-2xl">3,000+</span>
                <span className="text-white/80 font-label-sm text-[10px] uppercase tracking-wider mt-1">
                  Hours of speech data
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="flex items-center justify-center h-10 w-10 text-mcaai-green shrink-0">
                <FiVideo className="text-[32px]" />
              </span>
              <div className="flex flex-col">
                <span className="text-university-gold text-sm sm:text-base font-bold leading-none md:text-2xl">20,000+</span>
                <span className="text-white/80 font-label-sm text-[10px] uppercase tracking-wider mt-1">
                  Sign language videos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="flex items-center justify-center h-10 w-10 text-mcaai-green shrink-0">
                <FiGlobe className="text-[32px]" />
              </span>
              <div className="flex flex-col">
                <span className="text-university-gold text-sm sm:text-base font-bold leading-none md:text-2xl">7+</span>
                <span className="text-white/80 font-label-sm text-[10px] uppercase tracking-wider mt-1">
                  Local Language corpus
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────────── */}
      <section>
        <ThreePillars />
      </section>

      {/* ── RESEARCH FOCUS AREAS ──────────────────────────────────── */}
      <section id="research" className="py-0 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-4">
            <h2 className="font-headline-lg text-[28px] leading-[34px] font-normal text-university-deep-blue mb-6">
              Research Focus Areas — Advancing the Frontiers of Applied AI
            </h2>
          </div>
          <div className="md:col-start-6 md:col-span-7">
            <p className="font-body-lg text-body-lg text-[#000A1F] max-w-2xl">
              At MCAAI, we bridge academia, industry, and community needs to
              solve real-world challenges. Our innovations span healthcare, agriculture,
              education, and disability inclusion. Explore the work driving technological
              leadership and real change across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* ── AI4KSL TEASER ─────────────────────────────────────────── */}
      <section className="py-10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="bg-university-deep-blue rounded-2xl overflow-hidden shadow-2xl relative flex flex-col lg:flex-row items-stretch">

            <div className="lg:w-1/2 p-8 lg:p-20 relative z-10 flex flex-col justify-center">
              <div className="font-label-sm text-label-sm text-university-gold mb-6 uppercase tracking-widest font-bold">
                Innovation Spotlight
              </div>
              <h2 className="font-headline-lg text-headline-lg text-white mb-6">
                AI4KSL
              </h2>
              <p className="font-body-lg text-body-lg text-white/80 mb-8 leading-relaxed">
                Our AI4KSL initiative builds an AI-powered avatar system translating spoken
                English into Kenyan Sign Language using twenty thousand videos to enhance
                inclusive education and workplace accessibility.
              </p>
              <div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-mcaai-green text-white px-8 py-4 rounded-lg font-body-md font-bold hover:bg-mcaai-green/90 transition-all"
                >
                  Learn About AI4KSL
                  <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative min-h-[400px] bg-mcaai-teal/20 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/daecietav/image/upload/v1753200174/research_dgtrss.jpg"
                alt="AI4KSL initiative"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── NEWS & EVENTS ─────────────────────────────────────────── */}
      <section id="news">
        <NewsEventsSection posts={postsData} />
      </section>


            {/* ── Publications CTA Banner ───────────────────────────────────────── */}
            <section className="py-8 px-6 md:px-12 max-w-[1280px] mx-auto">
              <div className="relative overflow-hidden rounded-2xl bg-[#003399] text-white p-6 md:p-16">
                {/* Background decorative icon */}
                <div className="absolute right-8 top-8 opacity-10">
                  <MdDescription className="text-[120px]" />
                </div>
      
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8">
                    <span className="bg-[#FDB813] text-[#003399] px-3 py-1 font-montserrat text-[10px] font-bold rounded mb-6 inline-block uppercase tracking-widest">
                      Open Access
                    </span>
                    <h2 className="font-montserrat text-[32px] leading-[38px] font-semibold text-white mb-4">
                      Browse Our Publications
                    </h2>
                    <p className="text-[#7fd3e2] text-[18px] leading-[28px] max-w-xl mb-8">
                      Access peer-reviewed papers, datasets, and technical reports from our
                      research teams. All MCAAI publications are available open-access to
                      support the global research community.
                    </p>
                    <ul className="space-y-3 mb-10">
                      {[
                        'Peer-reviewed journal articles & conference papers',
                        'Open datasets for African language NLP',
                        'Technical reports & policy briefs',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <MdCheckCircle className="text-[#FDB813]" />
                          <span className="text-[16px] leading-[24px]">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="/research/publications"
                        className="inline-flex items-center gap-2 bg-white text-[#003399] px-8 py-4 rounded-lg font-montserrat font-bold hover:bg-[#72C6D5] hover:text-white transition-all duration-200"
                      >
                        View All Publications
                        <MdArrowForward />
                      </a>
                      <DatasetRequestModalTrigger />
                    </div>
                  </div>
      
                  {/* Stats column */}
                  <div className="md:col-span-4 grid grid-cols-2 gap-4">
                    {[
                      { value: '28+', label: 'Publications', icon: 'description' },
                      { value: '6', label: 'Open Datasets', icon: 'database' },
                      { value: '400+', label: 'Citations', icon: 'format_quote' },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white/10 rounded-xl p-5 flex items-center gap-4 border border-white/20"
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-[#72C6D5]/10 rounded-xl">
                          {s.icon === 'description' ? (
                            <MdDescription className="text-[#72C6D5] text-[24px]" />
                          ) : s.icon === 'database' ? (
                            <MdDataset className="text-[#72C6D5] text-[24px]" />
                          ) : (
                            <MdFormatQuote className="text-[#72C6D5] text-[24px]" />
                          )}
                        </div>
                        <div>
                          <p className="font-montserrat text-[20px] font-bold text-white leading-none">
                            {s.value}
                          </p>
                          <p className="text-[12px] text-[#7fd3e2] font-medium tracking-wide mt-1">
                            {s.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>


      {/* ── TEAM SNAPSHOT ─────────────────────────────────────────── */}
      <section id="team">
       <TeamSnapshotSection members={plainMembers} />
      </section>

      {/* ── PARTNER WITH US + FORM ────────────────────────────────── */}
      <PartnerWithUsSection />

      {/* ── PARTNERSHIPS ──────────────────────────────────────────── */}
      <section>
        <PartnershipsSection partners={partnersData} />
      </section>

    </div>
  );
}