# Stripe Billing Dashboard Setup

The Billing Dashboard is wired to `/api/billing-summary`.

## Current behavior

- Without Stripe environment variables, the dashboard uses local mock data.
- With `STRIPE_SECRET_KEY` configured in Vercel, `/api/billing-summary` reads subscriptions, customers, invoices, and available one-time payments from Stripe on the server.
- With Redis storage configured, `/api/billing-summary` reads the latest saved Stripe snapshot first.
- Stripe webhooks refresh that saved snapshot after relevant customer, subscription, invoice, and payment events.
- The browser never receives the Stripe key.
- The page refreshes billing data every five minutes while open.

## Vercel environment variables

Add these in Vercel Project Settings > Environment Variables:

```text
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

If your Vercel storage integration provides the older Vercel KV names instead, the code also supports:

```text
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

Do not prefix these with `VITE_`. Vite exposes `VITE_*` variables to browser code.

## Snapshot storage

For Vercel, use an Upstash Redis database from the Vercel Marketplace or project Storage tab.

Once it is attached to the project, Vercel should inject Redis REST environment variables. The dashboard only uses these variables inside server-side API functions:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

or:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

After adding or attaching storage, redeploy the Vercel project so the API functions can see the new variables.

## Stripe key recommendation

Use a restricted Stripe API key where possible. It needs read access for:

- Customers
- Subscriptions
- Invoices
- Payment intents if one-time payment tracking is needed

## Webhook endpoint

After deployment, create a Stripe webhook endpoint that points to:

```text
https://YOUR_VERCEL_DOMAIN/api/stripe-webhook
```

Subscribe to these events:

```text
customer.created
customer.updated
customer.deleted
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.created
invoice.finalized
invoice.paid
invoice.payment_failed
invoice.voided
payment_intent.succeeded
```

Copy the webhook signing secret from Stripe into `STRIPE_WEBHOOK_SECRET`.

## How the live refresh works

1. The dashboard calls `/api/billing-summary`.
2. If a saved Stripe snapshot exists, the API returns it with `source: "stripe-cache"`.
3. If no snapshot exists yet, the API reads Stripe live and saves the snapshot.
4. When Stripe sends a webhook event, `/api/stripe-webhook` verifies the signature, reads a fresh Stripe summary, and replaces the saved snapshot.

If Redis is not configured yet, the dashboard still works by reading Stripe live, but the webhook has nowhere durable to save the refreshed snapshot.
