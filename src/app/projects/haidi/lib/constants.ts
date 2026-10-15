import type { LatLngTuple } from "leaflet";
import type { OrganisationCategory, RegionFilter } from "./types";

export const REGIONS: RegionFilter[] = [
  "All Africa",
  "East Africa",
  "West Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Pan-African",
];

export const REGION_COORDS: Record<RegionFilter, { center: LatLngTuple; zoom: number }> = {
  "All Africa": { center: [2, 20], zoom: 2.5 },
  "East Africa": { center: [2, 35], zoom: 4 },
  "West Africa": { center: [8, -2], zoom: 4 },
  "Central Africa": { center: [4, 22], zoom: 4 },
  "Southern Africa": { center: [-25, 25], zoom: 4 },
  "North Africa": { center: [25, 20], zoom: 4 },
  "Pan-African": { center: [2, 20], zoom: 2.5 },
};

export const DOMAIN_COLORS: Record<string, string> = {
  "Machine Learning": "#0D9E75",
  NLP: "#1F4E79",
  "Computer Vision": "#E67E22",
  "Assistive AI": "#8E44AD",
  Datasets: "#C0392B",
};

export const CATEGORY_COLORS: Record<OrganisationCategory, string> = {
  "Capacity Building": "#0D9E75",
  "Advocacy & NGOs": "#8E44AD",
};

export const COUNTRY_REGION: Record<string, RegionFilter> = {
  Kenya: "East Africa", Ethiopia: "East Africa", Tanzania: "East Africa",
  Uganda: "East Africa", Rwanda: "East Africa", Somalia: "East Africa",
  Nigeria: "West Africa", Ghana: "West Africa", "Francophone Africa": "West Africa", Benin: "West Africa",
  "South Africa": "Southern Africa", Zimbabwe: "Southern Africa", Zambia: "Southern Africa",
  Botswana: "Southern Africa", Malawi: "Southern Africa",
  Sudan: "North Africa", Morocco: "North Africa", Egypt: "North Africa",
  "Central Africa": "Central Africa", "Multi-country": "Pan-African", Madagascar: "East Africa",
  "Pan-Africa": "Pan-African", Global: "Pan-African",
};

export const ADDN_HOME_URL = "https://tourmaline-rolypoly-f9598c.netlify.app/";

export const RED = "#AC1212";
export const RED_DARK = "#4A0202";
export const GOLD = "#DC901E";
export const GOLD_LIGHT = "#EEB42C";
export const TEAL = "#0D9E75";
export const PURPLE = "#8E44AD";
export const DARK = "#180404";
export const MID = "#5a3a3a";
export const LIGHT = "#faf8f7";
export const BORDER = "#e8ddd9";
export const CARD_BG = "#ffffff";
export const MAP_PIN = "#AC1212";
export const MAP_PIN_ALT = "#DC901E";
