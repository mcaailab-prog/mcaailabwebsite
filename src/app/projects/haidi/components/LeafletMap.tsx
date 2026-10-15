"use client";

// Leaflet touches `window` on import, so this component must only ever be
// loaded on the client. Repository.tsx imports it with next/dynamic and
// `ssr: false`; don't import it directly from a server component.

import { useEffect, useMemo } from "react";
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Layer, LeafletMouseEvent, Path } from "leaflet";
import type { Feature, Polygon } from "geojson";
import { CARD_BG, GOLD_LIGHT, MAP_PIN, MAP_PIN_ALT, RED, REGION_COORDS } from "../lib/constants";
import { COUNTRY_BORDERS } from "../lib/countryBorders";
import type { MapItem, RegionFilter } from "../lib/types";

interface LeafletMapProps {
  selectedRegion: RegionFilter;
  data: MapItem[];
  onCountryClick?: (country: string) => void;
}

type PlottedItem = MapItem & { lat: number; lng: number };

interface CountrySummary {
  country: string;
  region: string;
  count: number;
}

function MapAutoCenter({ selectedRegion }: { selectedRegion: RegionFilter }) {
  const map = useMap();
  useEffect(() => {
    const region = REGION_COORDS[selectedRegion] ?? REGION_COORDS["All Africa"];
    map.setView(region.center, region.zoom);
  }, [selectedRegion, map]);
  return null;
}

function popupTitle(item: MapItem): string {
  return item.name;
}

function popupSubtitle(item: MapItem): string {
  switch (item.__kind) {
    case "dataset": return item.type;
    case "venture": return item.product;
    case "org": return item.subType;
  }
}

function isRestricted(item: MapItem): boolean {
  return item.__kind === "dataset" && item.accessible === false;
}

export default function LeafletMap({ selectedRegion, data, onCountryClick }: LeafletMapProps) {
  const region = REGION_COORDS[selectedRegion] ?? REGION_COORDS["All Africa"];

  const markers = useMemo(
    () => data.filter((d): d is PlottedItem => d.lat != null && d.lng != null),
    [data],
  );

  const summaries = useMemo(() => {
    return markers.reduce<Record<string, CountrySummary>>((acc, item) => {
      const key = (item.country || "Unknown").trim();
      if (!acc[key]) acc[key] = { country: key, region: item.region || "", count: 0 };
      acc[key].count += 1;
      return acc;
    }, {});
  }, [markers]);

  const onEachFeature = (feature: Feature<Polygon, { name: string }>, layer: Layer) => {
    const name = feature.properties?.name || "Country";
    layer.bindTooltip(name, { sticky: true, direction: "center", opacity: 0.85 });
    layer.on({
      mouseover: (e: LeafletMouseEvent) => (e.target as Path).setStyle({ weight: 3, color: RED, fillOpacity: 0.08 }),
      mouseout: (e: LeafletMouseEvent) => (e.target as Path).setStyle({ weight: 2, color: GOLD_LIGHT, opacity: 0.85, fillOpacity: 0.02 }),
      click: () => onCountryClick?.(name),
    });
  };

  return (
    <div style={{ borderRadius: 18, overflow: "hidden", background: CARD_BG, boxShadow: "0 18px 28px rgba(0,0,0,0.08)", height: "clamp(420px, 50vh, 560px)", width: "100%" }}>
      <MapContainer center={region.center} zoom={region.zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        {/*
          Esri's World Light Gray Base canvas: free, no API key required, and it
          ships with no place-name labels, so the only text on the map is our own
          English country tooltips/markers below.
        */}
        <TileLayer
          attribution="Tiles &copy; Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        <GeoJSON
          data={COUNTRY_BORDERS}
          style={() => ({ color: GOLD_LIGHT, weight: 2, opacity: 0.9, fillOpacity: 0, dashArray: "6,6" })}
          onEachFeature={onEachFeature}
        />
        {markers.map((item, index) => {
          const summary = summaries[item.country?.trim()] ?? { count: 0, region: item.region || "" };
          const pin = isRestricted(item) ? MAP_PIN_ALT : MAP_PIN;
          return (
            <CircleMarker
              key={`${item.__kind}-${item.id}-${item.country}-${index}`}
              center={[item.lat, item.lng]}
              radius={8}
              pathOptions={{ color: pin, fillColor: pin, fillOpacity: 0.9, weight: 2 }}
              eventHandlers={{ click: () => onCountryClick?.(item.country) }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95} sticky>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.country}</div>
                  <div style={{ fontSize: 12, color: "#0f172a", marginBottom: 4 }}>{summary.region || "Africa"}</div>
                  <div style={{ fontSize: 12, color: "#334155" }}>
                    {summary.count} entr{summary.count !== 1 ? "ies" : "y"}
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{popupTitle(item)}</div>
                  <div style={{ fontSize: 12, marginBottom: 2 }}>{item.country}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{popupSubtitle(item)}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <MapAutoCenter selectedRegion={selectedRegion} />
      </MapContainer>
    </div>
  );
}
