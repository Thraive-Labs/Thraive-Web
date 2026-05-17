import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function lookupPriceId(product: string, plan: string, billingType: string): string | undefined {
  // e.g. STRIPE_WILDCAFE_STARTER_MONTHLY_PRICE_ID
  const suffix = billingType === 'one_time' ? 'ONETIME' : billingType === 'annual' ? 'ANNUAL' : 'MONTHLY'
  const key = `STRIPE_${product.toUpperCase()}_${plan.toUpperCase()}_${suffix}_PRICE_ID`
  return process.env[key]
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { priceId, product, plan, billingType } = body as Record<string, string>

  if (!product || !plan || !billingType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Accept explicit priceId or look up from env vars
  const resolvedPriceId: string = priceId ?? lookupPriceId(product, plan, billingType) ?? ''

  if (!resolvedPriceId) {
    return NextResponse.json({ error: 'Price not configured for this plan' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get or create Stripe customer for this user
  let stripeCustomerId: string

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (profile?.stripe_customer_id) {
    stripeCustomerId = profile.stripe_customer_id as string
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    stripeCustomerId = customer.id
    await supabase
      .from('user_profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: billingType === 'one_time' ? 'payment' : 'subscription',
    line_items: [{ price: resolvedPriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&product=${product}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product}?checkout=cancelled`,
    metadata: {
      supabase_user_id: user.id,
      product,
      plan,
      billing_type: billingType,
    },
    billing_address_collection: 'auto',
  })

  return NextResponse.json({ url: session.url })
}
