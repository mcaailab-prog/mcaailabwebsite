/**
 * seedProjects.ts
 *
 * ONE-FILE seed script for the MCAAI registry.
 * Wipes and rewrites the TeamMember, Partner, and Project collections.
 * Does NOT touch ResearchArea or Publication (no source data supplied for those).
 *
 * SETUP:
 *   1. This script assumes it lives at project-root-level, e.g. `scripts/seedProjects.ts`,
 *      with your Mongoose models at `models/TeamMember.ts`, `models/Partner.ts`,
 *      `models/Project.ts`. Adjust the three import paths below if your layout differs.
 *   2. The Project.ts model already includes the extended `sector` enum values used by
 *      this seed data, so these custom categories are preserved rather than pruned.
 *   3. Set MONGODB_URI in your environment.
 *   4. `npm install dotenv` if not already present.
 *   5. Run: `npx tsx scripts/seedProjects.ts`
 *
 * SAFETY: deleteMany({}) on TeamMember, Partner, and Project. No undo. Run on
 * dev/staging first.
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// ---- Adjust these three import paths to match your project structure ----
import { TeamMember } from '../src/app/api/models/TeamMember';
import { Partner } from '../src/app/api/models/Partner';
import { Project } from '../src/app/api/models/Project'; // must be the UPDATED Project.ts (extended sector enum)
import { Dataset } from '../src/app/api/models/Dataset';
import { Publication } from '../src/app/api/models/Publication';

dotenv.config();

// =====================================================================
// TEAM MEMBERS
// =====================================================================


interface SeedTeamMember {
  name: string;
  slug: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  linkedin: string;
  google_scholar: string;
  research_interests: string;
  order: number;
}

const teamMembers: SeedTeamMember[] = [
  {
    name: "Hope Kerubo",
    slug: "hope-kerubo",
    title: "Research Associate — Corpus Linguistics (Ekegusii & Kuria)",
    bio: `<p>Hope Kerubo is a Master's student at Maseno University and a Research Associate at MCAAI, where her work focuses on corpus creation for <strong>Ekegusii and Kuria</strong> — two Bantu languages spoken in the Kisii and Migori regions of Kenya that remain significantly under resourced in the computational linguistics landscape.</p>

<br/> <p>Hope's research involves the collection, annotation, and validation of text and speech data from native speaker communities, applying rigorous linguistic standards to ensure that the resulting corpora are suitable for downstream NLP tasks including language modelling, machine translation, and speech recognition. She conducts field data collection sessions with community contributors across the Kisii and South Nyanza regions, working closely with local linguists and cultural custodians to ensure that the data she collects accurately reflects the full breadth of each language's vocabulary, grammar, and usage patterns.</p>

<br/><p>Her work is expanding the linguistic coverage of MCAAI's datasets and contributing to the digital preservation of two languages that face growing displacement pressure from dominant regional languages such as Kiswahili and Dholuo. By creating open, well documented corpora for Ekegusii and Kuria, Hope is helping to ensure that these languages have a presence in the AI systems of the future — and that their speakers are not left behind in the transition to AI mediated digital communication.</p>

<br/><p>Hope is supervised jointly by Dr. Vivian Oloo and Dr. Lilian Wanzare, and her corpus work feeds directly into MCAAI's multilingual language model development pipeline.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Corpus creation, Ekegusii NLP, Kuria language, low-resource Bantu language processing, linguistic field data collection",
    order: 9,
  },
  {
    name: "Boniface Mwau",
    slug: "boniface-mwau",
    title: "Research Associate — Automatic Speech Recognition & TTS (Kikuyu)",
    bio: `<p>Boniface Mwau is a Research Associate at the Maseno Centre for Applied Artificial Intelligence (MCAAI) and an MSc Computer Science student at Maseno University. His research focuses on Natural Language Processing (NLP), speech technologies, and data-centric AI for low-resource African languages.</p>

<br/><p>His current research investigates data-efficient neural Text-to-Speech (TTS) for low-resource Kenyan languages, with a focus on Kikuyu. He is interested in multilingual transfer learning, Automatic Speech Recognition (ASR), machine translation, language resource creation, and the development of open AI technologies for African languages.</p>

<br/><p>At MCAAI, he contributes to research on speech and language technologies, multilingual NLP, cultural knowledge representation, and AI datasets for African languages. His postgraduate research is supervised by Dr. Lilian Wanzare and Dr. Vivian Oloo.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1784098425/DSC_2236_copyfdghj_5_-_Boniface_Mwau_llcefs.jpg",
    email: "",
    linkedin: "https://linkedin.com/in/foxh79",
    google_scholar: "",
    research_interests: "Automatic speech recognition, text-to-speech synthesis, Kikuyu language technology, speech model fine-tuning, low-resource speech processing",
    order: 15,
  },
  {
    name: "Ezekiel Maina",
    slug: "ezekiel-maina",
    title: "Research Associate — Computer Vision & Disability Inclusion",
    bio: `<p>Ezekiel Maina leads the Computer Vision research faction at MCAAI and is the principal engineer behind the <strong>AI4KSL project</strong> — MCAAI's AI powered system for Kenyan Sign Language (KSL) glossing and avatar generation, developed in partnership with Data Science Africa (DSA).</p>

<br/><p>Ezekiel designed and built the foundational model architecture that enables real-time translation of spoken English into KSL avatar animations. The system is built on a training dataset of over <strong>20,000 annotated sign language videos</strong>, making it one of the most comprehensively resourced KSL computational systems in existence. His architecture combines pose estimation, transformer based sequence modelling, and avatar rendering pipelines to produce naturalistic signing animations that accurately capture the spatial grammar of KSL.</p>

<br/><p>Prior to AI4KSL, Ezekiel contributed to the early data collection phase of the <strong>African Next Voices</strong> initiative, developing the web based voice recording platform used to gather speech data from community contributors across Western Kenya. This tool has since been used to collect thousands of hours of audio across multiple language communities.</p>

<br/><p>Ezekiel's work on AI4KSL directly addresses the digital exclusion experienced by deaf and hard of hearing communities in Kenya, providing a scalable, AI driven solution to the absence of sign language interpretation in digital educational and professional environments. He is committed to ensuring that persons with disabilities are not an afterthought in Africa's AI development trajectory, but active participants and beneficiaries from the outset.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1782458583/mainaa_tekp7j.jpg",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Computer vision, sign language recognition, avatar generation, pose estimation, disability-inclusive AI, machine learning engineering",
    order: 5,
  },
  {
    name: "Dr. Gabriel Oliko",
    slug: "dr-gabriel-oliko",
    title: "Senior Researcher — Applied AI & Data Governance",
    bio: `<p>Dr. Gabriel Oliko leads MCAAI's Applied AI research programme and serves as the centre's principal authority on AI ethics and data governance. He is the principal architect of the foundational legal and ethical principles underlying the Nwulite Obodo Open Data License (NOODL) — the framework that made MCAAI the first institution in the world to implement community-controlled open data governance for African language datasets in practice.</p>

<br/><p>NOODL's three core principles — community reciprocity, non-exploitative usage, and transparent attribution — reflect Dr. Oliko's conviction that African communities must be the primary beneficiaries of AI systems trained on their data. His research combines technical rigour with socio-legal analysis, drawing on intellectual property law, development economics, and machine learning theory to produce governance frameworks that are both principled and practically implementable.</p>

<br/><p>Dr. Oliko is a recognised voice in regional AI policy discourse and regularly advises policymakers across East Africa on responsible AI deployment, data sovereignty legislation, and the ethical dimensions of national AI strategies. He has contributed to policy consultations with government agencies in Kenya, Uganda, and Tanzania, and has presented NOODL at international forums including the ACM Conference on Fairness, Accountability, and Transparency (FAccT).</p>

<br/><p>Within MCAAI, Dr. Oliko oversees the NOODL Validation Programme, through which the centre reviews and certifies datasets submitted by external researchers for compliance with the NOODL framework. He also plays a key mentorship role for researchers working on the intersection of AI and social impact.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1782301244/oliko_nwvd8o.jpg",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Data sovereignty, AI ethics and policy, open data licensing, responsible AI governance, socio-legal analysis of AI systems",
    order: 4
  },
  {
    name: "Starnley Odiwuor",
    slug: "starnley-odiwuor",
    title: "Research Associate — MLOps & Model Deployment",
    bio: `<p>Starnley Odiwuor is a Master's student at Maseno University and a Research Associate at MCAAI, where he leads the centre's <strong>MLOps engineering</strong> efforts — ensuring that AI models developed across MCAAI's research programmes are deployed, monitored, and maintained as stable, scalable systems that serve real users reliably in the field.</p>

<br/>  <p>The gap between a trained model and a production deployment is one of the most challenging engineering problems in applied AI, particularly in African research environments where cloud infrastructure costs, connectivity constraints, and device heterogeneity add significant complexity. Starnley designs and maintains the CI/CD pipelines, model versioning systems, experiment tracking infrastructure, and performance monitoring dashboards that form the backbone of MCAAI's production AI environment.</p>

<br/><p>His work has been instrumental in enabling MCAAI to move from research prototype to live deployment across multiple projects. The <strong>AI Farm Assistant's</strong> USSD and web deployment, the <strong>DhoNam</strong> dataset release pipeline, and the <strong>AI4KSL</strong> avatar rendering backend all depend on the infrastructure Starnley has built and continues to maintain.</p>

<br/><p>Starnley is also developing expertise in edge deployment — optimising AI models for low power devices and intermittent connectivity environments, which is essential for MCAAI's mission of reaching communities in rural Western Kenya. He works in close collaboration with Biatus Maina on the centre's broader machine learning engineering infrastructure.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "MLOps, model deployment and monitoring, CI/CD for machine learning, edge AI, infrastructure engineering for research systems",
    order: 14,
  },
  {
    name: "Cynthia Jayne Amol",
    slug: "cynthia-jayne-amol",
    title: "Research Associate — NLP & Community Engagement",
    bio: `<p>Cynthia Jayne Amol is a Research Associate at MCAAI where she guides and mentors junior researchers in NLP methodology, African language data collection, and ethical research practice. She is also the co founder of TONATIVE — a pan African initiative dedicated to building AI models capable of understanding, processing, and generating African languages, and one of the first such initiatives to adopt an explicitly community first approach to language technology on the continent.</p>

<br/> <p>At MCAAI Cynthia applies her expertise in computational linguistics and community engagement to ensure that all data collection efforts are culturally sensitive, linguistically accurate, and grounded in genuine community consent. She works closely with community leaders and local linguists to develop data collection protocols that respect the cultural contexts from which language data is gathered, and she trains junior researchers and student volunteers in these protocols before they engage with speaker communities in the field.</p>

<br/><p>Cynthia's research contributions span corpus development for multiple Kenyan languages, NLP model evaluation methodologies designed for low resource settings, and the design of community facing interfaces that enable non technical speakers to contribute their language data with full understanding of how it will be used. Her work bridges the often wide gap between academic NLP research and the lived linguistic realities of African communities, and she is one of MCAAI's most effective advocates for the principle that language technology must be built with communities, not merely for them.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1782458580/amol_n18esd.jpg",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Community-centred NLP, African language representation, computational linguistics, data collection ethics, language technology outreach",
    order: 6,
  },
  {
    name: "Nelson Odhiambo",
    slug: "nelson-odhiambo",
    title: "Research Associate — Machine Translation",
    bio: `<p>Nelson Odhiambo is a PhD candidate in Computer Science at Maseno University, where his doctoral research focuses on machine translation for low-resource African languages. At MCAAI he leads the Machine Translation team within the NLP research programme, directing the development of neural translation systems for Dholuo, Kikuyu, and related Nilotic and Bantu languages.</p>

<br/><p>Nelson's translation research employs a range of architectures — from sequence to sequence models with attention mechanisms to modern multilingual transformer approaches such as mBART and NLLB — adapting them to the specific morphological and tonal characteristics of his target languages. His work on Dholuo English machine translation has produced the first publicly available neural translation system for the language pair, a milestone that opens up new possibilities for cross lingual information access for Dholuo speakers.</p>

<br/><p>Nelson is also the pioneer of MCAAI's Hate Speech Sentiment Analysis project, a timely research initiative that applies NLP techniques to detect and classify harmful content in African language social media contexts. The project addresses a critical gap in content moderation infrastructure: mainstream AI content moderation systems are trained almost exclusively on high-resource languages and systematically fail to identify harmful content in Dholuo, Kikuyu, and other Kenyan languages. Nelson's work provides the first computational tools for addressing this gap at scale.</p>

<br/><p>Through both his translation and hate speech research, Nelson exemplifies MCAAI's conviction that NLP technology must serve not only the scientific community but also the everyday safety and wellbeing of African language users online.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1782458582/nelson_naqii2.jpg",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Machine translation, neural sequence modelling, hate speech detection, sentiment analysis, low-resource NLP, multilingual transformers",
    order: 7,
  },
  {
    name: "Valary Atieno",
    slug: "valary-otieno",
    title: "Research Associate — Disability Inclusion & AI4KSL",
    bio: `<p>Valary Atieno is a Master's student in Computer Science at Maseno University and a Research Associate at MCAAI, where she is a core team member of the <strong>AI4KSL</strong> project — MCAAI's AI powered Kenyan Sign Language production system — and a committed advocate for disability inclusion in African AI development.</p>

<br/><p>Valary contributes to the AI4KSL project across multiple dimensions: she assists with the curation and annotation of the sign language video dataset, participates in model evaluation sessions with deaf community representatives, and helps to design the user interface components of the KSL avatar system to ensure they meet the accessibility needs of deaf and hard of hearing users. Her work is informed by direct engagement with deaf schools and disability advocacy organisations in Western Kenya, whose feedback shapes the design priorities of the AI4KSL system.</p>

<br/><p>Beyond AI4KSL, Valary is a vocal champion for disability inclusion as a research priority within MCAAI and Maseno University more broadly. She has presented on the topic at university seminars and student conferences, making the case that AI systems designed without consideration for disability inclusion risk compounding existing inequalities in digital access.</p>

<br/><p>Valary is supervised by Dr. Samwel Oonge and works in close collaboration with Ezekiel Maina on the technical aspects of the AI4KSL system. Her research interests are increasingly focused on the design of participatory methodologies for co creating AI tools with disability communities, rather than designing for them without their direct input.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Disability-inclusive AI, Kenyan Sign Language technology, participatory design, assistive technology, AI accessibility",
    order: 19,
  },
  {
    name: "Dr. Vivian Oloo",
    slug: "dr-vivian-oloo",
    title: "Senior Researcher — NLP & Corpus Linguistics",
    bio: `<p>Dr. Vivian Oloo is a Senior Researcher and NLP specialist at MCAAI, with a primary research focus on corpus creation and language model development for Dholuo — a Nilotic language spoken by over four million people in Western Kenya and a core target language for MCAAI's language technology programme.</p>

<br/><p>Dr. Oloo leads the <strong>DhoNam dataset initiative</strong>, overseeing the end to end process of speech data collection, transcription, quality assurance, and open release. Under her leadership, the DhoNam corpus has grown to encompass 51.34 hours of native speaker audio from 59 speakers, carefully annotated across thematic domains including agriculture, healthcare, education, and conversational Dholuo. Her meticulous approach to corpus design has made DhoNam one of the most rigorously documented speech datasets produced by any African research institution.</p>

<br/><p>Dr. Oloo brings deep expertise in transformer based neural architectures and their adaptation for morphologically complex languages — a significant technical challenge for Dholuo, which features agglutinative morphology and tonal distinctions that are difficult to capture using models pre trained primarily on Indo European languages. Her research addresses these challenges through targeted pre training strategies and phonological data augmentation techniques.</p>

<br/><p>Alongside her research contributions, Dr. Oloo is a dedicated mentor who actively guides junior researchers and postgraduate students in corpus linguistics methodology, experimental design, and academic writing. She is widely regarded within MCAAI as one of the centre's most important capacity building figures.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Corpus linguistics, transformer-based language models, Dholuo NLP, low-resource language processing, speech data annotation",
    order: 3,
  },
  {
    name: "Edwin Onkoba",
    slug: "edwin-onkoba",
    title: "Research Associate — Synthetic Data Generation",
    bio: `<p>Edwin Onkoba leads the <strong>Synthetic Data Generation team</strong> at MCAAI — a research function that directly addresses one of the most fundamental constraints in African language AI development: the chronic scarcity of labelled training data for low-resource languages.</p>

<br/><p>As a PhD candidate in Computer Science at Maseno University, Edwin's doctoral research explores techniques for generating high-fidelity synthetic text and speech data that can augment real-world corpora for low-resource language modelling. His work encompasses generative adversarial networks, large language model based data synthesis, and statistical augmentation approaches, evaluated rigorously against native speaker benchmarks to ensure that synthetic data maintains authentic linguistic properties.</p>

<br/><p>Edwin's contributions are foundational to MCAAI's ability to scale its language datasets beyond what community data collection alone can achieve. Community data collection — while essential for authenticity and ethical grounding — is time intensive and resource constrained. Synthetic data generation allows the centre to dramatically increase the volume of training examples available for its NLP and ASR models, accelerating model development without compromising linguistic quality.</p>

<br/><p>He works closely with the corpus linguistics and NLP teams to design synthetic pipelines that complement, rather than replace, real-world data collection efforts. His benchmarking methodology — which compares synthetic data quality against held-out native speaker recordings and texts — has become a standard quality assurance protocol across MCAAI's language programmes.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1782392915/edu_q5fput.jpg",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Synthetic data generation, generative AI, data augmentation for low-resource NLP, speech synthesis, model benchmarking",
    order: 8,
  },
  {
    name: "Maureen Awour",
    slug: "maureen-awour",
    title: "Research Associate — Dholuo Corpus & Data Validation",
    bio: `<p>Moureen Awour is a Master's student at Maseno University, a <strong>Data Science Africa (DSA) Fellow</strong>, and a Research Associate at MCAAI. Her DSA fellowship reflects her standing as an emerging leader in the African data science community, and she brings the rigorous quantitative training of that programme to her work at MCAAI.</p>

<br/><p>Moureen focuses on <strong>Dholuo corpus creation and data validation</strong>, ensuring that the speech and text data produced by the DhoNam and African Next Voices initiatives meets the rigorous linguistic and technical standards required before being released for open research use. Her validation work is systematic and data driven: she applies statistical quality metrics to incoming audio batches, uses inter annotator agreement analysis to assess transcription consistency, and develops automated pre screening pipelines that flag recordings for human review based on audio quality and transcription confidence scores.</p>

<br/><p>Her data science background enriches the validation methodology she has introduced to MCAAI's corpus production pipeline. Prior to Moureen's contributions, quality assurance was largely manual; she has helped to systematise and partially automate the process, significantly increasing the throughput of validated data while maintaining high quality standards.</p>

<br/><p>Moureen also contributes to MCAAI's broader community of practice, sharing her data science expertise with junior researchers through informal workshops and code review sessions. She is supervised by Dr. Vivian Oloo and works in close collaboration with Judith Odera and Martin Okech on the DhoNam corpus team.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Dholuo corpus validation, data quality assurance, statistical methods in corpus linguistics, data science for NLP, low-resource language processing",
    order: 18,
  },
  {
    name: "Biatus Maina",
    slug: "biatus-maina",
    title: "Research Associate — Machine Learning Engineering",
    bio: `<p>Biatus Maina is a Master's student at Maseno University and a Research Associate at MCAAI, contributing to the centre's machine learning engineering infrastructure. With a strong practical grounding in software engineering, model optimisation, and MLOps practices, Biatus serves as a key technical collaborator for teams across MCAAI's four research programmes.</p>

<br/><p>His primary contribution is in translating research prototypes into robust, production ready systems. The gap between a research model and a deployable application is often large — involving performance optimisation, API development, data pipeline engineering, and integration testing — and Biatus plays a central role in bridging this gap across MCAAI's portfolio. He has contributed engineering support to the <strong>AI Farm Assistant</strong>, the <strong>DhoNam</strong> corpus processing pipeline, and the <strong>AI4KSL</strong> avatar backend system.</p>

<br/>  <p>Biatus is also deeply involved in MCAAI's internal tooling development, building the data management systems, annotation interfaces, and model evaluation dashboards that enable the centre's researchers to work efficiently at scale. His contributions — while often invisible in published research outputs — are essential to MCAAI's ability to move rapidly from research idea to working prototype to deployable system.</p>

<br/><p>He is supervised by Dr. Samwel Oonge and works in close collaboration with Starnley Odiwuor on the centre's MLOps and deployment infrastructure.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Machine learning engineering, ML pipeline optimisation, software engineering for AI, model deployment, research prototyping",
    order: 11,
  },
  {
    name: "Jack Oraro",
    slug: "jack-oraro",
    title: "Research Associate — Software Engineering & Data Collection",
    bio: `<p>Jack Oraro is an undergraduate student at Maseno University studying Computer Science, and a Research Associate at MCAAI where he applies his software engineering skills to build the tools that power the centre's data collection programmes.</p>

<br/> <p>Jack's most significant contribution to date is the development of MCAAI's <strong>web-based voice collection platform</strong> — the primary interface through which community contributors record and submit Dholuo, Kikuyu, and other language samples for the African Next Voices and DhoNam initiatives. The platform handles audio recording, quality pre screening, contributor consent management, and metadata capture in a browser-based interface accessible on any internet-connected device. It has been used to collect thousands of hours of speech data across multiple language communities.</p>

<br/> <p>Beyond the voice collection platform, Jack contributes to MCAAI's broader software engineering infrastructure, assisting with the development and maintenance of internal tooling including data annotation interfaces, dataset management systems, and the web front-end components of the AI Farm Assistant platform.</p>

<br/>  <p>Jack is mentored by Ezekiel Maina and Starnley Odiwuor, and is developing expertise in full stack web development, progressive web app architecture, and the engineering of human in the loop data collection systems. His work exemplifies MCAAI's commitment to involving undergraduate students in meaningful research engineering from the earliest stages of their academic careers.</p>`,
    photo: "",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Software engineering for research, web-based data collection systems, progressive web apps, human-in-the-loop data pipelines",
    order: 21,
  },
  {
    name: "Dr. Lilian Wanzare",
    slug: "dr-lilian-wanzare",
    title: "Founder & Lead Researcher",
    bio: `<p>Dr. Lilian Wanzare is the Founder and Lead Researcher of the Maseno Centre for Applied Artificial Intelligence (MCAAI), which she established in early 2026 with a vision to bridge the gap between cutting-edge AI research and grassroots community impact across Africa.</p>

<br/><p>Dr. Wanzare holds a PhD in Computational Linguistics with a specialisation in Natural Language Processing, and brings over 15 years of experience in African language technology to her role. Her scholarly contributions span low-resource language modelling, automatic speech recognition, and the design of ethical AI frameworks adapted to African institutional and cultural contexts. Her work has been recognised at leading venues including the <em>Annual Meeting of the Association for Computational Linguistics (ACL)</em> and <em>AfricaML</em>.</p>

<br/><p>At MCAAI, Dr. Wanzare provides strategic leadership across all four research programmes, manages the centre's international partnerships, and champions the community-centred philosophy that defines MCAAI's approach to AI development. She is a principal investigator on the <strong>DhoNam speech corpus project</strong>, the <strong>African Next Voices initiative</strong>, and the <strong>AI Farm Assistant</strong> agricultural advisory platform.</p>

<br/><p>Beyond her research, Dr. Wanzare is deeply committed to building Africa's next generation of AI researchers. She established MCAAI as both a research institution and a mentorship environment, ensuring that every postgraduate student and junior researcher at the centre receives the guidance, resources, and professional development opportunities needed to build lasting careers in AI.</p>`,
    photo: "https://res.cloudinary.com/daecietav/image/upload/v1782301245/wanzare_sbbppv.jpg",
    email: "",
    linkedin: "",
    google_scholar: "",
    research_interests: "Natural language processing, low-resource language modelling, African language technology, ethical AI frameworks, automatic speech recognition",
    order: 1,
  }
];

// =====================================================================
// PARTNERS
// =====================================================================
// partner_type constrained to: 'research' | 'funding' | 'community'

interface SeedPartner {
  name: string;
  logo: string;
  website: string;
  description: string;
  partner_type: 'research' | 'funding' | 'community';
  order: number;
  _flag?: string;
}

const partners: SeedPartner[] = [
  // ---- RESEARCH ----
  {
    name: "Princeton University",
    logo: "", website: "",
    description: "Academic research collaborator on cross-lingual exploratory data analysis for multilingual ASR. Joint work published on arXiv.",
    partner_type: "research", order: 1
  },
  {
    name: "Strathmore University (iLab)",
    logo: "", website: "",
    description: "Lead institution on the Gates Foundation-funded SAFIC project, co-developing the Kenya AI-Driven Agricultural Advisory Platform (TTS, MT, ASR, LID, data collection).",
    partner_type: "research", order: 2
  },
  {
    name: "Makerere University",
    logo: "", website: "",
    description: "Academic collaborator on Kiswahili text and speech dataset development for low-resourced East African languages, under the Lacuna-funded project.",
    partner_type: "research", order: 3
  },
  {
    name: "ACTS",
    logo: "", website: "",
    description: "Academic/technical partner on the cross-lingual transformer-based Text-to-Speech project for Dholuo–Swahili speech synthesis.",
    partner_type: "research", order: 4,
    _flag: "Full name of 'ACTS' not given in source documents — confirm and update description."
  },
  {
    name: "Eva",
    logo: "", website: "",
    description: "Collaborator on ASR research with Cynthia Amol and team.",
    partner_type: "research", order: 5,
    _flag: "Full name of 'Eva' not given in source documents — confirm and update description."
  },

  // ---- FUNDING ----
  {
    name: "Microsoft",
    logo: "", website: "",
    description: "Technology and funding partner providing USD 30,000 in Azure credits, supporting ASR, Text-to-Speech, Language Identification, Synthetic Data Generation, and Machine Translation projects for Kenyan languages.",
    partner_type: "funding", order: 6
  },
  {
    name: "Gates Foundation",
    logo: "", website: "",
    description: "Funder of the Kenya AI-Driven Agricultural Advisory Platform (SAFIC, 2026-2027) and the African Next Voices pilot data collection project (2024-2025).",
    partner_type: "funding", order: 7
  },
  {
    name: "IDRC",
    logo: "", website: "",
    description: "Funder of the AI4D Hub for AI and Disability Inclusion project (2026-2028).",
    partner_type: "funding", order: 8
  },
  {
    name: "European Union",
    logo: "", website: "",
    description: "Funder of the CVEinAI (Critical Virtual Exchange in Artificial Intelligence) project (2025-2026).",
    partner_type: "funding", order: 9
  },
  {
    name: "Mozilla Common Voice",
    logo: "", website: "",
    description: "Funder of the 'Piloting Alternative Language Data Licenses' project (2025), which produced the Dhonam dataset on the Mozilla Data Collective.",
    partner_type: "funding", order: 10
  },
  {
    name: "Edu AI",
    logo: "", website: "",
    description: "Funder of the AI4KSL project: bridging language barriers using AI for Kenyan Sign Language among Deaf learners (2023-2024).",
    partner_type: "funding", order: 11
  },
  {
    name: "UNESCO TWAS-BMBF",
    logo: "", website: "",
    description: "Funder of the Seed Grant for New African Principal Investigators (SG-NAPI), supporting the Kenyan Languages Corpus for NLP and Machine Translation project (2023-2024).",
    partner_type: "funding", order: 12
  },
  {
    name: "Lacuna Fund",
    logo: "", website: "",
    description: "Funder of KenCorpus: Kenyan Language Corpus for NLP and Machine Learning (2021-2022), and of NLP/speech dataset development for low-resourced East African languages (2021-2022).",
    partner_type: "funding", order: 13
  },
  {
    name: "Google",
    logo: "", website: "",
    description: "Provided scholarship awards supporting MCAAI researchers.",
    partner_type: "funding", order: 14
  },
  {
    name: "Data Science Africa",
    logo: "", website: "",
    description: "Funder of the AI4D Hub for AI and Disability Inclusion project (2026-2027).",
    partner_type: "funding", order: 15
  },
  {
    name: "HAIDI",
    logo: "", website: "",
    description: "Partner named alongside AI4KSL in the active projects registry.",
    partner_type: "funding", order: 16,
    _flag: "'HAIDI' appears only once in the source table next to the AI4KSL project, with no expansion given. Confirm what this refers to (may overlap with or be distinct from Edu AI) and correct partner_type if needed."
  },

  // ---- COMMUNITY ----
  {
    name: "Digital Umuganda",
    logo: "", website: "",
    description: "Community partner co-hosting a hackathon on multilingual ASR and collaborating on the African Next Voices data collection project.",
    partner_type: "community", order: 17
  },
  {
    name: "SEM-EVAL",
    logo: "", website: "",
    description: "International shared-task research community. MCAAI has participated in SemEval 2024 (AfriHate hate speech dataset collection) and SemEval 2026 (multilingual online polarization detection; aspect-based sentiment analysis and stance detection).",
    partner_type: "community", order: 18
  }
];

// =====================================================================
// PROJECTS
// =====================================================================
// team_members: TeamMember slugs (resolved to ObjectIds below)
// partners: Partner names (resolved to ObjectIds below)
// research_areas intentionally left empty everywhere — no ResearchArea seed
// data was supplied for this task.

interface SeedProject {
  title: string;
  slug: string;
  description: string;
  sector: string;
  status: 'active' | 'completed' | 'ongoing';
  start_date?: string;
  end_date?: string;
  cover_image: string;
  team_members: string[];
  partners: string[];
  _flag?: string;
}

const ALL_TEAM_MEMBER_SLUGS = teamMembers.map((tm) => tm.slug);

const projects: SeedProject[] = [
  {
    title: "ASR for Kenyan Languages",
    slug: "asr-for-kenyan-languages",
    description: `Development of automatic speech recognition systems for Kenyan languages, in collaboration with Microsoft.`,
    sector: "speech_technology", status: "active", cover_image: "",
    team_members: ["hope-kerubo", "cynthia-jayne-amol"], partners: ["Microsoft"]
  },
  {
    title: "Text-to-Speech for Kenyan Languages",
    slug: "text-to-speech-kenyan-languages",
    description: `Development of text-to-speech synthesis systems for Kenyan languages, in collaboration with Microsoft.`,
    sector: "speech_technology", status: "active", cover_image: "",
    team_members: ["boniface-mwau"], partners: ["Microsoft"]
  },
  {
    title: "Language Identification for Kenyan Languages",
    slug: "language-identification-kenyan-languages",
    description: `Development of language identification systems to automatically detect Kenyan languages in speech and text, in collaboration with Microsoft.`,
    sector: "speech_technology", status: "active", cover_image: "",
    team_members: ["hope-kerubo"], partners: ["Microsoft"]
  },
  {
    title: "Exploratory Data Analysis for Cross-lingual Multilingual ASR",
    slug: "eda-cross-lingual-multilingual-asr",
    description: `Exploratory data analysis supporting cross-lingual, multilingual ASR research, conducted in collaboration with Princeton University. This work produced a joint paper on arXiv.`,
    sector: "speech_technology", status: "active", cover_image: "",
    team_members: ["cynthia-jayne-amol", "boniface-mwau"], partners: ["Princeton University"]
  },
  {
    title: "Synthetic Data Generation",
    slug: "synthetic-data-generation",
    description: `Generation of synthetic speech and language data to support MCAAI's ASR, TTS, and machine translation pipelines, in collaboration with Microsoft.`,
    sector: "synthetic_data", status: "active", cover_image: "",
    team_members: ["edwin-onkoba"], partners: ["Microsoft"]
  },
  {
    title: "Kenya AI-Driven Agricultural Advisory Platform (SAFIC)",
    slug: "kenya-ai-driven-agricultural-advisory-platform-safic",
    description: `Gates Foundation-funded project led by Strathmore University, building an AI-driven agricultural advisory platform for Kenyan farmers using text-to-speech, machine translation, ASR, language identification, and community data collection (LID-ASR-NER pipeline). MCAAI serves as co-Principal Investigator.`,
    sector: "agriculture", status: "active", start_date: "2026-01-01", end_date: "2027-12-31", cover_image: "",
    team_members: ["cynthia-jayne-amol", "nelson-odhiambo", "boniface-mwau", "biatus-maina", "hope-kerubo"],
    partners: ["Strathmore University (iLab)", "Gates Foundation"]
  },
  {
    title: "Data Quality Checker for Crowdsourced Data",
    slug: "data-quality-checker-crowdsourced-data",
    description: `A tool for automatically assessing and validating the quality of crowdsourced language and speech data before it enters MCAAI's training datasets.`,
    sector: "data_collection", status: "active", cover_image: "",
    team_members: ["nelson-odhiambo", "biatus-maina", "cynthia-jayne-amol"], partners: []
  },
  {
    title: "Machine Translation for Kenyan Languages",
    slug: "machine-translation-kenyan-languages",
    description: `Development of neural machine translation systems for Kenyan languages, in collaboration with Microsoft.`,
    sector: "machine_translation", status: "active", cover_image: "",
    team_members: ["biatus-maina", "nelson-odhiambo"], partners: ["Microsoft"]
  },
  {
    title: "General Data Collection Initiative",
    slug: "general-data-collection-initiative",
    description: `Cross-cutting data collection effort supporting multiple MCAAI research programmes, drawing on team members across the speech, translation, and NLP groups.`,
    sector: "data_collection", status: "active", cover_image: "",
    team_members: ["nelson-odhiambo", "ezekiel-maina", "cynthia-jayne-amol", "biatus-maina", "hope-kerubo", "boniface-mwau"],
    partners: []
  },
  {
    title: "AI4KSL: Bridging Language Barriers Using AI for Kenyan Sign Language Among Deaf Learners",
    slug: "ai4ksl-kenyan-sign-language-deaf-learners",
    description: `Edu AI-funded project developing AI tools to bridge language barriers for Deaf learners using Kenyan Sign Language.`,
    sector: "disability", status: "completed", start_date: "2023-01-01", end_date: "2024-12-31", cover_image: "",
    team_members: ["ezekiel-maina"], partners: ["Edu AI", "HAIDI"]
  },
  {
    title: "African Next Voices: Pilot Data Collection in Kenya",
    slug: "african-next-voices-pilot-data-collection-kenya",
    description: `Gates Foundation-funded pilot data collection project gathering Dholuo and Kalenjin speech and language data, including a multilingual ASR hackathon run jointly with Digital Umuganda.`,
    sector: "data_collection", status: "completed", start_date: "2024-01-01", end_date: "2025-12-31", cover_image: "",
    team_members: ["ezekiel-maina", "cynthia-jayne-amol"], partners: ["Gates Foundation", "Digital Umuganda"]
  },
  {
    title: "SemEval 2026: Detecting Multilingual, Multicultural, and Multievent Online Polarization",
    slug: "semeval-2026-detecting-online-polarization",
    description: `Curating a Swahili dataset for polarization detection tasks under MCAAI's DBSA initiative, including manifestation identification — classifying polarized text by type (stereotype, vilification, dehumanization, extreme language, lack of empathy, or invalidation).`,
    sector: "sentiment_analysis", status: "active", cover_image: "",
    team_members: ["nelson-odhiambo"], partners: ["SEM-EVAL"]
  },
  {
    title: "SemEval 2026: Aspect-Based Sentiment Analysis — Stance Detection",
    slug: "semeval-2026-aspect-based-sentiment-stance-detection",
    description: `Curating a Swahili dataset for aspect-based sentiment analysis under MCAAI's DBSA initiative, moving beyond simple sentiment labels (neutral, against, favor) to identifying aspect terms paired with valence-arousal values.`,
    sector: "sentiment_analysis", status: "active", cover_image: "",
    team_members: ["nelson-odhiambo"], partners: ["SEM-EVAL"]
  },
  {
    title: "SemEval 2024: AfriHate — African Language Hate Speech Detection Datasets",
    slug: "semeval-2024-afrihate-hate-speech-datasets",
    description: `Curating hate speech textual datasets for Swahili and code-switched English-Swahili content, labelled as neither, offensive, or hate (further categorized by nationality, disability, disease, sexual orientation, or gender).`,
    sector: "sentiment_analysis", status: "completed", start_date: "2024-01-01", end_date: "2024-12-31", cover_image: "",
    team_members: ["nelson-odhiambo"], partners: ["SEM-EVAL"]
  },
  {
    title: "Cross-lingual Text-to-Speech: Dholuo–Swahili",
    slug: "cross-lingual-tts-dholuo-swahili",
    description: `Developing a cross-lingual transformer-based text-to-speech system with learned prosody conditioning, supporting Dholuo-text-to-Swahili-speech synthesis and Swahili-text-to-Dholuo-speech synthesis.`,
    sector: "speech_technology", status: "active", cover_image: "",
    team_members: ["starnley-odiwuor", "dr-vivian-oloo", "valary-otieno"], partners: ["ACTS"]
  },
  {
    title: "AI4D Hub for AI and Disability Inclusion",
    slug: "ai4d-hub-ai-disability-inclusion",
    description: `Combined initiative for AI and disability inclusion research and practice, spanning the IDRC-funded 'AI4D Hub for AI and Disability Inclusion' (2026-2028) and the Data Science Africa-funded 'AI for Disability Inclusion' project (2026-2027) — treated as a single project per MCAAI's confirmation that these are the same initiative.`,
    sector: "disability", status: "active", start_date: "2026-01-01", end_date: "2028-12-31", cover_image: "",
    team_members: [], partners: ["IDRC", "Data Science Africa"],
    _flag: "No individual Principal Investigator or team member was named for this project in the source documents."
  },
  {
    title: "ASR Collaboration with Eva",
    slug: "asr-collaboration-with-eva",
    description: `Automatic speech recognition research collaboration led by Cynthia Amol and team.`,
    sector: "speech_technology", status: "active", cover_image: "",
    team_members: ["cynthia-jayne-amol"], partners: ["Eva"]
  },
  {
    title: "CVEinAI: Critical Virtual Exchange in Artificial Intelligence",
    slug: "cveinai-critical-virtual-exchange-ai",
    description: `EU-funded project developing critical virtual exchange modules in artificial intelligence education.`,
    sector: "education", status: "ongoing", start_date: "2025-01-01", end_date: "2026-12-31", cover_image: "",
    team_members: ["cynthia-jayne-amol", "edwin-onkoba"], partners: ["European Union"]
  },
  {
    title: "Piloting Alternative Language Data Licenses",
    slug: "piloting-alternative-language-data-licenses",
    description: `Mozilla Common Voice-funded project piloting alternative language data licensing frameworks, producing the Dhonam dataset on the Mozilla Data Collective.`,
    sector: "data_governance", status: "completed", start_date: "2025-01-01", end_date: "2025-12-31", cover_image: "",
    team_members: ["dr-gabriel-oliko"], partners: ["Mozilla Common Voice"],
    _flag: "No individual PI was named in the source document; Dr. Gabriel Oliko linked based on his role as MCAAI's data governance/open-licensing lead (architect of NOODL) — confirm this is correct."
  },
  {
    title: "Kenyan Languages Corpus for NLP and Machine Translation (SG-NAPI)",
    slug: "kenyan-languages-corpus-nlp-mt-sg-napi",
    description: `UNESCO TWAS-BMBF Seed Grant for New African Principal Investigators project, building a Kenyan languages corpus for natural language processing and machine translation, and supporting several MSc students.`,
    sector: "nlp", status: "completed", start_date: "2023-01-01", end_date: "2024-12-31", cover_image: "",
    team_members: ["ezekiel-maina", "nelson-odhiambo", "edwin-onkoba", "maureen-awour"], partners: ["UNESCO TWAS-BMBF"]
  },
  {
    title: "KenCorpus: Kenyan Language Corpus for NLP and Machine Learning",
    slug: "kencorpus-kenyan-language-corpus",
    description: `Lacuna Fund-funded project, led by Dr. Lilian Wanzare as Principal Investigator, building KenCorpus — a Kenyan language corpus for natural language processing and machine learning research.`,
    sector: "nlp", status: "completed", start_date: "2021-01-01", end_date: "2022-12-31", cover_image: "",
    team_members: ["dr-lilian-wanzare"], partners: ["Lacuna Fund"]
  },
  {
    title: "Building NLP Text and Speech Datasets for Low-Resourced Languages in East Africa",
    slug: "nlp-text-speech-datasets-low-resourced-east-africa",
    description: `Lacuna Fund-funded project building NLP text and speech datasets for low-resourced languages in East Africa, including Kiswahili data collection from Mozilla and a joint publication with the Makerere University team.`,
    sector: "nlp", status: "completed", start_date: "2021-01-01", end_date: "2022-12-31", cover_image: "",
    team_members: ALL_TEAM_MEMBER_SLUGS, partners: ["Lacuna Fund", "Makerere University", "Mozilla Common Voice"]
  }
];

const datasetSeeds = [
  {
    name: 'PolitiKweli: A Swahili-English Code-Switched Twitter Political Misinformation Classification Dataset',
    slug: 'politikweli-swahili-english-code-switched-twitter-political-misinformation-classification-dataset',
    language: 'Swahili / English / code-switched',
    size_description: '6,345 code-switched texts, 22,954 English texts, 211 Swahili texts',
    format: 'Text + labels',
    license: 'CC-BY-4.0',
    description: 'PolitiKweli is the first Swahili-English code-switched dataset for political misinformation classification in Kenya. It contains 6,345 code-switched texts alongside 22,954 English texts and 211 Swahili texts, sourced from Twitter (now X) and labelled as fake, fact or neutral against a fact-checked reference set built as part of the same study.',
    download_url: 'https://github.com/jayneamol/kweli',
    requires_request: false,
    associated_project: null,
  },
  {
    name: 'Global PIQA: Evaluating Commonsense Reasoning Across 100+ Languages and Cultures',
    slug: 'global-piqa-evaluating-commonsense-reasoning-across-100-languages-and-cultures',
    language: '136 language varieties across 18 language families',
    size_description: '100 examples per language across 100+ languages',
    format: 'Benchmark / JSONL',
    license: 'CC BY-SA 4.0',
    description: 'Global PIQA is a participatory commonsense reasoning benchmark covering over 100 languages, built by hand by more than 350 researchers from over 65 countries. The non-parallel split covers 136 language varieties across five continents, 18 language families and 24 writing systems, with 100 examples per language and over 50% referencing local foods, customs or other culturally specific elements.',
    download_url: 'https://huggingface.co/datasets/mrlbenchmarks/global-piqa-nonparallel',
    requires_request: false,
    associated_project: null,
  },
  {
    name: 'AfriVoices-KE: A Multilingual Speech Dataset for Kenyan Languages (African Next Voices)',
    slug: 'afrivoices-ke-multilingual-speech-dataset-for-kenyan-languages',
    language: 'Dholuo, Kikuyu, Somali, Kalenjin, Maasai',
    size_description: '3,000+ hours of scripted and unscripted audio, 9,000+ hours across 18 African languages',
    format: 'Audio + transcripts',
    license: 'CC-BY-4.0',
    description: 'African Next Voices is a multilingual speech dataset targeting over 3,000 hours of scripted and unscripted audio across Dholuo, Kikuyu, Somali, Kalenjin and Maasai, collected under the Kenya pilot led by the KenCorpus Consortium and funded by the Gates Foundation. Recordings span eleven domains including agriculture, healthcare, financial transactions and digital government services, collected through ethical, community-led processes with speaker-disjoint train/dev/test splits.',
    download_url: 'https://huggingface.co/Anv-ke',
    requires_request: false,
    associated_project: null,
  },
  {
    name: 'CommonLID: Re-evaluating State-of-the-Art Language Identification Performance on Web Data',
    slug: 'commonlid-re-evaluating-state-of-the-art-language-identification-performance-on-web-data',
    language: '109 languages',
    size_description: '350,000+ annotated lines across 109 languages',
    format: 'Text annotations',
    license: 'Common Crawl Terms of Use (evaluation only)',
    description: 'CommonLID is a community-created language identification benchmark of web text manually annotated for language, covering 109 languages (78 with at least 100 lines of data), totalling over 350,000 annotated lines. It was built as a shared task at the Workshop on Multilingual Data Quality Signals and released under the Common Crawl terms of use for evaluation-only use.',
    download_url: 'https://huggingface.co/datasets/commoncrawl/CommonLID',
    requires_request: false,
    associated_project: null,
  },
  {
    name: 'Sign Language dataset in Zenodo',
    slug: 'sign-language-dataset-zenodo',
    language: 'Kenyan Sign Language',
    size_description: 'Annotated sign language video resources',
    format: 'Video dataset',
    license: 'Open access (Zenodo record)',
    description: 'A sign language dataset hosted in Zenodo for Kenyan Sign Language research and development, supporting computer vision and assistive technology work for deaf and hard-of-hearing communities.',
    download_url: 'https://zenodo.org/',
    requires_request: false,
    associated_project: null,
  },
  {
    name: 'Swahili and code-switched English-Swahili hate speech dataset in Zenodo',
    slug: 'swahili-code-switched-english-swahili-hate-speech-dataset-zenodo',
    language: 'Swahili / English-Swahili code-switching',
    size_description: '101,014 tweets with hate class, target and language labels',
    format: 'Tweet dataset / CSV',
    license: 'Open access (Zenodo record)',
    description: 'This study fills data scarcity gaps by curating a Swahili and code-switched English-Swahili hate speech dataset and annotating with hate class, target and language. The dataset combines Politikweli, AfriSenti, and Hate_Speech_Kenya and contains 101,014 tweets with multilingual content and hate target labels including nationality, social status, politics, disability, ethnicity, gender, religion and others.',
    download_url: 'https://zenodo.org/',
    requires_request: false,
    associated_project: null,
  }
];

const publicationSeeds = [
  {
    title: 'State of NLP in Kenya: A Survey',
    authors: 'CJ Amol, EA Chimoto, RD Gesicho, AM Gitau, NA Etori, C Kinyanjui, ...',
    year: 2024,
    venue: 'arXiv preprint arXiv:2410.09948',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: 'https://arxiv.org/abs/2410.09948',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'Global PIQA: Evaluating Physical Commonsense Reasoning Across 100+ Languages and Cultures',
    authors: 'TA Chang, C Arnett, A Eldesokey, A Sadallah, A Kashar, A Daud, ...',
    year: 2025,
    venue: 'arXiv preprint / EMNLP',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=SVeANIQAAAAJ&citation_for_view=SVeANIQAAAAJ:ufrVoPGSRksC',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'Politikweli: A Swahili-English Code-Switched Twitter Political Misinformation Classification Dataset',
    authors: 'C Amol, L Wanzare, J Obuhuma',
    year: 2023,
    venue: 'International Conference on Speech and Language Technologies for Low Resource Languages / Dataset release',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Dataset',
    category: 'Datasets',
    is_open_access: true,
    url: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=SVeANIQAAAAJ&citation_for_view=SVeANIQAAAAJ:u5HHmVD_uO8C',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'CommonLID: Re-evaluating State-of-the-Art Language Identification Performance on Web Data',
    authors: 'P Ortiz Suarez, L Burchell, C Arnett, R Mosquera-Gómez, SH Monsalve, T Vaughan, ...',
    year: 2026,
    venue: 'arXiv e-prints / ACL proceedings',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: 'https://arxiv.org/abs/2601.18026',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'Modelling Misinformation in Swahili-English Code-switched Texts',
    authors: 'C Amol, L Wanzare, J Obuhuma',
    year: 2025,
    venue: 'International Journal of Information Technology and Computer Science',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=SVeANIQAAAAJ&citation_for_view=SVeANIQAAAAJ:WF5omc3nYNoC',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'Evaluating the Effect of Linguistic Relatedness on Cross-Lingual Transfer in Large Multilingual Automatic Speech Recognition',
    authors: 'A Florian, CJ Amol, HK Ombaba, X Cui, B Mwau, BM Kamau, ...',
    year: 2026,
    venue: 'arXiv preprint arXiv:2607.04814',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: 'https://arxiv.org/abs/2607.04814',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'AfriVoices-KE: A Multilingual Speech Dataset for Kenyan Languages',
    authors: 'L Wanzare, C Amol, E Maina, N Odhiambo, H Kerubo, L Misula, V Oloo, ...',
    year: 2026,
    venue: 'SIGUL 2026 / Workshop proceedings',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Dataset',
    category: 'Datasets',
    is_open_access: true,
    url: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=SVeANIQAAAAJ&citation_for_view=SVeANIQAAAAJ:UebtZRa9Y70C',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: "Kenyan sign language word-based pose dataset",
    authors: 'E Maina, L Wanzare, J Obuhuma, M Ayere, M Kang\'ahi, J Okutoyi',
    year: 2025,
    venue: 'Data in Brief',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Dataset',
    category: 'Datasets',
    is_open_access: true,
    url: '',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'Leveraging Artificial Intelligence for Kenyan Sign Language Production to Support Deaf Learners',
    authors: 'M Ayere, L Wanzare, J Okutoyi, M Kangahi, E Maina',
    year: 2024,
    venue: 'ICERI2024 Proceedings',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=ZmDM9y4AAAAJ&citation_for_view=ZmDM9y4AAAAJ:u-x6o8ySG0sC',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'Tonative: Community-Driven Extension of African Datasets Through Human-AI Collaboration',
    authors: 'CJ Amol, S Ibejih',
    year: 2026,
    venue: 'AI for African Languages Conference',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Paper',
    category: 'Research',
    is_open_access: true,
    url: '',
    doi: undefined,
    research_areas: [],
    projects: []
  },
  {
    title: 'AfriHate: A Multilingual Collection of Hate Speech and Abusive Language Datasets for African Languages',
    authors: 'SH Muhammad, I Abdulmumin, AA Ayele, DI Adelani, IS Ahmad, SM Aliyu, ...',
    year: 2025,
    venue: 'Conference proceedings',
    abstract: 'Abstract not provided.',
    pdf_file: '',
    publication_type: 'Dataset',
    category: 'Datasets',
    is_open_access: true,
    url: '',
    doi: undefined,
    research_areas: [],
    projects: []
  }
];

// =====================================================================
// SEED LOGIC
// =====================================================================

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your .env.local or environment before running this script.');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  const flags: string[] = [];

  try {
    console.log('\nWiping existing collections for team members, partners, projects, datasets, and publications...');
    const [tmDel, partnerDel, projectDel, datasetDel, publicationDel] = await Promise.all([
      TeamMember.deleteMany({}),
      Partner.deleteMany({}),
      Project.deleteMany({}),
      Dataset.deleteMany({}),
      Publication.deleteMany({})
    ]);
    console.log(`  Deleted ${tmDel.deletedCount} team members`);
    console.log(`  Deleted ${partnerDel.deletedCount} partners`);
    console.log(`  Deleted ${projectDel.deletedCount} projects`);
    console.log(`  Deleted ${datasetDel.deletedCount} datasets`);
    console.log(`  Deleted ${publicationDel.deletedCount} publications`);

    console.log('\nInserting team members...');
    const teamMemberSlugToId = new Map<string, mongoose.Types.ObjectId>();
    for (const tm of teamMembers) {
      const created = await TeamMember.create(tm);
      teamMemberSlugToId.set(tm.slug, created._id as mongoose.Types.ObjectId);
    }
    console.log(`  Inserted ${teamMemberSlugToId.size} team members`);

    console.log('\nInserting partners...');
    const partnerNameToId = new Map<string, mongoose.Types.ObjectId>();
    for (const p of partners) {
      const { _flag, ...doc } = p;
      const created = await Partner.create(doc);
      partnerNameToId.set(p.name, created._id as mongoose.Types.ObjectId);
      if (_flag) flags.push(`Partner "${p.name}": ${_flag}`);
    }
    console.log(`  Inserted ${partnerNameToId.size} partners`);

    console.log('\nInserting projects...');
    let projectCount = 0;
    for (const proj of projects) {
      const { _flag, team_members, partners: partnerNames, start_date, end_date, ...rest } = proj;

      const resolvedTeamMembers: mongoose.Types.ObjectId[] = [];
      for (const slug of team_members) {
        const id = teamMemberSlugToId.get(slug);
        if (!id) { flags.push(`Project "${proj.title}": could not resolve team_member slug "${slug}" — skipped.`); continue; }
        resolvedTeamMembers.push(id);
      }

      const resolvedPartners: mongoose.Types.ObjectId[] = [];
      for (const name of partnerNames) {
        const id = partnerNameToId.get(name);
        if (!id) { flags.push(`Project "${proj.title}": could not resolve partner name "${name}" — skipped.`); continue; }
        resolvedPartners.push(id);
      }

      await Project.create({
        ...rest,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        research_areas: [],
        team_members: resolvedTeamMembers,
        partners: resolvedPartners
      });

      projectCount++;
      if (_flag) flags.push(`Project "${proj.title}": ${_flag}`);
    }
    console.log(`  Inserted ${projectCount} projects`);

    console.log('\nInserting datasets...');
    const datasetCount = await Dataset.insertMany(datasetSeeds);
    console.log(`  Inserted ${datasetCount.length} datasets`);

    console.log('\nInserting publications...');
    // Helper to make slugs for author names/orgs
    const slugifyName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const publicationDocs: Record<string, unknown>[] = [];
    for (const publication of publicationSeeds) {
      // Parse authors into tokens. This is forgiving and will treat organizations as authors as well.
      const rawAuthors = (publication.authors || '') as string;
      const authorTokens = rawAuthors
        .split(/,| and | & |\/|;|\||\band\b/i)
        .map((t) => t.trim())
        .filter(Boolean);

      const teamAuthorIds: mongoose.Types.ObjectId[] = [];
      for (const authorName of authorTokens) {
        let slug = slugifyName(authorName);
        if (!slug) slug = `author-${Date.now().toString().slice(-5)}-${Math.random().toString(36).slice(2,6)}`;
        let id = teamMemberSlugToId.get(slug);
        if (!id) {
          // Try to find by exact name in DB (handles pre-existing members with different slug)
          const existing = await TeamMember.findOne({ name: authorName }).exec();
          if (existing) {
            id = existing._id as mongoose.Types.ObjectId;
            teamMemberSlugToId.set(existing.slug, id);
            } else {
            // Create a minimal TeamMember record for this author/org
            const created = await TeamMember.create({
              name: authorName,
              slug,
              title: 'Collaborator',
              bio: 'No bio provided.',
              photo: '',
              email: '',
              linkedin: '',
              google_scholar: '',
              research_interests: '',
              order: 999
            });
            id = created._id as mongoose.Types.ObjectId;
            teamMemberSlugToId.set(slug, id);
          }
        }
        if (id) teamAuthorIds.push(id);
      }

      const { doi, ...rest } = publication;
      const doc = doi ? { ...rest, doi, team_authors: teamAuthorIds } : { ...rest, team_authors: teamAuthorIds };
      publicationDocs.push(doc);
    }

    const insertedPubs = await Publication.insertMany(publicationDocs);
    console.log(`  Inserted ${insertedPubs.length} publications`);

    console.log('\n=== Seed complete ===');
    console.log(`Team members: ${teamMemberSlugToId.size}`);
    console.log(`Partners: ${partnerNameToId.size}`);
    console.log(`Projects: ${projectCount}`);
    console.log(`Datasets: ${datasetCount.length}`);
    console.log(`Publications: ${insertedPubs.length}`);

    if (flags.length > 0) {
      console.log(`\n=== ${flags.length} item(s) need human review ===`);
      for (const f of flags) console.log(`  - ${f}`);
    }
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected.');
  }
}

main().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});