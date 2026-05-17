# Stripe Integration

Full payment processing for all Thraive Labs products. One Stripe account handles all 6 products.

---

## Architecture

```
Customer visits product pricing page
  → clicks "Buy" or "Subscribe"
  → Next.js API route creates Stripe Checkout Session
  → customer redirected to Stripe-hosted checkout
  → payment completed
  → Stripe sends webhook to /api/webhooks/stripe
  → webhook handler provisions license in Supabase
  → email sent to customer via Resend (license key + download link)
  → customer redirected to app.thraive.com/dashboard
```

Stripe is used for:
- One-time payments (lifetime licenses)
- Monthly/annual subscriptions
- Customer billing portal (manage card, cancel, view invoices)

Stripe is NOT used for:
- Authentication (that's Supabase)
- License storage (that's Supabase)
- Email delivery (that's Resend)

---

## Stripe Products and Prices

Create these in Stripe Dashboard before wiring the integration.

### One product per Thraive product, multiple prices per product:

```
WildCafe POS
  Price: wildcafe_starter_onetime     LKR 15,000  one-time
  Price: wildcafe_starter_monthly     LKR 1,500   /month
  Price: wildcafe_starter_annual      LKR 14,400  /year
  Price: wildcafe_business_onetime    LKR 35,000  one-time
  Price: wildcafe_business_monthly    LKR 3,000   /month
  Price: wildcafe_business_annual     LKR 28,800  /year

SmartPOS
  (same price structure, different amounts)

Pharmacy POS
  (same)

RouteFlow
  (same)

AutoServ
  (same)

Sonara
  Price: sonara_pro_monthly           LKR 1,200   /month
  Price: sonara_pro_annual            LKR 9,600   /year
  (Sonara is freemium — no one-time option)
```

Store Stripe Price IDs in environment variables:
```
STRIPE_WILDCAFE_STARTER_ONETIME_PRICE_ID=price_xxx
STRIPE_WILDCAFE_STARTER_MONTHLY_PRICE_ID=price_xxx
...etc
```

Or fetch them dynamically from Stripe API at build time and store in Supabase `products` table.

---

## Checkout Flow

### API Route: POST /api/checkout

```typescript
// app/api/checkout/route.ts

import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { priceId, product, plan, billingType } = await req.json()

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get or create Stripe customer for this user
  let stripeCustomerId: string

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', user!.id)
    .single()

  if (profile?.stripe_customer_id) {
    stripeCustomerId = profile.stripe_customer_id
  } else {
    const customer = await stripe.customers.create({
      email: user!.email,
      metadata: { supabase_user_id: user!.id }
    })
    stripeCustomerId = customer.id
    await supabase.from('user_profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', user!.id)
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: billingType === 'one_time' ? 'payment' : 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&product=${product}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product}?checkout=cancelled`,
    metadata: {
      supabase_user_id: user!.id,
      product,
      plan,
      billing_type: billingType,
    },
    // Collect billing address for invoice
    billing_address_collection: 'auto',
  })

  return Response.json({ url: session.url })
}
```

### Pricing page button behavior

```typescript
// In ProductPricing.tsx or product page

async function handleCheckout(priceId: string, product: string, plan: string, billingType: string) {
  setLoading(true)
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, product, plan, billingType })
  })
  const { url } = await res.json()
  window.location.href = url
}
```

If user is not logged in when clicking Buy:
- Store intended purchase in sessionStorage: `{ priceId, product, plan, billingType }`
- Redirect to /register with `?redirect=checkout`
- After registration/login, check sessionStorage and resume checkout automatically

---

## Webhook Handler

This is the most critical piece. Everything flows from here.

### API Route: POST /api/webhooks/stripe

```typescript
// app/api/webhooks/stripe/route.ts

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendLicenseEmail } from '@/lib/resend'
import { generateLicenseKey } from '@/lib/license'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Use service role key here — webhooks run outside user session
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      await handleCheckoutComplete(session)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      await handlePaymentSucceeded(invoice)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await handlePaymentFailed(invoice)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionCancelled(subscription)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionUpdated(subscription)
      break
    }
  }

  return new Response('OK', { status: 200 })
}
```

### Handler: checkout.session.completed

Fires when customer completes payment. Provision the license.

```typescript
async function handleCheckoutComplete(session: Stripe.CheckoutSession) {
  const { supabase_user_id, product, plan, billing_type } = session.metadata!

  // Generate license key
  const licenseKey = generateLicenseKey(product)
  // Format: WLDC-XXXX-XXXX-XXXX for WildCafe, SMPS-XXXX-... etc.

  // Determine expiry
  let expiresAt: string | null = null
  let stripeSubId: string | null = null

  if (billing_type === 'subscription' && session.subscription) {
    const sub = await stripe.subscriptions.retrieve(session.subscription as string)
    expiresAt = new Date(sub.current_period_end * 1000).toISOString()
    // Add 3-day grace period
    const grace = new Date(sub.current_period_end * 1000)
    grace.setDate(grace.getDate() + 3)
    expiresAt = grace.toISOString()
    stripeSubId = sub.id
  }

  // Create license in Supabase
  const { data: license } = await supabase.from('licenses').insert({
    user_id: supabase_user_id,
    product,
    plan,
    billing_type,
    license_key: licenseKey,
    status: 'active',
    stripe_sub_id: stripeSubId,
    expires_at: expiresAt,
  }).select().single()

  // Record payment
  await supabase.from('payment_history').insert({
    user_id: supabase_user_id,
    license_id: license.id,
    amount_cents: session.amount_total!,
    currency: 'LKR',
    stripe_payment_id: session.payment_intent as string,
    status: 'paid',
    paid_at: new Date().toISOString(),
  })

  // Get user email
  const { data: { user } } = await supabase.auth.admin.getUserById(supabase_user_id)

  // Send welcome email with license key
  await sendLicenseEmail({
    to: user!.email!,
    product,
    plan,
    licenseKey,
    downloadUrl: `https://app.thraive.com/downloads`,
    portalUrl: `https://app.thraive.com/dashboard`,
  })
}
```

### Handler: invoice.payment_succeeded

Fires on subscription renewal. Update expiry date.

```typescript
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return // not a subscription invoice

  const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)

  // Find license by stripe_sub_id
  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_sub_id', sub.id)
    .single()

  if (!license) return

  // Extend expiry
  const grace = new Date(sub.current_period_end * 1000)
  grace.setDate(grace.getDate() + 3)

  await supabase.from('licenses').update({
    status: 'active',
    expires_at: grace.toISOString(),
  }).eq('id', license.id)

  // Record payment
  await supabase.from('payment_history').insert({
    user_id: license.user_id,
    license_id: license.id,
    amount_cents: invoice.amount_paid,
    currency: 'LKR',
    stripe_payment_id: invoice.payment_intent as string,
    status: 'paid',
    paid_at: new Date().toISOString(),
  })
}
```

### Handler: invoice.payment_failed

Fires when subscription renewal fails. Give 3-day grace.

```typescript
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_sub_id', invoice.subscription as string)
    .single()

  if (!license) return

  // Set expiry to now + 3 days grace period
  const grace = new Date()
  grace.setDate(grace.getDate() + 3)

  await supabase.from('licenses').update({
    status: 'active',  // still active, grace period
    expires_at: grace.toISOString(),
  }).eq('id', license.id)

  // Record failed payment
  await supabase.from('payment_history').insert({
    user_id: license.user_id,
    license_id: license.id,
    amount_cents: invoice.amount_due,
    currency: 'LKR',
    stripe_payment_id: invoice.payment_intent as string ?? null,
    status: 'failed',
    paid_at: null,
  })

  // Send payment failed email via Resend
  // user will see expired state after grace period
}
```

### Handler: customer.subscription.deleted

Fires when subscription is cancelled (immediately or at period end).

```typescript
async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_sub_id', subscription.id)
    .single()

  if (!license) return

  await supabase.from('licenses').update({
    status: 'cancelled',
    expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
  }).eq('id', license.id)
}
```

---

## License Key Generator

```typescript
// lib/license.ts

const PRODUCT_PREFIXES: Record<string, string> = {
  wildcafe:  'WLDC',
  smartpos:  'SMPS',
  pharmacy:  'PHRM',
  routeflow: 'RTFL',
  autoserv:  'ASVR',
  sonara:    'SNRA',
}

function randomSegment(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no confusable chars
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function generateLicenseKey(product: string): string {
  const prefix = PRODUCT_PREFIXES[product] ?? 'THRV'
  return `${prefix}-${randomSegment()}-${randomSegment()}-${randomSegment()}`
}
```

---

## Stripe Customer Portal

For subscription management (cancel, change card, view invoices).

```typescript
// app/api/billing-portal/route.ts

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', user!.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return Response.json({ error: 'No billing account found' }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  })

  return Response.json({ url: session.url })
}
```

In billing page:
```typescript
async function handleManageBilling() {
  const res = await fetch('/api/billing-portal', { method: 'POST' })
  const { url } = await res.json()
  window.location.href = url
}
```

---

## Resend Email Templates

### License Delivery Email

Sent immediately after successful purchase.

```
Subject: Your [Product Name] license is ready

Hi [name],

Your purchase is confirmed. Here's everything you need to get started.

LICENSE KEY
[WLDC-XXXX-XXXX-XXXX]  ← large, monospace, easy to copy

DOWNLOAD
[Download [Product Name] for Windows →]
[Download [Product Name] for Android →]

ACTIVATE
1. Install the software using the downloaded installer
2. Open the app — you'll be prompted to enter your license key
3. Enter the key above and click Activate
4. You're ready to go

Manage your license anytime at app.thraive.com/dashboard

Questions? Reply to this email or contact support@thraive.com

Thraive Labs
```

### Renewal Reminder Email (7 days before)

```
Subject: Your [Product Name] subscription renews in 7 days

Hi [name],

Your [Product Name] subscription renews on [date] for LKR [amount].

If you'd like to cancel or update your payment method:
[Manage billing →]

Questions? support@thraive.com

Thraive Labs
```

### Payment Failed Email

```
Subject: Action needed: payment failed for [Product Name]

Hi [name],

We couldn't process your subscription payment for [Product Name].
Your access will continue for 3 days while you update your payment method.

[Update payment method →]

If you don't update by [date], your access will pause.

Questions? support@thraive.com

Thraive Labs
```

---

## Environment Variables Required

```
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Supabase (service role for webhooks)
SUPABASE_SERVICE_ROLE_KEY=...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@thraive.com

# URLs
NEXT_PUBLIC_SITE_URL=https://thraive.com
NEXT_PUBLIC_APP_URL=https://app.thraive.com
```

---

## Stripe Webhook Setup

In Stripe Dashboard → Developers → Webhooks:

```
Endpoint URL: https://thraive.com/api/webhooks/stripe

Events to listen for:
  checkout.session.completed
  invoice.payment_succeeded
  invoice.payment_failed
  customer.subscription.deleted
  customer.subscription.updated
```

For local development use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Schema Updates for Stripe

Add `stripe_customer_id` to user_profiles:

```sql
ALTER TABLE user_profiles ADD COLUMN stripe_customer_id text;
```

---

## Pricing Page Updates

When Stripe is integrated, update ProductPricing.tsx:

- Replace placeholder buttons with real checkout buttons
- Pass the correct Stripe Price ID for each plan/billing cycle combination
- Show "Billed monthly" / "Billed annually (save 20%)" toggle
- Show LKR amounts (fetch from Stripe or hardcode from env)
- "Most popular" badge on Business plan
- Free trial logic: if product has trial, add `trial_period_days` to checkout session

---

## Testing Checklist

Before going live:

```
[ ] Test card: 4242 4242 4242 4242 (success)
[ ] Test card: 4000 0000 0000 0002 (decline)
[ ] Test card: 4000 0025 0000 3155 (3D Secure)
[ ] One-time purchase: license created, email sent, dashboard shows license
[ ] Subscription: license created, expiry set correctly
[ ] Subscription renewal: expiry extended, payment recorded
[ ] Payment failure: grace period set, email sent
[ ] Cancellation: license status updated to cancelled
[ ] Webhook signature: invalid signature returns 400
[ ] Portal redirect: clicking manage billing goes to Stripe portal
[ ] Return from portal: returns to /billing correctly
```
