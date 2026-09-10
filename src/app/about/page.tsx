import { Metadata } from 'next';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'About — MCAAI',
  description:
    'Learn about the Maseno Centre for Applied Artificial Intelligence — our history, mission, and research impact across East Africa.',
};

// ── helpers ──────────────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

const CATEGORY_STYLES: Record<string, { pill: string; label: string }> = {
  news:  { pill: 'bg-[#003399]/10 text-[#003399]',  label: 'News'  },
  event: { pill: 'bg-[#72C6D5]/15 text-[#006875]',  label: 'Event' },
  award: { pill: 'bg-[#FDB813]/15 text-[#8a6200]',  label: 'Award' },
};

// ── objectives ───────────────────────────────────────────────────────────────
const OBJECTIVES = [
  {
    number: '01',
    title: 'Build African language technology',
    body: 'Develop speech, text, and multimodal datasets for underrepresented African languages — starting with the communities of Western Kenya — and release them under open, community-controlled licences.',
  },
  {
    number: '02',
    title: 'Advance disability inclusion',
    body: 'Create AI-powered tools for Kenyan Sign Language (KSL) recognition and interpretation, ensuring deaf and hard-of-hearing communities are not left behind by the AI revolution.',
  },
  {
    number: '03',
    title: 'Champion data sovereignty',
    body: 'Establish and demonstrate frameworks for community-controlled data governance, so that the people who generate data retain meaningful rights over how it is used and who benefits.',
  },
  {
    number: '04',
    title: 'Grow local research capacity',
    body: 'Train the next generation of African AI practitioners through mentorship, workshops, and events like IndabaX Kenya — building a self-sustaining research ecosystem in East Africa.',
  },
  {
    number: '05',
    title: 'Forge ethical partnerships',
    body: 'Collaborate with universities, civil society, and industry partners who share our commitment to AI that is accountable, transparent, and genuinely beneficial to the communities it touches.',
  },
];


// ── page ─────────────────────────────────────────────────────────────────────
export default async function AboutPage() {
  const posts = await api.getPosts({ category: 'news' });
  const latestNews = posts.slice(0, 3);

  return (
    <div className="w-full ">

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex">
        <img
          src="/about.jpg"
          alt="MCAAI team at Maseno University"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,22,80,0.97) 0%, rgba(0,22,80,0.72) 45%, rgba(0,22,80,0.22) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,34,102,0.55) 0%, transparent 65%)',
          }}
        />

        {/* Node graph decoration */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-[45%] opacity-[0.13] hidden md:block"
          viewBox="0 0 400 400"
          fill="none"
        >
          <g stroke="#72C6D5" strokeWidth="1">
            <line x1="60"  y1="80"  x2="180" y2="60"  />
            <line x1="180" y1="60"  x2="310" y2="120" />
            <line x1="180" y1="60"  x2="150" y2="200" />
            <line x1="310" y1="120" x2="370" y2="80"  />
            <line x1="310" y1="120" x2="340" y2="250" />
            <line x1="150" y1="200" x2="80"  y2="300" />
            <line x1="150" y1="200" x2="260" y2="310" />
            <line x1="260" y1="310" x2="340" y2="250" />
            <line x1="60"  y1="80"  x2="80"  y2="300" />
            <line x1="370" y1="80"  x2="340" y2="250" />
          </g>
          <g fill="#72C6D5">
            <circle cx="60"  cy="80"  r="4" />
            <circle cx="180" cy="60"  r="7" />
            <circle cx="310" cy="120" r="5" />
            <circle cx="370" cy="80"  r="4" />
            <circle cx="150" cy="200" r="5" />
            <circle cx="80"  cy="300" r="4" />
            <circle cx="260" cy="310" r="5" />
            <circle cx="340" cy="250" r="4" />
          </g>
        </svg>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 pb-16 pt-36">
          <h1
            className="font-montserrat font-bold text-white mb-5"
            style={{ fontSize: 'clamp(34px, 6vw, 68px)', lineHeight: 1.05, letterSpacing: '-0.025em', maxWidth: '720px' }}
          >
            About{' '}
            <span style={{ color: '#72C6D5' }}>MCAAI</span>
          </h1>
          <p
            className="text-white/70 mb-9 max-w-[540px]"
            style={{ fontSize: 'clamp(15px, 2vw, 19px)', lineHeight: 1.75 }}
          >
            MCAAI is an interdisciplinary research centre at Maseno University dedicated to
            language technology, disability inclusion, data sovereignty, and applied AI —
            built by and for the communities it serves.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-montserrat font-bold text-[14px] text-[#003399] transition-all hover:opacity-90"
              style={{ background: '#FDB813' }}
            >
              Our Research <FiArrowRight size={15} />
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-montserrat font-bold text-[14px] text-white transition-all hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
         
           

            <div>
              <h2
                className="font-montserrat font-bold text-university-deep-blue mb-6 text-headline-lg"
              >
                Who We Are
              </h2>
              <div className="space-y-4 text-[15px] text-[#3e484b] leading-relaxed">
                <p>
                  The Maseno Centre for Applied Artificial Intelligence (MCAAI) is an
                  interdisciplinary research centre housed at Maseno University in Kisumu County,
                  Kenya. We bring together linguists, computer scientists, disability advocates,
                  and community organisers under one roof united by the belief that AI must
                  be built <em>with</em> communities, not merely <em>for</em> them.
                </p>
                <p>
                  Founded in 2023 by Dr. Lilian Wanzare, MCAAI emerged from a clear gap: while
                  global AI capabilities were advancing rapidly, the languages, contexts, and
                  lived realities of East African communities remained largely absent from the
                  datasets and models shaping the technology. We set out to change that.
                </p>
                <p>
                  Today, MCAAI is recognised across the continent as a pioneer in
                  community-controlled AI data governance stewarding corpora in Dholuo,
                  Swahili, Kenyan Sign Language, and other regional languages while ensuring the
                  communities that power our data share meaningfully in its benefits.
                </p>
              </div>
            </div>
          </div>
       
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHAT WE DO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pt-0 sm:py-12 bg-white px-margin-mobile md:px-margin-desktop" >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
          

            <div>

              <h2
                className="font-montserrat font-bold text-university-deep-blue text-headline-lg mb-6">
               
                what We Do
              </h2>
              <div className="space-y-4 text-[15px] text-[#3e484b] leading-relaxed">
                <p>
                  Our work spans the full pipeline from raw data collection to deployed
                  applications. Through programmes like <strong className="font-semibold text-[#003399]">African Next Voices</strong>, we
                  organise community recording sessions that gather thousands of hours of
                  speech in languages that global tech companies routinely overlook. These
                  corpora are then used to train speech recognition, text-to-speech, and
                  natural language understanding systems tailored to African contexts.
                </p>
                <p>
                  In parallel, our <strong className="font-semibold text-[#003399]">KSL AI project</strong> — co-funded by Data Science
                  Africa — is building the first large-scale dataset and recognition model for
                  Kenyan Sign Language, creating a foundation for real-time interpretation
                  tools that can transform access to education, healthcare, and public services
                  for the deaf community.
                </p>
                <p>
                  We also convene the research community. As host of{' '}
                  <strong className="font-semibold text-[#003399]">IndabaX Kenya</strong>, we create
                  space for practitioners across East Africa to share findings, forge
                  collaborations, and push the frontier of African AI research together.
                </p>
              </div>
            </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          OUR OBJECTIVES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">

          <div className="max-w-xl mb-14">
            
            <h2
              className="font-montserrat font-bold text-[#003399] mb-4"
              style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
             Our Objectives
            </h2>
            <p className="text-[15px] text-[#3e484b] leading-relaxed">
              Everything we do traces back to these commitments — to the communities we serve,
              the researchers we train, and the partners we choose.
            </p>
          </div>

          <div className="divide-y divide-[#e4eaf4]">
            {OBJECTIVES.map((obj) => (
              <div
                key={obj.number}
                className="group grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] gap-6 sm:gap-8 py-8 sm:py-10"
              >
                <div
                  className="font-montserrat font-bold text-[28px] sm:text-[36px] leading-none pt-1 transition-colors duration-200 group-hover:text-[#72C6D5] text-mcaai-green"
                  
                >
                  {obj.number}
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-[16px] sm:text-[18px] text-[#003399] mb-2 leading-snug">
                    {obj.title}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] text-[#3e484b] leading-relaxed max-w-2xl">
                    {obj.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* ══════════════════════════════════════════════════════════════════
          LATEST NEWS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="news-updates" className="bg-white py-20 sm:py-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-[#72C6D5] block mb-3">
                Stay Updated
              </span>
              <h2
                className="font-montserrat font-bold text-[#003399]"
                style={{ fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
              >
                Latest from MCAAI
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-montserrat font-semibold text-[13px] text-[#72C6D5] hover:text-[#003399] transition-colors shrink-0"
            >
              All news <FiArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((post, i) => {
              const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.award;
              const bodyText = post.body?.includes('<') ? stripHtml(post.body) : (post.body ?? '');
              const excerpt = bodyText.slice(0, 160).trimEnd();

              return (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-[#bec8cb]/40 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={i === 0 ? 'h-1.5 w-full' : 'h-1 w-full'}
                    style={{ background: i === 0 ? '#FDB813' : '#003399' }}
                  />

                  {post.cover_image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${cat.pill}`}>
                        {cat.label}
                      </span>
                      {post.published_date && (
                        <time
                          dateTime={new Date(post.published_date).toISOString()}
                          className="text-[11px] text-[#3e484b]/50 font-montserrat"
                        >
                          {new Date(post.published_date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </time>
                      )}
                    </div>

                    <h4 className="font-montserrat font-bold text-[15px] sm:text-[16px] text-[#003399] leading-snug mb-3 group-hover:text-[#006875] transition-colors">
                      {post.title}
                    </h4>

                    <p className="text-[13px] text-[#3e484b] leading-relaxed flex-grow line-clamp-3">
                      {excerpt}{bodyText.length > 160 ? '…' : ''}
                    </p>

                    <Link
                      href={`/news/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold font-montserrat text-[#72C6D5] hover:text-[#003399] transition-colors"
                    >
                      Read more <FiArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-montserrat font-bold text-[14px] text-white transition-all hover:opacity-90"
              style={{ background: '#003399' }}
            >
              View all news <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// ── Timeline card ─────────────────────────────────────────────────────────────
function TimelineCard({
  item,
  align = 'left',
  mobile = false,
}: {
  item: { year: string; title: string; body: string; accent: string; current: boolean };
  align?: 'left' | 'right';
  mobile?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow"
      style={{
        background: '#fff',
        border: '1px solid rgba(114,198,213,0.18)',
        borderLeft:  (align === 'left'  || mobile) ? `3px solid ${item.accent}` : undefined,
        borderRight: align === 'right' && !mobile   ? `3px solid ${item.accent}` : undefined,
        textAlign:   align === 'right' && !mobile   ? 'right' : 'left',
      }}
    >
      <span
        className="inline-block font-montserrat font-bold text-[11px] uppercase tracking-widest mb-3 px-2.5 py-1 rounded-full"
        style={{ background: `${item.accent}1a`, color: item.accent }}
      >
        {item.year}
      </span>

      <h3 className="font-montserrat font-bold text-[17px] text-[#003399] mb-2 leading-tight">
        {item.title}
      </h3>
      <p className="text-[13px] sm:text-[14px] text-[#3e484b] leading-relaxed">
        {item.body}
      </p>

      {item.current && (
        <span className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-bold uppercase tracking-widest text-[#FDB813]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDB813] inline-block animate-pulse" />
          Present day
        </span>
      )}
    </div>
  );
}