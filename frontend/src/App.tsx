import React, { useState, useEffect, useCallback } from "react";
import "./styles/global.css";
 
import Header             from "./components/Header";
import InputForm          from "./components/InputForm";
import MandiCard          from "./components/MandiCard";
import { ProfitChart, CostBreakdownChart } from "./components/ProfitChart";
import RouteMap           from "./components/RouteMap";
import ImpactSummary      from "./components/ImpactSummary";
import PerishabilityAlert from "./components/PerishabilityAlert";
import PriceHistoryChart  from "./components/PriceHistoryChart";
 
import {
  fetchCrops,
  fetchVehicles,
  analyzeTrip,
  checkBackendHealth,
  MOCK_CROPS,
  MOCK_VEHICLES,
  MOCK_MANDIS_BY_LOCATION,
} from "./data/api";
 
import {
  analyzeAllMandis,
  toQuintals,
  getPerishabilityRisk,
} from "./utils/profitEngine";
 
import type { Crop, Vehicle, AnalysisInputs, FullAnalysis } from "./types";
 
// ── Helpers ───────────────────────────────────────────────────
 
const SL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={styles.sectionLabel}>{children}</div>
);
 
const StatusBanner: React.FC<{ live: boolean; checked: boolean }> = ({ live, checked }) => {
  if (!checked) return null;
  return (
    <div style={{ ...styles.banner, ...(live ? styles.bannerLive : styles.bannerMock) }}>
      <span>{live ? "🟢" : "🟡"}</span>
      {live
        ? "Connected to live backend — using real market prices"
        : "Backend offline — using mock data. Run  cd krishi-server && npm run dev  to go live."}
    </div>
  );
};
 
// ============================================================
//  App
// ============================================================
 
const App: React.FC = () => {
  // Initialize with MOCK data immediately — form is never blank
  const [crops,    setCrops]    = useState<Crop[]>(MOCK_CROPS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
 
  const [analysis,  setAnalysis]  = useState<FullAnalysis | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [backendUp, setBackendUp] = useState(false);
  const [checked,   setChecked]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
 
  // Try to upgrade to live data in background — doesn't block the UI
  useEffect(() => {
    const tryLive = async () => {
      const isUp = await checkBackendHealth();
      setBackendUp(isUp);
      setChecked(true);
 
      if (isUp) {
        try {
          const [liveCrops, liveVehicles] = await Promise.all([
            fetchCrops(),
            fetchVehicles(),
          ]);
          if (liveCrops.length > 0)    setCrops(liveCrops);
          if (liveVehicles.length > 0) setVehicles(liveVehicles);
        } catch {
          console.warn("Live crop/vehicle fetch failed — using mock data");
        }
      }
    };
    tryLive();
  }, []);
 
  // ── Main analyze handler ───────────────────────────────────
  const handleAnalyze = useCallback(
    async (inputs: AnalysisInputs): Promise<void> => {
      setLoading(true);
      setError(null);
 
      try {
        let result: FullAnalysis;
 
        if (backendUp) {
          // ── LIVE PATH ──────────────────────────────────────
          // Send crop.value and vehicle.value as slugs (e.g. "onion", "truck_lcv")
          // The backend resolves them via findOne({ value: id }) — no ObjectId needed
          const data = await analyzeTrip({
            cropId:           inputs.crop.value,      // e.g. "onion"
            vehicleId:        inputs.vehicle.value,   // e.g. "truck_lcv"
            lat:              inputs.location.lat,
            lng:              inputs.location.lng,
            radiusKm:         100,
            quantityQuintals: toQuintals(inputs.qty, inputs.unit),
            handlingCost:     inputs.handling,
          });
 
          result = {
            ...data,
            nearestResult:    data.nearest,
            perishRisk:       getPerishabilityRisk(inputs.crop, data.winner.km),
            inputs,
            quantityQuintals: toQuintals(inputs.qty, inputs.unit),
            mandisCompared:   data.mandisCompared,
            bestMargin:       data.bestMargin,
          };
        } else {
          // ── OFFLINE PATH ───────────────────────────────────
          await new Promise(r => setTimeout(r, 400));
 
          const mandis           = MOCK_MANDIS_BY_LOCATION[inputs.location.value] ?? [];
          const quantityQuintals = toQuintals(inputs.qty, inputs.unit);
          const res              = analyzeAllMandis({
            mandis,
            crop:        inputs.crop,
            quantityQuintals,
            vehicle:     inputs.vehicle,
            handlingCost: inputs.handling,
          });
 
          result = {
            ...res,
            perishRisk:      getPerishabilityRisk(inputs.crop, res.winner.km),
            inputs,
            quantityQuintals,
          };
        }
 
        setAnalysis(result);
        setTimeout(() => {
          document
            .getElementById("results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
 
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [backendUp]
  );
 
  // ── Render ────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      <Header />
 
      <StatusBanner live={backendUp} checked={checked} />
 
      <InputForm
        onAnalyze={handleAnalyze}
        loading={loading}
        crops={crops}
        vehicles={vehicles}
      />
 
      {error && (
        <div style={styles.errorBox}>⚠️ {error}</div>
      )}
 
      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <span>
            {backendUp ? "Fetching live market prices…" : "Calculating with mock data…"}
          </span>
        </div>
      )}
 
      {analysis && !loading && (
        <div id="results">
          <PerishabilityAlert risk={analysis.perishRisk} />
 
          <SL>Route Map</SL>
          <RouteMap
            origin={analysis.inputs.location}
            results={analysis.results}
            winner={analysis.winner}
          />
 
          <SL>Mandi Comparison</SL>
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
 
          <SL>Profit Breakdown</SL>
          <ProfitChart results={analysis.results} />
          <CostBreakdownChart results={analysis.results} />
 
          <SL>Price Trends</SL>
          <PriceHistoryChart
            results={analysis.results}
            backendUp={backendUp}
          />
 
          <ImpactSummary
            analysis={analysis}
            crop={analysis.inputs.crop}
            vehicle={analysis.inputs.vehicle}
          />
 
          {!backendUp && (
            <div style={styles.devNote}>
              <strong>Running on mock data.</strong> Start the backend with{" "}
              <code>cd krishi-server && npm run dev</code> to use live prices.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
const styles: Record<string, React.CSSProperties> = {
  app:          { maxWidth: 960, margin: "0 auto", padding: "1.5rem 1.25rem 4rem" },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: "#4a7c23", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 },
  mandiGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: "1.5rem" },
  loadingBox:   { display: "flex", alignItems: "center", gap: 12, padding: "1rem 1.5rem", background: "#edf5e1", borderRadius: 12, fontSize: 14, color: "#2d5016", marginBottom: "1.5rem", border: "1px solid rgba(74,124,35,0.2)" },
  spinner:      { width: 18, height: 18, border: "2px solid rgba(45,80,22,0.2)", borderTop: "2px solid #2d5016", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
  errorBox:     { background: "#fff3f2", border: "1px solid #f5c6c3", borderRadius: 12, padding: "1rem 1.25rem", fontSize: 13, color: "#7b1a14", marginBottom: "1.5rem" },
  devNote:      { background: "#f5f0ff", border: "1px solid rgba(120,80,220,0.2)", borderRadius: 12, padding: "1rem 1.25rem", fontSize: 13, color: "#4a3880", lineHeight: 1.6, marginTop: "0.5rem" },
  banner:       { display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "8px 14px", borderRadius: 10, marginBottom: "1.25rem", border: "1px solid" },
  bannerLive:   { background: "#edf5e1", color: "#2d5016", borderColor: "rgba(74,124,35,0.25)" },
  bannerMock:   { background: "#fdf3dc", color: "#6b4c12", borderColor: "rgba(200,148,26,0.3)" },
};
 
export default App;