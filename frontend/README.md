# 🌾 Krishi-Route — Profit & Logistics Optimizer (TypeScript)

> "Google Maps for Farmers" — shows most profitable mandi routes, not just fastest.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
# → Opens at http://localhost:3000

# 3. Type-check only (no build)
npm run type-check

# 4. Production build
npm run build
```

---

## 📁 Project Structure

```
krishi-route/
├── public/
│   └── index.html                  # HTML shell (loads Leaflet CSS)
├── src/
│   ├── types/
│   │   └── index.ts                # ✅ All shared TypeScript interfaces
│   ├── data/
│   │   └── mockData.ts             # Crops, vehicles, mandis, price history
│   ├── utils/
│   │   └── profitEngine.ts         # Core algorithm + formatters
│   ├── components/
│   │   ├── Header.tsx              # Top navigation bar
│   │   ├── InputForm.tsx           # Trip detail inputs (crop/vehicle/location)
│   │   ├── MandiCard.tsx           # Per-mandi profit card
│   │   ├── ProfitChart.tsx         # Bar chart + cost breakdown (Recharts)
│   │   ├── PriceHistoryChart.tsx   # 7-day price trend (Recharts)
│   │   ├── RouteMap.tsx            # Leaflet map with mandi markers
│   │   ├── ImpactSummary.tsx       # 3 metric cards + smart tips
│   │   └── PerishabilityAlert.tsx  # Risk warning for perishable crops
│   ├── styles/
│   │   └── global.css              # CSS variables + base styles
│   ├── App.tsx                     # Root component
│   ├── index.tsx                   # React entry point
│   └── react-app-env.d.ts          # CRA type reference
├── tsconfig.json                   # Strict TypeScript config
└── package.json
```

---

## 🧮 Profit Algorithm

```
Revenue        = Market Price (₹/quintal) × Quantity (quintals)
Transport Cost = Distance (km) × Vehicle Rate (₹/km)
Commission     = Revenue × 2%    ← APMC standard; adjust per state
Total Cost     = Transport + Handling + Commission
Net Profit     = Revenue − Total Cost
Margin         = Net Profit / Revenue × 100
```

---

## 🔌 Replacing Mock Data with Live APIs

### 1. Agmarknet — Live Market Prices

Edit `src/utils/profitEngine.ts`:

```typescript
// BEFORE (mock)
export function simulateMarketPrice(
  basePrice: number,
  priceBoost: number,
  variance: number
): number {
  return Math.round(basePrice + priceBoost + (Math.random() - 0.5) * variance * 0.15);
}

// AFTER (live)
export async function fetchAgmarknetPrice(
  commodity: string,
  market: string,
  state: string
): Promise<number> {
  const res = await fetch(
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
    `?api-key=${process.env.REACT_APP_AGMARKNET_KEY}` +
    `&filters[commodity]=${encodeURIComponent(commodity)}` +
    `&filters[market]=${encodeURIComponent(market)}` +
    `&filters[state]=${encodeURIComponent(state)}&limit=1`
  );
  const data = await res.json();
  return parseFloat(data.records?.[0]?.modal_price ?? "0");
}
```

Add to `.env`:
```
REACT_APP_AGMARKNET_KEY=your_key_here
```

### 2. Google Maps — Real Road Distances

In `src/data/mockData.ts`, remove the `km` field and compute dynamically:

```typescript
export async function getRoadDistanceKm(
  originLat: number, originLng: number,
  destLat: number,   destLng: number
): Promise<number> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${originLat},${originLng}` +
    `&destinations=${destLat},${destLng}` +
    `&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
  );
  const data = await res.json();
  const metres = data.rows[0]?.elements[0]?.distance?.value ?? 0;
  return metres / 1000;
}
```

### 3. MongoDB — Historical Price Storage

Add a backend (`/server` folder):

```typescript
// server/models/Price.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPrice extends Document {
  mandi:      string;
  commodity:  string;
  date:       Date;
  modalPrice: number;
  minPrice:   number;
  maxPrice:   number;
}

const PriceSchema = new Schema<IPrice>({
  mandi:      { type: String, required: true, index: true },
  commodity:  { type: String, required: true },
  date:       { type: Date,   required: true },
  modalPrice: Number,
  minPrice:   Number,
  maxPrice:   Number,
});

export default mongoose.model<IPrice>("Price", PriceSchema);
```

---

## 🗺️ Key TypeScript Types (`src/types/index.ts`)

| Type | Description |
|------|-------------|
| `Crop` | Crop with basePrice, variance, perishable flag |
| `Vehicle` | Transport with ratePerKm |
| `FarmerLocation` | Origin with lat/lng |
| `Mandi` | Market with km, priceBoost, trend |
| `MandiResult` | Mandi + full profit breakdown |
| `AnalysisResult` | All results + winner + extras |
| `FullAnalysis` | AnalysisResult + inputs + perishRisk |
| `PerishabilityRisk` | Level (high/medium/low) + message |
| `QuantityUnit` | `"quintal" \| "ton" \| "kg"` |

---

## ⚡ Level-Up Features

| Feature | File to edit |
|---------|-------------|
| GPS auto-detect | `InputForm.tsx` → `navigator.geolocation.getCurrentPosition()` |
| Rideshare matching form | New `RideshareForm.tsx` + socket.io |
| Price volatility alerts | `profitEngine.ts` → 3-day slope check |
| Fuel price API | Fetch diesel rates → adjust `ratePerKm` dynamically |
| Live Agmarknet prices | `profitEngine.ts` → replace `simulateMarketPrice()` |
| Google Maps routing | `RouteMap.tsx` → switch to Maps JS SDK |
| MongoDB backend | Add `/server` with Express + Mongoose |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Language | TypeScript 5.3 (strict mode) |
| Frontend | React 18 |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap (free, no key needed) |
| Styling | CSS-in-JS (React.CSSProperties) + CSS variables |
| Data | Typed mock JSON → swap with Agmarknet API |
