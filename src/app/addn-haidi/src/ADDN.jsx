import { useState } from "react";
import App from "./App";
import logoImg from "./assets/images/Sec_White.png";
import heroImg from "./assets/images/dee.png";
import sponsor179Img from "./assets/images/Asset 179.png";
import sponsor15Img from "./assets/images/Asset 15.png";
import ldImg from "./assets/images/ld.jpg";
import bernardImg from "./assets/images/Bernard_Chira.jpg";
import chrisImg from "./assets/images/chris-hrsn.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
    color: #1a1a2e;
    background: #ffffff;
    line-height: 1.7;
  }

  :root {
    --red:     #AC1212;
    --red-d:   #4A0202;
    --red-l:   #f9ecec;
    --gold:    #DC901E;
    --gold-l:  #EEB42C;
    --dark:    #180404;
    --mid:     #5a3a3a;
    --light:   #faf8f7;
    --border:  #e8ddd9;
    --radius:  10px;
    --max-w:   1080px;
  }

  .container { max-width: var(--max-w); margin: 0 auto; padding: 0 24px; }
  .tag {
    display: inline-block;
    background: var(--red-l);
    color: var(--red);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 100px;
    margin-bottom: 14px;
  }
  section { padding: 80px 0; }
  h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: var(--dark); margin-bottom: 16px; }
  h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--dark); }
  p  { color: var(--mid); margin-bottom: 12px; }
  a  { color: var(--red); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* NAV */
  nav.main-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(24,4,4,0.97);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(172,18,18,0.3);
  }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .nav-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
  .nav-logo img { height: 48px; object-fit: contain; filter: drop-shadow(0 0 4px rgba(172,18,18,0.5)); }
  .nav-logo-text { font-weight: 800; font-size: 1rem; color: #fff; line-height: 1.2; }
  .nav-logo-text span { display: block; font-size: 0.7rem; font-weight: 400; color: rgba(255,255,255,0.6); letter-spacing:.05em; }
  .nav-links { display: flex; gap: 28px; list-style: none; }
  .nav-links a,
  .nav-links .nav-link-button { font-size: 0.88rem; font-weight: 600; color: rgba(255,255,255,0.7); transition: color .2s; background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
  .nav-links a:hover,
  .nav-links .nav-link-button:hover { color: var(--gold-l); text-decoration: none; }
  .btn { display: inline-block; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; transition: all .2s; cursor: pointer; text-decoration: none; font-family: inherit; }
  .btn-primary { background: var(--red); color: #fff; }
  .btn-primary:hover { background: #8a0e0e; text-decoration: none; }
  .btn-outline { border: 2px solid rgba(255,255,255,0.4); color: #fff; background: transparent; }
  .btn-outline:hover { background: rgba(255,255,255,0.1); text-decoration: none; }
  .btn-lg { padding: 14px 36px; font-size: 1rem; border-radius: 10px; }

  /* HERO */
  #hero {
    position: relative;
    min-height: 88vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .hero-bg-fallback {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0e0202 0%, #2a0505 45%, #4A0202 100%);
    z-index: 0;
  }
  .hero-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-4l24-14V18L28 4 4 18v30l24 14z' fill='%23ffffff'/%3E%3C/svg%3E");
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: radial-gradient(ellipse at 80% 20%, rgba(172,18,18,0.25) 0%, transparent 60%);
  }
  .hero-content {
    position: relative;
    z-index: 3;
    width: 100%;
    padding: 70px 0 70px;
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 52px;
    align-items: center;
  }
  .hero-img-wrap {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 2px rgba(172,18,18,0.4);
  }
  .hero-img-wrap img {
    width: 100%;
    height: 560px;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .hero-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    box-shadow: inset 0 -80px 60px rgba(24,4,4,0.5);
    pointer-events: none;
  }
  .hero-img-caption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(24,4,4,0.9) 0%, transparent 100%);
    padding: 20px 18px 14px;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.75);
    font-weight: 500;
    letter-spacing: .03em;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(220,144,30,0.2);
    border: 1px solid rgba(220,144,30,0.4);
    color: var(--gold-l);
    font-size: 0.78rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    padding: 6px 16px; border-radius: 100px; margin-bottom: 20px;
  }
  .hero-eyebrow .dot { width: 6px; height: 6px; background: var(--gold-l); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  #hero h1 { font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; line-height: 1.12; color: #fff; margin-bottom: 20px; max-width: 780px; }
  #hero h1 em { color: var(--gold-l); font-style: normal; }
  #hero p.hero-sub { font-size: clamp(1rem, 1.8vw, 1.15rem); color: rgba(255,255,255,0.82); max-width: 600px; margin-bottom: 36px; }
  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .hero-actions .btn-primary { background: var(--gold); color: var(--dark); }
  .hero-actions .btn-primary:hover { background: var(--gold-l); }

  .event-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(172,18,18,0.5); border: 1px solid rgba(172,18,18,0.7);
    color: #fff; font-size: 0.82rem; font-weight: 600;
    padding: 8px 18px; border-radius: 8px; margin-top: 28px;
  }

  /* PROBLEM */
  #problem { background: var(--light); }
  .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
  .stat-block { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; }
  .stat-block .stat { font-size: 2.8rem; font-weight: 900; color: var(--red); line-height: 1; margin-bottom: 8px; }
  .stat-block p { margin: 0; font-size: 0.95rem; }
  .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }

  /* MISSION */
  #mission { background: var(--dark); color: #fff; }
  #mission h2 { color: #fff; }
  #mission .tag { background: rgba(220,144,30,0.2); color: var(--gold-l); }
  .mission-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 40px; }
  .mission-card { background: rgba(172,18,18,0.15); border: 1px solid rgba(172,18,18,0.3); border-radius: var(--radius); padding: 32px; }
  .mission-card h3 { color: var(--gold-l); font-size: 0.8rem; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 12px; }
  .mission-card p { color: rgba(255,255,255,0.85); margin: 0; font-size: 1.05rem; line-height: 1.65; }

  /* WHAT */
  #what .what-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 40px; }
  .what-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; transition: box-shadow .2s, border-color .2s; }
  .what-card:hover { box-shadow: 0 8px 30px rgba(172,18,18,0.1); border-color: var(--red); }
  .what-icon { width: 48px; height: 48px; background: var(--red-l); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 18px; }

  /* WHO */
  #who { background: var(--light); }
  .audience-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
  .audience-card { background: #fff; border-radius: var(--radius); border: 1px solid var(--border); padding: 28px 24px; }
  .audience-card .aud-icon { font-size: 2rem; margin-bottom: 12px; }
  .audience-card h3 { font-size: 1rem; margin-bottom: 8px; }
  .audience-card p { font-size: 0.9rem; margin: 0; }

  /* FOCUS */
  #focus .focus-list { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 40px; }
  .focus-item { display: flex; align-items: flex-start; gap: 14px; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); background: #fff; }
  .focus-item .fi-dot { width: 10px; height: 10px; background: var(--red); border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .focus-item p { margin: 0; font-size: 0.95rem; }

  /* PARTNERS */
  #partners { background: var(--light); }
  .partners-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 40px; }
  .partner-card,
  .partner-card a { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 28px; display: flex; flex-direction: column; gap: 6px; text-decoration: none; color: inherit; }
  .partner-card .partner-type { font-size: 0.75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--red); }
  .partner-card h3 { font-size: 1rem; margin: 0; }
  .partner-card p { font-size: 0.88rem; margin: 0; }
  .principal-section { margin-top: 36px; }
  .principal-section .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .principal-section .section-header h3 { margin: 0; font-size: 1.1rem; }
  .principal-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 20px; }
  .principal-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; }
  .principal-card img { width: 100%; height: 220px; object-fit: cover; object-position: center; display: block; }
  .principal-card img.offset-down { object-position: center 20%; }
  .principal-card img.offset-down-chris { object-position: center 3%; }
  .principal-card-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .principal-card h4 { margin: 0; font-size: 1rem; }
  .principal-card .bio-toggle { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(172,18,18,0.2); background: rgba(172,18,18,0.05); color: var(--red-d); padding: 10px 14px; border-radius: 999px; cursor: pointer; font-size: 0.9rem; transition: background .2s, transform .2s; }
  .principal-card .bio-toggle:hover { background: rgba(172,18,18,0.12); transform: translateY(-1px); }
  .principal-card .bio-text { margin: 0; font-size: 0.92rem; color: var(--mid); line-height: 1.5; }
  .support-note { margin-top: 32px; padding: 20px 24px; background: rgba(172,18,18,0.07); border-left: 4px solid var(--red); border-radius: 0 var(--radius) var(--radius) 0; font-size: 0.92rem; color: var(--red-d); }

  /* COLLABORATE */
  #collaborate { background: linear-gradient(135deg, #4A0202, #AC1212); color: white; text-align: center; }
  #collaborate h2 { color: #fff; }
  #collaborate .tag { background: rgba(220,144,30,0.2); color: var(--gold-l); }
  #collaborate > .container > p { color: rgba(255,255,255,.85); max-width: 620px; margin: 0 auto 32px; }
  .cta-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 40px 0 48px; text-align: left; }
  .cta-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); padding: 20px; }
  .cta-card h3 { color: var(--gold-l); font-size: 0.95rem; margin-bottom: 6px; }
  .cta-card p { color: rgba(255,255,255,0.75); font-size: 0.88rem; margin: 0; }

  /* SPONSORS */
  #sponsors { background: var(--dark); padding: 70px 0; }
  #sponsors h2 { color: #fff; text-align: center; font-size: clamp(1.4rem,2.5vw,2rem); margin-bottom: 10px; }
  #sponsors .tag { display: block; text-align: center; margin: 0 auto 14px; }
  #sponsors .sub { text-align: center; color: rgba(255,255,255,0.5); font-size: 0.92rem; margin-bottom: 48px; }
  .sponsors-row { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: stretch; }
  .sponsors-col { display: flex; flex-direction: column; gap: 14px; }
  .sponsors-label { text-align: center; font-size: 0.75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); padding-bottom: 2px; }
  .sponsors-card { background: #fff; border-radius: 14px; overflow: hidden; padding: 28px 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(172,18,18,0.2); display: flex; align-items: center; justify-content: center; min-height: 160px; }
  .sponsors-card img { width: auto; max-width: 100%; max-height: 140px; height: auto; display: block; border-radius: 8px; object-fit: contain; }

  /* FOOTER */
  footer { background: #0e0202; color: rgba(255,255,255,0.45); padding: 40px 0; font-size: 0.85rem; }
  .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .footer-brand { color: #fff; font-weight: 700; font-size: 1rem; }
  .footer-brand span { color: var(--gold-l); }
  .footer-logo { height: 40px; object-fit: contain; opacity: 0.9; filter: drop-shadow(0 0 3px rgba(172,18,18,0.4)); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    section { padding: 60px 0; }
    .problem-grid, .mission-cards, .audience-grid, .focus-list, .partners-grid, .cta-cards { grid-template-columns: 1fr !important; }
    .what-grid { grid-template-columns: 1fr 1fr !important; }
    .stats-row { grid-template-columns: 1fr !important; }
    .nav-links { display: none !important; }
    #hero { min-height: auto; }
    .hero-content { grid-template-columns: 1fr !important; gap: 32px; padding: 60px 0 60px; }
    .hero-img-wrap { order: -1; }
    .hero-img-wrap img { height: 260px; }
    .sponsors-row { grid-template-columns: 1fr !important; }
    .principal-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .what-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function ADDN() {
  const [showApp, setShowApp] = useState(false);
  const [bioOpen, setBioOpen] = useState([false, false, false]);

  const toggleBio = (index) => {
    setBioOpen((current) => current.map((open, i) => (i === index ? !open : open)));
  };

  if (showApp) {
    return <App onBack={() => setShowApp(false)} />;
  }

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="main-nav">
        <div className="container nav-inner">
          <a className="nav-logo" href="#hero">
            <img src={logoImg} alt="ADDN Logo" />
          </a>
          <ul className="nav-links">
            <li><a href="#problem">The Problem</a></li>
            <li><a href="#what">About</a></li>
            <li><a href="#who">Who It's For</a></li>
            <li><a href="#partners">Partners</a></li>
            <li><a href="#collaborate">Collaborate</a></li>
            <li>
              <button type="button" className="nav-link-button" onClick={() => setShowApp(true)}>
                Open Explorer
              </button>
            </li>
          </ul>
          <a href="#collaborate" className="btn btn-primary">Express Interest</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg-fallback"></div>
        <div className="hero-pattern"></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="dot"></span>
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
              <button onClick={() => setShowApp(true)} className="btn btn-primary btn-lg" style={{ background: "#ffffff", color: "var(--dark)", border: "2px solid var(--red)", marginLeft: "0" }}>
                Open Data Explorer
              </button>
            </div>
            <div className="event-badge">
              📍 ADDN &nbsp;·&nbsp; Enhancing Inclusiveness with AI
            </div>
          </div>

          <div className="hero-img-wrap">
            <img src={heroImg} alt="ADDN launch" />
            <div className="hero-img-caption">
              ADDN · Enhancing Inclusiveness with AI
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem">
        <div className="container">
          <div className="problem-grid">
            <div>
              <div className="tag">The Problem</div>
              <h2>Africa's AI systems are built without disability data</h2>
              <p>Artificial intelligence is rapidly reshaping education, employment, healthcare, and public services across Africa, yet PWDs remain largely absent from the datasets on which AI systems are built.</p>
              <p>Disability is often absent from datasets and, as a result, underrepresented in AI systems. This contributes to technologies that may misunderstand, overlook, or exclude PWDs. This "disability data desert" limits the ability of AI systems to recognise and respond to diverse disability experiences across Africa.</p>
              <p>Three major barriers drive this gap: a persistent disability data deficit, fragmented innovation ecosystems, and weak integration of disability inclusion within AI governance.</p>
            </div>
            <div>
              <div className="stats-row">
                <div className="stat-block">
                  <div className="stat">15%</div>
                  <p>of the world's population lives with disability, yet PWDs remain largely invisible in AI training data</p>
                </div>
                <div className="stat-block">
                  <div className="stat">80%</div>
                  <p>of PWDs globally live in low- and middle-income countries, including across Africa</p>
                </div>
                <div className="stat-block" style={{ gridColumn: "span 2" }}>
                  <div className="stat" style={{ fontSize: "1.8rem" }}>"Disability data desert"</div>
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
          <p style={{ maxWidth: "660px" }}>ADDN is a Pan-African coordination and data discovery platform. Rather than hosting datasets itself, ADDN helps users identify what datasets exist, understand access conditions, and connect responsibly with dataset custodians and related initiatives.</p>
          <div className="what-grid">
            {[
              { title: "Data Discovery", desc: "Catalog and surface disability-related datasets from across Africa, making them visible and easier to find for researchers and innovators." },
              { title: "Ecosystem Coordination", desc: "Connect researchers, OPDs, policymakers, and innovators working on disability and AI across sectoral and geographic boundaries." },
              { title: "Ethical Governance", desc: "Promote responsible disability data practices, prioritising informed consent, privacy, participation of PWDs, and accountability." },
              { title: "Pan-African Reach", desc: "Built to serve the diversity of African contexts, languages, and disability communities from the ground up." },
              { title: "From Data to Impact", desc: "Support real-world AI innovation in assistive technology, education, employment, mental health, and accessibility." },
              { title: "Part of HAIDI", desc: "ADDN contributes to the broader Hub for AI and Disability Inclusion (HAIDI), focusing on the data foundations for disability-inclusive AI." },
            ].map((card) => (
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
          <div className="tag">Who It's For</div>
          <h2>A network built for a diverse ecosystem</h2>
          <p style={{ maxWidth: "600px" }}>ADDN is designed to support every actor working at the intersection of disability, data, and AI in Africa.</p>
          <div className="audience-grid">
            {[
              { title: "Researchers & Dataset Builders", desc: "Universities, AI labs, and dataset creators developing disability-related data resources." },
              { title: "AI Innovators", desc: "Startups and AI developers seeking responsible access to disability-relevant datasets and partnerships." },
              { title: "OPDs & Disability Communities", desc: "Organizations ensuring disability data practices are participatory, ethical, and rights-based." },
              { title: "Policymakers", desc: "Governments, regulators, and AI strategy bodies working to strengthen disability-inclusive digital governance." },
              { title: "Media", desc: "Journalists and communicators amplifying the conversation around disability inclusion in Africa's AI ecosystem." },
              { title: "Funders & Ecosystem Builders", desc: "Development partners, accelerators, and philanthropic organizations supporting inclusive AI ecosystems." },
            ].map((card) => (
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
          <h2>Where we're starting</h2>
          <p style={{ maxWidth: "620px" }}>During its early phase, ADDN will explore and strengthen disability-related datasets and partnerships across several emerging domains.</p>
          <div className="focus-list">
            {[
              { title: "Sign Language & Communication", desc: "Datasets supporting African sign language recognition and communication AI tools." },
              { title: "Non-Standard Speech & Accessibility", desc: "Speech datasets capturing the diversity of disability-related vocal expression and accessibility needs." },
              { title: "Mental Health & Psychosocial Support", desc: "Data resources for AI solutions addressing mental health and psychosocial disability across Africa." },
              { title: "Employment & Disability Inclusion", desc: "Datasets supporting AI-driven employment and economic inclusion for PWDs." },
            ].map((item) => (
              <div className="focus-item" key={item.title}>
                <div className="fi-dot"></div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
            <div className="focus-item" style={{ gridColumn: "span 2" }}>
              <div className="fi-dot"></div>
              <div>
                <h3>Ethical &amp; Governance Frameworks</h3>
                <p>Standards, principles, and frameworks for ethical, participatory, and rights-based disability data governance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners">
        <div className="container">
          <div className="tag">Founding Partners &amp; Support</div>
          <h2>Built through Pan-African collaboration</h2>
          <p style={{ maxWidth: "600px" }}>ADDN is developed through collaboration among organisations working at the intersection of artificial intelligence, disability inclusion, and innovation across Africa.</p>
          <div className="partners-grid">
            {[
              { href: "https://example.com/mcaai", name: "Maseno Centre for Applied AI (MCAAI)", sub: "Maseno University, Kenya — applied AI research for development" },
              { href: "https://example.com/rail", name: "Responsible AI Lab (RAIL)", sub: "Kwame Nkrumah University of Science and Technology (KNUST), Ghana" },
              { href: "https://example.com/at4d", name: "Assistive Technologies for Disability Trust (AT4D)", sub: "Supporting assistive technology access and disability inclusion" },
              { href: "https://example.com/nsf", name: "Next Step Foundation (NSF)", sub: "Driving disability inclusion and empowerment across Africa" },
            ].map((p) => (
              <a className="partner-card" key={p.name} href={p.href} target="_blank" rel="noopener noreferrer">
                <span className="partner-type">Founding Partner</span>
                <h3>{p.name}</h3>
                <p>{p.sub}</p>
              </a>
            ))}
          </div>
          <div className="support-note">
            <strong>Initial Support:</strong> ADDN is supported by the <strong>Artificial Intelligence for Development (AI4D)</strong> programme, funded by the <strong>International Development Research Centre (IDRC)</strong> and the <strong>United Kingdom's Foreign, Commonwealth &amp; Development Office (FCDO)</strong>.
          </div>
          <div className="principal-section">
            <div className="section-header">
              <div className="tag">Principal Investigators</div>
              <h3>Meet the principal investigators</h3>
            </div>
            <div className="principal-grid">
              {[
                { img: ldImg, imgClass: "", name: "Dr. Lilian Wanzare", role: "Lead Principal Investigator - MCAAI", bio: "Placeholder biography content for L. D. covering their research focus, leadership role, and connection to disability-inclusive AI in Africa." },
                { img: bernardImg, imgClass: "offset-down", name: "Bernard Chiira", role: "Principal Investigator - AT4D", bio: "Placeholder biography content for Bernard Chira describing experience in applied AI research, disability inclusion, and dataset collaboration." },
                { img: chrisImg, imgClass: "offset-down-chris", name: "Chris Harrison", role: "Principal Investigator - NSF", bio: "Placeholder biography content for Chris Hrsn outlining their expertise in inclusive data practices and partner engagement across the ADDN network." },
              ].map((person, index) => (
                <div className="principal-card" key={person.name}>
                  <img className={person.imgClass || ""} src={person.img} alt={person.name} />
                  <div className="principal-card-body">
                    <div>
                      <h4>{person.name}</h4>
                      <p>{person.role}</p>
                    </div>
                    <button type="button" className="bio-toggle" onClick={() => toggleBio(index)}>
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
            {[
              { title: "Research & Datasets", desc: "Contribute datasets, collaborate on ethical standards, or share research on disability-inclusive AI." },
              { title: "Policy & Governance", desc: "Shape disability-inclusive data governance frameworks and digital policy across Africa." },
              { title: "OPD Engagement", desc: "Ensure disability data practices centre the voices, rights, and participation of PWDs." },
              { title: "Funding & Partnerships", desc: "Support the data infrastructure needed for disability-inclusive AI innovation at scale." },
              { title: "Media & Communications", desc: "Amplify the importance of disability-inclusive data and help build visibility for ADDN." },
              { title: "AI Innovation", desc: "Access disability-relevant datasets responsibly to build inclusive AI solutions for Africa." },
            ].map((card) => (
              <div className="cta-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
          <a href="https://forms.gle/73bKa4jU8VfdeHRx9" className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
            Submit Your Expression of Interest →
          </a>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors">
        <div className="container">
          <div className="tag" style={{ background: "rgba(220,144,30,0.15)", color: "var(--gold)" }}>Sponsors &amp; Partners</div>
          <h2>The ecosystem behind ADDN</h2>
          <p className="sub">Built through collaboration across research, innovation, funding, and disability inclusion</p>
          <div className="sponsors-row">
            <div className="sponsors-col">
              <div className="sponsors-label">Founding Partners</div>
              <div className="sponsors-card">
                <img src={sponsor15Img} alt="Maseno University, MCAAI, Next Step Foundation, Assistive Technologies for Disability Trust" />
              </div>
            </div>
            <div className="sponsors-col">
              <div className="sponsors-label">Funders &amp; Supporters</div>
              <div className="sponsors-card">
                <img src={sponsor179Img} alt="AI4D Africa, Foreign Commonwealth & Development Office, IDRC-CRDI Canada, Universidade de Cabo Verde" />
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
            <div style={{ marginTop: "4px" }}>Part of the Hub for AI and Disability Inclusion (HAIDI)</div>
          </div>
          <div>Supported by AI4D · IDRC · FCDO</div>
        </div>
      </footer>
    </>
  );
}
