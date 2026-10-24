import { POPULAR_SERVICE_IDS } from "./careChatbot.js";
import { sortServices } from "./sortServices.js";

const STORAGE_KEY = "mson_service_engagement";

/** Baseline popularity when no clicks yet (matches common enquiries). */
const SEED_WEIGHT = {
  "gda-male-and-female-12-hours": 48,
  "elderly-care-service": 44,
  "home-health-care-service": 42,
  "registered-nurses-12-hours": 40,
  "medical-care-nurse": 38,
  "elder-care-nurse": 36,
};

export function readServiceStats() {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* private mode */
  }
}

/** Call when user opens a service (card click, chatbot chip, etc.). */
export function recordServiceEngagement(serviceId, source = "click") {
  if (!serviceId) return;
  const stats = readServiceStats();
  const row = stats[serviceId] || { clicks: 0, searches: 0, lastAt: 0 };
  if (source === "search" || source === "chatbot") row.searches += 1;
  else row.clicks += 1;
  row.lastAt = Date.now();
  stats[serviceId] = row;
  writeStats(stats);
}

export function scoreService(service, stats) {
  const row = stats[service.id] || {};
  const clicks = row.clicks || 0;
  const searches = row.searches || 0;
  const seed = SEED_WEIGHT[service.id] || 0;
  const popularIdx = POPULAR_SERVICE_IDS.indexOf(service.id);
  const popularBoost = popularIdx >= 0 ? (POPULAR_SERVICE_IDS.length - popularIdx) * 2 : 0;
  const orderBoost = Math.max(0, 120 - (service.sortOrder ?? 999));
  const recency = row.lastAt ? Math.min(15, Math.floor((Date.now() - row.lastAt) / 86400000)) : 0;
  return clicks * 5 + searches * 3 + seed + popularBoost + orderBoost - recency;
}

/** Home / highlights: most reached services first. Pass stats from the client after mount so SSR stays stable. */
export function pickPopularServices(services = [], limit = 4, stats = {}) {
  const list = sortServices(services);
  return [...list]
    .map((s) => ({ service: s, score: scoreService(s, stats) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.service);
}
