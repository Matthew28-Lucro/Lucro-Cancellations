import { dashboardData } from "../data/mockData.js";
import {
  buildCancellationDataset,
  calculateRecoveryRate,
  calculateRetentionRate,
  calculateRevenueAtRisk,
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

function mapLocalRecordToApiShape(record) {
  return {
    id: record.id,
    client_name: record.client,
    cancellation_reason: record.cancellationReason,
    revenue: record.revenueAtRisk,
    status: record.status,
    account_manager: record.accountManager,
    created_at: record.date,
  };
}

function getLocalCancellationRows() {
  return buildCancellationDataset(dashboardData).map(mapLocalRecordToApiShape);
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
    revenueAtRisk: Number(row.revenue) || 0,
    recoveredRevenue: 0,
  }));

  return {
    total_cancellations: cancellations.length,
    retention_rate: calculateRetentionRate(metricInput),
    revenue_at_risk: calculateRevenueAtRisk(metricInput),
    recovery_rate: calculateRecoveryRate(metricInput),
  };
}
