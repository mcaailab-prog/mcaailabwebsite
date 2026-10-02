'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiExternalLink, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const logout = async () => {
    setBusy(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navMarkup = (
    <>
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
              onClick={() => setMobileMenuOpen(false)}
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
        <Link href="/" className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
          <FiExternalLink className="h-4 w-4" />
          View site
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={busy}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
        >
          <FiLogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-outline-variant bg-university-deep-blue text-white md:flex md:flex-col">
        {navMarkup}
      </aside>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-30 bg-university-deep-blue/60 md:hidden" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[82%] max-w-xs bg-university-deep-blue text-white shadow-xl transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active ? 'bg-white text-university-deep-blue' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={logout}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-sm font-semibold text-university-deep-blue hover:opacity-95"
            >
              <FiLogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-university-deep-blue px-4 py-3 shadow-lg md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white md:hidden"
              aria-label="Open admin menu"
            >
              {mobileMenuOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/10 p-1.5">
                <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white">M</div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">MCAAI</p>
                <p className="text-sm font-medium text-white">Content management</p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="h-9 w-9 rounded-full bg-white/10 p-1.5">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white">M</div>
            </div>
            <p className="text-sm font-medium text-white">Admin</p>
          </div>
        </header>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
