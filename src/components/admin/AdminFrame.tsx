'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/research', label: 'Research areas' },
  { href: '/admin/collaborations', label: 'Collaborations' },
  { href: '/admin/innovations', label: 'Innovations' },
  { href: '/admin/datasets', label: 'Datasets' },
  { href: '/admin/careers', label: 'Career tracks' },
  { href: '/admin/inbox', label: 'Inbox' },
];

export default function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const logout = async () => {
    setBusy(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-outline-variant bg-university-deep-blue text-white md:flex md:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">MCAAI</p>
          <h1 className="mt-1 font-headline text-lg">Admin</h1>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active ? 'bg-white text-university-deep-blue' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link href="/" className="mb-2 block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            View site
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={busy}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-white px-4 py-3 md:px-8">
          <p className="text-sm text-on-surface-variant">Content management</p>
          <div className="flex gap-2 md:hidden">
            {NAV.slice(0, 4).map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md border border-outline-variant px-2 py-1 text-[11px]">
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
