"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import {
  PUBLICATIONS, PUBLICATION_TABS, TYPE_LABEL, formatPubDate,
  type PublicationType,
} from "../lib/publications";

type TabId = "all" | PublicationType;

export default function PublicationsSection() {
  const [tab, setTab] = useState<TabId>("all");

  const sorted = useMemo(
    () => [...PUBLICATIONS].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );
  const countOf = (id: TabId) => (id === "all" ? sorted.length : sorted.filter((p) => p.type === id).length);
  const items = tab === "all" ? sorted : sorted.filter((p) => p.type === tab);

  // Arrow keys move between tabs, as expected for an ARIA tablist.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = PUBLICATION_TABS.findIndex((t) => t.id === tab);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % PUBLICATION_TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + PUBLICATION_TABS.length) % PUBLICATION_TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = PUBLICATION_TABS.length - 1;
    else return;
    e.preventDefault();
    const id = PUBLICATION_TABS[next].id;
    setTab(id);
    document.getElementById(`pub-tab-${id}`)?.focus();
  };

  return (
    <section id="publications">
      <div className="container">
        <div className="tag">Publications &amp; Reports</div>
        <h2>Research, reports and policy briefs</h2>
        <p style={{ maxWidth: 620 }}>
          Evidence and guidance from HAIDI and the ADDN network on disability data, ethical
          governance and inclusive AI in Africa.
        </p>

        <div className="pub-tabs" role="tablist" aria-label="Publication type" onKeyDown={onKeyDown}>
          {PUBLICATION_TABS.map((t) => (
            <button
              key={t.id}
              id={`pub-tab-${t.id}`}
              type="button"
              role="tab"
              className="pub-tab"
              aria-selected={tab === t.id}
              aria-controls="pub-panel"
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <span className="pub-count">{countOf(t.id)}</span>
            </button>
          ))}
        </div>

        <div id="pub-panel" role="tabpanel" aria-labelledby={`pub-tab-${tab}`}>
          {items.length === 0 ? (
            <div className="events-empty">
              <strong>Nothing here yet.</strong>
              <p>Documents in this category will appear here as they are published.</p>
            </div>
          ) : (
            <div className="pub-grid">
              {items.map((p) => (
                <article className="pub-card" key={p.id}>
                  <div className="pub-card-top">
                    <span className="pub-type">{TYPE_LABEL[p.type]}</span>
                    <span className="pub-date">{formatPubDate(p.date)}</span>
                  </div>
                  <h3>{p.title}</h3>
                  {p.authors && <p className="pub-authors">{p.authors}</p>}
                  <p className="pub-summary">{p.summary}</p>
                  {p.url ? (
                    <a className="pub-link" href={p.url} target="_blank" rel="noopener noreferrer">
                      Read / download →
                    </a>
                  ) : (
                    <span className="pub-soon">Link coming soon</span>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
