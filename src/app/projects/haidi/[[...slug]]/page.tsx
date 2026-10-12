'use client';

import dynamic from 'next/dynamic';

const AddnApp = dynamic(
  async () => {
    const module = await import('../../../addn-haidi/src/App');
    return module.default as any;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f7] text-sm font-medium uppercase tracking-[0.14em] text-[#5a3a3a]">
        Loading HAIDI platform...
      </div>
    ),
  },
);

export default function HaidiProjectPage() {
  return <AddnApp />;
}
