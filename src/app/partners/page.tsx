import { Metadata } from 'next';
import { api } from '@/lib/api';
import type { PartnerType as Partner } from '@/lib/api-types';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Partners - MCAAI',
  description: 'Meet our research, funding, and community partners at the Maseno Centre for Applied Artificial Intelligence.',
};

export default async function PartnersPage() {
  const partners = await api.getPartners();

  return (
    <div className="w-full">
      <section id="partners" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Partners & Collaborators
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our work is made possible through strong partnerships with research institutions, funding agencies, and community organizations.
            </p>
          </div>

          {/* Logos Gallery */}
          <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {partners.map((partner: Partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center"
              >
                {partner.logo && typeof partner.logo === 'string' && partner.logo.trim() !== '' ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    height={56}
                    width={56}
                    title={partner.name}
                    className="object-contain rounded hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded text-xs text-gray-500">
                    {partner.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}

            {/* Show message if no partners */}
            {partners.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-600">
                  No partners found. Check back soon as we continue to build our partnership network.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}