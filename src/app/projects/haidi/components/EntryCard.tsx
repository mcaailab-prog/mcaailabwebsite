"use client";

import { useState, type ReactNode } from "react";
import Badge from "./Badge";
import {
  BORDER, CATEGORY_COLORS, DARK, DOMAIN_COLORS, GOLD, MAP_PIN, MAP_PIN_ALT, MID, PURPLE, RED, TEAL,
} from "../lib/constants";
import type { Dataset, Organisation, Publication, Venture } from "../lib/types";

export type EntryCardProps =
  | { type: "dataset"; item: Dataset }
  | { type: "venture"; item: Venture }
  | { type: "org"; item: Organisation }
  | { type: "publication"; item: Publication };

type Field = [label: string, value: string | number | null | undefined];

function FieldGrid({ fields }: { fields: Field[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {fields.map(([k, v]) =>
        v ? (
          <div key={k}>
            <span style={{ fontSize: 11, color: MID, textTransform: "uppercase" }}>{k}</span>
            <div style={{ fontSize: 13, color: DARK, marginTop: 2 }}>{v}</div>
          </div>
        ) : null,
      )}
    </div>
  );
}

function WebsiteLink({ website }: { website: string | null }) {
  return (
    <div style={{ marginTop: 10, fontSize: 12 }}>
      {website ? (
        <a
          href={website.startsWith("http") ? website : `https://${website}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: RED, textDecoration: "none", fontWeight: 600 }}
        >
          Visit website →
        </a>
      ) : (
        <span style={{ color: MID }}>No public website listed</span>
      )}
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <div style={{ marginTop: 10, fontSize: 12, color: MID }}>📄 {children}</div>;
}

export default function EntryCard(props: EntryCardProps) {
  const [open, setOpen] = useState(false);
  const { type, item } = props;

  let title: string;
  let meta: string;
  let description: string | null;
  let badges: ReactNode;
  let details: ReactNode;

  switch (props.type) {
    case "dataset": {
      const d = props.item;
      title = d.name;
      meta = `${d.country}${d.org ? ` · ${d.org}` : ""}`;
      description = d.desc;
      badges = (
        <>
          <Badge text={d.domain} color={DOMAIN_COLORS[d.domain] ?? RED} />
          {d.accessible ? <Badge text="Accessible" color={MAP_PIN} /> : <Badge text="Restricted" color={MAP_PIN_ALT} />}
        </>
      );
      details = (
        <>
          <FieldGrid fields={[["Sign Language", d.signLanguage], ["Year", d.year], ["Type", d.type], ["Size", d.size], ["Design", d.design]]} />
          {d.topics.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {d.topics.map((t) => <Badge key={t} text={t} color={GOLD} />)}
            </div>
          )}
          {d.contact && <Note>{d.contact}</Note>}
        </>
      );
      break;
    }
    case "venture": {
      const v = props.item;
      title = v.name;
      meta = `${v.country}${v.aiSpecialization ? ` · ${v.aiSpecialization}` : ""}`;
      description = null; // ventures have no desc/summary field in the source data
      badges = (
        <>
          {v.stage && <Badge text={v.stage} color={TEAL} />}
          {v.focus && <Badge text={v.focus} color={PURPLE} />}
        </>
      );
      details = (
        <>
          <FieldGrid fields={[["AI Specialisation", v.aiSpecialization], ["Product / Solution", v.product], ["Stage", v.stage]]} />
          {v.notes && <Note>{v.notes}</Note>}
          <WebsiteLink website={v.website} />
        </>
      );
      break;
    }
    case "org": {
      const o = props.item;
      title = o.name;
      meta = `${o.country}${o.subType ? ` · ${o.subType}` : ""}`;
      description = o.desc;
      badges = <Badge text={o.category} color={CATEGORY_COLORS[o.category] ?? TEAL} />;
      details = (
        <>
          <FieldGrid fields={[["Category", o.category], ["Sub-Type", o.subType], ["Disability Focus", o.focus]]} />
          <WebsiteLink website={o.website} />
        </>
      );
      break;
    }
    case "publication": {
      const p = props.item;
      title = p.title;
      meta = `${p.authors || ""}${p.venue ? ` · ${p.venue}` : ""}`;
      description = p.summary;
      badges = p.year ? <Badge text={String(p.year)} color={TEAL} /> : null;
      details = (
        <>
          <FieldGrid fields={[["Authors", p.authors], ["Year", p.year], ["Venue", p.venue], ["Country / Region Studied", p.country]]} />
          {p.link && (
            <div style={{ marginTop: 10, fontSize: 12 }}>
              <a href={p.link} target="_blank" rel="noreferrer" style={{ color: RED, textDecoration: "none", fontWeight: 600 }}>
                View on Google Scholar →
              </a>
            </div>
          )}
        </>
      );
      break;
    }
  }

  return (
    <div className="dataset-card" data-kind={type} data-id={item.id}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexShrink: 0, cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            <Badge text={item.region} color={GOLD} />
            {badges}
          </div>
          <div className="dataset-card-title">{title}</div>
          <div className="dataset-card-meta">{meta}</div>
        </div>
        <button
          type="button"
          className="card-toggle"
          aria-expanded={open}
          aria-label={open ? "Collapse details" : "Expand details"}
        >
          {open ? "▲" : "▼"}
        </button>
      </div>
      {open && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
          {description && <p style={{ fontSize: 13, color: MID, lineHeight: 1.6, margin: "0 0 10px" }}>{description}</p>}
          {details}
        </div>
      )}
    </div>
  );
}
