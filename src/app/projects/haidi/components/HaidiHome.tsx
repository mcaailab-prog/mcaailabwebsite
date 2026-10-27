"use client";

import { useState } from "react";
import Link from "next/link";
import EventsSection from "./EventsSection";
import PublicationsSection from "./PublicationsSection";
import "./haidi-home.css";

// HAIDI assets are served from the app-level public/haidi directory.
const IMG = {
  logo: "/haidi/Sec_White.png",
  hero: "/haidi/dee.png",
  sponsorFounding: "/haidi/Asset-15.png",
  sponsorFunders: "/haidi/Asset-179.png",
  ld: "/haidi/ld.jpg",
  bernard: "/haidi/Bernard_Chira.jpg",
  jerry: "/haidi/PROF-JJ.jpg",
  chris: "/haidi/chris-hrsn.png",
};

const FORM_URL = "https://forms.gle/73bKa4jU8VfdeHRx9";

const WHAT_CARDS = [
  { title: "Data Discovery", desc: "Catalog and surface disability-related datasets from across Africa, making them visible and easier to find for researchers and innovators." },
  { title: "Ecosystem Coordination", desc: "Connect researchers, OPDs, policymakers, and innovators working on disability and AI across sectoral and geographic boundaries." },
  { title: "Ethical Governance", desc: "Promote responsible disability data practices, prioritising informed consent, privacy, participation of PWDs, and accountability." },
  { title: "Pan-African Reach", desc: "Built to serve the diversity of African contexts, languages, and disability communities from the ground up." },
  { title: "From Data to Impact", desc: "Support real-world AI innovation in assistive technology, education, employment, mental health, and accessibility." },
  { title: "Part of HAIDI", desc: "ADDN contributes to the broader Hub for AI and Disability Inclusion (HAIDI), focusing on the data foundations for disability-inclusive AI." },
];

const AUDIENCE_CARDS = [
  { title: "Researchers & Dataset Builders", desc: "Universities, AI labs, and dataset creators developing disability-related data resources." },
  { title: "AI Innovators", desc: "Startups and AI developers seeking responsible access to disability-relevant datasets and partnerships." },
  { title: "OPDs & Disability Communities", desc: "Organizations ensuring disability data practices are participatory, ethical, and rights-based." },
  { title: "Policymakers", desc: "Governments, regulators, and AI strategy bodies working to strengthen disability-inclusive digital governance." },
  { title: "Media", desc: "Journalists and communicators amplifying the conversation around disability inclusion in Africa's AI ecosystem." },
  { title: "Funders & Ecosystem Builders", desc: "Development partners, accelerators, and philanthropic organizations supporting inclusive AI ecosystems." },
];

const FOCUS_ITEMS = [
  { title: "Sign Language & Communication", desc: "Datasets supporting African sign language recognition and communication AI tools." },
  { title: "Non-Standard Speech & Accessibility", desc: "Speech datasets capturing the diversity of disability-related vocal expression and accessibility needs." },
  { title: "Mental Health & Psychosocial Support", desc: "Data resources for AI solutions addressing mental health and psychosocial disability across Africa." },
  { title: "Employment & Disability Inclusion", desc: "Datasets supporting AI-driven employment and economic inclusion for PWDs." },
];

const PARTNERS = [
  { href: "https://example.com/mcaai", name: "Maseno Centre for Applied AI (MCAAI)", sub: "Maseno University, Kenya — applied AI research for development" },
  { href: "https://example.com/rail", name: "Responsible AI Lab (RAIL)", sub: "Kwame Nkrumah University of Science and Technology (KNUST), Ghana" },
  { href: "https://example.com/at4d", name: "Assistive Technologies for Disability Trust (AT4D)", sub: "Supporting assistive technology access and disability inclusion" },
  { href: "https://example.com/nsf", name: "Next Step Foundation (NSF)", sub: "Driving disability inclusion and empowerment across Africa" },
];

const PRINCIPALS = [
  { img: IMG.ld, imgClass: "", name: "Dr. Lilian Wanzare", role: "Lead Principal Investigator - MCAAI", bio: "Dr. Lilian Wanzare is a Lecturer and Chair of the Department of Computer Science at Maseno University and Research Lead at the Maseno Centre for Applied Artificial Intelligence (MCAAI). Her research focuses on Artificial Intelligence (AI), Machine Learning, and Natural Language Processing (NLP), with particular emphasis on developing language technologies for underserved African languages and applying AI to challenges in agriculture, education, and health. She leads research initiatives advancing Kenyan Sign Language (KSL) technologies, inclusive AI, and the development of locally relevant language datasets and models. Through these initiatives, she contributes to strengthening disability-inclusive AI research, multidisciplinary collaboration, community engagement, and AI capacity development across Africa. Dr. Wanzare has served as Principal Investigator on several research projects supported by the Gates Foundation, the International Development Research Centre (IDRC), and the Artificial Intelligence for Development (AI4D) programme. Her work promotes African-led AI innovation, equitable access to language technologies, and the translation of research into practical solutions with meaningful societal impact." },
  { img: IMG.bernard, imgClass: "offset-down", name: "Bernard Chiira", role: "Principal Investigator - AT4D", bio: "Bernard Chiira is a globally recognized leader, investor and advisor in digital accessibility, inclusive technology ecosystems, assistive tech innovation, and disability-inclusive AI. As the CEO of AT4D and co-founder of Innovate Now, he has shaped Africa’s most impactful disability innovation ecosystem. Bernard brings nearly two decades of experience in startup innovation ecosystem development, digital accessibility, public-private partnerships, inclusive policy influence, and startup venture support. He is a trusted voice at high-level forums and think tanks including Wilton Park, Africa AI Summit, British Council Going Global, and the Equitable AI Alliance." },
  { img: IMG.jerry, imgClass: "offset-down-chris", name: "Jerry John Kponyo", role: "Principal Investigator - RAIL", bio: "Prof. Jerry John Kponyo is the Principal Investigator of the Responsible AI Lab II (RAIL) in Ghana. Director of the Office of Grants and Research at the Kwame Nkrumah University of Science and Technology (KNUST) and former Dean of the Faculty of Electrical and Computer Engineering, he leads the Quantum Computing and Assistive Technologies Laboratory and has published over 80 articles in AI, IoT, and intelligent systems. He is also Co-Founder of the Responsible AI Network (RAIN) Africa, a KNUST–TUM Germany collaboration. RAIL works to deepen how responsible AI is developed and applied across computer, biomedical, agricultural, and ecological sciences, strengthening researcher capacity in energy, health, food security, and assistive technology for the continent's most vulnerable communities while expanding participation of women in technology through outreach to pre-tertiary schools." },
  { img: IMG.chris, imgClass: "offset-down-chris", name: "Chris Harrison", role: "Principal Investigator - NSF", bio: "Chris Harrison is a researcher and advocate for inclusive data practices and partner engagement across the ADDN network. His work focuses on ensuring that data-driven solutions are accessible and beneficial to people with disabilities." },
];

const CTA_CARDS = [
  { title: "Research & Datasets", desc: "Contribute datasets, collaborate on ethical standards, or share research on disability-inclusive AI." },
  { title: "Policy & Governance", desc: "Shape disability-inclusive data governance frameworks and digital policy across Africa." },
  { title: "OPD Engagement", desc: "Ensure disability data practices centre the voices, rights, and participation of PWDs." },
  { title: "Funding & Partnerships", desc: "Support the data infrastructure needed for disability-inclusive AI innovation at scale." },
  { title: "Media & Communications", desc: "Amplify the importance of disability-inclusive data and help build visibility for ADDN." },
  { title: "AI Innovation", desc: "Access disability-relevant datasets responsibly to build inclusive AI solutions for Africa." },
];

// Layout overrides for the Principal Investigators cards: four compact cards in one row.
// Scoped to #partners and marked !important so they win over haidi-home.css.
const PRINCIPAL_GRID_CSS = `
  #partners .principal-grid {
    display: grid !important;
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    gap: 1rem !important;
    align-items: start !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  #partners .principal-grid .principal-card {
    width: auto !important;
    min-width: 0 !important;
    max-width: none !important;
    flex: none !important;
    margin: 0 !important;
  }
  #partners .principal-grid .principal-card img {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    margin: 0 !important;
  }
  #partners .principal-grid .principal-card-body {
    padding: 0.75rem 0.85rem 0.9rem !important;
  }
  #partners .principal-grid .principal-card-body h4 {
    font-size: 0.95rem !important;
    line-height: 1.3;
    margin: 0 0 0.2rem;
  }
  #partners .principal-grid .principal-card-body > div > p {
    font-size: 0.78rem !important;
    margin: 0 0 0.5rem;
  }
  #partners .principal-grid .bio-toggle {
    font-size: 0.78rem !important;
    padding: 0.3rem 0.6rem !important;
  }
  #partners .principal-grid .bio-text {
    font-size: 0.78rem !important;
    line-height: 1.5;
  }
  @media (max-width: 768px) {
    #partners .principal-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }
  @media (max-width: 480px) {
    #partners .principal-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

export default function HaidiHome() {
  const [bioOpen, setBioOpen] = useState<boolean[]>(PRINCIPALS.map(() => false));

  const toggleBio = (index: number) =>
    setBioOpen((current) => current.map((open, i) => (i === index ? !open : open)));

  return (
    <div className="landing">
      {/* NAV */}
      <nav className="main-nav">
        <div className="container nav-inner">
          <a className="nav-logo" href="#hero">
            <img src={IMG.logo} alt="ADDN Logo" />
          </a>
          <ul className="nav-links">
            <li><a href="#problem">The Problem</a></li>
            <li><a href="#what">About</a></li>
            <li><a href="#who">Who It&apos;s For</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#publications">Publications</a></li>
            <li><a href="#partners">Partners</a></li>
            <li><a href="#collaborate">Collaborate</a></li>
            <li><Link href="/projects/haidi/explorer">Open Explorer</Link></li>
          </ul>
          <a href="#collaborate" className="btn btn-primary nav-interest">Express Interest</a>
          <Link href="/" className="btn nav-mcaai">Back to MCAAI</Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg-fallback" />
        <div className="hero-pattern" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="dot" />
              Building the data infrastructure for disability-inclusive AI
            </div>
            <h1>
              The African <em>Disability Data Network</em> Launch
            </h1>
            <p className="hero-sub">
              The African Disability Data Network (ADDN) connects researchers, innovators,
              OPDs, and policymakers to improve the visibility, discoverability, and ethical
              governance of disability-related datasets across Africa.
            </p>
            <div className="hero-actions">
              <a href="#collaborate" className="btn btn-primary btn-lg">Express Interest to Collaborate</a>
              <a href="#what" className="btn btn-outline btn-lg">Learn More</a>
              <Link href="/projects/haidi/explorer" className="btn btn-primary btn-lg btn-explorer">
                Open Data Explorer
              </Link>
            </div>
            <div className="event-badge">
              📍 ADDN &nbsp;·&nbsp; Enhancing Inclusiveness with AI
            </div>
          </div>

          <div className="hero-img-wrap">
            <img src={IMG.hero} alt="ADDN launch" />
            <div className="hero-img-caption">ADDN · Enhancing Inclusiveness with AI</div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem">
        <div className="container">
          <div className="problem-grid">
            <div>
              <div className="tag">The Problem</div>
              <h2>Africa&apos;s AI systems are built without disability data</h2>
              <p>Artificial intelligence is rapidly reshaping education, employment, healthcare, and public services across Africa, yet PWDs remain largely absent from the datasets on which AI systems are built.</p>
              <p>Disability is often absent from datasets and, as a result, underrepresented in AI systems. This contributes to technologies that may misunderstand, overlook, or exclude PWDs. This &quot;disability data desert&quot; limits the ability of AI systems to recognise and respond to diverse disability experiences across Africa.</p>
              <p>Three major barriers drive this gap: a persistent disability data deficit, fragmented innovation ecosystems, and weak integration of disability inclusion within AI governance.</p>
            </div>
            <div>
              <div className="stats-row">
                <div className="stat-block">
                  <div className="stat">15%</div>
                  <p>of the world&apos;s population lives with disability, yet PWDs remain largely invisible in AI training data</p>
                </div>
                <div className="stat-block">
                  <div className="stat">80%</div>
                  <p>of PWDs globally live in low- and middle-income countries, including across Africa</p>
                </div>
                <div className="stat-block span-2">
                  <div className="stat small">&quot;Disability data desert&quot;</div>
                  <p>Promising AI initiatives in sign language, speech, mental health, and accessibility exist but remain fragmented and hard to discover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission">
        <div className="container">
          <div className="tag">Vision &amp; Mission</div>
          <h2>An African AI future that leaves no one behind</h2>
          <div className="mission-cards">
            <div className="mission-card">
              <h3>Vision</h3>
              <p>An African AI ecosystem in which PWDs are meaningfully represented in the data, systems, and governance structures shaping digital futures.</p>
            </div>
            <div className="mission-card">
              <h3>Mission</h3>
              <p>ADDN works to strengthen disability-inclusive data ecosystems across Africa by improving the discovery, coordination, and ethical governance of disability-related datasets to support responsible AI and inclusive innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT */}
      <section id="what">
        <div className="container">
          <div className="tag">What is ADDN?</div>
          <h2>More than a repository, it is a coordination platform</h2>
          <p style={{ maxWidth: 660 }}>ADDN is a Pan-African coordination and data discovery platform. Rather than hosting datasets itself, ADDN helps users identify what datasets exist, understand access conditions, and connect responsibly with dataset custodians and related initiatives.</p>
          <div className="what-grid">
            {WHAT_CARDS.map((card) => (
              <div className="what-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section id="who">
        <div className="container">
          <div className="tag">Who It&apos;s For</div>
          <h2>A network built for a diverse ecosystem</h2>
          <p style={{ maxWidth: 600 }}>ADDN is designed to support every actor working at the intersection of disability, data, and AI in Africa.</p>
          <div className="audience-grid">
            {AUDIENCE_CARDS.map((card) => (
              <div className="audience-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOCUS */}
      <section id="focus">
        <div className="container">
          <div className="tag">Initial Focus Areas</div>
          <h2>Where we&apos;re starting</h2>
          <p style={{ maxWidth: 620 }}>During its early phase, ADDN will explore and strengthen disability-related datasets and partnerships across several emerging domains.</p>
          <div className="focus-list">
            {FOCUS_ITEMS.map((item) => (
              <div className="focus-item" key={item.title}>
                <div className="fi-dot" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
            <div className="focus-item span-2">
              <div className="fi-dot" />
              <div>
                <h3>Ethical &amp; Governance Frameworks</h3>
                <p>Standards, principles, and frameworks for ethical, participatory, and rights-based disability data governance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <EventsSection />

      {/* PUBLICATIONS & REPORTS */}
      <PublicationsSection />

      {/* PARTNERS */}
      <section id="partners">
        <div className="container">
          <div className="tag">Founding Partners &amp; Support</div>
          <h2>Built through Pan-African collaboration</h2>
          <p style={{ maxWidth: 600 }}>ADDN is developed through collaboration among organisations working at the intersection of artificial intelligence, disability inclusion, and innovation across Africa.</p>
          <div className="partners-grid">
            {PARTNERS.map((p) => (
              <a className="partner-card" key={p.name} href={p.href} target="_blank" rel="noopener noreferrer">
                <span className="partner-type">Founding Partner</span>
                <h3>{p.name}</h3>
                <p>{p.sub}</p>
              </a>
            ))}
          </div>
          <div className="support-note">
            <strong>Initial Support:</strong> ADDN is supported by the <strong>Artificial Intelligence for Development (AI4D)</strong> programme, funded by the <strong>International Development Research Centre (IDRC)</strong> and the <strong>United Kingdom&apos;s Foreign, Commonwealth &amp; Development Office (FCDO)</strong>.
          </div>
          <div className="principal-section">
            <style>{PRINCIPAL_GRID_CSS}</style>
            <div className="section-header">
              <div className="tag">Principal Investigators</div>
              <h3>Meet the principal investigators</h3>
            </div>
            <div className="principal-grid">
              {PRINCIPALS.map((person, index) => (
                <div className="principal-card" key={person.name}>
                  <img className={person.imgClass} src={person.img} alt={person.name} />
                  <div className="principal-card-body">
                    <div>
                      <h4>{person.name}</h4>
                      <p>{person.role}</p>
                    </div>
                    <button
                      type="button"
                      className="bio-toggle"
                      aria-expanded={bioOpen[index]}
                      onClick={() => toggleBio(index)}
                    >
                      {bioOpen[index] ? "-" : "+"} Biography
                    </button>
                    {bioOpen[index] && <p className="bio-text">{person.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COLLABORATE */}
      <section id="collaborate">
        <div className="container">
          <div className="tag">Join the Network</div>
          <h2>Help build disability-inclusive AI in Africa</h2>
          <p>ADDN is being developed as a collaborative, Pan-African initiative. We invite researchers, innovators, OPDs, policymakers, dataset custodians, and development partners to join us.</p>
          <div className="cta-cards">
            {CTA_CARDS.map((card) => (
              <div className="cta-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
          <a href={FORM_URL} className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
            Submit Your Expression of Interest →
          </a>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors">
        <div className="container">
          <div className="tag">Sponsors &amp; Partners</div>
          <h2>The ecosystem behind ADDN</h2>
          <p className="sub">Built through collaboration across research, innovation, funding, and disability inclusion</p>
          <div className="sponsors-row">
            <div className="sponsors-col">
              <div className="sponsors-label">Founding Partners</div>
              <div className="sponsors-card">
                <img src={IMG.sponsorFounding} alt="Maseno University, MCAAI, Next Step Foundation, Assistive Technologies for Disability Trust" />
              </div>
            </div>
            <div className="sponsors-col">
              <div className="sponsors-label">Funders &amp; Supporters</div>
              <div className="sponsors-card">
                <img src={IMG.sponsorFunders} alt="AI4D Africa, Foreign Commonwealth & Development Office, IDRC-CRDI Canada, Universidade de Cabo Verde" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <div>
            <div className="footer-brand">African Disability Data Network <span>(ADDN)</span></div>
            <div style={{ marginTop: 4 }}>Part of the Hub for AI and Disability Inclusion (HAIDI)</div>
          </div>
          <div>
            <Link href="/projects/haidi/explorer">Open Data Explorer</Link>
            <span style={{ margin: "0 8px" }}>·</span>
            Supported by AI4D · IDRC · FCDO
          </div>
        </div>
      </footer>
    </div>
  );
}