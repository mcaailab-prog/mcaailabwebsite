'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';
import UniversalFormModal from '@/components/ui/UniversalFormModal';
import PartnershipForm from '@/components/forms/PartnershipForm';

export default function PartnerWithUsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-12 bg-white" id="contact">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-university-deep-blue mb-6">
              Partner with Us
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              Join MCAAI in bridging the gap between academic AI research and real-world impact.
              We collaborate with industry leaders to develop locally relevant, globally competitive solutions.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-mcaai-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="handshake" color="text-primary" />
                </div>
                <div>
                  <h4 className="font-body-md font-bold text-university-deep-blue">Strategic Alliances</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Long-term research and development partnerships.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-mcaai-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="rocket_launch" color="text-secondary" />
                </div>
                <div>
                  <h4 className="font-body-md font-bold text-university-deep-blue">Innovation Hub</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Incubating AI-driven startups and local ventures.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-university-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="school" color="text-university-gold" />
                </div>
                <div>
                  <h4 className="font-body-md font-bold text-university-deep-blue">Capacity Building</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Co-developing training programmes for African talent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 lg:p-12 rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-lg text-[28px] text-university-deep-blue mb-4">
                  Submit a Partnership Inquiry
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Share your organisation’s goals, and our team will reach out with collaboration options.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full rounded-full bg-university-deep-blue px-6 py-4 text-body-md font-bold text-white transition hover:bg-university-deep-blue/90"
              >
                Open Partnership Form
              </button>
            </div>
          </div>
        </div>
      </div>

      <UniversalFormModal
        open={isOpen}
        title="Partnership Inquiry"
        description="Tell us about your partnership goals and how MCAAI can support your AI initiative."
        onClose={() => setIsOpen(false)}
      >
        <PartnershipForm />
      </UniversalFormModal>
    </section>
  );
}
