import { billingClients, billingTrend } from "../data/billing.js";

const fallbackSummary = {
  clients: billingClients,
  generatedAt: null,
  mode: "mock",
  source: "mock",
  trend: billingTrend,
  warning: "Using local mock billing data.",
  warnings: [],
};

export async function fetchBillingSummary() {
  try {
    const response = await fetch("/api/billing-summary", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Billing API failed with ${response.status}.`);
    }

    const payload = await response.json();

    return {
      clients: Array.isArray(payload.clients) ? payload.clients : billingClients,
      generatedAt: payload.generatedAt || null,
      mode: payload.mode || "live",
      source: payload.source || payload.mode || "mock",
      cache: payload.cache || null,
      trend: Array.isArray(payload.trend) ? payload.trend : billingTrend,
      warning: payload.warning || "",
      warnings: Array.isArray(payload.warnings) ? payload.warnings : [],
    };
  } catch (error) {
    return {
      ...fallbackSummary,
      error: error instanceof Error ? error.message : "Unable to load billing API.",
    };
  }
}
