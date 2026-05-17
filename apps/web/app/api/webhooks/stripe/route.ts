import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { generateLicenseKey } from '@/lib/license'
import { sendLicenseEmail, sendPaymentFailedEmail } from '@/lib/resend'

// Lazy-initialized to avoid build-time env var requirement
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// Service role — webhooks run outside user session
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Stripe v22: period end is on subscription items, not the subscription itself
function getSubPeriodEnd(sub: Stripe.Subscription): Date {
  const periodEnd = sub.items.data[0]?.current_period_end ?? sub.cancel_at ?? 0
  const d = new Date(periodEnd * 1000)
  d.setDate(d.getDate() + 3) // 3-day grace period
  return d
}

// Stripe v22: subscription ID is on invoice.parent.subscription_details
function getInvoiceSubId(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent
  if (!parent || parent.type !== 'subscription_details') return null
  const sd = parent.subscription_details
  if (!sd) return null
  const sub = sd.subscription
  return typeof sub === 'string' ? sub : sub?.id ?? null
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
      break

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
      break

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice)
      break

    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object as Stripe.Subscription)
      break

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break
  }

  return new Response('OK', { status: 200 })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = getSupabase()
  const { supabase_user_id, product, plan, billing_type } = session.metadata!

  const licenseKey = generateLicenseKey(product)

  let expiresAt: string | null = null
  let stripeSubId: string | null = null

  if (billing_type === 'subscription' && session.subscription) {
    const stripe = getStripe()
    const sub = await stripe.subscriptions.retrieve(
      typeof session.subscription === 'string' ? session.subscription : session.subscription.id
    )
    const grace = getSubPeriodEnd(sub)
    expiresAt = grace.toISOString()
    stripeSubId = sub.id
  }

  const { data: license } = await supabase
    .from('licenses')
    .insert({
      user_id: supabase_user_id,
      product,
      plan,
      billing_type,
      license_key: licenseKey,
      status: 'active',
      stripe_sub_id: stripeSubId,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (!license) return

  await supabase.from('payment_history').insert({
    user_id: supabase_user_id,
    license_id: license.id,
    amount_cents: session.amount_total,
    currency: 'LKR',
    stripe_payment_id: session.payment_intent as string | null,
    status: 'paid',
    paid_at: new Date().toISOString(),
  })

  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(supabase_user_id)

  if (user?.email) {
    await sendLicenseEmail({
      to: user.email,
      product,
      plan,
      licenseKey,
      downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/downloads`,
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const supabase = getSupabase()
  const subId = getInvoiceSubId(invoice)
  if (!subId) return

  const sub = await getStripe().subscriptions.retrieve(subId)
  const grace = getSubPeriodEnd(sub)

  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_sub_id', sub.id)
    .single()

  if (!license) return

  await supabase
    .from('licenses')
    .update({ status: 'active', expires_at: grace.toISOString() })
    .eq('id', license.id)

  await supabase.from('payment_history').insert({
    user_id: license.user_id,
    license_id: license.id,
    amount_cents: invoice.amount_paid,
    currency: 'LKR',
    stripe_payment_id: invoice.id, // invoice ID as reference in v22
    status: 'paid',
    paid_at: new Date().toISOString(),
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = getSupabase()
  const subId = getInvoiceSubId(invoice)
  if (!subId) return

  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('stripe_sub_id', subId)
    .single()

  if (!license) return

  const grace = new Date()
  grace.setDate(grace.getDate() + 3)

  await supabase
    .from('licenses')
    .update({ status: 'active', expires_at: grace.toISOString() })
    .eq('id', license.id)

  await supabase.from('payment_history').insert({
    user_id: license.user_id,
    license_id: license.id,
    amount_cents: invoice.amount_due,
    currency: 'LKR',
    stripe_payment_id: invoice.id,
    status: 'failed',
    paid_at: null,
  })

  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(license.user_id as string)

  if (user?.email) {
    await sendPaymentFailedEmail({
      to: user.email,
      product: license.product as string,
      gracePeriodEnd: grace.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const supabase = getSupabase()
  const { data: license } = await supabase
    .from('licenses')
    .select('id')
    .eq('stripe_sub_id', subscription.id)
    .single()

  if (!license) return

  const periodEnd = subscription.items.data[0]?.current_period_end ?? 0

  await supabase
    .from('licenses')
    .update({
      status: 'cancelled',
      expires_at: new Date(periodEnd * 1000).toISOString(),
    })
    .eq('id', license.id)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = getSupabase()
  const { data: license } = await supabase
    .from('licenses')
    .select('id')
    .eq('stripe_sub_id', subscription.id)
    .single()

  if (!license) return

  const grace = getSubPeriodEnd(subscription)

  await supabase
    .from('licenses')
    .update({
      status: subscription.status === 'active' ? 'active' : subscription.status,
      expires_at: grace.toISOString(),
    })
    .eq('id', license.id)
}
