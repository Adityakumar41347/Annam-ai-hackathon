import React from "react";
import type { MandiResult } from "../types";
import { fmtRupee, fmtPct } from "../utils/profitEngine";

interface Props {
  result:   MandiResult;
  isWinner: boolean;
  rank:     number;
}

const TREND_STYLE: Record<string, React.CSSProperties> = {
  rising:  { color: "#1e7e34", borderColor: "#1e7e3444", background: "#1e7e3411" },
  falling: { color: "#c0392b", borderColor: "#c0392b44", background: "#c0392b11" },
  stable:  { color: "#6b6b6b", borderColor: "#6b6b6b44", background: "#6b6b6b11" },
};

const TREND_LABEL: Record<string, string> = {
  rising:  "↑ Rising",
  falling: "↓ Falling",
  stable:  "→ Stable",
};

const MandiCard: React.FC<Props> = ({ result, isWinner }) => {
  const {
    name, km, pricePerQuintal,
    revenue, transportCost, handlingCost,
    commissionCost, netProfit, profitMargin,
    trend, peakDay,
  } = result;

  const trendStyle = TREND_STYLE[trend] ?? TREND_STYLE["stable"];
  const trendLabel = TREND_LABEL[trend]  ?? "→ Stable";

  return (
    <div style={{ ...styles.card, ...(isWinner ? styles.winnerCard : {}) }}>
      {isWinner && <div style={styles.winnerBadge}>⭐ Best Profit</div>}

      <div style={styles.cardHeader}>
        <div>
          <div style={styles.mandiName}>{name}</div>
          <div style={styles.mandiMeta}>{km} km away · Peak: {peakDay}</div>
        </div>
        <div style={{ ...styles.trendBadge, ...trendStyle }}>{trendLabel}</div>
      </div>

      <div style={styles.priceRow}>
        <span style={styles.priceLabel}>₹ / Quintal</span>
        <span style={styles.priceValue}>{fmtRupee(pricePerQuintal)}</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.rows}>
        <Row label="Revenue"          value={fmtRupee(revenue)}         color="#1e7e34" />
        <Row label="Transport"        value={`-${fmtRupee(transportCost)}`}  color="#c0392b" />
        <Row label="Handling"         value={`-${fmtRupee(handlingCost)}`}   color="#c0392b" />
        <Row label="Commission (2%)"  value={`-${fmtRupee(commissionCost)}`} color="#c0392b" />
        <Row label="Margin"           value={fmtPct(profitMargin)} />
      </div>

      <div style={styles.profitRow}>
        <span style={styles.profitLabel}>Net Profit</span>
        <span style={{ ...styles.profitValue, color: isWinner ? "#1e7e34" : "#1a1a1a" }}>
          {fmtRupee(netProfit)}
        </span>
      </div>
    </div>
  );
};

// ── Sub-component ────────────────────────────────────────────

interface RowProps {
  label: string;
  value: string;
  color?: string;
}

const Row: React.FC<RowProps> = ({ label, value, color }) => (
  <div style={styles.row}>
    <span style={styles.rowKey}>{label}</span>
    <span style={{ ...styles.rowVal, ...(color ? { color } : {}) }}>{value}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#ffffff",
    border: "1.5px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: "1.2rem",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  winnerCard: {
    borderColor: "#1e7e34",
    background: "#f0fbf3",
    boxShadow: "0 4px 16px rgba(30,126,52,0.12)",
  },
  winnerBadge: {
    position: "absolute",
    top: -12,
    left: 16,
    background: "#1e7e34",
    color: "#fff",
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 12px",
    borderRadius: 20,
    letterSpacing: "0.05em",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  mandiName: { fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 },
  mandiMeta: { fontSize: 12, color: "#6b6b6b" },
  trendBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 20,
    border: "1px solid",
    whiteSpace: "nowrap",
    flexShrink: 0,
    marginLeft: 8,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    background: "#faf8f3",
    borderRadius: 8,
    padding: "8px 10px",
  },
  priceLabel: { fontSize: 12, color: "#6b6b6b" },
  priceValue: { fontSize: 18, fontWeight: 600, color: "#2d5016" },
  divider:    { height: 1, background: "rgba(0,0,0,0.08)", margin: "10px 0" },
  rows:       { display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 },
  row:        { display: "flex", justifyContent: "space-between", fontSize: 13 },
  rowKey:     { color: "#6b6b6b" },
  rowVal:     { fontWeight: 500 },
  profitRow:  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(0,0,0,0.10)",
    paddingTop: 10,
    marginTop: 4,
  },
  profitLabel: { fontSize: 13, color: "#6b6b6b" },
  profitValue: { fontSize: 22, fontWeight: 600 },
};

export default MandiCard;
