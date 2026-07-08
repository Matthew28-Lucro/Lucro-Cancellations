import crypto from "node:crypto";

const RELEVANT_EVENTS = new Set([
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.voided",
  "payment_intent.succeeded",
]);

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function getRawBody(request) {
  if (typeof request.body === "string") return Promise.resolve(request.body);
  if (Buffer.isBuffer(request.body)) return Promise.resolve(request.body.toString("utf8"));

  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function parseStripeSignature(header = "") {
  return header.split(",").reduce(
    (parts, item) => {
      const [key, value] = item.split("=");
      if (key === "t") parts.timestamp = value;
      if (key === "v1") parts.signatures.push(value);
      return parts;
    },
    { timestamp: "", signatures: [] }
  );
}

function verifyStripeSignature({ payload, signatureHeader, webhookSecret }) {
  const { signatures, timestamp } = parseStripeSignature(signatureHeader);
  if (!timestamp || !signatures.length) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");

  return signatures.some((signature) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  });
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    sendJson(response, 500, { error: "STRIPE_WEBHOOK_SECRET is not configured." });
    return;
  }

  const payload = await getRawBody(request);
  const signatureHeader = request.headers["stripe-signature"];

  if (!verifyStripeSignature({ payload, signatureHeader, webhookSecret })) {
    sendJson(response, 400, { error: "Invalid Stripe webhook signature." });
    return;
  }

  const event = JSON.parse(payload);

  if (!RELEVANT_EVENTS.has(event.type)) {
    sendJson(response, 200, { received: true, ignored: true, type: event.type });
    return;
  }

  // Future database step: update the persisted billing snapshot here.
  sendJson(response, 200, {
    received: true,
    type: event.type,
    objectId: event.data?.object?.id || null,
  });
}
