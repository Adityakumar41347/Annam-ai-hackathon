import React from "react";
import type { PerishabilityRisk, RiskLevel } from "../types";

interface Props {
  risk: PerishabilityRisk | null;
}

interface LevelStyle {
  background: string;
  border:     string;
  textColor:  string;
  icon:       string;
  heading:    string;
}

const LEVEL_STYLES: Record<RiskLevel, LevelStyle> = {
  high: {
    background: "#fff3f2",
    border:     "1px solid #f5c6c3",
    textColor:  "#7b1a14",
    icon:       "🔴",
    heading:    "Perishability Warning",
  },
  medium: {
    background: "#fff8ec",
    border:     "1px solid #ffd8a0",
    textColor:  "#7a4200",
    icon:       "🟡",
    heading:    "Perishability Notice",
  },
  low: {
    background: "#fdf3dc",
    border:     "1px solid #f5d99a",
    textColor:  "#6b4c12",
    icon:       "🟠",
    heading:    "Perishability Info",
  },
};

const PerishabilityAlert: React.FC<Props> = ({ risk }) => {
  if (!risk) return null;

  const s = LEVEL_STYLES[risk.level];

  return (
    <div style={{ ...styles.wrap, background: s.background, border: s.border }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: s.textColor, marginBottom: 2 }}>
          {s.heading}
        </div>
        <div style={{ fontSize: 13, color: s.textColor }}>{risk.message}</div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: "1.5rem",
  },
};

export default PerishabilityAlert;
