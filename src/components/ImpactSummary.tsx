import React from "react";
import type { FullAnalysis, Crop, Vehicle, Tip } from "../types";
import { fmtRupee, fmtPct, getRideshareSavings } from "../utils/profitEngine";

interface Props {
  analysis: FullAnalysis;
  crop:     Crop;
  vehicle:  Vehicle;
}

const ImpactSummary: React.FC<Props> = ({ analysis, crop, vehicle }) => {
  const { results, winner, extraVsNearest, mandisCompared, bestMargin } = analysis;
  const rideshareSaving = getRideshareSavings(winner.transportCost);
  const tips = buildTips({ winner, results, crop, vehicle, rideshareSaving, extraVsNearest });

  return (
    <>
      <div style={styles.sectionLabel}>Impact Summary</div>
      <div style={styles.impactGrid}>
        <MetricCard value={String(mandisCompared)} label="Mandis Compared"      icon="📊" />
        <MetricCard value={fmtPct(bestMargin)}     label="Best Profit Margin"   icon="📈" />
        <MetricCard value={fmtRupee(extraVsNearest)} label="Extra vs Nearest Mandi" icon="💰" />
      </div>

      <div style={styles.sectionLabel}>Smart Insights</div>
      <div style={styles.tipsPanel}>
        {tips.map((tip, i) => (
          <div key={i} style={styles.tip}>
            <span style={styles.tipIcon}>{tip.icon}</span>
            <div>
              <div style={styles.tipTitle}>{tip.title}</div>
              <div style={styles.tipBody}>{tip.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ── Metric Card ──────────────────────────────────────────────

interface MetricCardProps {
  value: string;
  label: string;
  icon:  string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, icon }) => (
  <div style={styles.metricCard}>
    <div style={styles.metricIcon}>{icon}</div>
    <div style={styles.metricVal}>{value}</div>
    <div style={styles.metricLabel}>{label}</div>
  </div>
);

// ── Tips builder ─────────────────────────────────────────────

interface TipBuilderParams {
  winner:          FullAnalysis["winner"];
  results:         FullAnalysis["results"];
  crop:            Crop;
  vehicle:         Vehicle;
  rideshareSaving: number;
  extraVsNearest:  number;
}

function buildTips(p: TipBuilderParams): Tip[] {
  const { winner, results, crop, vehicle, rideshareSaving, extraVsNearest } = p;
  const tips: Tip[] = [];

  tips.push({
    icon: "🏆",
    title: `${winner.name} is your best bet`,
    body: `Traveling ${winner.km} km earns you ${fmtRupee(extraVsNearest)} more than the nearest mandi. Transport is only ${fmtRupee(winner.transportCost)}.`,
  });

  tips.push({
    icon: "🚛",
    title: "Pool with a neighbour — save 45%",
    body: `Share the ${vehicle.label} with one farmer going the same route. Each saves ~${fmtRupee(rideshareSaving)} on this trip.`,
  });

  tips.push({
    icon: "📅",
    title: `Sell on ${winner.peakDay} for best price`,
    body: `${winner.name} historically peaks on ${winner.peakDay}s. Arriving after 8 AM gives you first access to wholesale buyers.`,
  });

  if (crop.perishable && winner.km > 60) {
    tips.push({
      icon: "🌡️",
      title: "Travel early to avoid spoilage",
      body: `${crop.label.split("(")[0].trim()} is perishable. For ${winner.km} km, leave before 5 AM and keep the load well covered.`,
    });
  }

  tips.push({
    icon: "⚖️",
    title: "Increase load for better margins",
    body: `The ${vehicle.label} (${vehicle.capacity}) spreads the ₹${winner.km * vehicle.ratePerKm} transport cost across more quintals — fill it up.`,
  });

  const fallingMandis = results.filter((r) => r.trend === "falling");
  if (fallingMandis.length > 0) {
    tips.push({
      icon: "⚠️",
      title: "Price falling at some mandis",
      body: `${fallingMandis.map((r) => r.name).join(", ")} ${fallingMandis.length > 1 ? "show" : "shows"} a 3-day falling trend. Avoid unless net profit is clearly better.`,
    });
  }

  return tips;
}

const styles: Record<string, React.CSSProperties> = {
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4a7c23",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  impactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: "1.5rem",
  },
  metricCard: {
    background: "#edf5e1",
    borderRadius: 14,
    padding: "1.1rem 1.2rem",
    border: "1px solid rgba(74,124,35,0.18)",
  },
  metricIcon:  { fontSize: 22, marginBottom: 6 },
  metricVal:   { fontSize: 24, fontWeight: 600, lineHeight: 1, marginBottom: 4, color: "#2d5016" },
  metricLabel: { fontSize: 12, color: "#4a7c23" },
  tipsPanel: {
    background: "#fdf3dc",
    border: "1px solid rgba(200,148,26,0.28)",
    borderRadius: 16,
    padding: "1.25rem 1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginBottom: "1.5rem",
  },
  tip:      { display: "flex", gap: 12, alignItems: "flex-start" },
  tipIcon:  { fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 },
  tipTitle: { fontSize: 13, fontWeight: 600, color: "#6b4c12", marginBottom: 2 },
  tipBody:  { fontSize: 13, color: "#8b6010", lineHeight: 1.5 },
};

export default ImpactSummary;
