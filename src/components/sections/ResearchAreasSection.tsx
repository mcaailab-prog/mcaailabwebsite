'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from "@/lib/icons";
import type { ResearchAreaType as ResearchArea } from '@/lib/api-types';

export default function ResearchAreasSection() {
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        const res = await fetch(`/api/research${params.toString() ? `?${params.toString()}` : ''}`);
        if (!res.ok) throw new Error('Failed to load research areas');
        const data: ResearchArea[] = await res.json();
        setResearchAreas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load research areas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  if (loading) return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="text-center mb-12">
          <div className="mx-auto h-6 w-48 rounded-full bg-surface-container-low/50 animate-pulse"></div>
          <div className="mt-4 mx-auto h-4 w-96 rounded-full bg-surface-container-low/50 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="relative bg-surface-container-low rounded-xl border border-outline-variant/30 p-6 animate-pulse">
              <div className="h-44 rounded-2xl bg-surface-container-low/50 mb-4" />
              <div className="space-y-3">
                <div className="h-5 w-32 rounded-full bg-surface-container-low/80" />
                <div className="h-6 w-3/4 rounded-full bg-surface-container-low/80" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-full bg-surface-container-low/80" />
                  <div className="h-4 w-5/6 rounded-full bg-surface-container-low/80" />
                </div>
                <div className="h-8 w-28 rounded-full bg-surface-container-low/80 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  if (error) return <div className="text-red-500 text-center py-16">⚠️ {error}</div>;
  if (!researchAreas.length) return <div className="text-center py-16 text-gray-600">No research areas found</div>;

  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-[36px] text-university-deep-blue mb-4">
            Research Areas
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Our research focuses on critical areas that drive societal impact
          </p>
        </div>

        {/* Research Area Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              className={`
                px-4 py-2
                ${selectedCategory === null ? 'bg-university-deep-blue text-on-primary' : 'border border-outline-variant'}
                rounded-full font-label-sm text-label-sm uppercase tracking-wider
                hover:${selectedCategory === null ? 'bg-university-deep-blue/20' : 'hover:border-mcaai-teal/20'}
                transition-all
              `}
              onClick={() => setSelectedCategory(null)}
            >
              All Areas
            </button>
            <button
              className={`
                px-4 py-2
                ${selectedCategory === 'nlp_low_resource' ? 'bg-university-deep-blue text-on-primary' : 'border border-outline-variant'}
                rounded-full font-label-sm text-label-sm uppercase tracking-wider
                hover:${selectedCategory === 'nlp_low_resource' ? 'bg-university-deep-blue/20' : 'hover:border-mcaai-teal/20'}
                transition-all
              `}
              onClick={() => setSelectedCategory('nlp_low_resource')}
            >
              NLP & Low-Resource Languages
            </button>
            <button
              className={`
                px-4 py-2
                ${selectedCategory === 'disability_inclusion' ? 'bg-university-deep-blue text-on-primary' : 'border border-outline-variant'}
                rounded-full font-label-sm text-label-sm uppercase tracking-wider
                hover:${selectedCategory === 'disability_inclusion' ? 'bg-university-deep-blue/20' : 'hover:border-mcaai-teal/20'}
                transition-all
              `}
              onClick={() => setSelectedCategory('disability_inclusion')}
            >
              Disability Inclusion
            </button>
            <button
              className={`
                px-4 py-2
                ${selectedCategory === 'data_governance' ? 'bg-university-deep-blue text-on-primary' : 'border border-outline-variant'}
                rounded-full font-label-sm text-label-sm uppercase tracking-wider
                hover:${selectedCategory === 'data_governance' ? 'bg-university-deep-blue/20' : 'hover:border-mcaai-teal/20'}
                transition-all
              `}
              onClick={() => setSelectedCategory('data_governance')}
            >
              Data Governance
            </button>
            <button
              className={`
                px-4 py-2
                ${selectedCategory === 'applied_ai' ? 'bg-university-deep-blue text-on-primary' : 'border border-outline-variant'}
                rounded-full font-label-sm text-label-sm uppercase tracking-wider
                hover:${selectedCategory === 'applied_ai' ? 'bg-university-deep-blue/20' : 'hover:border-mcaai-teal/20'}
                transition-all
              `}
              onClick={() => setSelectedCategory('applied_ai')}
            >
              Applied AI
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchAreas.map(area => {
            // Skip invalid research area objects
            if (!area || typeof area !== 'object') {
              return null;
            }

            return (
              <div key={area.id} className="group relative bg-surface-container-low rounded-xl border border-outline-variant/30 p-6 research-card-hover transition-all hover:shadow-sm hover:border-mcaai-teal/20">
                {/* Top accent bar (expands on hover) */}
                <div className="card-accent absolute top-0 left-0 h-0.5 w-[6rem] bg-mcaai-teal transition-all duration-500 group-hover:w-[12rem]"></div>
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low/50">
                    {area.cover_image ? (
                      <Image
                        src={area.cover_image}
                        alt={area.title}
                        className="w-full h-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-low/50 flex items-center justify-center">
                        <Icon name="biotech" size={32} color="text-primary" />
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="translate" color="text-mcaai-green" />
                      <span className="font-label-sm text-label-sm text-uppercase tracking-wider text-mcaai-green">
                        NLP & LINGUISTICS
                      </span>
                    </div>
                    <h3 className="font-headline-lg text-[24px] text-university-deep-blue mb-3">{area.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">{area.summary}</p>
                    {/* Tag pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[12px] font-label-sm rounded border border-outline-variant/30">
                        {area.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <Link href={`/research/${area.slug ?? area.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`} className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
                      Explore Dataset <Icon name="arrow_forward" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}