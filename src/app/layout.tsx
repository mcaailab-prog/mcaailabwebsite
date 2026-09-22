import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import PerformanceGuardClient from '@/components/PerformanceGuardClient';

export const metadata: Metadata = {
  title: "MCAAI - Maseno  Center for Applied Artificial intelligence",
  description: "Harnessing AI for community-driven innovations. Positioning Maseno University at the forefront of AI research in Africa.",
};

// Content pages read directly from MongoDB (not via fetch()), and the
// production build's database is only an empty, disposable CI service
// container - so static prerendering bakes every content page in as
// permanently empty. Force every route to render per-request instead so
// pages always reflect the real database, not the build-time snapshot.
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-surface-container-lowest">
        <PerformanceGuardClient />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}