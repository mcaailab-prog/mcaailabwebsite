import { useMemo } from "react";
import { BORDER, CARD_BG, DARK, GOLD, LIGHT, MID, PURPLE, RED_DARK, TEAL } from "../lib/constants";
import type { Dataset, Organisation, Publication, Venture } from "../lib/types";

interface SummaryTableProps {
  datasets: Dataset[];
  ventures: Venture[];
  orgs: Organisation[];
  publications: Publication[];
}

interface CountryCounts {
  region: string;
  datasets: number;
  ventures: number;
  orgs: number;
  publications: number;
}

type CountKey = "datasets" | "ventures" | "orgs" | "publications";

const total = (c: CountryCounts) => c.datasets + c.ventures + c.orgs + c.publications;

const HEADERS = ["Country", "Region", "Datasets", "Innovators & Ventures", "Organisations", "Publications", "Total"];

export default function SummaryTable({ datasets, ventures, orgs, publications }: SummaryTableProps) {
  const byCountry = useMemo(() => {
    const m: Record<string, CountryCounts> = {};
    const bump = (country: string, region: string, key: CountKey) => {
      if (!country) return;
      if (!m[country]) m[country] = { region: region || "", datasets: 0, ventures: 0, orgs: 0, publications: 0 };
      m[country][key] += 1;
      if (!m[country].region && region) m[country].region = region;
    };
    datasets.forEach((d) => bump(d.country, d.region, "datasets"));
    ventures.forEach((v) => bump(v.country, v.region, "ventures"));
    orgs.forEach((o) => bump(o.country, o.region, "orgs"));
    publications.forEach((p) => bump(p.country, p.region, "publications"));
    return Object.entries(m).sort((a, b) => total(b[1]) - total(a[1]));
  }, [datasets, ventures, orgs, publications]);

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="summary-table">
        <thead>
          <tr style={{ background: LIGHT }}>
            {HEADERS.map((h) => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: RED_DARK, borderBottom: `1px solid ${BORDER}`, fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {byCountry.map(([country, v], i) => (
            <tr key={country} style={{ background: i % 2 === 0 ? CARD_BG : "#f7f3ef" }}>
              <td style={{ padding: "9px 12px", color: DARK, fontWeight: 500 }}>{country}</td>
              <td style={{ padding: "9px 12px", color: MID }}>{v.region}</td>
              <td style={{ padding: "9px 12px", color: RED_DARK, fontWeight: 600 }}>{v.datasets}</td>
              <td style={{ padding: "9px 12px", color: GOLD, fontWeight: 600 }}>{v.ventures}</td>
              <td style={{ padding: "9px 12px", color: PURPLE, fontWeight: 600 }}>{v.orgs}</td>
              <td style={{ padding: "9px 12px", color: TEAL, fontWeight: 600 }}>{v.publications}</td>
              <td style={{ padding: "9px 12px", color: DARK, fontWeight: 700 }}>{total(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
