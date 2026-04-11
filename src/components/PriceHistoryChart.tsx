import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { MandiResult } from "../types";
import { fetchPriceHistory, generatePriceHistory } from "../data/api";
import { fmtRupee } from "../utils/profitEngine";

interface Props {
  results:    MandiResult[];
  backendUp:  boolean;
}

interface ChartRow {
  day: string;
  [mandiName: string]: string | number;
}

const COLORS = ["#1e7e34", "#7ab648", "#c8941a", "#4a7c23"] as const;

const PriceHistoryChart: React.FC<Props> = ({ results, backendUp }) => {
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [isLive,    setIsLive]    = useState(false);

  const top4 = results.slice(0, 4);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      if (backendUp) {
        try {
          // Fetch 7-day history for each mandi from the backend
          const histories = await Promise.all(
            top4.map(async (r) => {
              const mandiId = (r as unknown as { _id?: string })._id ?? r.id;
              const cropId  = (r as unknown as { cropId?: string }).cropId ?? "";

              if (!cropId) throw new Error("no cropId");

              const points = await fetchPriceHistory(mandiId, cropId, 7);
              return {
                mandi:   r.name.replace(" APMC", "").replace(" Mandi", ""),
                history: points,
              };
            })
          );

          // Merge all mandis by day index
          const merged: ChartRow[] = histories[0].history.map((point, i) => {
            const row: ChartRow = { day: point.day };
            histories.forEach(h => {
              row[h.mandi] = h.history[i]?.price ?? 0;
            });
            return row;
          });

          setChartData(merged);
          setIsLive(true);
        } catch {
          // Fall back to generated mock history
          buildMockData();
        }
      } else {
        buildMockData();
      }

      setLoading(false);
    };

    const buildMockData = () => {
      const histories = top4.map(r => ({
        mandi:   r.name.replace(" APMC", "").replace(" Mandi", ""),
        history: generatePriceHistory(r.pricePerQuintal),
      }));

      const merged: ChartRow[] = histories[0].history.map((point, i) => {
        const row: ChartRow = { day: point.day };
        histories.forEach(h => { row[h.mandi] = h.history[i].price; });
        return row;
      });

      setChartData(merged);
      setIsLive(false);
    };

    load();
  
  }, [results, backendUp]);

  const mandiNames = top4.map(r =>
    r.name.replace(" APMC", "").replace(" Mandi", "")
  );

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.title}>7-Day Price Trend (₹/Quintal)</div>
        <span style={{ ...s.badge, ...(isLive ? s.badgeLive : s.badgeMock) }}>
          {isLive ? "🟢 Live data" : "🟡 Simulated"}
        </span>
      </div>
      <div style={s.sub}>
        {isLive
          ? "Fetched from backend market price records"
          : "Simulated data — connect backend for Agmarknet live feed"}
      </div>

      {loading ? (
        <div style={s.loading}>Loading price history…</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#6b6b6b" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: "#6b6b6b" }}
              axisLine={false} tickLine={false} width={50}
            />
            <Tooltip formatter={(v: number, name: string) => [fmtRupee(v), name]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {mandiNames.map((name, i) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[i]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap:      { background: "#fff", border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  title:     { fontSize: 14, fontWeight: 500, color: "#1a1a1a" },
  sub:       { fontSize: 11, color: "#9a9a9a", marginBottom: "1rem" },
  loading:   { fontSize: 13, color: "#6b6b6b", padding: "2rem 0", textAlign: "center" },
  badge:     { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "1px solid" },
  badgeLive: { background: "#edf5e1", color: "#2d5016", borderColor: "rgba(74,124,35,0.3)" },
  badgeMock: { background: "#fdf3dc", color: "#6b4c12", borderColor: "rgba(200,148,26,0.3)" },
};

export default PriceHistoryChart;