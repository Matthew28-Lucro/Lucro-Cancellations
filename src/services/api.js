import { localCancellations } from "../data/cancellations.js";
import {
  calculateSaveOpportunityRate,
  calculateRetentionRate,
  getTopRevenueTier,
} from "../utils/metrics.js";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

function unwrapApiResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.cancellations)) return payload.cancellations;
  return [];
}

async function request(endpoint) {
  if (!API_URL) return null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}) while loading ${endpoint}.`);
  }

  return response.json();
}

function getLocalCancellationRows() {
  return localCancellations.map((record) => ({ ...record }));
}

export async function fetchCancellations() {
  const payload = await request("/cancellations");
  if (!payload) return getLocalCancellationRows();

  return unwrapApiResponse(payload);
}

export async function fetchMetrics() {
  const payload = await request("/metrics");
  if (payload) return payload?.data || payload;

  const cancellations = getLocalCancellationRows();
  const metricInput = cancellations.map((row) => ({
    revenueTier: row.revenue_tier || "Unknown",
    revenueTierValue: Number(row.revenue) || 0,
    status: row.status || "Unknown",
    preventable: row.preventable || "Unclear",
  }));
  const topRevenueTier = getTopRevenueTier(metricInput);

  return {
    total_cancellations: cancellations.length,
    retention_rate: calculateRetentionRate(metricInput),
    top_revenue_tier: topRevenueTier.label,
    top_revenue_tier_count: topRevenueTier.count,
    save_opportunity_rate: calculateSaveOpportunityRate(metricInput),
  };
}
