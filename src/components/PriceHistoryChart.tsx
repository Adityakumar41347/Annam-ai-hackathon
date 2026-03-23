import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { MandiResult } from "../types";
import type { MandiHistory } from "../types";
import { generatePriceHistory } from "../data/mockData";
import { fmtRupee } from "../utils/profitEngine";

interface Props {
  results: MandiResult[];
}

const CHART_COLORS = ["#1e7e34", "#7ab648", "#c8941a", "#4a7c23"] as const;

const PriceHistoryChart: React.FC<Props> = ({ results }) => {
  const histories: MandiHistory[] = results.slice(0, 4).map((r, i) => ({
    mandi:   r.name.replace(" APMC", "").replace(" Mandi", ""),
    history: generatePriceHistory(r.pricePerQuintal),
    color:   CHART_COLORS[i],
  }));

  // Merge by day
  const days = histories[0].history.map((h) => h.day);
  const chartData = days.map((day, i) => {
    const row: Record<string, string | number> = { day };
    histories.forEach((h) => {
      row[h.mandi] = h.history[i].price;
    });
    return row;
  });

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>7-Day Price Trend (₹/Quintal)</div>
      <div style={styles.subtitle}>Simulated historical data — replace with Agmarknet live feed</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
            tick={{ fontSize: 11, fill: "#6b6b6b" }}
            axisLine={false} tickLine={false} width={50}
          />
          <Tooltip
            formatter={(v: number, name: string) => [fmtRupee(v), name]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {histories.map((h) => (
            <Line
              key={h.mandi}
              type="monotone"
              dataKey={h.mandi}
              stroke={h.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  title:    { fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginBottom: 2 },
  subtitle: { fontSize: 11, color: "#9a9a9a", marginBottom: "1rem" },
};

export default PriceHistoryChart;
