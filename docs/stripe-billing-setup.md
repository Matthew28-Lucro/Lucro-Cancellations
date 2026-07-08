# Stripe Billing Dashboard Setup

The Billing Dashboard is wired to `/api/billing-summary`.

## Current behavior

- Without Stripe environment variables, the dashboard uses local mock data.
- With `STRIPE_SECRET_KEY` configured in Vercel, `/api/billing-summary` reads subscriptions, customers, and invoices from Stripe on the server.
- The browser never receives the Stripe key.
- The page refreshes billing data every five minutes while open.

## Vercel environment variables

Add these in Vercel Project Settings > Environment Variables:

```text
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

Do not prefix these with `VITE_`. Vite exposes `VITE_*` variables to browser code.

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

## Next database step

The webhook currently verifies events and acknowledges them. The next production step is to persist a clean billing snapshot in a database, then have `/api/billing-summary` read from that database instead of querying Stripe every page load.
