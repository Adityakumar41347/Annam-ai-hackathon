import React, { useState } from "react";
import { CROPS, VEHICLES, LOCATIONS } from "../data/mockData";
import type { AnalysisInputs, QuantityUnit } from "../types";

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
}

const InputForm: React.FC<Props> = ({ onAnalyze, loading }) => {
  const [form, setForm] = useState<FormState>({
    crop:     "",
    qty:      0,
    unit:     "",
    vehicle:  "",
    location: "",
    handling: 0,
  });

  const setField =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const raw = e.target.value;
      if (key === "vehicle") {
  const selectedVehicle = VEHICLES.find((v) => v.value === raw);
  setForm((prev) => ({
    ...prev,
    vehicle: raw,
    handling: selectedVehicle ? selectedVehicle.loadingCost : prev.handling,
  }));
  return;
}
      setForm((prev) => ({
        ...prev,
        [key]: key === "qty" || key === "handling" ? parseFloat(raw) || 0 : raw,
      }));
    };

  const handleSubmit = (): void => {
    const crop     = CROPS.find((c) => c.value === form.crop);
    const vehicle  = VEHICLES.find((v) => v.value === form.vehicle);
    const location = LOCATIONS.find((l) => l.value === form.location);

    if (!crop || !vehicle || !location) return;

    onAnalyze({ crop, vehicle, location, qty: form.qty, unit: form.unit, handling: form.handling });
  };

  return (

    
    <div style={styles.panel}>
      <div style={styles.sectionLabel}>Trip Details</div>

      <div style={styles.grid}>

        <Field label="Crop Type">
          <select value={form.crop} onChange={setField("crop")} style={styles.control} >
            
            <option value="" disabled hidden>Select The Crop 🌾</option>

            {CROPS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </option>
            ))}
            
          </select>
        </Field>

        <Field label="Quantity">
          <input
            type="number"
            value={form.qty}
            onChange={setField("qty")}
            min={0.5} max={500} step={0.5}
            style={styles.control}
          />
        </Field>

        <Field label="Unit">
          <select value={form.unit} onChange={setField("unit")} style={styles.control}>
            <option value="" disabled hidden >Select Unit (Kg, Quintal, etc.)</option>
            {/* <option value="kg">Kilogram</option> */}
            <option value="quintal">Quintal (100 kg)</option>
            <option value="ton">Metric Ton</option>
            
          </select>
        </Field>

        <Field label="Vehicle">
          <select value={form.vehicle} onChange={setField("vehicle")} style={styles.control}>

            <option value="" disabled hidden>Select The Vehicle 🛻</option>

            {VEHICLES.map((v) => (
            
              <option key={v.value} value={v.value}>
                {v.label} — {v.capacity} @ ₹{v.ratePerKm}/km
              </option>
            ))}
          </select>
        </Field>

        <Field label="Your Location">
          <select value={form.location} onChange={setField("location")} style={styles.control}>
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Loading / Unloading (₹)">
          <input
            type="number"
            value={form.handling}
            onChange={setField("handling")}
            readOnly

            style={styles.control}
          />
        </Field>
      </div>

      <button
        style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Calculating…" : "Find Best Mandi →"}
      </button>
    </div>
  );
};

// ── Sub-component ────────────────────────────────────────────

interface FieldProps {
  label:    string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={fieldLabel}>{label}</label>
    {children}
  </div>
);

const fieldLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#6b6b6b",
  fontWeight: 500,
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4a7c23",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 14,
  },
  control: {
    padding: "9px 11px",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 8,
    fontSize: 14,
    background: "#faf8f3",
    color: "#1a1a1a",
    outline: "none",
    width: "100%",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
  },
  btn: {
    marginTop: "1.25rem",
    width: "100%",
    padding: "13px",
    background: "#2d5016",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "background 0.15s",
  },
  btnDisabled: {
    background: "#aaa",
    cursor: "not-allowed",
  },
  
};

export default InputForm;
