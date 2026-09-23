import Link from 'next/link';
import type { DatasetType } from '@/lib/api-types';
import { canOpenDataset, datasetOpenLabel } from '@/lib/datasets';

interface DatasetRequestActionProps {
  dataset: DatasetType;
  buttonClass?: string;
}

export default function DatasetRequestAction({ dataset, buttonClass }: DatasetRequestActionProps) {
  const defaultBtn =
    'w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-montserrat text-[14px] font-bold text-white transition-all hover:opacity-90';

  if (canOpenDataset(dataset) && dataset.download_url) {
    return (
      <a
        href={dataset.download_url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass ?? defaultBtn}
      >
        {datasetOpenLabel(dataset.download_url)}
      </a>
    );
  }

  if (!dataset.requires_request) {
    return null;
  }

  const href = `/datasets/request?dataset=${encodeURIComponent(dataset.slug ?? dataset.id ?? '')}`;

  return (
    <Link href={href} className={buttonClass ?? defaultBtn}>
      Request Access
    </Link>
  );
}
