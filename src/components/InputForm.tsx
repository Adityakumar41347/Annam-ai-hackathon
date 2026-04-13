import React, { useState } from "react";
import { LOCATIONS } from "../data/api";
import type { AnalysisInputs, Crop, Vehicle, QuantityUnit } from "../types";

interface FormState {
  crop:     string;
  qty:      number;
  unit:     QuantityUnit;
  vehicle:  string;
  location: string;
  handling: number;
}

interface Props {
  onAnalyze: (inputs: AnalysisInputs) => void;
  loading:   boolean;
  crops:     Crop[];
  vehicles:  Vehicle[];
}

const InputForm: React.FC<Props> = ({ onAnalyze, loading, crops, vehicles }) => {
  const [form, setForm] = useState<FormState>({
    crop:     "",
    qty:      0,
    unit:     "",
    vehicle:  "",
    location: "",
    handling: 0,
  });



  const setStr =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLSelectElement>): void =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const setNum =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>): void =>
      setForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }));

  const submit = (): void => {
    const crop     = crops.find(c => c.value === form.crop);
    const vehicle  = vehicles.find(v => v.value === form.vehicle);
    const location = LOCATIONS.find(l => l.value === form.location);
    if (!crop || !vehicle || !location) {
      console.log("missing data");
      return ;
    };
    onAnalyze({ crop, vehicle, location, qty: form.qty, unit: form.unit, handling: form.handling });
  };

  return (
    <div style={s.panel}>
      <p style={s.sectionLabel}>Trip Details</p>

      <div style={s.grid}>

        {/* ── Crop ── */}
        <div style={s.field}>
          <label style={s.label}>Crop Type</label>
          <select
            value={form.crop}
            onChange={setStr("crop")}
            style={s.select}
          >
            {crops.length === 0 && (
              <option disabled>Loading crops…</option>
            )}
             <option value="" disabled hidden>Select Crop 🌾</option>
            {crops.map(c => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Quantity ── */}
        <div style={s.field}>
          <label style={s.label}>Quantity</label>
          <input
            type="number"
            value={form.qty}
            onChange={setNum("qty")}
            min={0.5} max={500} step={0.5}
            style={s.input}
          />
        </div>

        {/* ── Unit ── */}
        <div style={s.field}>
          <label style={s.label}>Unit</label>
          <select
            value={form.unit}
            onChange={setStr("unit")}
            style={s.select}
          >
            <option value="" disabled hidden >Select Unit (Kg, Quintal, etc.)</option>
            <option value="quintal">Quintal (100 kg)</option>
            <option value="ton">Metric Ton</option>
            <option value="kg">Kilogram</option>
          </select>
        </div>

        {/* ── Vehicle ── */}
        <div style={s.field}>
          <label style={s.label}>Vehicle</label>
          <select
            value={form.vehicle}
            onChange={(e) => {//It will auto fetch the loading and handling cost auto
                const raw = e.target.value;
                const selectedVehicle = vehicles.find(v => v.value === raw);
                setForm(prev => ({
                     ...prev,
                     vehicle: raw,
                     handling: selectedVehicle ? selectedVehicle.loadingCost : prev.handling,
                }));
            }}
            style={s.select}
          >
            {vehicles.length === 0 && (
              <option disabled>Loading vehicles…</option>
            )}
             <option value="" disabled hidden>Select The Vehicle 🛻</option>
            {vehicles.map(v => (
              <option key={v.value} value={v.value}>
                {v.label} ({v.capacity}) ₹{v.ratePerKm}/km
              </option>
            ))}
          </select>
        </div>


         {/* ── Handling cost ── */}
        <div style={s.field}>
          <label style={s.label}>Loading / Unloading (₹)</label>
          <input
            type="number"
            value={form.handling}
            onChange={setNum("handling")}
            min={0} step={50}
            style={s.input}
          />
        </div>

        {/* ── Location ── */}
        <div style={s.field}>
          <label style={s.label}>Your Location</label>
          <select
            value={form.location}
            onChange={setStr("location")}
            style={s.select}
          >
            <option value="" disabled hidden>Select The Location 📍</option>

            {LOCATIONS.map(l => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

       

      </div>

      <button
        onClick={submit}
        disabled={loading || crops.length === 0}
        style={{
          ...s.btn,
          ...(loading || crops.length === 0 ? s.btnDisabled : {}),
        }}
      >
        {loading ? "Calculating…" : "Find Best Mandi →"}
      </button>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────
// NOTE: selects use the browser's native appearance intentionally.
// Do NOT set appearance:none here — it breaks the dropdown on Windows Chrome.

const s: Record<string, React.CSSProperties> = {
  panel: {
    background:   "#ffffff",
    border:       "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding:      "1.5rem",
    marginBottom: "1.5rem",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.06)",
  },
  sectionLabel: {
    fontSize:      11,
    fontWeight:    700,
    color:         "#4a7c23",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom:  14,
    margin:        "0 0 14px 0",
  },
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap:                 14,
  },
  field: {
    display:       "flex",
    flexDirection: "column",
    gap:           5,
  },
  label: {
    fontSize:   12,
    fontWeight: 600,
    color:      "#555555",
  },
  // Native select — no appearance override, works on all browsers + OS
  select: {
    width:        "100%",
    padding:      "9px 10px",
    fontSize:     13,
    fontFamily:   "inherit",
    color:        "#1a1a1a",
    background:   "#ffffff",
    border:       "1.5px solid #cccccc",
    borderRadius: 8,
    cursor:       "pointer",
    outline:      "none",
  },
  input: {
    width:        "100%",
    padding:      "9px 10px",
    fontSize:     13,
    fontFamily:   "inherit",
    color:        "#1a1a1a",
    background:   "#ffffff",
    border:       "1.5px solid #cccccc",
    borderRadius: 8,
    outline:      "none",
    boxSizing:    "border-box",
  },
  btn: {
    marginTop:     "1.25rem",
    width:         "100%",
    padding:       "13px",
    background:    "#2d5016",
    color:         "#ffffff",
    border:        "none",
    borderRadius:  10,
    fontSize:      15,
    fontWeight:    600,
    fontFamily:    "inherit",
    cursor:        "pointer",
    letterSpacing: "0.02em",
  },
  btnDisabled: {
    background: "#a0a0a0",
    cursor:     "not-allowed",
  },
};

export default InputForm;