export type Region =
  | "East Africa"
  | "West Africa"
  | "Central Africa"
  | "Southern Africa"
  | "North Africa"
  | "Pan-African";

export type RegionFilter = "All Africa" | Region;

export interface Dataset {
  id: number;
  country: string;
  region: Region;
  org: string;
  name: string;
  signLanguage: string;
  domain: string;
  type: string;
  year: number;
  participants: number | null;
  size: string;
  accessible: boolean;
  fee: boolean;
  design: string;
  topics: string[];
  contact: string;
  desc: string;
  lat: number;
  lng: number;
}

export interface Venture {
  id: number;
  name: string;
  country: string;
  region: Region;
  focus: string;
  aiSpecialization: string;
  product: string;
  stage: string;
  website: string | null;
  notes: string | null;
  lat: number | null;
  lng: number | null;
}

export type OrganisationCategory = "Capacity Building" | "Advocacy & NGOs";

export interface Organisation {
  id: number;
  category: OrganisationCategory;
  subType: string;
  name: string;
  country: string;
  region: Region;
  focus: string;
  website: string | null;
  desc: string;
  lat: number | null;
  lng: number | null;
}

export interface Publication {
  id: number;
  title: string;
  authors: string;
  year: number;
  venue: string;
  country: string;
  link: string;
  summary: string;
  region: Region;
}

/** An item plotted on the map, tagged with the collection it came from. */
export type MapItem =
  | (Dataset & { __kind: "dataset" })
  | (Venture & { __kind: "venture" })
  | (Organisation & { __kind: "org" });

export type CategoryFilter = "all" | "datasets" | "ventures" | "orgs" | "publications";
export type AccessFilter = "All" | "Accessible" | "Restricted";
export type TabId = "map" | "grid" | "list" | "summary" | "about" | "faq";
