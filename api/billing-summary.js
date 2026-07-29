import { billingClients, billingTrend } from "../src/data/billing.js";
import { getCacheMeta, readBillingSnapshot, writeBillingSnapshot } from "./lib/billing-cache.js";
import { getLiveBillingSummary, hasStripeSecretKey } from "./lib/stripe-billing.js";

function sendJson(response, status, payload) {
  response.status(status).json({
    generatedAt: new Date().toISOString(),
    ...payload,
  });
}

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const snapshot = await readBillingSnapshot();

    if (snapshot) {
      sendJson(response, 200, {
        ...snapshot,
        cache: getCacheMeta({
          generatedAt: snapshot.generatedAt || null,
          hit: true,
          stored: true,
        }),
        mode: "live",
        source: "stripe-cache",
      });
      return;
    }
  } catch (error) {
    if (!hasStripeSecretKey()) {
      const message = getErrorMessage(error, "Billing snapshot could not be read.");
      sendJson(response, 200, {
        mode: "mock",
        source: "mock",
        clients: billingClients,
        trend: billingTrend,
        warning: `Billing snapshot could not be read: ${message}`,
        cache: getCacheMeta({ error: message }),
      });
      return;
    }
  }

  if (!hasStripeSecretKey()) {
    sendJson(response, 200, {
      mode: "mock",
      source: "mock",
      clients: billingClients,
      trend: billingTrend,
      warning: "STRIPE_SECRET_KEY is not configured. Returning mock billing data.",
      cache: getCacheMeta(),
    });
    return;
  }

  try {
    const summary = await getLiveBillingSummary();
    let cache = getCacheMeta();

    try {
      cache = await writeBillingSnapshot(summary, "stripe-live");
    } catch (error) {
      cache = getCacheMeta({
        error: getErrorMessage(error, "Unable to write billing snapshot."),
      });
    }

    sendJson(response, 200, {
      mode: "live",
      source: "stripe-live",
      ...summary,
      cache,
    });
  } catch (error) {
    sendJson(response, 500, {
      mode: "error",
      source: "mock-fallback",
      clients: billingClients,
      trend: billingTrend,
      error: getErrorMessage(error, "Unable to load Stripe billing data."),
      cache: getCacheMeta(),
    });
  }
}
