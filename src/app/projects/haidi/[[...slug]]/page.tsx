'use client';

import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

type AddnAppProps = {
  onBack?: () => void;
};

const AddnApp = dynamic(
  async () => {
    const appModule = await import('../../../addn-haidi/src/App');
    return appModule.default as ComponentType<AddnAppProps>;
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
