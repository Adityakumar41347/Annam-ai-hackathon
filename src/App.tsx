import React, { useState, useCallback } from "react";
import "./styles/global.css";

import Header              from "./components/Header";
import InputForm           from "./components/InputForm";
import MandiCard           from "./components/MandiCard";
import { ProfitChart, CostBreakdownChart } from "./components/ProfitChart";
import RouteMap            from "./components/RouteMap";
import ImpactSummary       from "./components/ImpactSummary";
import PerishabilityAlert  from "./components/PerishabilityAlert";
import PriceHistoryChart   from "./components/PriceHistoryChart";

import { MANDIS_BY_LOCATION } from "./data/mockData";
import {
  analyzeAllMandis,
  toQuintals,
  getPerishabilityRisk,
} from "./utils/profitEngine";

import type { AnalysisInputs, FullAnalysis } from "./types";

// ── Spinner keyframe (injected once) ────────────────────────
const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);

// ── Root Component ────────────────────────────────────────────

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleAnalyze = useCallback((inputs: AnalysisInputs): void => {
    setLoading(true);

    // Simulate async API latency (swap with real Agmarknet fetch)
    setTimeout(() => {
      const mandis           = MANDIS_BY_LOCATION[inputs.location.value] ?? [];
      const quantityQuintals = toQuintals(inputs.qty, inputs.unit);

      const result = analyzeAllMandis({
        mandis,
        crop:     inputs.crop,
        quantityQuintals,
        vehicle:  inputs.vehicle,
        handlingCost: inputs.handling,
      });

      const perishRisk = getPerishabilityRisk(inputs.crop, result.winner.km);

      const full: FullAnalysis = {
        ...result,
        perishRisk,
        inputs,
        quantityQuintals,
      };

      setAnalysis(full);
      setLoading(false);

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }, 600);
  }, []);

  return (
    <div style={styles.app}>
      <Header />

      <InputForm onAnalyze={handleAnalyze} loading={loading} />

      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <span>Fetching market prices and calculating optimal route…</span>
        </div>
      )}

      {analysis && !loading && (
        <div id="results-section">
          {/* Perishability warning */}
          <PerishabilityAlert risk={analysis.perishRisk} />

          {/* Route map */}
          <SectionLabel>Route Map</SectionLabel>
          <RouteMap
            origin={analysis.inputs.location}
            results={analysis.results}
            winner={analysis.winner}
          />

          {/* Mandi cards */}
          <SectionLabel>Mandi Comparison</SectionLabel>
          <div style={styles.mandiGrid}>
            {analysis.results.map((r, i) => (
              <MandiCard
                key={r.id}
                result={r}
                isWinner={r.id === analysis.winner.id}
                rank={i + 1}
              />
            ))}
          </div>

          {/* Charts */}
          <SectionLabel>Profit Breakdown</SectionLabel>
          <ProfitChart results={analysis.results} />
          <CostBreakdownChart results={analysis.results} />

          {/* Price trends */}
          <SectionLabel>Price Trends</SectionLabel>
          <PriceHistoryChart results={analysis.results} />

          {/* Impact + tips */}
          <ImpactSummary
            analysis={analysis}
            crop={analysis.inputs.crop}
            vehicle={analysis.inputs.vehicle}
          />

          {/* Dev integration note */}
          <div style={styles.devNote}>
            <strong>Dev Note:</strong> Prices are simulated. To go live: (1) replace{" "}
            <code>simulateMarketPrice()</code> in <code>profitEngine.ts</code> with Agmarknet API,
            (2) use Google Maps Distance Matrix for real road km, (3) add Express + MongoDB backend
            for historical data. See <code>README.md</code> for integration snippets.
          </div>
        </div>
      )}
    </div>
  );
};

// ── Section Label helper ─────────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={styles.sectionLabel}>{children}</div>
);

// ── Styles ────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  app: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "1.5rem 1.25rem 4rem",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4a7c23",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  mandiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: "1.5rem",
  },
  loadingBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "1rem 1.5rem",
    background: "#edf5e1",
    borderRadius: 12,
    fontSize: 14,
    color: "#2d5016",
    marginBottom: "1.5rem",
    border: "1px solid rgba(74,124,35,0.2)",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(45,80,22,0.2)",
    borderTop: "2px solid #2d5016",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  devNote: {
    background: "#f5f0ff",
    border: "1px solid rgba(120,80,220,0.2)",
    borderRadius: 12,
    padding: "1rem 1.25rem",
    fontSize: 13,
    color: "#4a3880",
    lineHeight: 1.6,
    marginTop: "0.5rem",
  },
};

export default App;
