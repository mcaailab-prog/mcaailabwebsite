import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import DatasetCardClient from '@/components/datasets/DatasetCardClient';
import { FiLock, FiUnlock, FiDatabase, FiArrowRight } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Datasets - MCAAI',
  description: 'Explore the datasets stewarded by the Maseno Centre for Applied Artificial Intelligence.',
};

export default async function DatasetsPage() {
  const raw = await api.getDatasets();
  const datasets = JSON.parse(JSON.stringify(raw));

  const open = datasets.filter((d: any) => !d.requires_request);
  const restricted = datasets.filter((d: any) => d.requires_request);

  return (
    <div className="w-full bg-background">

      <section className="mx-auto max-w-container-max px-margin-mobile pb-8 pt-10 md:px-margin-desktop md:pb-12 md:pt-12">
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-outline">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/research" className="transition-colors hover:text-primary">Research</Link>
          <span>/</span>
          <span className="text-on-surface">Datasets</span>
        </nav>

        <h1 className="mb-6 font-display-xl text-headline-lg text-primary md:text-display-xl">
          Datasets
        </h1>

        <p className="max-w-3xl text-[15px] leading-7 text-on-surface-variant md:text-[17px] md:leading-8">
          MCAAI stewards and contributes valuable datasets supporting AI research for African
          languages and contexts. All data is governed under the NOODL open data framework.
        </p>

        <div className="mt-8 w-full max-w-4xl rounded-lg border border-outline-variant bg-surface-container-lowest p-2 shadow-sm transition-all focus-within:border-2 focus-within:border-primary">
          <div className="flex items-center gap-3">
            <FiDatabase size={18} className="ml-3 shrink-0 text-outline" />
            <input
              type="text"
              placeholder="Search datasets, languages, or keywords…"
              className="flex-1 border-none bg-transparent py-3 text-[14px] text-on-surface placeholder:text-outline-variant/70 focus:outline-none md:text-[16px]"
            />
          </div>
        </div>
      </section>

      {/* ── Open Access ───────────────────────────────────────────────────── */}
      {open.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8 sm:py-16 lg:px-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-2">
              <FiUnlock size={18} className="text-mcaai-green" />
              <h2 className="font-montserrat text-[20px] font-semibold text-primary sm:text-[28px]">
                Curated List
              </h2>
            </div>
            <div className="h-px flex-1 bg-outline-variant/50" />
            <span className="hidden shrink-0 font-montserrat text-[12px] uppercase tracking-wide text-on-surface-variant sm:block">
              {open.length} dataset{open.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {open.map((dataset: any) => (
              <DatasetCardClient key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </section>
      )}

      {restricted.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8 sm:py-16 lg:px-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-2">
              <FiLock size={18} className="text-mcaai-teal" />
              <h2 className="font-montserrat text-[20px] font-semibold text-primary sm:text-[28px]">
                Restricted Access
              </h2>
            </div>
            <div className="h-px flex-1 bg-outline-variant/50" />
            <span className="hidden shrink-0 font-montserrat text-[12px] uppercase tracking-wide text-on-surface-variant sm:block">
              {restricted.length} dataset{restricted.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {restricted.map((dataset: any) => (
              <DatasetCardClient key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </section>
      )}

      {datasets.length === 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-24 text-center">
          <FiDatabase size={48} className="mx-auto mb-4 text-outline-variant" />
          <p className="text-[16px] text-on-surface-variant">
            No datasets found. Check back soon as we continue to steward and contribute to valuable research datasets.
          </p>
        </section>
      )}

      {/* ── NOODL Governance Banner ───────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto">
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-primary p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="mb-3 font-montserrat text-[11px] font-bold uppercase tracking-widest text-mcaai-teal">
              Data Governance
            </p>
            <h3 className="mb-3 font-montserrat text-[24px] font-bold text-white sm:text-[32px]">
              Governed by NOODL
            </h3>
            <p className="text-white/70 text-[14px] sm:text-[16px] max-w-lg leading-relaxed">
              All MCAAI datasets are released under the Nwulite Obodo Open Data License — ensuring
              community reciprocity, non-exploitative usage rights, and transparent attribution.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/data-sovereignty"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-university-gold px-6 py-3 text-sm font-montserrat font-bold text-university-deep-blue transition-all hover:bg-university-gold/90 sm:px-8 sm:py-4 sm:text-base whitespace-nowrap"
            >
              Read the License
              <FiArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-montserrat font-bold hover:bg-white/10 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Request a Dataset
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

