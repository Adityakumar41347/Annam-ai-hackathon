// ============================================================
//  Krishi-Route — API Service Layer
//  All calls go to the Express backend (krishi-server)
//  Fallback mock data is used if the backend is unreachable
// ============================================================

import type {
  Crop,
  Vehicle,
  FarmerLocation,
  MandiResult,
  AnalysisInputs,
  PriceHistoryPoint,
} from "../types";

// ── Base URL from Vite env ────────────────────────────────────
// Set VITE_API_URL=http://localhost:5000 in krishi-vite/.env
const BASE = process.env.REACT_APP_API_URL ;
console.log(process.env.REACT_APP_API_URL)

// ── Generic fetch wrapper with error handling ─────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  const json = (await res.json()) as { success: boolean; data: T };
  return json.data;
}

// ============================================================
//  CROPS
// ============================================================

export async function fetchCrops(): Promise<Crop[]> {
  return apiFetch<Crop[]>("/api/crops");
}

// ============================================================
//  VEHICLES
// ============================================================

export async function fetchVehicles(): Promise<Vehicle[]> {
  return apiFetch<Vehicle[]>("/api/vehicles");
}

// ============================================================
//  LOCATIONS  (static — no backend needed)
// ============================================================

export const LOCATIONS: FarmerLocation[] = [
  { value: "haridwar",      label: "Haridwar, Uttarakhand", lat: 29.9457, lng: 78.1642 },
  { value: "roorkee",       label: "Roorkee, Uttarakhand",  lat: 29.8543, lng: 77.8880 },
  { value: "muzaffarnagar", label: "Muzaffarnagar, UP",     lat: 29.4727, lng: 77.7085 },
  { value: "saharanpur",    label: "Saharanpur, UP",        lat: 29.9680, lng: 77.5456 },
  { value: "dehradun",      label: "Dehradun, Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { value: "meerut",        label: "Meerut, UP",            lat: 28.9845, lng: 77.7064 },
];

// ============================================================
//  MANDIS — nearby by lat/lng radius
// ============================================================

export async function fetchNearbyMandis(
  lat: number,
  lng: number,
  radiusKm = 100
): Promise<MandiResult[]> {
  return apiFetch<MandiResult[]>(
    `/api/mandis?lat=${lat}&lng=${lng}&radius=${radiusKm}`
  );
}

// ============================================================
//  MARKET PRICES
// ============================================================

export async function fetchPriceHistory(
  mandiId: string,
  cropId: string,
  days = 7
): Promise<PriceHistoryPoint[]> {
  const raw = await apiFetch<
    Array<{ date: string; modalPrice: number }>
  >(`/api/prices?mandiId=${mandiId}&cropId=${cropId}&days=${days}`);

  // Map backend shape → chart-friendly shape
  return raw.map((r) => ({
    day:   new Date(r.date).toLocaleDateString("en-IN", { weekday: "short" }),
    price: r.modalPrice,
  }));
}

export async function fetchLatestPrice(
  mandiId: string,
  cropId: string
): Promise<number> {
  const raw = await apiFetch<{ modalPrice: number }>(
    `/api/prices/latest?mandiId=${mandiId}&cropId=${cropId}`
  );
  return raw.modalPrice;
}

// ============================================================
//  ANALYZE  — core profit comparison (POST)
// ============================================================

export interface AnalyzePayload {
  cropId:           string;
  lat:              number;
  lng:              number;
  radiusKm?:        number;
  quantityQuintals: number;
  vehicleId:        string;
  handlingCost:     number;
}

export interface AnalyzeResponse {
  results:         MandiResult[];
  winner:          MandiResult;
  nearest:         MandiResult;
  extraVsNearest:  number;
  mandisCompared:  number;
  bestMargin:      number;
}

export async function analyzeTrip(
  payload: AnalyzePayload
): Promise<AnalyzeResponse> {
  return apiFetch<AnalyzeResponse>("/api/analyze", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
}

// ============================================================
//  FARMERS
// ============================================================

export interface RegisterFarmerPayload {
  name:        string;
  phone:       string;
  village?:    string;
  district?:   string;
  state?:      string;
  lat:         number;
  lng:         number;
  landHolding?: number;
}

export async function registerFarmer(payload: RegisterFarmerPayload) {
  return apiFetch("/api/farmers", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
}

export async function fetchFarmerByPhone(phone: string) {
  return apiFetch(`/api/farmers/${phone}`);
}

// ============================================================
//  TRIPS
// ============================================================

export interface SaveTripPayload {
  farmer:           string;   // Farmer ObjectId
  crop:             string;   // Crop ObjectId
  mandi:            string;   // Mandi ObjectId
  vehicle:          string;   // Vehicle ObjectId
  quantityQuintals: number;
  pricePerQuintal:  number;
  revenue:          number;
  transportCost:    number;
  handlingCost:     number;
  commissionCost:   number;
  totalCost:        number;
  netProfit:        number;
  profitMargin:     number;
  distanceKm:       number;
  tripDate:         string;   // ISO date string
  status:           "planned" | "completed";
}

export async function saveTrip(payload: SaveTripPayload) {
  return apiFetch("/api/trips", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
}

export async function fetchTripHistory(farmerId: string, page = 1) {
  return apiFetch(`/api/trips/farmer/${farmerId}?page=${page}&limit=10`);
}

export async function fetchTripSummary(farmerId: string) {
  return apiFetch(`/api/trips/farmer/${farmerId}/summary`);
}

export async function updateTripStatus(
  tripId: string,
  status: "completed" | "cancelled"
) {
  return apiFetch(`/api/trips/${tripId}/status`, {
    method: "PATCH",
    body:   JSON.stringify({ status }),
  });
}

// ============================================================
//  RIDESHARE
// ============================================================

export async function fetchOpenRides(mandiId: string, date: string) {
  return apiFetch(
    `/api/rideshare?mandiId=${mandiId}&date=${date}`
  );
}

export async function joinRide(rideId: string, farmerId: string) {
  return apiFetch(`/api/rideshare/${rideId}/join`, {
    method: "POST",
    body:   JSON.stringify({ farmerId }),
  });
}

export async function cancelRide(rideId: string) {
  return apiFetch(`/api/rideshare/${rideId}/cancel`, {
    method: "PATCH",
  });
}

// ============================================================
//  HEALTH CHECK — used to detect if backend is up
// ============================================================

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================
//  MOCK FALLBACK DATA
//  Used automatically when backend is unreachable (offline dev)
// ============================================================

export const MOCK_CROPS: Crop[] = [
  { value: "onion",   label: "Onion (प्याज)",   perishable: true,  basePrice: 1800, variance: 600,  emoji: "🧅" },
  { value: "tomato",  label: "Tomato (टमाटर)",  perishable: true,  basePrice: 2200, variance: 900,  emoji: "🍅" },
  { value: "wheat",   label: "Wheat (गेहूं)",   perishable: false, basePrice: 2100, variance: 200,  emoji: "🌾" },
  { value: "potato",  label: "Potato (आलू)",    perishable: true,  basePrice: 1200, variance: 400,  emoji: "🥔" },
  { value: "garlic",  label: "Garlic (लहसुन)",  perishable: false, basePrice: 6000, variance: 1500, emoji: "🧄" },
  { value: "rice",    label: "Rice (चावल)",     perishable: false, basePrice: 2800, variance: 300,  emoji: "🌾" },
  { value: "mustard", label: "Mustard (सरसों)", perishable: false, basePrice: 5400, variance: 400,  emoji: "🌿" },
  { value: "maize",   label: "Maize (मक्का)",   perishable: false, basePrice: 1700, variance: 250,  emoji: "🌽" },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { value: "tata_ace",  label: "Tata Ace",        capacity: "1 Ton",    ratePerKm: 18, loadingCost: 150 },
  { value: "tractor",   label: "Tractor-Trolley", capacity: "2 Tons",   ratePerKm: 14, loadingCost: 100 },
  { value: "truck_lcv", label: "Truck (LCV)",      capacity: "5 Tons",   ratePerKm: 22, loadingCost: 250 },
  { value: "mahindra",  label: "Mahindra Pickup",  capacity: "1.5 Tons", ratePerKm: 16, loadingCost: 120 },
  { value: "bolero",    label: "Bolero Pickup",    capacity: "1 Ton",    ratePerKm: 17, loadingCost: 130 },
];

export const MOCK_MANDIS_BY_LOCATION: Record<string, Array<{
  id: string; name: string; km: number; lat: number; lng: number;
  priceBoost: number; peakDay: string; trend: "rising" | "falling" | "stable";
}>> = {
  haridwar: [
    { id: "hw_local",  name: "Haridwar APMC",      km: 8,  lat: 29.9500, lng: 78.1700, priceBoost: 0,   peakDay: "Tuesday",  trend: "stable"  },
    { id: "rk_mandi",  name: "Roorkee Mandi",       km: 35, lat: 29.8543, lng: 77.8880, priceBoost: 180, peakDay: "Wednesday",trend: "rising"  },
    { id: "sp_apmc",   name: "Saharanpur APMC",     km: 62, lat: 29.9680, lng: 77.5456, priceBoost: 340, peakDay: "Monday",   trend: "stable"  },
    { id: "mzn_mandi", name: "Muzaffarnagar Mandi", km: 95, lat: 29.4727, lng: 77.7085, priceBoost: 520, peakDay: "Thursday", trend: "falling" },
  ],
  roorkee: [
    { id: "rk_local", name: "Roorkee APMC",    km: 5,  lat: 29.8600, lng: 77.8900, priceBoost: 0,   peakDay: "Monday",   trend: "stable" },
    { id: "hw_mandi", name: "Haridwar Mandi",  km: 36, lat: 29.9457, lng: 78.1642, priceBoost: 150, peakDay: "Tuesday",  trend: "rising" },
    { id: "sp_apmc2", name: "Saharanpur APMC", km: 55, lat: 29.9680, lng: 77.5456, priceBoost: 310, peakDay: "Wednesday",trend: "stable" },
    { id: "dd_mandi", name: "Dehradun Mandi",  km: 90, lat: 30.3165, lng: 78.0322, priceBoost: 490, peakDay: "Saturday", trend: "rising" },
  ],
  muzaffarnagar: [
    { id: "mzn_local", name: "Muzaffarnagar APMC", km: 6,   lat: 29.4800, lng: 77.7100, priceBoost: 0,   peakDay: "Monday",   trend: "stable"  },
    { id: "mt_mandi",  name: "Meerut Mandi",        km: 45,  lat: 28.9845, lng: 77.7064, priceBoost: 260, peakDay: "Thursday", trend: "rising"  },
    { id: "sp_apmc3",  name: "Saharanpur APMC",     km: 58,  lat: 29.9680, lng: 77.5456, priceBoost: 380, peakDay: "Tuesday",  trend: "stable"  },
    { id: "ghz_mandi", name: "Ghaziabad Mandi",     km: 100, lat: 28.6692, lng: 77.4538, priceBoost: 610, peakDay: "Wednesday",trend: "rising"  },
  ],
  saharanpur: [
    { id: "sp_local",  name: "Saharanpur APMC",   km: 7,  lat: 29.9680, lng: 77.5456, priceBoost: 0,   peakDay: "Tuesday",  trend: "stable"  },
    { id: "db_mandi",  name: "Deoband Mandi",      km: 30, lat: 29.6965, lng: 77.6856, priceBoost: 140, peakDay: "Monday",   trend: "falling" },
    { id: "mzn_mand2", name: "Muzaffarnagar APMC", km: 55, lat: 29.4727, lng: 77.7085, priceBoost: 300, peakDay: "Thursday", trend: "stable"  },
    { id: "rk_mand2",  name: "Roorkee Mandi",      km: 65, lat: 29.8543, lng: 77.8880, priceBoost: 420, peakDay: "Wednesday",trend: "rising"  },
  ],
  dehradun: [
    { id: "dd_local",  name: "Dehradun APMC",   km: 6,   lat: 30.3165, lng: 78.0322, priceBoost: 0,   peakDay: "Monday",   trend: "stable" },
    { id: "hw_mand2",  name: "Haridwar Mandi",  km: 54,  lat: 29.9457, lng: 78.1642, priceBoost: 280, peakDay: "Tuesday",  trend: "rising" },
    { id: "rk_mand3",  name: "Roorkee Mandi",   km: 88,  lat: 29.8543, lng: 77.8880, priceBoost: 430, peakDay: "Wednesday",trend: "stable" },
    { id: "sp_apmc4",  name: "Saharanpur APMC", km: 105, lat: 29.9680, lng: 77.5456, priceBoost: 590, peakDay: "Thursday", trend: "rising" },
  ],
  meerut: [
    { id: "mt_local",  name: "Meerut APMC",         km: 5,  lat: 28.9845, lng: 77.7064, priceBoost: 0,   peakDay: "Monday",   trend: "stable"  },
    { id: "mzn_mand3", name: "Muzaffarnagar Mandi",  km: 47, lat: 29.4727, lng: 77.7085, priceBoost: 220, peakDay: "Thursday", trend: "rising"  },
    { id: "ghz_mand2", name: "Ghaziabad APMC",       km: 35, lat: 28.6692, lng: 77.4538, priceBoost: 310, peakDay: "Wednesday",trend: "stable"  },
    { id: "sp_apmc5",  name: "Saharanpur APMC",      km: 92, lat: 29.9680, lng: 77.5456, priceBoost: 480, peakDay: "Tuesday",  trend: "falling" },
  ],
};

/** Simulated 7-day price history — used when backend is offline */
export function generatePriceHistory(basePrice: number): PriceHistoryPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => ({
    day,
    price: Math.round(
      basePrice +
      Math.sin(i * 0.9) * basePrice * 0.08 +
      (Math.random() - 0.5) * basePrice * 0.04
    ),
  }));
}