/**
 * HAIDI publications & reports.
 *
 * HOW TO ADD ONE: add an object to PUBLICATIONS below. It appears under "All" and
 * under the tab matching its `type`. Newest `date` is shown first.
 * Without a `url` the card shows "Link coming soon".
 *
 * The entries below are SAMPLES: replace them with real documents before deploying.
 */

export type PublicationType = "publication" | "report" | "brief";

export interface Publication {
  id: string;
  title: string;
  type: PublicationType;
  /** Publication date, YYYY-MM-DD */
  date: string;
  authors?: string;
  summary: string;
  /** Link to the PDF or page */
  url?: string;
}

export const PUBLICATION_TABS: { id: "all" | PublicationType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "publication", label: "Publications" },
  { id: "report", label: "Reports" },
  { id: "brief", label: "Policy briefs" },
];

export const TYPE_LABEL: Record<PublicationType, string> = {
  publication: "Publication",
  report: "Report",
  brief: "Policy brief",
};

export const PUBLICATIONS: Publication[] = [
  {
    id: "state-of-disability-data",
    title: "[Sample] The State of Disability Data for AI in Africa",
    type: "report",
    date: "2026-09-15",
    authors: "HAIDI / ADDN",
    summary: "A landscape review of what disability-related datasets exist across Africa, how accessible they are, and where the major gaps remain.",
    url: "https://example.com/state-of-disability-data.pdf",
  },
  {
    id: "ethical-governance-framework",
    title: "[Sample] Towards an Ethical Governance Framework for Disability Data",
    type: "publication",
    date: "2026-07-02",
    authors: "Research team",
    summary: "Principles for consent, privacy and participation of persons with disabilities in data collection and AI development.",
    url: "https://example.com/ethical-governance.pdf",
  },
  {
    id: "brief-inclusive-ai-strategy",
    title: "[Sample] Policy Brief: Embedding Disability Inclusion in National AI Strategies",
    type: "brief",
    date: "2026-05-20",
    summary: "Five recommendations for policymakers to make national AI strategies disability-inclusive.",
  },
  {
    id: "launch-report",
    title: "[Sample] ADDN Launch Report",
    type: "report",
    date: "2026-06-30",
    summary: "Highlights, outcomes and next steps from the ADDN launch.",
    url: "https://example.com/launch-report.pdf",
  },
  {
    id: "sign-language-datasets-review",
    title: "[Sample] African Sign Language Datasets: A Review",
    type: "publication",
    date: "2025-12-10",
    authors: "Research team",
    summary: "A review of existing sign language datasets, their coverage and the barriers to responsible reuse.",
  },
];

const PUB_DATE = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

/** "Sep 2026" */
export const formatPubDate = (iso: string) => PUB_DATE.format(Date.parse(`${iso}T00:00:00Z`));
