'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/lib/icons';
import { clientApi } from '@/lib/client-api';
import type { ProjectType as Project } from '@/lib/api-types';

export default function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await clientApi.getProjects();
        setProjects(data.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="text-center mb-12">
          <div className="mx-auto h-6 w-48 rounded-full bg-surface-container-low/50 animate-pulse"></div>
          <div className="mt-4 mx-auto h-4 w-96 rounded-full bg-surface-container-low/50 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="group relative bg-surface-container-low rounded-xl border border-outline-variant/30 p-6 animate-pulse">
              <div className="absolute top-0 left-0 h-0.5 w-24 bg-surface-container-low/80"></div>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg bg-surface-container-low/50" />
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 w-32 rounded-full bg-surface-container-low/80" />
                  <div className="h-6 w-5/6 rounded-full bg-surface-container-low/80" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded-full bg-surface-container-low/80" />
                    <div className="h-4 w-5/6 rounded-full bg-surface-container-low/80" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 w-20 rounded-full bg-surface-container-low/80" />
                    <div className="h-8 w-24 rounded-full bg-surface-container-low/80" />
                  </div>
                  <div className="h-8 w-40 rounded-full bg-surface-container-low/80" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  if (error) return <div className="text-red-500 text-center py-16">⚠️ {error}</div>;
  if (!projects.length) return <div className="text-center py-16 text-gray-600">No projects found</div>;

  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-[36px] text-university-deep-blue mb-4">
            Featured Projects
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Innovative projects making real-world impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            // Skip invalid project objects
            if (!project || typeof project !== 'object') {
              return null;
            }

            return (
              <div key={project.id} className="group relative bg-surface-container-low rounded-xl border border-outline-variant/30 p-6 research-card-hover transition-all hover:shadow-sm hover:border-mcaai-teal/20">
                {/* Top accent bar (expands on hover) */}
                <div className="card-accent absolute top-0 left-0 h-0.5 w-[6rem] bg-mcaai-teal transition-all duration-500 group-hover:w-[12rem]"></div>
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low/50">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-low/50 flex items-center justify-center">
                        <Icon name="hub" size={32} color="text-primary" />
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="school" color="text-mcaai-green" />
                      <span className="font-label-sm text-label-sm text-uppercase tracking-wider text-mcaai-green">
                        PROJECT
                      </span>
                    </div>
                    <h3 className="font-headline-lg text-[24px] text-university-deep-blue mb-3">{project.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">{project.description}</p>
                    {/* Tag pills - using project type or status */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[12px] font-label-sm rounded border border-outline-variant/30">
                        {project.sector?.replace('_', ' ').toUpperCase() || 'PROJECT'}
                      </span>
                      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[12px] font-label-sm rounded border border-outline-variant/30">
                        {project.status ? `${project.status.charAt(0).toUpperCase()}${project.status.slice(1)}` : 'Status Unknown'}
                      </span>
                    </div>
                    <a href={`/projects/${project.slug}`} className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
                      Explore Project <Icon name="arrow_forward" />
                    </a>
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
