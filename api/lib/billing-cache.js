const BILLING_SNAPSHOT_KEY = "lucro:billing-summary:v1";

function getStoreConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_KV_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_KV_REST_API_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    "";

  return {
    token,
    url: url.replace(/\/$/, ""),
  };
}

export function isBillingSnapshotStoreConfigured() {
  const { token, url } = getStoreConfig();
  return Boolean(token && url);
}

async function runStoreCommand(command) {
  const { token, url } = getStoreConfig();

  if (!token || !url) {
    return null;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Billing snapshot store failed with ${response.status}.`);
  }

  const payload = await response.json();

  if (payload.error) {
    throw new Error(`Billing snapshot store failed: ${payload.error}`);
  }

  return payload.result;
}

export async function readBillingSnapshot() {
  if (!isBillingSnapshotStoreConfigured()) return null;

  const value = await runStoreCommand(["GET", BILLING_SNAPSHOT_KEY]);
  if (!value) return null;

  const snapshot = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(snapshot.clients) || !Array.isArray(snapshot.trend)) return null;

  return snapshot;
}

export async function writeBillingSnapshot(summary, source = "stripe-live") {
  if (!isBillingSnapshotStoreConfigured()) {
    return { configured: false, hit: false, stored: false };
  }

  const snapshot = {
    ...summary,
    generatedAt: new Date().toISOString(),
    mode: "live",
    source,
  };

  await runStoreCommand(["SET", BILLING_SNAPSHOT_KEY, JSON.stringify(snapshot)]);

  return {
    configured: true,
    generatedAt: snapshot.generatedAt,
    hit: false,
    key: BILLING_SNAPSHOT_KEY,
    stored: true,
  };
}

export function getCacheMeta(overrides = {}) {
  return {
    configured: isBillingSnapshotStoreConfigured(),
    hit: false,
    stored: false,
    ...overrides,
  };
}
