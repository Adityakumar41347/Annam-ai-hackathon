import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
  TooltipProps,
} from "recharts";
import type { MandiResult } from "../types";
import { fmtRupee } from "../utils/profitEngine";

// ── Types ────────────────────────────────────────────────────

interface ChartRow {
  name:      string;
  netProfit: number;
  km:        number;
  isWinner:  boolean;
}

interface Props {
  results: MandiResult[];
}

// ── Custom Tooltip ────────────────────────────────────────────

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ChartRow;
  return (
    <div style={ttStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].payload.name}</div>
      <div style={{ fontSize: 13, color: "#6b6b6b" }}>{d.km} km away</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: d.isWinner ? "#1e7e34" : "#1a1a1a", marginTop: 4 }}>
        {fmtRupee(d.netProfit)}
      </div>
    </div>
  );
};

const ttStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 13,
  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
};

// ── Profit bar chart ──────────────────────────────────────────

export const ProfitChart: React.FC<Props> = ({ results }) => {
  const maxProfit = Math.max(...results.map((r) => r.netProfit));

  const data: ChartRow[] = results.map((r) => ({
    name:      r.name.replace(" APMC", "").replace(" Mandi", ""),
    netProfit: Math.round(r.netProfit),
    km:        r.km,
    isWinner:  r.netProfit === maxProfit,
  }));

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Net Profit Comparison (₹)</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b6b6b" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#6b6b6b" }}
            axisLine={false} tickLine={false} width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="netProfit" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isWinner ? "#1e7e34" : "#7ab648"} />
            ))}
            <LabelList
              dataKey="netProfit"
              position="top"
              formatter={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
              style={{ fontSize: 11, fontWeight: 600, fill: "#1a1a1a" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Cost breakdown stacked chart ──────────────────────────────

interface BreakdownRow {
  name:       string;
  revenue:    number;
  transport:  number;
  handling:   number;
  commission: number;
}

export const CostBreakdownChart: React.FC<Props> = ({ results }) => {
  const data: BreakdownRow[] = results.map((r) => ({
    name:       r.name.replace(" APMC", "").replace(" Mandi", ""),
    revenue:    Math.round(r.revenue),
    transport:  Math.round(r.transportCost),
    handling:   Math.round(r.handlingCost),
    commission: Math.round(r.commissionCost),
  }));

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Revenue vs Costs Breakdown (₹)</div>
      <div style={styles.legend}>
        <LegendDot color="#7ab648" label="Revenue" />
        <LegendDot color="#c0392b" label="Transport" />
        <LegendDot color="#e07b00" label="Handling + Commission" />
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#6b6b6b" }} axisLine={false} tickLine={false} width={50}
          />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} formatter={(v: number) => [fmtRupee(v), ""]} />
          <Bar dataKey="revenue"    stackId="a" fill="#7ab648" />
          <Bar dataKey="transport"  stackId="b" fill="#c0392b" />
          <Bar dataKey="handling"   stackId="b" fill="#e07b00" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Legend helper ─────────────────────────────────────────────

interface LegendDotProps {
  color: string;
  label: string;
}

const LegendDot: React.FC<LegendDotProps> = ({ color, label }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b6b6b" }}>
    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
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
  title: { fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginBottom: "1rem" },
  legend: { display: "flex", gap: 16, marginBottom: "0.75rem" },
};

export default ProfitChart;
