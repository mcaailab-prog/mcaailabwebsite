import Link from 'next/link';
import type { DatasetType } from '@/lib/api-types';

interface DatasetRequestActionProps {
  dataset: DatasetType;
  buttonClass?: string;
}

export default function DatasetRequestAction({ dataset, buttonClass }: DatasetRequestActionProps) {
  const defaultBtn =
    'w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-montserrat text-[14px] font-bold text-white transition-all hover:opacity-90';

  const href = `/datasets/request?dataset=${encodeURIComponent(dataset.slug ?? dataset.id ?? '')}`;

  return (
    <Link href={href} className={buttonClass ?? defaultBtn}>
      Request Access
    </Link>
  );
}
