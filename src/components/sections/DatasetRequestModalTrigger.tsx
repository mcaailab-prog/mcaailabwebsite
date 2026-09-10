import Link from 'next/link';
import { MdDataset } from 'react-icons/md';

export default function DatasetRequestModalTrigger() {
  return (
    <Link
      href="/datasets/request"
      className="inline-flex items-center gap-2 rounded-lg border-2 border-[#72C6D5] px-8 py-4 font-montserrat font-bold text-white transition-all duration-200 hover:bg-[#72C6D5]/20"
    >
      <MdDataset />
      request Dataset Access
    </Link>
  );
}
