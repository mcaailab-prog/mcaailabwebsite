'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsletterSection from '@/components/layout/NewsletterSection';
import FeaturedEventsModalClient from '@/components/ui/FeaturedEventsModalClient';
import { usePathname } from 'next/navigation';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <NewsletterSection />
      <Footer />
      <FeaturedEventsModalClient />
    </>
  );
}
