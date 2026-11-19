import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiHeadphones, FiMic, FiShield, FiUsers } from 'react-icons/fi';
import type { InnovationType } from '@/lib/api';

const soundBars = [20, 34, 52, 30, 44, 64, 40, 26, 56, 38, 48, 24, 60, 34, 44, 22, 52, 30, 42, 18];

const qualityChecks = [
  { title: 'Duration', description: 'Checks that recordings meet the expected length.' },
  { title: 'Noise', description: 'Checks that background noise does not compromise clarity.' },
  { title: 'Edge silence', description: 'Checks for excessive silence at the start or end.' },
  { title: 'Signal quality', description: 'Checks signal-to-noise ratio before a clip is accepted.' },
];

const workflowCards = [
  {
    icon: FiMic,
    title: 'Contribute a voice',
    description: 'Complete onboarding and consent, qualify for a task, then record assigned ASR or TTS sentences.',
  },
  {
    icon: FiHeadphones,
    title: 'Review recordings',
    description: 'Reviewers listen to submitted ASR clips and record approval or rejection decisions.',
  },
  {
    icon: FiShield,
    title: 'Govern language quality',
    description: 'Language leads and administrators manage assignments, qualifications, flags, and validation.',
  },
];

export default function SmartVoiceLanding({ product }: { product: InnovationType }) {
  const users = product.users || [];

  return (
    <div className="bg-background text-on-surface">
      <section className="relative overflow-hidden border-b border-outline-variant/60 bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-8 flex justify-center">
            <Image
              src="/smartvoice-logo.webp"
              alt="SmartVoice"
              width={320}
              height={106}
              className="max-w-full mix-blend-darken"
              style={{ width: '320px', height: 'auto' }}
              priority
            />
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-mcaai-green" />
                {product.category}
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-university-deep-blue sm:text-5xl lg:text-6xl">
                Technology that speaks your language.
                <span className="mt-2 block text-primary">Kikuyu and Kalenjin.</span>
              </h1>
              <p className="mt-6 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
                {product.subtitle}
              </p>
              <p className="mt-4 max-w-xl font-body-md text-body-md text-on-surface-variant">
                {product.summary || product.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition hover:bg-university-deep-blue"
                >
                  Get in touch <FiArrowRight aria-hidden="true" />
                </Link>
                <a
                  href="#quality"
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-3 font-semibold text-primary transition hover:bg-surface-container"
                >
                  <FiCheckCircle aria-hidden="true" /> Explore quality checks
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-outline-variant/60 pt-6">
                {[
                  ['2', 'languages'],
                  ['ASR + TTS', 'speech workflows'],
                  ['2-stage', 'audio validation'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-headline text-xl font-bold text-university-deep-blue sm:text-2xl">{value}</p>
                    <p className="mt-1 text-xs text-on-surface-variant sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-lg sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-error" />
                  <span className="h-2.5 w-2.5 rounded-full bg-university-gold" />
                  <span className="h-2.5 w-2.5 rounded-full bg-mcaai-green" />
                  <span className="ml-2 text-xs font-semibold tracking-wide text-on-surface-variant">WORKFLOW PREVIEW</span>
                </div>
                <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-primary">SmartVoice</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-low p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-outline">Language collection</p>
                  <p className="mt-1 font-headline text-lg font-semibold text-university-deep-blue">Kikuyu &amp; Kalenjin</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-primary-fixed/70 px-3 py-1 text-xs font-semibold text-primary">ASR</span>
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-fixed">TTS</span>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-neutral-surface p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-outline">Recording journey</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                    <FiMic aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-university-deep-blue">A community voice, carefully captured</p>
                    <p className="mt-1 text-sm text-on-surface-variant">From consent and qualification to review</p>
                  </div>
                </div>
                <div className="mt-5 flex h-16 items-center justify-between gap-1 overflow-hidden rounded-lg bg-surface-container-low px-3" aria-hidden="true">
                  {soundBars.map((height, index) => (
                    <span
                      key={index}
                      className={`w-1.5 shrink-0 rounded-full ${index % 4 === 0 ? 'bg-mcaai-green' : 'bg-primary'}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  {['Record', 'Validate', 'Review'].map((step, index) => (
                    <div key={step} className="rounded-lg bg-surface-container-lowest p-2">
                      <span className="block font-semibold text-primary">0{index + 1}</span>
                      <span className="mt-1 block text-on-surface-variant">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-outline">
                A visual overview of the platform workflow; recordings and validation are completed in the SmartVoice system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest py-16 sm:py-20" id="languages">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Language-first speech data</p>
            <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">
              Built around Kikuyu and Kalenjin
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              SmartVoice supports community-centered speech collection and validation for both languages, with ASR and TTS workflows.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { initial: 'K', name: 'Kikuyu', workflow: 'ASR and TTS recording pathways' },
              { initial: 'K', name: 'Kalenjin', workflow: 'ASR and TTS recording pathways' },
            ].map((language) => (
              <article key={language.name} className="rounded-2xl border border-outline-variant/60 bg-background p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-on-primary">
                      {language.initial}
                    </span>
                    <div>
                      <h3 className="font-headline text-2xl font-semibold text-university-deep-blue">{language.name}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">Community voice collection</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-fixed">Supported</span>
                </div>
                <p className="mt-6 text-sm leading-6 text-on-surface-variant">{language.workflow} with onboarding, consent, and review.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(product.stack || []).map((item) => (
                    <span key={item} className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16 sm:py-20" id="workflows">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">A coordinated workflow</p>
            <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">Every role helps improve the corpus</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {workflowCards.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed/60 text-primary">
                  <Icon aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-outline">Step 0{index + 1}</p>
                <h3 className="mt-2 font-headline text-xl font-semibold text-university-deep-blue">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest py-16 sm:py-20" id="quality">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-university-deep-blue p-6 text-on-primary sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/10 px-4 py-2 text-sm font-semibold text-primary-fixed">
                  <FiShield aria-hidden="true" /> Quality gate
                </span>
                <h2 className="mt-5 font-headline text-3xl font-semibold sm:text-4xl">Audio quality is checked before acceptance.</h2>
                <p className="mt-4 leading-7 text-surface-container-high">
                  Browser and server-side checks help identify recordings that are too short, noisy, silent, or low in signal quality.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {qualityChecks.map((check, index) => (
                  <article key={check.title} className="rounded-xl border border-surface-container-lowest/20 bg-surface-container-lowest/10 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-primary-fixed">CHECK 0{index + 1}</span>
                      <FiCheckCircle aria-hidden="true" className="text-secondary-container" />
                    </div>
                    <h3 className="mt-4 font-headline text-lg font-semibold">{check.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-surface-container-high">{check.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {users.length > 0 ? (
        <section className="bg-surface-container-low py-16 sm:py-20" id="roles">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Access and stewardship</p>
              <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">A role for each part of the process</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {users.map(({ role, description }) => (
                <article key={role} className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5">
                  <FiUsers aria-hidden="true" className="text-xl text-primary" />
                  <h3 className="mt-4 font-headline text-lg font-semibold text-university-deep-blue">{role}</h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Community-powered language technology</p>
          <h2 className="mt-3 font-headline text-3xl font-semibold text-university-deep-blue sm:text-4xl">
            Help build voice technology that includes more communities.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-md text-on-surface-variant">
            Contact MCAAI to learn more about SmartVoice, language data, or opportunities to collaborate.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition hover:bg-university-deep-blue"
          >
            Contact MCAAI <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
