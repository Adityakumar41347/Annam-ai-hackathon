// ============================================================
//  Krishi-Route — Mock Data (TypeScript)
//  Replace API calls here when Agmarknet / Google Maps are live
// ============================================================

// import type { Crop, Vehicle, FarmerLocation, Mandi, PriceHistoryPoint } from "../types";

// export const CROPS: Crop[] = [
//   { value: "onion",   label: "Onion (प्याज)",    perishable: true,  basePrice: 1800, variance: 600,  emoji: "🧅" },
//   { value: "tomato",  label: "Tomato (टमाटर)",   perishable: true,  basePrice: 2200, variance: 900,  emoji: "🍅" },
//   { value: "wheat",   label: "Wheat (गेहूं)",     perishable: false, basePrice: 2100, variance: 200,  emoji: "🌾" },
//   { value: "potato",  label: "Potato (आलू)",      perishable: true,  basePrice: 1200, variance: 400,  emoji: "🥔" },
//   { value: "garlic",  label: "Garlic (लहसुन)",    perishable: false, basePrice: 6000, variance: 1500, emoji: "🧄" },
//   { value: "rice",    label: "Rice (चावल)",       perishable: false, basePrice: 2800, variance: 300,  emoji: "🌾" },
//   { value: "mustard", label: "Mustard (सरसों)",   perishable: false, basePrice: 5400, variance: 400,  emoji: "🌿" },
//   { value: "maize",   label: "Maize (मक्का)",     perishable: false, basePrice: 1700, variance: 250,  emoji: "🌽" },
// ];

// export const VEHICLES: Vehicle[] = [
//   { value: "tata_ace",  label: "Tata Ace",         capacity: "1 Ton",    ratePerKm: 18, loadingCost: 150 },
//   { value: "tractor",   label: "Tractor-Trolley",  capacity: "2 Tons",   ratePerKm: 14, loadingCost: 100 },
//   { value: "truck_lcv", label: "Truck (LCV)",       capacity: "5 Tons",   ratePerKm: 22, loadingCost: 250 },
//   { value: "mahindra",  label: "Mahindra Pickup",   capacity: "1.5 Tons", ratePerKm: 16, loadingCost: 120 },
//   { value: "bolero",    label: "Bolero Pickup",     capacity: "1 Ton",    ratePerKm: 17, loadingCost: 130 },
// ];

// export const LOCATIONS: FarmerLocation[] = [
//   { value: "haridwar",      label: "Haridwar, Uttarakhand",  lat: 29.9457, lng: 78.1642 },
//   { value: "roorkee",       label: "Roorkee, Uttarakhand",   lat: 29.8543, lng: 77.8880 },
//   { value: "muzaffarnagar", label: "Muzaffarnagar, UP",      lat: 29.4727, lng: 77.7085 },
//   { value: "saharanpur",    label: "Saharanpur, UP",         lat: 29.9680, lng: 77.5456 },
//   { value: "dehradun",      label: "Dehradun, Uttarakhand",  lat: 30.3165, lng: 78.0322 },
//   { value: "meerut",        label: "Meerut, UP",             lat: 28.9845, lng: 77.7064 },
// ];

// export const MANDIS_BY_LOCATION: Record<string, Mandi[]> = {
//   haridwar: [
//     { id: "hw_local",  name: "Haridwar APMC",        km: 8,   lat: 29.9500, lng: 78.1700, priceBoost: 0,   peakDay: "Tuesday",  trend: "stable"  },
//     { id: "rk_mandi",  name: "Roorkee Mandi",         km: 35,  lat: 29.8543, lng: 77.8880, priceBoost: 180, peakDay: "Wednesday",trend: "rising"  },
//     { id: "sp_apmc",   name: "Saharanpur APMC",       km: 62,  lat: 29.9680, lng: 77.5456, priceBoost: 340, peakDay: "Monday",   trend: "stable"  },
//     { id: "mzn_mandi", name: "Muzaffarnagar Mandi",   km: 95,  lat: 29.4727, lng: 77.7085, priceBoost: 520, peakDay: "Thursday", trend: "falling" },
//   ],
//   roorkee: [
//     { id: "rk_local",  name: "Roorkee APMC",          km: 5,   lat: 29.8600, lng: 77.8900, priceBoost: 0,   peakDay: "Monday",   trend: "stable"  },
//     { id: "hw_mandi",  name: "Haridwar Mandi",         km: 36,  lat: 29.9457, lng: 78.1642, priceBoost: 150, peakDay: "Tuesday",  trend: "rising"  },
//     { id: "sp_apmc2",  name: "Saharanpur APMC",        km: 55,  lat: 29.9680, lng: 77.5456, priceBoost: 310, peakDay: "Wednesday",trend: "stable"  },
//     { id: "dd_mandi",  name: "Dehradun Mandi",         km: 90,  lat: 30.3165, lng: 78.0322, priceBoost: 490, peakDay: "Saturday", trend: "rising"  },
//   ],
//   muzaffarnagar: [
//     { id: "mzn_local", name: "Muzaffarnagar APMC",    km: 6,   lat: 29.4800, lng: 77.7100, priceBoost: 0,   peakDay: "Monday",   trend: "stable"  },
//     { id: "mt_mandi",  name: "Meerut Mandi",           km: 45,  lat: 28.9845, lng: 77.7064, priceBoost: 260, peakDay: "Thursday", trend: "rising"  },
//     { id: "sp_apmc3",  name: "Saharanpur APMC",        km: 58,  lat: 29.9680, lng: 77.5456, priceBoost: 380, peakDay: "Tuesday",  trend: "stable"  },
//     { id: "ghz_mandi", name: "Ghaziabad Mandi",        km: 100, lat: 28.6692, lng: 77.4538, priceBoost: 610, peakDay: "Wednesday",trend: "rising"  },
//   ],
//   saharanpur: [
//     { id: "sp_local",  name: "Saharanpur APMC",        km: 7,   lat: 29.9680, lng: 77.5456, priceBoost: 0,   peakDay: "Tuesday",  trend: "stable"  },
//     { id: "db_mandi",  name: "Deoband Mandi",           km: 30,  lat: 29.6965, lng: 77.6856, priceBoost: 140, peakDay: "Monday",   trend: "falling" },
//     { id: "mzn_mand2", name: "Muzaffarnagar APMC",      km: 55,  lat: 29.4727, lng: 77.7085, priceBoost: 300, peakDay: "Thursday", trend: "stable"  },
//     { id: "rk_mand2",  name: "Roorkee Mandi",           km: 65,  lat: 29.8543, lng: 77.8880, priceBoost: 420, peakDay: "Wednesday",trend: "rising"  },
//   ],
//   dehradun: [
//     { id: "dd_local",  name: "Dehradun APMC",           km: 6,   lat: 30.3165, lng: 78.0322, priceBoost: 0,   peakDay: "Monday",   trend: "stable"  },
//     { id: "hw_mand2",  name: "Haridwar Mandi",           km: 54,  lat: 29.9457, lng: 78.1642, priceBoost: 280, peakDay: "Tuesday",  trend: "rising"  },
//     { id: "rk_mand3",  name: "Roorkee Mandi",            km: 88,  lat: 29.8543, lng: 77.8880, priceBoost: 430, peakDay: "Wednesday",trend: "stable"  },
//     { id: "sp_apmc4",  name: "Saharanpur APMC",          km: 105, lat: 29.9680, lng: 77.5456, priceBoost: 590, peakDay: "Thursday", trend: "rising"  },
//   ],
//   meerut: [
//     { id: "mt_local",  name: "Meerut APMC",              km: 5,   lat: 28.9845, lng: 77.7064, priceBoost: 0,   peakDay: "Monday",   trend: "stable"  },
//     { id: "mzn_mand3", name: "Muzaffarnagar Mandi",       km: 47,  lat: 29.4727, lng: 77.7085, priceBoost: 220, peakDay: "Thursday", trend: "rising"  },
//     { id: "ghz_mand2", name: "Ghaziabad APMC",            km: 35,  lat: 28.6692, lng: 77.4538, priceBoost: 310, peakDay: "Wednesday",trend: "stable"  },
//     { id: "sp_apmc5",  name: "Saharanpur APMC",           km: 92,  lat: 29.9680, lng: 77.5456, priceBoost: 480, peakDay: "Tuesday",  trend: "falling" },
//   ],
// };

// /** Simulated 7-day price history for a mandi */
// export function generatePriceHistory(basePrice: number): PriceHistoryPoint[] {
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   return days.map((day, i) => ({
//     day,
//     price: Math.round(
//       basePrice +
//       Math.sin(i * 0.9) * basePrice * 0.08 +
//       (Math.random() - 0.5) * basePrice * 0.04
//     ),
//   }));
// }
