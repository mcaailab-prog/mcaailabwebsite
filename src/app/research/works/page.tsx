import Link from 'next/link';
import { MdArrowForward, MdScience } from 'react-icons/md';

const researchWorkProjects = [
  {
    slug: 'acts-project-kenya-ai-driven-agricultural-advisory-platform',
    title: 'ACTS Project: Kenya AI-Driven Agricultural Advisory Platform',
    shortTitle: 'ACTS Project',
    subtitle: 'AI for climate resilience and farmer advisory systems',
    status: 'Ongoing',
    startDate: '2024',
    focus: ['Agriculture', 'Speech Technology', 'Machine Translation', 'Data Collection'],
    theme: { primary: '#123a6b', secondary: '#2d7d66' },
  },
  {
    slug: 'ai4d-hub-for-ai-and-disability-inclusion',
    title: 'AI4D Hub for AI and Disability Inclusion',
    shortTitle: 'AI4D Hub',
    subtitle: 'Africa-wide coordination for disability-inclusive AI',
    status: 'Active',
    startDate: '2026',
    focus: ['Disability Inclusion', 'Responsible AI', 'Data Governance', 'Innovation Ecosystems'],
    theme: { primary: '#0d3b66', secondary: '#2a9d8f' },
  },
  {
    slug: 'mozilla-common-voice-alternative-language-data-licenses',
    title: 'Mozilla Common Voice funded Project: Piloting Alternative Language Data Licenses',
    shortTitle: 'Common Voice Licensing',
    subtitle: 'Community-centered licensing for African language datasets',
    status: 'Completed',
    startDate: '2025',
    focus: ['Data Governance', 'Language Data', 'Open Data Licensing', 'Community Consent'],
    theme: { primary: '#1e3a5f', secondary: '#3c6e71' },
  },
  {
    slug: 'african-next-voices-pilot-data-collection-in-kenya',
    title: 'African Next Voices: Pilot Data Collection in Kenya',
    shortTitle: 'African Next Voices',
    subtitle: 'Speech and text collection for grassroots language inclusion',
    status: 'Completed',
    startDate: '2024',
    focus: ['Data Collection', 'Speech Data', 'Low-resource Languages', 'Community Participation'],
    theme: { primary: '#3f4b8b', secondary: '#10989a' },
  },
  {
    slug: 'ai4ksl-bridging-language-barrier-using-ai-for-kenyan-sign-language',
    title: 'AI4KSL: Bridging Language Barrier using Artificial Intelligence for Kenyan Sign Language among Deaf Learners',
    shortTitle: 'AI4KSL',
    subtitle: 'AI-powered sign language translation for inclusive education',
    status: 'Ongoing',
    startDate: '2023',
    focus: ['Disability Inclusion', 'Computer Vision', 'Sign Language', 'Education'],
    theme: { primary: '#1d4d4f', secondary: '#2d6a4f' },
  },
  {
    slug: 'kenyan-languages-corpus-for-nlp-and-machine-translation',
    title: 'Kenyan Languages Corpus for Natural Language Processing and Machine Translation',
    shortTitle: 'UNESCO TWAS-BMBF Corpus',
    subtitle: 'Seed grant for low-resource language technology',
    status: 'Completed',
    startDate: '2023',
    focus: ['Machine Translation', 'NLP', 'Corpus Linguistics', 'Low-resource Languages'],
    theme: { primary: '#213e66', secondary: '#22808e' },
  },
  {
    slug: 'kencorpus-kenyan-language-corpus-for-nlp-and-machine-learning',
    title: 'KenCorpus: Kenyan Language Corpus for NLP and Machine Learning',
    shortTitle: 'KenCorpus',
    subtitle: 'Text and speech resources for Swahili, Dholuo and Luhya',
    status: 'Completed',
    startDate: '2021',
    focus: ['NLP', 'Speech Data', 'Machine Learning', 'Low-resource Languages'],
    theme: { primary: '#1f5472', secondary: '#0d9488' },
  },
  {
    slug: 'building-nlp-text-and-speech-datasets-for-low-resourced-languages-in-east-africa',
    title: 'Building NLP Text and Speech Datasets for Low Resourced Languages in East Africa',
    shortTitle: 'East Africa Dataset Initiative',
    subtitle: 'Collaborative text and speech resource development',
    status: 'Completed',
    startDate: '2021',
    focus: ['Speech Data', 'Text Data', 'East Africa', 'Collaborative AI'],
    theme: { primary: '#094067', secondary: '#2c6e86' },
  }
];

export const metadata = {
  title: 'Our research works - MCAAI',
  description: 'Explore the flagship research projects and applied AI programmes driving MCAAI’s work for language access, inclusion and data justice.',
};

export default function ResearchWorksPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/research" className="transition-colors hover:text-primary">Research</Link>
          <span>/</span>
          <span className="text-on-surface">Our research works</span>
        </nav>

        <div className="mb-6 flex items-center gap-3 text-primary">
          <div className="inline-flex rounded-full bg-primary/10 p-3">
            <MdScience size={22} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Flagship projects</span>
        </div>

        <h1 className="mb-5 font-display-xl text-headline-lg text-primary md:text-display-xl">
          Our research works
        </h1>

        <p className="max-w-4xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          MCAAI’s research portfolio brings together language technologies, disability inclusion,
          data governance and community-led AI systems. These eight projects represent the core
          programmes driving our work across research, implementation and responsible innovation.
        </p>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile pb-20 md:px-margin-desktop">
        <div className="grid gap-6 xl:grid-cols-2">
          {researchWorkProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/research/works/${project.slug}`}
              className="group overflow-hidden rounded-3xl border border-outline-variant bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="min-h-[120px] p-6"
                style={{
                  background: `linear-gradient(135deg, ${project.theme.primary} 0%, ${project.theme.secondary} 100%)`,
                }}
              >
                <div className="flex items-center justify-between gap-4 text-white">
                  <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {project.status}
                  </span>
                  <span className="text-[11px] font-medium text-white/80">{project.startDate}</span>
                </div>

                <div className="mt-6 max-w-lg">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                    {project.shortTitle}
                  </p>
                  <h2 className="font-headline-lg text-[22px] leading-tight text-white md:text-[26px]">
                    {project.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <p className="text-[14px] leading-6 text-on-surface-variant md:text-[15px]">
                  {project.subtitle}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.focus.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1 text-[11px] font-medium text-on-surface-variant"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-outline-variant pt-4">
                  <span className="text-[13px] font-semibold text-primary">View project</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:translate-x-1">
                    <MdArrowForward size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
