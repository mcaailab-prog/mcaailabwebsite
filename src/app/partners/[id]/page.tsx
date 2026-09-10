import Link from 'next/link';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import type { PartnerType as Partner } from '@/lib/api-types';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const partners = await api.getPartners();
  const partner = partners.find((p) => p.id === params.id) as Partner | undefined;
  return {
    title: partner ? `${partner.name} — MCAAI` : 'Partner — MCAAI',
    description: partner ? partner.description?.slice(0, 160) : 'Partner details',
  };
}

export default async function PartnerPage({ params }: { params: { id: string } }) {
  const partners = await api.getPartners();
  const partner = partners.find((p) => p.id === params.id) as Partner | undefined;

  if (!partner) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold">Partner not found</h1>
        <p className="mt-4">We couldn't find the partner you're looking for.</p>
        <p className="mt-6"><Link href="/partners" className="text-primary hover:underline">Back to partners</Link></p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="flex items-center gap-4 mb-6">
        {partner.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.logo} alt={partner.name} className="w-20 h-20 object-contain" />
        ) : (
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded text-xl">{partner.name.substring(0, 2).toUpperCase()}</div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{partner.name}</h1>
          {partner.website && (
            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm text-on-surface-variant hover:underline">{partner.website}</a>
          )}
        </div>
      </div>

      <div className="prose">
        <div dangerouslySetInnerHTML={{ __html: partner.description ?? '' }} />
      </div>

      <p className="mt-8"><Link href="/partners" className="text-primary hover:underline">Back to partners</Link></p>
    </div>
  );
}
