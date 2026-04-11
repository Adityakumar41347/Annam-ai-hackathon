// ============================================================
//  Krishi-Route — Profit Calculation Engine (TypeScript)
//  Core: Net Profit = Revenue − Transport − Commission − Handling
// ============================================================

import type {
  Crop,
  Vehicle,
  Mandi,
  MandiResult,
  AnalysisResult,
  PerishabilityRisk,
  QuantityUnit,
} from "../types";

// ── Unit conversion ─────────────────────────────────────────

export function toQuintals(qty: number, unit: QuantityUnit): number {
  switch (unit) {
    case "ton":     return qty * 10;
    case "kg":      return qty / 100;
    case "quintal":
    default:        return qty;
  }
}

// ── Price simulation ─────────────────────────────────────────
// Replace with Agmarknet API call in production

export function simulateMarketPrice(
  basePrice: number,
  priceBoost: number,
  variance: number
): number {
  const noise = (Math.random() - 0.5) * variance * 0.15;
  return Math.round(basePrice + priceBoost + noise);
}

// ── Core profit calculation ──────────────────────────────────

interface ProfitParams {
  pricePerQuintal:  number;
  quantityQuintals: number;
  distanceKm:       number;
  vehicleRatePerKm: number;
  handlingCost:     number;
  commissionPct?:   number;  // default 2%
}

interface ProfitBreakdown {
  revenue:        number;
  transportCost:  number;
  handlingCost:   number;
  commissionCost: number;
  totalCost:      number;
  netProfit:      number;
  profitMargin:   number;   // 0–100 %
  revenuePerKm:   number;
  pricePerQuintal: number;
  quantityQuintals: number;
  distanceKm:     number;
}

export function calculateProfit(params: ProfitParams): ProfitBreakdown {
  const {
    pricePerQuintal,
    quantityQuintals,
    distanceKm,
    vehicleRatePerKm,
    handlingCost,
    commissionPct = 2,
  } = params;

  const revenue        = pricePerQuintal * quantityQuintals;
  const transportCost  = distanceKm * vehicleRatePerKm;
  const commissionCost = Math.round(revenue * (commissionPct / 100));
  const totalCost      = transportCost + handlingCost + commissionCost;
  const netProfit      = revenue - totalCost;
  const profitMargin   = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const revenuePerKm   = distanceKm > 0 ? netProfit / distanceKm : netProfit;

  return {
    revenue,
    transportCost,
    handlingCost,
    commissionCost,
    totalCost,
    netProfit,
    profitMargin,
    revenuePerKm,
    pricePerQuintal,
    quantityQuintals,
    distanceKm,
  };
}

// ── Full multi-mandi analysis ────────────────────────────────

interface AnalyzeParams {
  mandis:            Mandi[];
  crop:              Crop;
  quantityQuintals:  number;
  vehicle:           Vehicle;
  handlingCost:      number;
}

export function analyzeAllMandis(params: AnalyzeParams): AnalysisResult {
  const { mandis, crop, quantityQuintals, vehicle, handlingCost } = params;

  const results: MandiResult[] = mandis.map((mandi) => {
    const pricePerQuintal = simulateMarketPrice(
      crop.basePrice,
      mandi.priceBoost,
      crop.variance
    );

    const breakdown = calculateProfit({
      pricePerQuintal,
      quantityQuintals,
      distanceKm:       mandi.km,
      vehicleRatePerKm: vehicle.ratePerKm,
      handlingCost,
    });

    return { ...mandi, ...breakdown };
  });

  // Sort by net profit descending
  results.sort((a, b) => b.netProfit - a.netProfit);

  const winner = results[0];

  const nearestMandi = [...mandis].sort((a, b) => a.km - b.km)[0];
  const nearestResult = results.find((r) => r.id === nearestMandi.id);

  const extraVsNearest =
    winner.netProfit - (nearestResult?.netProfit ?? winner.netProfit);

  return {
    results,
    winner,
    nearestResult,
    extraVsNearest,
    mandisCompared: results.length,
    bestMargin: winner.profitMargin,
  };
}

// ── Perishability risk ───────────────────────────────────────

export function getPerishabilityRisk(
  crop: Crop,
  distanceKm: number
): PerishabilityRisk | null {
  if (!crop.perishable) return null;
  const name = crop.label.split("(")[0].trim();

  if (distanceKm > 150) {
    return {
      level: "high",
      message: `${name} over 150km: est. 12–18% spoilage risk. Consider refrigerated transport or splitting the trip.`,
    };
  }
  if (distanceKm > 100) {
    return {
      level: "medium",
      message: `${name} over 100km: est. 5–10% spoilage risk. Travel early morning and ensure good covering.`,
    };
  }
  if (distanceKm > 60) {
    return {
      level: "low",
      message: `${name} over 60km: minimal risk. Ensure proper covering and avoid midday heat.`,
    };
  }
  return null;
}

// ── Rideshare savings ────────────────────────────────────────

export function getRideshareSavings(transportCost: number): number {
  return Math.round(transportCost * 0.45);
}

// ── Formatters ───────────────────────────────────────────────

export function fmtRupee(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function fmtPct(n: number): string {
  return Math.round(n) + "%";
}
