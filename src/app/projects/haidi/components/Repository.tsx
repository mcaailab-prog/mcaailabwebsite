"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Badge from "./Badge";
import EntryCard from "./EntryCard";
import StatCard from "./StatCard";
import SummaryTable from "./SummaryTable";
import {
  BORDER, CATEGORY_COLORS, CARD_BG, COUNTRY_REGION, DARK, DOMAIN_COLORS,
  GOLD, LIGHT, MID, PURPLE, RED, RED_DARK, REGIONS, TEAL,
} from "../lib/constants";
import { DATASETS, ORGANISATIONS, PUBLICATIONS, VENTURES } from "../lib/data";
import type { AccessFilter, CategoryFilter, MapItem, RegionFilter, TabId } from "../lib/types";

// Leaflet needs `window`, so the map is rendered on the client only.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div style={{ borderRadius: 18, background: CARD_BG, height: "clamp(420px, 50vh, 560px)", display: "grid", placeItems: "center", color: MID, fontSize: 13 }}>
      Loading map…
    </div>
  ),
});

const ACCESS_OPTIONS: AccessFilter[] = ["All", "Accessible", "Restricted"];

/** "All Africa" and "Pan-African" both show every entry, as in the original app. */
const inRegion = (selected: RegionFilter, region: string) =>
  selected === "All Africa" || selected === "Pan-African" || region === selected;

const includes = (value: string | null | undefined, query: string) =>
  (value ?? "").toLowerCase().includes(query);

interface RepositoryProps {
  /** Optional handler when embedded inside the ADDN shell; falls back to a link. */
  onBack?: () => void;
}

export default function Repository({ onBack }: RepositoryProps) {
  const [activeTab, setActiveTab] = useState<TabId>("map");
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("All Africa");
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("All");
  const [filterAccess, setFilterAccess] = useState<AccessFilter>("All");
  const [filterType, setFilterType] = useState<CategoryFilter>("all");

  const allDomains = useMemo(() => ["All", ...new Set(DATASETS.map(d => d.domain))], []);
  const q = search.toLowerCase();

  const filteredDS = useMemo(() => DATASETS.filter(d => {
    const dom = filterDomain === "All" || d.domain === filterDomain;
    const acc = filterAccess === "All" || (filterAccess === "Accessible" && d.accessible) || (filterAccess === "Restricted" && !d.accessible);
    const s = !q || includes(d.name, q) || includes(d.country, q) || includes(d.org, q);
    return inRegion(selectedRegion, d.region) && dom && acc && s;
  }), [selectedRegion, filterDomain, filterAccess, q]);

  const filteredVentures = useMemo(() => VENTURES.filter(v => {
    const s = !q || includes(v.name, q) || includes(v.country, q) || includes(v.product, q) || includes(v.focus, q);
    return inRegion(selectedRegion, v.region) && s;
  }), [selectedRegion, q]);

  const filteredOrganisations = useMemo(() => ORGANISATIONS.filter(o => {
    const s = !q || includes(o.name, q) || includes(o.country, q) || includes(o.subType, q) || includes(o.category, q);
    return inRegion(selectedRegion, o.region) && s;
  }), [selectedRegion, q]);

  const filteredPublications = useMemo(() => PUBLICATIONS.filter(p => {
    const s = !q || includes(p.title, q) || includes(p.authors, q) || includes(p.country, q);
    return inRegion(selectedRegion, p.region) && s;
  }), [selectedRegion, q]);

  const showDatasets = filterType === "all" || filterType === "datasets";
  const showVentures = filterType === "all" || filterType === "ventures";
  const showOrgs = filterType === "all" || filterType === "orgs";
  const showPublications = filterType === "all" || filterType === "publications";

  const handleCountryClick = (countryName: string) => {
    setSelectedRegion(COUNTRY_REGION[countryName] ?? "All Africa");
  };

  const totalCountries = useMemo(() => new Set([
    ...DATASETS.map(d => d.country),
    ...VENTURES.map(v => v.country),
    ...ORGANISATIONS.map(o => o.country),
  ]).size, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: "map", label: "Map View" },
    { id: "grid", label: "Grid View" },
    { id: "list", label: "List View" },
    { id: "summary", label: "Data Summary" },
    { id: "about", label: "About" },
    { id: "faq", label: "FAQs" },
  ];

  const mapData: MapItem[] = [
    ...(showDatasets ? filteredDS.map(d => ({ ...d, __kind: "dataset" as const })) : []),
    ...(showVentures ? filteredVentures.map(v => ({ ...v, __kind: "venture" as const })) : []),
    ...(showOrgs ? filteredOrganisations.map(o => ({ ...o, __kind: "org" as const })) : []),
  ];

  return (
    <div className="app-root">
      {/* Header */}
      <div className="app-header">
        <div className="app-brand">
          <div className="app-brand-mark">SL</div>
          <div className="app-header-title">
            <div className="app-title-main">African Disability Datasets, Innovations and Hubs</div>
            <div className="app-title-sub">Part of the African Disability Data Network (ADDN) · HAIDI</div>
          </div>
        </div>
        <div className="app-back">
          {onBack ? (
            <button type="button" onClick={onBack}>← Back to HAIDI home</button>
          ) : (
            <Link href="/projects/haidi">← Back to HAIDI home</Link>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="app-hero">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: RED_DARK, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>African Disability Data Network · ADDN</div>
          <h1>
            African Innovations,  Hubs , <span style={{ color: GOLD }}>Research &amp; Disability Datasets</span> Platform
          </h1>
          <p>
            Mapping datasets, innovators and ventures, organisations, and publications on disability and AI across all African countries. A discovery and coordination platform — not a data host.
          </p>

          {/* Featured stats card */}
          <div className="featured-card">
            <div className="featured-left">
              <h2>Special Needs AI Research &amp; Data</h2>
              <p>Mapping datasets, innovators and ventures, organisations, and publications across all African countries. A discovery and coordination platform — not a data host.</p>
            </div>
            <div className="featured-stats">
              <div className="featured-stat"><div className="num">{DATASETS.length}</div><div className="lbl">Datasets</div></div>
              <div className="featured-stat"><div className="num">{VENTURES.length}</div><div className="lbl">Innovators &amp; Ventures</div></div>
              <div className="featured-stat"><div className="num">{ORGANISATIONS.length}</div><div className="lbl">Organisations</div></div>
              <div className="featured-stat"><div className="num">{PUBLICATIONS.length}</div><div className="lbl">Publications</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <input id="sl-search" className="filter-input" type="text" placeholder="Search datasets, ventures, organisations, publications…" value={search} onChange={e => setSearch(e.target.value)} />

          <select className="filter-select" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value as RegionFilter)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>

          <select className="filter-select" value={filterDomain} onChange={e => setFilterDomain(e.target.value)}>
            {allDomains.map(d => <option key={d}>{d}</option>)}
          </select>

          <select className="filter-select" value={filterAccess} onChange={e => setFilterAccess(e.target.value as AccessFilter)}>
            {ACCESS_OPTIONS.map(a => <option key={a}>{a}</option>)}
          </select>

          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value as CategoryFilter)}>
            <option value="all">All Categories</option>
            <option value="datasets">Datasets</option>
            <option value="ventures">Innovators &amp; Ventures</option>
            <option value="orgs">Organisations</option>
            <option value="publications">Publications</option>
          </select>

          <button type="button" className="filter-button" onClick={() => { setSearch(""); setFilterDomain("All"); setFilterAccess("All"); setFilterType("all"); setSelectedRegion("All Africa"); }}>
            Clear
          </button>
        </div>
        <div style={{ fontSize: 11, color: MID, marginTop: 8, maxWidth: 1200, margin: "8px auto 0" }}>
          Domain and access filters apply to the Datasets category only.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: LIGHT, borderBottom: `1px solid ${BORDER}` }}>
        <div className="tab-row" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {tabs.map(t => (
            <button type="button" key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? "active" : ""}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="app-layout">

        {/* MAP VIEW */}
        {activeTab === "map" && (
          <div className="map-layout">
            <div style={{ minWidth: 0 }}>
              <LeafletMap selectedRegion={selectedRegion} data={mapData} onCountryClick={handleCountryClick} />
              <div style={{ marginTop: 12, fontSize: 12, color: "#6a8aaa" }}>
                Use the region filter above to zoom. Hover markers for a quick country summary, or tap to open details. Publications are not geo-located and appear only in Grid/List/Summary views.
              </div>
            </div>
            <div className="map-sidebar">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, flexShrink: 0 }}>
                {selectedRegion} — {showDatasets ? filteredDS.length : 0} datasets · {showVentures ? filteredVentures.length : 0} ventures · {showOrgs ? filteredOrganisations.length : 0} orgs
              </div>
              <div className="map-sidebar-list">
                {(showDatasets ? filteredDS : []).map(d => <EntryCard key={`d-${d.id}`} item={d} type="dataset" />)}
                {(showVentures ? filteredVentures : []).map(v => <EntryCard key={`v-${v.id}`} item={v} type="venture" />)}
                {(showOrgs ? filteredOrganisations : []).map(o => <EntryCard key={`o-${o.id}`} item={o} type="org" />)}
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {activeTab === "grid" && (
          <div>
            {showDatasets && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>DATASETS ({filteredDS.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: "2rem", alignItems: "start" }}>
                  {filteredDS.map(d => <EntryCard key={d.id} item={d} type="dataset" />)}
                  {filteredDS.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No datasets match your filters.</div>}
                </div>
              </>
            )}
            {showVentures && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>INNOVATORS &amp; VENTURES ({filteredVentures.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: "2rem", alignItems: "start" }}>
                  {filteredVentures.map(v => <EntryCard key={v.id} item={v} type="venture" />)}
                  {filteredVentures.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No ventures match your filters.</div>}
                </div>
              </>
            )}
            {showOrgs && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>ORGANISATIONS ({filteredOrganisations.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: "2rem", alignItems: "start" }}>
                  {filteredOrganisations.map(o => <EntryCard key={o.id} item={o} type="org" />)}
                  {filteredOrganisations.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No organisations match your filters.</div>}
                </div>
              </>
            )}
            {showPublications && (
              <>
                <div style={{ fontSize: 13, color: "#9ab", marginBottom: 12, fontWeight: 600 }}>PUBLICATIONS ({filteredPublications.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, alignItems: "start" }}>
                  {filteredPublications.map(p => <EntryCard key={p.id} item={p} type="publication" />)}
                  {filteredPublications.length === 0 && <div style={{ color: "#9ab", fontSize: 13, gridColumn: "1/-1" }}>No publications match your filters.</div>}
                </div>
              </>
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {activeTab === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {showDatasets && filteredDS.map(d => (
              <div key={`d-${d.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{d.name}</div><div style={{ fontSize: 12, color: MID }}>{d.org}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{d.country}</div>
                <Badge text={d.domain} color={DOMAIN_COLORS[d.domain] || TEAL} />
                <div style={{ fontSize: 12, color: MID }}>{d.year}</div>
                <Badge text={d.accessible ? "Open" : "Restricted"} color={d.accessible ? TEAL : "#E67E22"} />
              </div>
            ))}
            {showVentures && filteredVentures.map(v => (
              <div key={`v-${v.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{v.name}</div><div style={{ fontSize: 12, color: MID }}>{v.product}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{v.country}</div>
                <Badge text={v.focus} color={PURPLE} />
                <div style={{ fontSize: 12, color: MID }}>{v.aiSpecialization || "—"}</div>
                <Badge text={v.stage || "—"} color={TEAL} />
              </div>
            ))}
            {showOrgs && filteredOrganisations.map(o => (
              <div key={`o-${o.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{o.name}</div><div style={{ fontSize: 12, color: MID }}>{o.subType}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{o.country}</div>
                <Badge text={o.category} color={CATEGORY_COLORS[o.category] || TEAL} />
                <div style={{ fontSize: 12, color: MID }}>{o.focus}</div>
                <Badge text={o.region} color={GOLD} />
              </div>
            ))}
            {showPublications && filteredPublications.map(p => (
              <div key={`p-${p.id}`} className="dark-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "0.75rem 1rem" }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: "#180404" }}>{p.title}</div><div style={{ fontSize: 12, color: MID }}>{p.authors}</div></div>
                <div style={{ fontSize: 12, color: MID }}>{p.country}</div>
                <Badge text={String(p.year)} color={TEAL} />
                <div style={{ fontSize: 12, color: MID }}>{p.venue}</div>
                {p.link ? <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: RED, fontWeight: 600 }}>Scholar →</a> : <span />}
              </div>
            ))}
          </div>
        )}

        {/* SUMMARY */}
        {activeTab === "summary" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "2rem" }}>
              <StatCard value={DATASETS.length} label="Total Datasets" />
              <StatCard value={VENTURES.length} label="Innovators & Ventures" />
              <StatCard value={ORGANISATIONS.length} label="Organisations" />
              <StatCard value={PUBLICATIONS.length} label="Publications" />
              <StatCard value={totalCountries} label="Countries Covered" />
              <StatCard value={DATASETS.filter(d => d.accessible).length} label="Open-Access Datasets" />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Organisations by Category</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
                  const count = ORGANISATIONS.filter(o => o.category === cat).length;
                  const pct = Math.round((count / ORGANISATIONS.length) * 100);
                  return (
                    <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 160, fontSize: 12, color: "#9ab" }}>{cat}</div>
                      <div style={{ flex: 1, background: "#f0e6df", borderRadius: 4, height: 16, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ width: 30, fontSize: 12, color: DARK, textAlign: "right" }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Datasets by Domain</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(DOMAIN_COLORS).map(([dom, color]) => {
                  const count = DATASETS.filter(d => d.domain === dom).length;
                  const pct = Math.round((count / DATASETS.length) * 100);
                  return (
                    <div key={dom} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 120, fontSize: 12, color: "#9ab" }}>{dom}</div>
                      <div style={{ flex: 1, background: "#f0e6df", borderRadius: 4, height: 16, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ width: 30, fontSize: 12, color: DARK, textAlign: "right" }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: "#9ab", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>By Country / Region</div>
            <SummaryTable datasets={DATASETS} ventures={VENTURES} orgs={ORGANISATIONS} publications={PUBLICATIONS} />
          </div>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <div style={{ maxWidth: 720, lineHeight: 1.7 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: RED, fontFamily: "Georgia, serif", marginBottom: "1rem" }}>About the Africa Disability AI Data Repository</h2>
            <div className="about-card" style={{ border: `1px solid ${TEAL}44`, marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, color: "#000", fontSize: 14 }}>
                This platform is a <strong style={{ color: RED }}>data discovery and coordination tool</strong> — it does not host datasets directly. Each entry links to the original dataset custodian, organisation, or publication. Access conditions vary per entry.
              </p>
            </div>
            <h3 style={{ fontSize: 16, color: RED, marginBottom: 8 }}>About ADDN</h3>
            <p style={{ color: "#000", fontSize: 14 }}>The African Disability Data Network (ADDN) is a pan-African coordination platform connecting researchers, innovators, OPDs, and policymakers to improve the visibility, discoverability, and ethical governance of disability-related datasets across Africa. ADDN is part of the Hub for AI and Disability Inclusion (HAIDI) and is supported by AI4D, IDRC, and FCDO.</p>
            <h3 style={{ fontSize: 16, color: RED, marginBottom: 8, marginTop: "1.5rem" }}>About This Repository</h3>
            <p style={{ color: "#000", fontSize: 14 }}>This platform brings together four categories: <strong>Datasets</strong> (sign language and disability AI datasets across African countries), <strong>Innovators &amp; Ventures</strong> (AI startups and innovators working on disability inclusion, sourced from the HAIDI Master Stakeholder Database), <strong>Organisations</strong> (capacity-building institutions and advocacy/NGO bodies, also sourced from the HAIDI Master Stakeholder Database), and <strong>Publications</strong> (peer-reviewed and preprint research on sign language technology across Africa, compiled from a Google Scholar literature search restricted to African countries and regions). Entries are organised by region (East, West, Central, Southern, North Africa, Pan-African) and are searchable by name, country, or keyword.</p>
            <h3 style={{ fontSize: 16, color: RED, marginBottom: 8, marginTop: "1.5rem" }}>Founding Partners</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[ ["MCAAI \u2013 Maseno University, Kenya", "Applied AI research for KSL"], ["KNUST / AfriSign \u2013 Ghana", "Multilingual African SL translation"], ["AT4D \u2013 Assistive Tech Trust", "Disability inclusion innovation"], ["Next Step Foundation", "Pan-African disability empowerment"] ].map(([n, d]) => (
                <div key={n} className="dark-card" style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#000", marginTop: 2 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: RED, fontFamily: "Georgia, serif", marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
            {[
              ["How do I access a dataset?", "This platform provides availability information only. ADDN does not provide direct access to data. Each dataset has its own access policies. Click on any dataset card to find contact and access details for the dataset custodian."],
              ["What types of entries are included?", "The platform includes four categories: Datasets (sign language and disability AI datasets), Innovators & Ventures (AI startups and innovators working on disability inclusion across Africa), Organisations (capacity-building institutions, plus advocacy bodies and NGOs), and Publications (peer-reviewed and preprint research on African sign language technology, compiled from a Google Scholar search restricted to Africa)."],
              ["Which African countries are covered?", "The platform covers all African regions: East Africa (Kenya, Ethiopia, Tanzania, Uganda, Rwanda, Malawi), West Africa (Nigeria, Ghana, Benin, Francophone Africa), Southern Africa (South Africa, Botswana, Zimbabwe, Zambia), North Africa (Sudan, Morocco, Egypt, Algeria), Central Africa, and pan-African initiatives. Countries with no identified entries are documented as gaps."],
              ["How do I search?", "Use the search bar to search by name, organisation, product, or country. Use the region dropdown or region pills to filter by African sub-region. Use the category pills to switch between Datasets, Innovators & Ventures, Organisations, and Publications. Domain and accessibility filters apply to the Datasets category only."],
              ["Where do the Innovators & Ventures and Organisations entries come from?", "These are sourced directly from the HAIDI Master Stakeholder Database. Innovators & Ventures combines the database's Ventures & Innovators sheet; Organisations combines its Capacity Building and Advocacy & NGOs categories."],
              ["Where do the Publications entries come from?", "The Publications list was compiled from a Google Scholar literature search on sign language research and datasets, restricted to African countries and regions. It is illustrative rather than exhaustive — follow the source link on each entry for the full record."],
              ["How can I add my dataset, venture, or organisation?", "Contact ADDN at info@aphrc.org or visit the ADDN main site to submit an entry for inclusion. We welcome contributions from across the African disability AI ecosystem."],
              ["What does 'Accessible' mean?", "Datasets marked Accessible are publicly available or have a clear open-access pathway. Datasets marked Restricted require an application, agreement, or payment. Some proprietary datasets are noted but not accessible to the public."],
            ].map(([q, a], i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: "1.25rem", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: RED, marginBottom: 6 }}>{i + 1}. {q}</div>
                <div style={{ fontSize: 13, color: "#000", lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer" style={{ marginTop: "2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#180404" }}>Africa Disability AI Data Repository</div>
            <div style={{ fontSize: 12, color: MID }}>Part of ADDN · Hub for AI and Disability Inclusion (HAIDI) · Supported by AI4D · IDRC · FCDO</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/projects/haidi" style={{ fontSize: 12, color: TEAL, textDecoration: "none" }}>HAIDI Home</Link>
            <span style={{ fontSize: 12, color: BORDER }}>|</span>
            <span style={{ fontSize: 12, color: MID }}>©  2026 ADDN. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
