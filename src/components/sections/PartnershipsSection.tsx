import Image from 'next/image';
import type { PartnerType } from '@/lib/api-types';

export default function PartnershipsSection({ partners = [] }: { partners?: PartnerType[] }) {
  if (!partners.length) return null;

  return (
    <section className="py-16 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        <div className="text-center mb-10">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Global Partners in Innovation
          </span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-10">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
              className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
            >
              {partner.logo && partner.logo.trim() !== '' ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  height={48}
                  width={120}
                  className="object-contain h-12 w-[120px]"
                />
              ) : (
                <div className="h-12 w-[120px] flex items-center justify-center bg-surface-container rounded border border-outline-variant">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    {partner.name}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}