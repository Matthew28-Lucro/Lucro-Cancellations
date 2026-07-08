import { billingClients, billingTrend } from "../src/data/billing.js";

const STRIPE_API_BASE = "https://api.stripe.com/v1";
const MAX_PAGES = 10;

function sendJson(response, status, payload) {
  response.status(status).json({
    generatedAt: new Date().toISOString(),
    ...payload,
  });
}

function getStripeHeaders() {
  const key = process.env.STRIPE_SECRET_KEY;
  return {
    Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

async function fetchStripeList(path, params = {}) {
  const records = [];
  let startingAfter = null;
  let page = 0;

  while (page < MAX_PAGES) {
    const searchParams = new URLSearchParams({ limit: "100", ...params });
    if (startingAfter) searchParams.set("starting_after", startingAfter);

    const response = await fetch(`${STRIPE_API_BASE}${path}?${searchParams.toString()}`, {
      headers: getStripeHeaders(),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Stripe ${path} failed with ${response.status}: ${message}`);
    }

    const payload = await response.json();
    records.push(...(payload.data || []));

    if (!payload.has_more || !payload.data?.length) break;
    startingAfter = payload.data[payload.data.length - 1].id;
    page += 1;
  }

  return records;
}

function formatDateFromUnix(value) {
  if (!value) return "";
  return new Date(value * 1000).toISOString().slice(0, 10);
}

function getAmountFromSubscription(subscription) {
  return (subscription.items?.data || []).reduce((total, item) => {
    const amount = item.price?.unit_amount || item.plan?.amount || 0;
    const quantity = item.quantity || 1;
    return total + amount * quantity;
  }, 0);
}

function getPlanType(subscription) {
  const recurring = subscription.items?.data?.[0]?.price?.recurring || subscription.items?.data?.[0]?.plan;
  if (!recurring) return "One-time";
  if (recurring.interval === "year") return "Annual";
  if (recurring.interval === "month") return "Month-to-month";
  return "Payment plan";
}

function normalizeStatus(subscription) {
  if (subscription.cancel_at_period_end) return "Canceling";
  if (subscription.status === "past_due" || subscription.status === "unpaid") return "Past due";
  if (subscription.status === "trialing") return "Trialing";
  if (subscription.status === "canceled" || subscription.status === "ended") return "Complete";
  return "Active";
}

function normalizeInvoiceStatus(invoice) {
  if (!invoice) return "Unknown";
  if (invoice.status === "paid") return "Paid";
  if (invoice.status === "open") return "Open";
  if (invoice.status === "draft") return "Draft";
  if (invoice.status === "void") return "Void";
  if (invoice.status === "uncollectible") return "Failed";
  return invoice.status || "Unknown";
}

function normalizePaymentMethod(subscription) {
  if (subscription.default_payment_method) return "Card";
  if (subscription.collection_method === "send_invoice") return "Invoice";
  return "Card";
}

function getOwnerAction(status, balanceDue) {
  if (status === "Past due") return "Collect payment";
  if (status === "Canceling") return "Save conversation";
  if (balanceDue > 0) return "Watch invoice";
  if (status === "Trialing") return "Confirm start";
  return "Keep current";
}

function toBillingClient(subscription, customer, latestInvoice) {
  const amountCents = getAmountFromSubscription(subscription);
  const planType = getPlanType(subscription);
  const status = normalizeStatus(subscription);
  const balanceDue = Math.max(0, latestInvoice?.amount_remaining || 0) / 100;
  const mrr = planType === "Month-to-month" || planType === "Payment plan" ? amountCents / 100 : 0;
  const arr = planType === "Annual" ? amountCents / 100 : mrr * 12;

  return {
    id: subscription.customer || subscription.id,
    client: customer?.name || customer?.email || subscription.customer || "Unknown client",
    planType,
    status,
    invoiceStatus: normalizeInvoiceStatus(latestInvoice),
    billingCadence: planType === "Annual" ? "Annual" : planType === "One-time" ? "One-time" : "Monthly",
    mrr,
    arr,
    contractValue: planType === "Annual" ? amountCents / 100 : arr,
    nextInvoiceDate: formatDateFromUnix(subscription.current_period_end),
    currentPeriodEnd: formatDateFromUnix(subscription.current_period_end),
    paymentMethod: normalizePaymentMethod(subscription),
    balanceDue,
    daysPastDue: 0,
    ownerAction: getOwnerAction(status, balanceDue),
  };
}

function buildTrendFromInvoices(invoices) {
  const months = new Map();

  invoices.forEach((invoice) => {
    const date = new Date((invoice.created || 0) * 1000);
    if (Number.isNaN(date.getTime())) return;
    const month = date.toLocaleString("en-US", { month: "short" });
    const current = months.get(month) || { month, collected: 0, invoiced: 0, overdue: 0 };

    current.invoiced += (invoice.total || invoice.amount_due || 0) / 100;
    current.collected += (invoice.amount_paid || 0) / 100;
    current.overdue += Math.max(0, invoice.amount_remaining || 0) / 100;
    months.set(month, current);
  });

  const trend = [...months.values()].slice(-7);
  return trend.length ? trend : billingTrend;
}

function findLatestInvoice(subscription, invoicesById, invoicesByCustomer) {
  if (typeof subscription.latest_invoice === "string") {
    return invoicesById.get(subscription.latest_invoice);
  }

  if (subscription.latest_invoice?.id) return subscription.latest_invoice;

  const customerInvoices = invoicesByCustomer.get(subscription.customer) || [];
  return customerInvoices[0] || null;
}

async function getLiveBillingSummary() {
  const [subscriptions, customers, invoices] = await Promise.all([
    fetchStripeList("/subscriptions", { status: "all" }),
    fetchStripeList("/customers"),
    fetchStripeList("/invoices"),
  ]);

  const customersById = new Map(customers.map((customer) => [customer.id, customer]));
  const invoicesById = new Map(invoices.map((invoice) => [invoice.id, invoice]));
  const invoicesByCustomer = new Map();

  invoices.forEach((invoice) => {
    if (!invoice.customer) return;
    const current = invoicesByCustomer.get(invoice.customer) || [];
    current.push(invoice);
    current.sort((a, b) => (b.created || 0) - (a.created || 0));
    invoicesByCustomer.set(invoice.customer, current);
  });

  return {
    clients: subscriptions.map((subscription) =>
      toBillingClient(
        subscription,
        customersById.get(subscription.customer),
        findLatestInvoice(subscription, invoicesById, invoicesByCustomer)
      )
    ),
    trend: buildTrendFromInvoices(invoices),
  };
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    sendJson(response, 200, {
      mode: "mock",
      clients: billingClients,
      trend: billingTrend,
      warning: "STRIPE_SECRET_KEY is not configured. Returning mock billing data.",
    });
    return;
  }

  try {
    const summary = await getLiveBillingSummary();
    sendJson(response, 200, { mode: "live", ...summary });
  } catch (error) {
    sendJson(response, 500, {
      mode: "error",
      clients: billingClients,
      trend: billingTrend,
      error: error instanceof Error ? error.message : "Unable to load Stripe billing data.",
    });
  }
}
