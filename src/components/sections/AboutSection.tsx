import Link from 'next/link';
import { Icon } from '@/lib/icons';

const features = [
  {
    icon: 'biotech',
    title: 'Research',
    description: 'Cutting-edge AI research addressing real-world challenges',
    borderClass: 'border-t-mcaai-teal',
    iconBgClass: 'bg-mcaai-teal/10',
    iconColorClass: 'text-primary',
  },
  {
    icon: 'lightbulb',
    title: 'Innovation',
    description: 'Translating research into practical AI solutions',
    borderClass: 'border-t-mcaai-teal',
    iconBgClass: 'bg-mcaai-teal/10',
    iconColorClass: 'text-primary',
  },
  {
    icon: 'school',
    title: 'Capacity Building',
    description: 'Training next generation of AI professionals',
    borderClass: 'border-t-mcaai-green',
    iconBgClass: 'bg-mcaai-green/10',
    iconColorClass: 'text-secondary',
  },
  {
    icon: 'handshake',
    title: 'Industry Collaboration',
    description: 'Partnering with industry for impactful projects',
    borderClass: 'border-t-university-gold',
    iconBgClass: 'bg-university-gold/10',
    iconColorClass: 'text-university-gold',
  },
];

export default function AboutSection() {
  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-desktop">

        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-[36px] text-university-deep-blue mb-4">
            About MCAAI
          </h2>
        </div>

        {/* Mission Section */}
        <section id="mission" className="mb-12">
          <h3 className="font-headline-lg text-[24px] text-university-deep-blue mb-4">
            Mission
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            To drive innovation and excellence in AI research, education, and practical applications.
          </p>
        </section>

        {/* History Section */}
        <section id="history" className="mb-12">
          <h3 className="font-headline-lg text-[24px] text-university-deep-blue mb-4">
            History
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Maseno Center for Applied Artificial Intelligence (MCAAI) was established to advance AI for societal impact across health, agriculture, education, climate, and governance.
          </p>
        </section>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`tonal-card p-6 rounded-xl border-t-4 ${feature.borderClass}`}
            >
              <div className={`w-12 h-12 ${feature.iconBgClass} rounded-full flex items-center justify-center mb-4`}>
                <Icon name={feature.icon} size={24} color={feature.iconColorClass} />
              </div>
              <h3 className="font-headline-lg text-[20px] text-university-deep-blue mb-3">
                {feature.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="text-center mt-8">
          <Link
            href="/about"
            className="bg-university-deep-blue text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm font-bold hover:bg-university-deep-blue/90 transition-all"
          >
            Learn More About MCAAI
          </Link>
        </div>

      </div>
    </section>
  );
}
