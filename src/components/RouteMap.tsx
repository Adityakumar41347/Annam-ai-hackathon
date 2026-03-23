import React, { useEffect, useRef } from "react";
import type { FarmerLocation, MandiResult } from "../types";

// Extend the Window type to include Leaflet
declare global {
  interface Window {
    L: typeof import("leaflet");
  }
}

interface Props {
  origin:  FarmerLocation;
  results: MandiResult[];
  winner:  MandiResult;
}

const RouteMap: React.FC<Props> = ({ origin, results, winner }) => {
  const mapRef      = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReturnType<typeof window.L.map> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (instanceRef.current) {
      instanceRef.current.remove();
      instanceRef.current = null;
    }

    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current).setView([origin.lat, origin.lng], 9);
    instanceRef.current = map;

    // Free OpenStreetMap tiles — no API key needed
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Farmer origin marker
    const originIcon = L.divIcon({
      html: `<div style="width:16px;height:16px;background:#2d5016;border:3px solid #7ab648;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: "",
    });

    L.marker([origin.lat, origin.lng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`<b>Your Location</b><br/>${origin.label}`);

    // Mandi markers + polylines
    results.forEach((mandi) => {
      const isWin = mandi.id === winner.id;
      const color = isWin ? "#1e7e34" : "#7ab648";
      const size  = isWin ? 20 : 14;

      const mandiIcon = L.divIcon({
        html: `<div style="
          width:${size}px;height:${size}px;
          background:${color};
          border:3px solid ${isWin ? "#fff" : "#2d5016"};
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          ${isWin ? "outline:2px solid #1e7e34;outline-offset:2px;" : ""}
        "></div>`,
        iconSize:   [size, size],
        iconAnchor: [size / 2, size / 2],
        className: "",
      });

      const profitLabel = "₹" + Math.round(mandi.netProfit).toLocaleString("en-IN");

      L.marker([mandi.lat, mandi.lng], { icon: mandiIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <b style="font-size:14px">${mandi.name}</b>${isWin ? " ⭐" : ""}<br/>
            <span style="color:#6b6b6b;font-size:12px">${mandi.km} km away</span><br/>
            <div style="margin-top:6px;font-size:13px">
              <div>Price: ₹${mandi.pricePerQuintal}/quintal</div>
              <div style="font-weight:600;color:${isWin ? "#1e7e34" : "#1a1a1a"};margin-top:2px">
                Net Profit: ${profitLabel}
              </div>
            </div>
          </div>
        `);

      L.polyline(
        [[origin.lat, origin.lng], [mandi.lat, mandi.lng]],
        {
          color,
          weight:    isWin ? 2.5 : 1.5,
          dashArray: isWin ? "8 4" : "4 6",
          opacity:   isWin ? 0.9 : 0.5,
        }
      ).addTo(map);
    });

    // Fit all markers
    const allPoints: [number, number][] = [
      [origin.lat, origin.lng],
      ...results.map((r): [number, number] => [r.lat, r.lng]),
    ];
    map.fitBounds(allPoints, { padding: [30, 30] });

    return () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, [origin, results, winner]);

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Route Map</div>
      <div style={styles.legend}>
        <LegendItem dotStyle={{ background: "#2d5016", border: "2px solid #7ab648" }} label="Your location" />
        <LegendItem dotStyle={{ background: "#1e7e34", border: "2px solid #fff", outline: "2px solid #1e7e34" }} label="Best mandi" />
        <LegendItem dotStyle={{ background: "#7ab648", border: "2px solid #2d5016" }} label="Other mandis" />
      </div>
      <div ref={mapRef} style={styles.map} />
    </div>
  );
};

interface LegendItemProps {
  dotStyle: React.CSSProperties;
  label:    string;
}

const LegendItem: React.FC<LegendItemProps> = ({ dotStyle, label }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b6b6b" }}>
    <span style={{ width: 12, height: 12, borderRadius: "50%", display: "inline-block", flexShrink: 0, ...dotStyle }} />
    {label}
  </span>
);

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  title:  { fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginBottom: 10 },
  legend: { display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" },
  map:    { height: 360, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" },
};

export default RouteMap;
