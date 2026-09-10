import { MdBiotech, MdSchool, MdGroups, MdCheckCircle } from "react-icons/md";

const pillars = [
  {
    title: "Research",
    description:
      "Pioneering applied AI solutions tailored for regional dialects and diverse environmental contexts in East Africa.",
    Icon: MdBiotech,
    border: "border-t-mcaai-teal",
    iconBg: "bg-mcaai-teal/10",
    iconColor: "text-mcaai-teal",
    textColor: "text-primary",
    items: ["NLP for Local Languages", "AI in Agriculture", "AI for Disability (AI4D)"],
  },
  {
    title: "Capacity Building",
    description:
      "Empowering the next generation of African data scientists and AI researchers with hands-on training and mentorship.",
    Icon: MdSchool,
    border: "border-t-mcaai-green",
    iconBg: "bg-mcaai-green/10",
    iconColor: "text-mcaai-green",
    textColor: "text-secondary",
    items: ["Specialized Workshops", "Degree Integration", "Industry Internships"],
  },
  {
    title: "Engagement",
    description:
      "Ensuring AI development is inclusive through grassroots community participation and ethical framework design.",
    Icon: MdGroups,
    border: "border-t-university-gold",
    iconBg: "bg-university-gold/10",
    iconColor: "text-university-gold",
    textColor: "text-university-deep-blue",
    items: ["Community Data Collection", "Policy Advocacy", "Global Collaborations"],
  },
];

export default function ThreePillars() {
  return (
    /* ── THREE PILLARS ─────────────────────────────────────────── */
    <section className="py-16 bg-white">
      <div className="max-w-container-max mx-auto px-margin-mobile  md:px-margin-desktop">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-university-deep-blue mb-4">
            Our Three Pillars
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            The foundation of MCAAI's mission to bridge the gap between
            advanced technology and African community needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {pillars.map(({ title, description, Icon, border, iconBg, iconColor, textColor, items }) => (
            <div
              key={title}
              className={`bg-slate-50 rounded-2xl border-t-[3px] ${border} p-8 shadow-sm`}
            >
              <div className={`w-12 h-12  rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`${iconColor} text-[40px]`} />
              </div>

              <h3 className="font-headline-lg text-[20px] font-bold text-university-deep-blue mb-3">
                {title}
              </h3>

              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {description}
              </p>

              <ul className={`space-y-2.5 font-label-sm text-label-sm font-medium ${textColor}`}>
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <MdCheckCircle className="text-[16px] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}