import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiUsers, FiAward, FiBookOpen, FiActivity } from 'react-icons/fi';

const researchWorkProjects: {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  status: string;
  startDate: string;
  endDate?: string | undefined;
  focus: string[];
  description: string;
  outcome?: string | { Aim?: string; Context?: string; Tasks?: string[] | string; Success?: string };
  lead: string;
  members: string[];
  funders: string[];
  links: { label: string; href: string }[];
  theme: { primary: string; secondary: string };
}[] = [
  {
    slug: 'acts-project-kenya-ai-driven-agricultural-advisory-platform',
    title: 'ACTS Project: Kenya AI-Driven Agricultural Advisory Platform',
    shortTitle: 'ACTS Project',
    subtitle: 'AI for climate resilience and farmer advisory systems',
    status: 'Ongoing',
    startDate: '2024',
    endDate: undefined,
    focus: ['Agriculture', 'Speech Technology', 'Machine Translation', 'Data Collection'],
    description:
      'The Kenya AI-Driven Agricultural Advisory Platform is a farmer-facing, multilingual digital advisory system designed to deliver practical agricultural guidance in locally understood languages. The project combines speech, translation, language identification and data pipeline work to support farmers with timely advice on pest control, agronomic practices, market information and climate-sensitive recommendations.',
    outcome: {
      Aim: 'Improve access to trusted agricultural information for farmers in Kenya by building multilingual AI systems that work in low-resource settings and support decision-making at the last mile.',
      Context: 'The project combines speech, translation, language identification and data pipeline work to deliver contextualised advisory to farmers in locally understood languages.',
      Tasks: [
        'Develop multilingual speech recognition models for local languages',
        'Integrate language identification and machine translation components',
        'Build a farmer-facing advisory pipeline with localised content',
        'Collect field feedback and iterate on model performance'
      ],
      Success: 'Deployed pilot advisory system with measurable uptake and improved information access in target communities.'
    },
    lead: 'Dr. Vivian Oloo',
    members: ['Dr. Vivian Oloo', 'Stanley Odiwour', 'Valary Otieno', 'Cynthia Amol', 'Nelson Odhiambo', 'Boniface Mwau', 'Biatus Maina', 'Hope Kerubo'],
    funders: ['Gates Foundation', 'Strathmore University', 'SAFIC initiative'],
    links: [
      { label: 'Project Profile', href: 'https://mcaai.maseno.ac.ke/' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/107030600/admin/dashboard/' }
    ],
    theme: { primary: '#123a6b', secondary: '#2d7d66' }
  },
  {
    slug: 'ai4d-hub-for-ai-and-disability-inclusion',
    title: 'AI4D Hub for AI and Disability Inclusion',
    shortTitle: 'AI4D Hub',
    subtitle: 'Africa-wide coordination for disability-inclusive AI',
    status: 'Active',
    startDate: '2026',
    endDate: '2028',
    focus: ['Disability Inclusion', 'Responsible AI', 'Data Governance', 'Innovation Ecosystems'],
    description:
      'The AI4D Hub for AI and Disability Inclusion is a continent-wide coordination platform that promotes disability-inclusive AI across the full AI lifecycle. It brings together researchers, innovators, policymakers, disability advocates and institutions to advance datasets, coordination, governance frameworks and inclusive AI ecosystems for persons with disabilities in Africa.',
    outcome:
      'The Hub intends to build a stronger, more ethical and inclusive AI ecosystem capable of improving outcomes for persons with disabilities while reducing bias, exclusion and data gaps in African technology systems.',
    lead: 'Dr. Lilian Wanzare',
    members: ['Dr. Lilian Wanzare', 'Jerry John Kponyo', 'Maseno University team', 'Kwame Nkrumah University of Science and Technology partners'],
    funders: ['IDRC', 'AI4D Funders Collaborative', 'FCDO', 'Sida', 'Community Jameel'],
    links: [
      { label: 'IDRC Project Page', href: 'https://idrc-crdi.ca/en/what-we-do/projects-we-support/project/ai4d-hub-ai-and-disability-inclusion' },
      { label: 'AI4D Project Page', href: 'https://www.ai4d.ai/projects/hub-for-ai-and-disability-inclusion' },
      { label: 'Project Website', href: 'https://haidiai4d.org/' }
    ],
    theme: { primary: '#0d3b66', secondary: '#2a9d8f' }
  },
  {
    slug: 'mozilla-common-voice-alternative-language-data-licenses',
    title: 'Mozilla Common Voice funded Project: Piloting Alternative Language Data Licenses',
    shortTitle: 'Common Voice Licensing',
    subtitle: 'Community-centered licensing for African language datasets',
    status: 'Completed',
    startDate: '2025',
    endDate: undefined,
    focus: ['Data Governance', 'Language Data', 'Open Data Licensing', 'Community Consent'],
    description:
      'This Mozilla Common Voice-supported project explored alternative language data licensing models that better reflect the realities of community ownership, consent and fair benefit sharing for African language data. It focused on practical pathways to make language data more ethically open while preserving community rights and accountability.',
    outcome:
      'The project produced actionable guidance and community-facing dialogue around more equitable data licensing approaches, advancing the conversation on open language data governance in Kenya and beyond.',
    lead: 'Dr. Gabriel Oliko',
    members: ['Dr. Gabriel Oliko', 'MCAAI research team', 'Community stakeholders', 'Mozilla Common Voice partners'],
    funders: ['Mozilla Foundation', 'Common Voice program'],
    links: [
      { label: 'Maseno University Update', href: 'https://www.maseno.ac.ke/common-voice-piloting-alternative-language-data-licenses-workshop-kenya-maseno-university' },
      { label: 'Mozilla Common Voice', href: 'https://www.mozillafoundation.org/en/common-voice/in-country-programmes/' },
      { label: 'Dhonam dataset', href: 'https://huggingface.co/Anv-ke' }
    ],
    theme: { primary: '#1e3a5f', secondary: '#3c6e71' }
  },
  {
    slug: 'african-next-voices-pilot-data-collection-in-kenya',
    title: 'African Next Voices: Pilot Data Collection in Kenya',
    shortTitle: 'African Next Voices',
    subtitle: 'Speech and text collection for grassroots language inclusion',
    status: 'Completed',
    startDate: '2024',
    endDate: '2025',
    focus: ['Data Collection', 'Speech Data', 'Low-resource Languages', 'Community Participation'],
    description:
      'African Next Voices focused on pilot data collection in Kenya to create language resources for underrepresented communities. The project centered on transcription, speech recording and community engagement in Dholuo and Kalenjin contexts, supporting the development of more representative and locally grounded AI systems.',
    outcome:
      'The project strengthened the evidence base for inclusive language data collection by creating pilot resources and practical workflows for community-driven AI data collection in Kenyan languages.',
    lead: 'Dr. Vivian Oloo',
    members: ['Dr. Vivian Oloo', 'Research associates', 'Community contributors', 'Digital Umuganda collaborators'],
    funders: ['Gates Foundation', 'African Next Voices partners'],
    links: [
      { label: 'Maseno workshop update', href: 'https://www.maseno.ac.ke/africa-next-voices-transcription-training-workshop-dholuo-and-kalenjin-communities-held-kisumu' },
      { label: 'TRT Afrika article', href: 'https://www.trtafrika.com/english/article/359e1362af39' },
      { label: 'Hugging Face', href: 'https://huggingface.co/Anv-ke' },
      { label: 'Hackathon with Digital Umuganda', href: 'https://mcaai.maseno.ac.ke/' }
    ],
    theme: { primary: '#3f4b8b', secondary: '#10989a' }
  },
  {
    slug: 'ai4ksl-bridging-language-barrier-using-ai-for-kenyan-sign-language',
    title: 'AI4KSL: Bridging Language Barrier using Artificial Intelligence for Kenyan Sign Language among Deaf Learners',
    shortTitle: 'AI4KSL',
    subtitle: 'AI-powered sign language translation for inclusive education',
    status: 'Ongoing',
    startDate: '2023',
    endDate: '2024',
    focus: ['Disability Inclusion', 'Computer Vision', 'Sign Language', 'Education'],
    description:
      'AI4KSL is designed to reduce language barriers for deaf learners by combining computer vision, sign-language data collection and avatar-based translation. The project creates accessible tools for learners, teachers and communities, helping to bridge communication gaps in education and digital access.',
    outcome:
      'The project aims to provide a scalable and practical AI route for Kenyan Sign Language support, improving communication access for deaf learners and strengthening inclusive education systems.',
    lead: 'Ezekiel Maina',
    members: ['Ezekiel Maina', 'Valary Atieno', 'Dr. Samwel Oonge', 'MCAAI disability inclusion team'],
    funders: ['EduAI Fund', 'MCAAI partners', 'Community and institutional stakeholders'],
    links: [
      { label: 'YouTube Demo', href: 'https://www.youtube.com/watch?v=5jmfr2hDFDo' },
      { label: 'Maseno University Feature', href: 'https://www.maseno.ac.ke/node/1850' },
      { label: 'Second Demo', href: 'https://www.youtube.com/watch?v=oH046ATSWtU' }
    ],
    theme: { primary: '#1d4d4f', secondary: '#2d6a4f' }
  },
  {
    slug: 'kenyan-languages-corpus-for-nlp-and-machine-translation',
    title: 'Kenyan Languages Corpus for Natural Language Processing and Machine Translation',
    shortTitle: 'UNESCO TWAS-BMBF Corpus',
    subtitle: 'Seed grant for low-resource language technology',
    status: 'Completed',
    startDate: '2023',
    endDate: '2024',
    focus: ['Machine Translation', 'NLP', 'Corpus Linguistics', 'Low-resource Languages'],
    description:
      'This UNESCO TWAS-BMBF Seed Grant project focused on building a Kenyan-language corpus for natural language processing and machine translation. It supported postgraduate researchers and advanced linguistic resource creation for core Kenyan languages, with a strong emphasis on open, useful and sustainable language data infrastructure.',
    outcome:
      'The project produced a foundation of annotated and curated corpora that support machine translation, language modelling and downstream NLP research across major Kenyan languages.',
    lead: 'Dr. Vivian Oloo',
    members: ['Dr. Vivian Oloo', 'Ezekiel Maina', 'Nelson Odhiambo', 'Edwin Onkoba', 'Maureen', 'MCAAI NLP research associates'],
    funders: ['UNESCO', 'TWAS', 'BMBF', 'SG-NAPI'],
    links: [
      { label: 'ACL Anthology Paper', href: 'https://aclanthology.org/2023.jlcl-2.1/' },
      { label: 'arXiv Paper', href: 'https://arxiv.org/abs/2210.16537' },
      { label: 'ACM Paper', href: 'https://dl.acm.org/doi/full/10.1145/3578553' },
      { label: 'MCAAI Research Archive', href: 'https://mcaai.maseno.ac.ke/' }
    ],
    theme: { primary: '#213e66', secondary: '#22808e' }
  },
  {
    slug: 'kencorpus-kenyan-language-corpus-for-nlp-and-machine-learning',
    title: 'KenCorpus: Kenyan Language Corpus for NLP and Machine Learning',
    shortTitle: 'KenCorpus',
    subtitle: 'Text and speech resources for Swahili, Dholuo and Luhya',
    status: 'Completed',
    startDate: '2021',
    endDate: '2022',
    focus: ['NLP', 'Speech Data', 'Machine Learning', 'Low-resource Languages'],
    description:
      'KenCorpus was a Lacuna Fund-supported project designed to build a Kenyan-language corpus that could support NLP and machine learning tasks across major Kenyan languages. The project created text and speech data resources for Swahili, Dholuo and Luhya and produced proof-of-concept systems for speech recognition and question answering.',
    outcome:
      'KenCorpus created an open, public-domain corpus and demonstration systems that advance how low-resource language datasets are built, evaluated and used in machine learning research.',
    lead: 'Dr. Vivian Oloo',
    members: ['Dr. Vivian Oloo', 'Barack Wanjawa', 'Florence Indede', 'Owen McOnyango', 'Edward Ombui', 'Lawrence Muchemi'],
    funders: ['Lacuna Fund'],
    links: [
      { label: 'KenCorpus site', href: 'https://kencorpus.maseno.ac.ke/' },
      { label: 'Stakeholder workshop', href: 'https://www.maseno.ac.ke/kenCorpus-workshop' },
      { label: 'Workshop review', href: 'https://www.maseno.ac.ke/kencorpus-workshop-review' },
      { label: '2022 update', href: 'https://www.maseno.ac.ke/kencorpus-2022' },
      { label: 'Sensitization workshop', href: 'https://www.maseno.ac.ke/kenyan-languages-corpus-kencorpus-lacuna-project-stake-holder-sensitization-workshop-program' },
      { label: 'ACL Anthology paper', href: 'https://aclanthology.org/2023.jlcl-2.1/' },
      { label: 'arXiv paper', href: 'https://arxiv.org/abs/2210.16537' },
      { label: 'ACM article', href: 'https://dl.acm.org/doi/full/10.1145/3578553' }
    ],
    theme: { primary: '#1f5472', secondary: '#0d9488' }
  },
  {
    slug: 'building-nlp-text-and-speech-datasets-for-low-resourced-languages-in-east-africa',
    title: 'Building NLP Text and Speech Datasets for Low Resourced Languages in East Africa',
    shortTitle: 'East Africa Dataset Initiative',
    subtitle: 'Collaborative text and speech resource development',
    status: 'Completed',
    startDate: '2021',
    endDate: '2022',
    focus: ['Speech Data', 'Text Data', 'East Africa', 'Collaborative AI'],
    description:
      'This project focused on building text and speech datasets for low-resource languages in East Africa, with a particular emphasis on Kiswahili and related language contexts. It was developed through collaborative work with research partners and built on open, useful and sustainable language data practices.',
    outcome:
      'The project generated reusable language resources and published work that shaped the data collection and evaluation practices for low-resourced East African languages in NLP research.',
    lead: 'MCAAI research team',
    members: ['MCAAI team', 'Makerere team', 'Regional language collaborators'],
    funders: ['Lacuna Fund', 'Partner research institutions'],
    links: [
      { label: 'OpenReview paper', href: 'https://openreview.net/forum?id=SO-U99z4U-q' },
      { label: 'MCAAI Research Archive', href: 'https://mcaai.maseno.ac.ke/' }
    ],
    theme: { primary: '#094067', secondary: '#2c6e86' }
  }
];

const researchWorkProjectMap = Object.fromEntries(researchWorkProjects.map((p) => [p.slug, p]));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = researchWorkProjectMap[slug];

  if (!project) {
    return {
      title: 'Project not found - MCAAI',
      description: 'The requested research project could not be found.',
    };
  }

  return {
    title: `${project.title} - MCAAI`,
    description: project.description,
  };
}

export default async function ResearchWorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = researchWorkProjectMap[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Simple, minimal hero — no gradients, images, or text effects */}
      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/research" className="transition-colors hover:text-primary">Research</Link>
          <span>/</span>
          <Link href="/research/works" className="transition-colors hover:text-primary">Our research works</Link>
          <span>/</span>
          <span className="text-on-surface">{project.shortTitle}</span>
        </nav>

        <div className="inline-flex rounded-full border border-outline-variant/60 bg-surface-container px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
          {project.status}
        </div>

        <h1 className="mt-6 max-w-4xl font-display-xl text-[32px] leading-tight text-primary md:text-[52px]">
          {project.title}
        </h1>

        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          {project.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.focus.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-outline-variant bg-surface-container px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-container-max px-margin-mobile py-10 md:px-margin-desktop md:py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/research/works"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <FiArrowLeft size={14} />
            Back to research works
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.7fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-outline-variant bg-white p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3 text-primary">
                <FiActivity size={18} />
                <h2 className="font-headline-lg text-[22px] text-primary">Project description</h2>
              </div>
              <p className="text-[15px] leading-7 text-on-surface-variant md:text-[16px]">
                {project.description}
              </p>
            </section>

            <section className="rounded-3xl border border-outline-variant bg-white p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3 text-primary">
                <FiAward size={18} />
                <h2 className="font-headline-lg text-[22px] text-primary">Outcome</h2>
              </div>
              <div className="text-[15px] leading-7 text-on-surface-variant md:text-[16px]">
                {typeof project.outcome === 'object' && project.outcome !== null ? (
                  <div className="mt-3">
                    <h3 className="font-semibold">Outcome (ACTS)</h3>
                    <div className="mt-2">
                      <p className="font-medium">Aim</p>
                      <p>{project.outcome.Aim}</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium">Context</p>
                      <p>{project.outcome.Context}</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium">Tasks</p>
                      {Array.isArray(project.outcome.Tasks) ? (
                        <ul className="list-disc pl-5">
                          {project.outcome.Tasks.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{project.outcome.Tasks}</p>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="font-medium">Success</p>
                      <p>{project.outcome.Success}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3">{project.outcome}</p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-outline-variant bg-white p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3 text-primary">
                <FiUsers size={18} />
                <h2 className="font-headline-lg text-[22px] text-primary">Project members</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.members.map((member) => (
                  <span
                    key={member}
                    className="rounded-full bg-surface-container px-3 py-2 text-[12px] font-medium text-on-surface-variant"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-outline-variant bg-white p-6">
              <div className="mb-5 flex items-center gap-3 text-primary">
                <FiBookOpen size={18} />
                <h3 className="font-headline-lg text-[20px] text-primary">Project details</h3>
              </div>

              <div className="space-y-4 text-[14px] text-on-surface-variant">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">Lead</p>
                  <p className="font-medium text-on-surface">{project.lead}</p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">Timeline</p>
                  <p className="font-medium text-on-surface">{project.startDate}{project.endDate ? ` – ${project.endDate}` : ''}</p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">Funders</p>
                  <ul className="space-y-2">
                    {project.funders.map((funder) => (
                      <li key={funder} className="font-medium text-on-surface">• {funder}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-white p-6">
              <div className="mb-5 flex items-center gap-3 text-primary">
                <FiExternalLink size={18} />
                <h3 className="font-headline-lg text-[20px] text-primary">Publications & links</h3>
              </div>

              <div className="space-y-3">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-3 text-[13px] font-medium text-primary transition-colors hover:border-primary/30 hover:text-primary/80"
                  >
                    <span>{link.label}</span>
                    <FiExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
