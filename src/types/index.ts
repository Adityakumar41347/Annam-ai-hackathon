// ============================================================
//  Krishi-Route — Shared TypeScript Types
// ============================================================

/** A crop that can be sold */
export interface Crop {
  value: string;
  label: string;
  perishable: boolean;
  basePrice: number;   // ₹ per quintal
  variance: number;    // price variance range
  emoji: string;
}

/** A transport vehicle with cost per km */
export interface Vehicle {
  value: string;
  label: string;
  capacity: string;
  ratePerKm: number;   // ₹ per km
  loadingCost: number; // ₹ fixed
}

/** A farmer's home location */
export interface FarmerLocation {
  value: string;
  label: string;
  lat: number;
  lng: number;
}

/** Price trend direction */
export type PriceTrend = "rising" | "falling" | "stable";

/** A mandi (agricultural market) */
export interface Mandi {
  id: string;
  name: string;
  km: number;
  lat: number;
  lng: number;
  priceBoost: number;  // ₹ above base price per quintal
  peakDay: string;
  trend: PriceTrend;
}

/** Full calculated result for one mandi */
export interface MandiResult extends Mandi {
  pricePerQuintal: number;
  revenue: number;
  transportCost: number;
  handlingCost: number;
  commissionCost: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;   // 0–100 %
  revenuePerKm: number;
}

/** Output from the full analysis run */
export interface AnalysisResult {
  results: MandiResult[];
  winner: MandiResult;
  nearestResult: MandiResult | undefined;
  extraVsNearest: number;
  mandisCompared: number;
  bestMargin: number;
}

/** Full analysis including inputs and perishability */
export interface FullAnalysis extends AnalysisResult {
  perishRisk: PerishabilityRisk | null;
  inputs: AnalysisInputs;
  quantityQuintals: number;
}

/** Inputs collected from the form */
export interface AnalysisInputs {
  crop: Crop;
  vehicle: Vehicle;
  location: FarmerLocation;
  qty: number;
  unit: QuantityUnit;
  handling: number;
}

/** Supported quantity units */
export type QuantityUnit = ""|"quintal" | "ton" | "kg";

/** Perishability risk level */
export type RiskLevel = "high" | "medium" | "low";

/** Risk object returned for perishable crops on long routes */
export interface PerishabilityRisk {
  level: RiskLevel;
  message: string;
}

/** One data point in a price history chart */
export interface PriceHistoryPoint {
  day: string;
  price: number;
}

/** Mandi with 7-day price history */
export interface MandiHistory {
  mandi: string;
  history: PriceHistoryPoint[];
  color: string;
}

/** Smart insight tip */
export interface Tip {
  icon: string;
  title: string;
  body: string;
}
