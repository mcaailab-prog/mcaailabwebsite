import Link from 'next/link';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiDatabase,
  FiDownload,
  FiEdit,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiSearch,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import type { InnovationType } from '@/lib/api';

const pillars = [
  {
    icon: FiShield,
    title: 'Exclusive 300-item batches',
    description: 'Translators claim dedicated packs, keeping work organized and preventing overlapping assignments.',
    detail: 'Claimed work stays exclusive',
  },
  {
    icon: FiDatabase,
    title: 'Translation memory and dictionary QA',
    description: 'Reuse approved translations and check terminology against versioned project dictionaries.',
    detail: 'Consistency at every step',
  },
  {
    icon: FiCheckCircle,
    title: 'Proofreader sample review',
    description: 'Proofreaders review a 10% sample and can approve, edit-approve, or return submitted work.',
    detail: '30-item sample per batch',
  },
  {
    icon: FiDownload,
    title: 'Delivery exports and reporting',
    description: 'Prepare CSV and Excel deliverables with batch monitoring and contributor performance reporting.',
    detail: 'Exports follow approved work',
  },
];

const workspaces = [
  {
    icon: FiLayers,
    title: 'Keyword workspace',
    eyebrow: 'Terminology and short-form content',
    description: 'Organize keyword tasks with dictionary hints, translation-memory suggestions, and quality checks.',
    features: ['Dictionary hints', 'Concordance search', 'Terminology QA'],
  },
  {
    icon: FiFileText,
    title: 'Sentence workspace',
    eyebrow: 'Context-aware translation',
    description: 'Translate sentences in context, use memory suggestions, and run checks before submitting a batch.',
    features: ['Sentence context', 'Translation memory', 'Proofreader review'],
  },
];

const pipeline = [
  { title: 'Import', description: 'Create a project and import keyword or sentence files.' },
  { title: 'Translate', description: 'Claim a batch and work with translation memory and dictionary QA.' },
  { title: 'Review', description: 'Send completed work through the proofreader sample gate.' },
  { title: 'Deliver', description: 'Export approved translations and review batch reporting.' },
];

export default function TafsiriLanding({ product }: { product: InnovationType }) {
  const users = product.users || [];
  const backend = product.backend || [];

  return (
    <div className="bg-background text-on-surface">
      <section className="relative overflow-hidden border-b border-outline-variant/60 bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3 text-primary">
              <FiGlobe aria-hidden="true" className="text-3xl" />
              <span className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Tafsiri</span>
            </div>
            <p className="text-sm font-semibold text-primary">{product.category}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-university-deep-blue sm:text-5xl lg:text-6xl">
              Localisation at scale, guided by community and quality.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
              {product.summary || product.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition hover:bg-university-deep-blue"
              >
                Request access <FiArrowRight aria-hidden="true" />
              </Link>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-5 py-3 font-semibold text-primary transition hover:bg-surface-container"
              >
                <FiBookOpen aria-hidden="true" /> Explore quality standards
              </a>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-university-deep-blue px-5 py-4 text-on-primary sm:px-7">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-mcaai-green" />
                <span className="font-label-sm text-sm font-bold uppercase tracking-wide">Translation workbench</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-primary/70 px-3 py-1.5">300-item exclusive batches</span>
                <span className="rounded-full bg-primary/70 px-3 py-1.5">Proofreader sample gate</span>
              </div>
            </div>

            <div className="grid gap-5 bg-surface-container-low p-4 sm:p-6 lg:grid-cols-12 lg:gap-6">
              <div className="space-y-5 lg:col-span-7">
                <article className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">Source workspace</span>
                    <span className="text-xs text-on-surface-variant">Keywords and sentences</span>
                  </div>
                  <div className="mt-4 rounded-lg bg-surface-container-low p-4">
                    <p className="font-headline text-lg font-semibold text-university-deep-blue">Project content ready for translation</p>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      Work with imported project material and its surrounding context.
                    </p>
                  </div>
                </article>
                <article className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <FiEdit aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-wide">Target translation</span>
                    </div>
                    <span className="text-xs font-semibold text-tertiary">Dictionary checks available</span>
                  </div>
                  <div className="mt-4 flex min-h-24 items-center rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-sm leading-6 text-on-surface-variant">
                    Draft the translation here. Translation-memory suggestions and project terminology checks support consistency.
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-on-surface-variant">Save work and continue through the assigned batch.</span>
                    <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary">
                      Save translation <FiArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </article>
              </div>

              <div className="space-y-5 lg:col-span-5">
                <article className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <FiDatabase aria-hidden="true" />
                    <h2 className="font-headline text-base font-semibold text-university-deep-blue">Translation memory</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                    Approved translations can be reused as suggestions to support consistency across project content.
                  </p>
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-container-low p-3 text-sm text-on-surface-variant">
                    <FiSearch aria-hidden="true" className="shrink-0 text-primary" />
                    Search the concordance for related approved strings.
                  </div>
                </article>
                <article className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-primary">
                      <FiCheckCircle aria-hidden="true" />
                      <h2 className="font-headline text-base font-semibold text-university-deep-blue">Dictionary QA</h2>
                    </div>
                    <span className="text-xs font-semibold text-tertiary">Pre-submission check</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                    Versioned project dictionaries and term-base checks help flag terminology issues before submission.
                  </p>
                  <div className="mt-4 border-t border-outline-variant pt-3 text-xs leading-5 text-on-surface-variant">
                    Terminology · translation memory · revision history
                  </div>
                </article>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-high px-5 py-3 text-sm text-on-surface-variant sm:px-7">
              <span className="font-semibold text-university-deep-blue">Proofreader sample review</span>
              <span>10% sample · approve, edit-approve, or return</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-surface py-16 sm:py-20" id="architecture">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">The Tafsiri workflow engine</p>
              <h2 className="mt-3 font-headline text-3xl font-semibold tracking-tight text-university-deep-blue sm:text-4xl">
                A consistent route from project import to approved delivery.
              </h2>
            </div>
            <p className="max-w-xl text-body-md text-on-surface-variant">
              Batch assignment, dictionary checks, translation memory, and proofreader review work together to support quality across translation projects.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, description, detail }, index) => (
              <article key={title} className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Icon aria-hidden="true" className="text-xl" />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-primary">Pillar 0{index + 1}</p>
                  <h3 className="mt-2 font-headline text-lg font-semibold text-university-deep-blue">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
                </div>
                <p className="mt-6 border-t border-outline-variant pt-3 text-xs font-semibold text-primary">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20" id="workspaces">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Two focused workspaces</p>
            <h2 className="mt-3 font-headline text-3xl font-semibold tracking-tight text-university-deep-blue sm:text-4xl">
              Tools for terminology and sentence-level work.
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              Tafsiri supports keyword and sentence localization with relevant checks and translation-memory assistance.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {workspaces.map(({ icon: Icon, title, eyebrow, description, features }) => (
              <article key={title} className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                      <Icon aria-hidden="true" className="text-xl" />
                    </span>
                    <div>
                      <h3 className="font-headline text-xl font-semibold text-university-deep-blue">{title}</h3>
                      <p className="mt-1 text-xs text-on-surface-variant">{eyebrow}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-on-surface-variant">{description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <li key={feature} className="rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {users.length > 0 ? (
        <section className="bg-neutral-surface py-16 sm:py-20" id="roles">
          <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">Access and governance</p>
                <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">
                  Clear responsibilities at every stage.
                </h2>
              </div>
              <p className="max-w-xl text-body-md text-on-surface-variant">
                Role-aware workflows support translation, sample review, language oversight, and project administration.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {users.map(({ role, description }) => (
                <article key={role} className="flex flex-col rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                    <FiUsers aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-headline text-lg font-semibold text-university-deep-blue">{role}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-on-surface-variant">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-background py-16 sm:py-20" id="pipeline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-university-deep-blue p-6 text-on-primary sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-fixed">Under the hood</p>
                <h2 className="mt-3 font-headline text-3xl font-semibold sm:text-4xl">A traceable translation pipeline.</h2>
                <p className="mt-4 leading-7 text-surface-container-high">
                  {product.overview || product.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(product.stack || []).map((item) => (
                    <span key={item} className="rounded-full bg-surface-container-lowest/10 px-3 py-1.5 text-xs font-semibold text-primary-fixed">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {pipeline.map(({ title, description }, index) => (
                  <article key={title} className="rounded-xl border border-surface-container-lowest/20 bg-surface-container-lowest/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary-fixed">Stage 0{index + 1}</p>
                    <h3 className="mt-3 font-headline text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-surface-container-high">{description}</p>
                  </article>
                ))}
              </div>
            </div>
            {backend.length > 0 ? (
              <ul className="mt-8 grid gap-3 border-t border-surface-container-lowest/20 pt-6 sm:grid-cols-2">
                {backend.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-surface-container-high">
                    <FiShield aria-hidden="true" className="mt-1 shrink-0 text-primary-fixed" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-neutral-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl bg-surface-container-low p-8 text-center">
              <FiGlobe aria-hidden="true" className="text-5xl text-primary" />
              <p className="mt-4 font-headline text-2xl font-bold text-university-deep-blue">Tafsiri</p>
              <p className="mt-1 text-sm text-on-surface-variant">Maseno MCAAI</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">Community-first localization</p>
              <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue">
                {product.impact || 'Supporting quality multilingual translation.'}
              </h2>
              <p className="mt-4 leading-7 text-on-surface-variant">
                Tafsiri brings translators, proofreaders, language leads, and administrators into a shared workflow for reliable localization.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Exclusive batch ownership', 'Dictionary and memory checks', 'Proofreader review'].map((item) => (
                  <div key={item} className="flex items-start gap-2 border-t border-outline-variant pt-3 text-sm font-semibold text-primary">
                    <FiCheckCircle aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary p-7 text-center text-on-primary sm:p-12">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-fixed">Localise with Tafsiri</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-headline text-3xl font-semibold sm:text-4xl">
              Bring a quality-focused workflow to your language project.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-fixed">
              Contact Maseno MCAAI to discuss project access, translation workflows, or collaboration.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-5 py-3 font-semibold text-primary transition hover:bg-surface-container"
            >
              Contact MCAAI <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
