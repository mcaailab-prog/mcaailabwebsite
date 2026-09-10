'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';
import UniversalFormModal from '@/components/ui/UniversalFormModal';
import MCAAIApplicationForm from '@/components/forms/MCAAIApplicationForm';

export default function TrainingProgramsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs = [
    {
      icon: 'biotech',
      title: 'Short Courses & Certifications',
      description: 'Industry-relevant short courses covering AI fundamentals, machine learning, and data science',
      highlights: ['Python Programming', 'Machine Learning Basics', 'Data Analysis', 'AI Ethics'],
      duration: '4-8 weeks',
      cta: 'Browse Courses',
      border: 'border-t-mcaai-teal',
      iconBg: 'bg-mcaai-teal/10',
      iconColor: 'text-primary'
    },
    {
      icon: 'school',
      title: 'MSc & PhD Programs',
      description: 'Advanced research-focused degree programs in AI and related disciplines',
      highlights: ['AI and Machine Learning', 'Data Science', 'Computer Vision', 'NLP'],
      duration: '2-4 years',
      cta: 'Apply Now',
      border: 'border-t-mcaai-teal',
      iconBg: 'bg-mcaai-teal/10',
      iconColor: 'text-primary'
    },
    {
      icon: 'flash_on',
      title: 'AI Bootcamps',
      description: 'Intensive, practical bootcamps for rapid skill development and career transition',
      highlights: ['Full-Stack AI', 'Data Engineering', 'AI Product Development', 'Deployment & DevOps'],
      duration: '12-16 weeks',
      cta: 'Enroll Now',
      border: 'border-t-mcaai-teal',
      iconBg: 'bg-mcaai-teal/10',
      iconColor: 'text-primary'
    },
    {
      icon: 'work',
      title: 'Internship Program',
      description: 'Paid internships with real-world AI projects and industry mentorship',
      highlights: ['Research Projects', 'Industry Partnerships', 'Mentorship', 'Portfolio Building'],
      duration: '3-6 months',
      cta: 'Apply for Internship',
      border: 'border-t-mcaai-teal',
      iconBg: 'bg-mcaai-teal/10',
      iconColor: 'text-primary'
    },
    {
      icon: 'star',
      title: 'Fellowship Program',
      description: 'Competitive fellowships for early-career researchers and professionals',
      highlights: ['Research Support', 'Networking', 'Conference Travel', 'Publication Support'],
      duration: '1 year',
      cta: 'Apply for Fellowship',
      border: 'border-t-mcaai-teal',
      iconBg: 'bg-mcaai-teal/10',
      iconColor: 'text-primary'
    },
    {
      icon: 'emoji_events',
      title: 'Workshops & Seminars',
      description: 'Regular workshops, seminars, and guest lectures from industry experts',
      highlights: ['Technical Workshops', 'Industry Talks', 'Networking Events', 'Hands-on Labs'],
      duration: '1-3 days',
      cta: 'View Schedule',
      border: 'border-t-mcaai-teal',
      iconBg: 'bg-mcaai-teal/10',
      iconColor: 'text-primary'
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-[36px] text-university-deep-blue mb-4">Training, Programs & Capacity Building</h2>
          <p className="font-body-md text-on-surface-variant max-w-3xl mx-auto">
            MCAAI offers diverse learning opportunities from short courses to advanced degree programs,
            designed to build AI expertise at all levels.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {programs.map((program) => (
            <div key={program.title} className={`tonal-card p-10 rounded-xl border-t-4 ${program.border}`}>
              <div className={`${program.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-8`}>
                <Icon name={program.icon} size={32} color={program.iconColor} />
              </div>
              <h3 className="font-headline-lg text-[24px] text-university-deep-blue mb-4">{program.title}</h3>
              <p className="text-on-surface-variant mb-6 font-body-md">{program.description}</p>
              {/* Highlights */}
              <div className="mb-4 pt-4 border-t border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-uppercase tracking-wider mb-2 block">Key Topics</span>
                <div className="flex flex-wrap gap-2">
                  {program.highlights.map((highlight) => (
                    <span key={highlight} className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[12px] font-label-sm rounded border border-outline-variant/30">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              {/* Duration */}
              <div className="mb-4">
                <span className="font-label-sm text-label-sm text-uppercase tracking-wider mb-2 block">Duration:</span>
                <span className="font-body-md text-on-surface-variant">{program.duration}</span>
              </div>
              {/* CTA Button */}
              <button
              type="button"
              onClick={() => {
                setSelectedProgram(program.title);
                setIsModalOpen(true);
              }}
              className="w-full bg-university-deep-blue text-on-primary py-4 rounded-lg font-bold hover:shadow-lg transition-all"
            >
                {program.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-surface-container-low rounded-xl p-6 text-center border border-outline-variant/30">
            <span className="font-label-sm text-primary mb-2">Students Trained</span>
            <div className="text-3xl font-bold text-on-surface">500+</div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 text-center border border-outline-variant/30">
            <span className="font-label-sm text-primary mb-2">Industry Partners</span>
            <div className="text-2xl font-bold text-on-surface">50+</div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 text-center border border-outline-variant/30">
            <span className="font-label-sm text-primary mb-2">Employment Rate</span>
            <div className="text-2xl font-bold text-on-surface">95%</div>
          </div>
        </div>

        {/* Call to Action - Using Partnership Intake Form pattern from DESIGN.md 7.17 */}
        <div className="mt-16">
          <div className="bg-surface-container-low p-8 lg:p-12 rounded-2xl border border-outline-variant/30">
            <h3 className="font-headline-lg text-[36px] text-university-deep-blue mb-6 text-center">
              Ready to Build Your AI Career?
            </h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-6">
              Join MCAAI and gain the skills and experience needed to excel in the rapidly growing field of artificial intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-university-deep-blue text-on-primary px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all">
                View All Programs
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProgram('MCAAI Application');
                  setIsModalOpen(true);
                }}
                className="border-2 border-mcaai-teal text-primary px-8 py-4 rounded-lg font-bold hover:bg-mcaai-teal/5 transition-all"
              >
                Contact Admissions
              </button>
            </div>
          </div>
        </div>

        <UniversalFormModal
          open={isModalOpen}
          title={selectedProgram ?? 'MCAAI Application'}
          description="Complete a quick application to tell us about your interests, experience, and how you want to engage with MCAAI."
          onClose={() => setIsModalOpen(false)}
        >
          <MCAAIApplicationForm />
        </UniversalFormModal>
      </div>
    </section>
  );
}