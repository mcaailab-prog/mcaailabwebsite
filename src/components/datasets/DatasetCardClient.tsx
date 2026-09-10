"use client";

import Link from 'next/link';
import type { DatasetType } from '@/lib/api-types';
import DatasetRequestAction from '@/components/datasets/DatasetRequestAction';
import RichTextRenderer from '@/components/ui/RichTextRenderer';

export default function DatasetCardClient({ dataset }: { dataset: DatasetType }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/datasets/${dataset.slug}`} className="inline-block">
              <h3 className="mb-2 text-[20px] font-bold leading-snug text-primary transition-colors group-hover:text-primary/80">
                {dataset.name}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-x-3 text-[12px] text-on-surface-variant">
              {dataset.language && <span>{dataset.language}</span>}
              {dataset.size_description && <span>{dataset.size_description}</span>}
            </div>
          </div>

          {dataset.associated_project?.title ? (
            <div className="hidden text-right text-[12px] text-on-surface-variant md:block">
              {dataset.associated_project.title}
            </div>
          ) : null}
        </div>

        <RichTextRenderer
          content={dataset.description}
          className="mb-4 mt-4 line-clamp-3 text-[14px] leading-relaxed text-on-surface-variant"
        />

        <div className="mt-auto pt-4">
          <div className="flex gap-3">
            <DatasetRequestAction
              dataset={dataset}
              buttonClass="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-montserrat text-[14px] font-bold text-white transition-all hover:opacity-90"
            />

            <Link
              href={`/datasets/${dataset.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 font-montserrat text-[14px] font-semibold text-primary transition-all hover:border-primary hover:bg-primary/5"
            >
              View Details
            </Link>
          </div>

          <div className="mt-4 border-t border-outline-variant/70 pt-3 text-[12px] text-on-surface-variant">
            <span className="font-medium text-on-surface">Licensed by:</span>{' '}
            {dataset.license ? dataset.license : 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  );
}
