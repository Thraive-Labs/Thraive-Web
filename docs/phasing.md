# Build Phases

Build in this order. End-of-phase review mandatory before moving forward.

---

## Phase 1 — Seasonal Engine ✓ COMPLETE

## Phase 2 — Homepage ✓ COMPLETE

## Phase 3 — Product Pages, About, Contact ✓ COMPLETE

## Phase 4 — Legal, Blog, Customer Portal, Auth ✓ COMPLETE

## Phase 5 — Supabase Integration ✓ COMPLETE

---

## Phase 5b — Remaining Loose Ends

Small items left over from Phases 4-5. Do these before Phase 6.

```
Contact form Resend wiring:
  - Install Resend SDK
  - Create app/api/contact/route.ts
  - POST handler: validate fields, send email via Resend to support@thraive.com
  - Update ContactForm.tsx to call /api/contact instead of mock
  - Success/error state already built — just wire the API call

Downloads page app_versions seeding:
  - Create app_versions table in Supabase (see portal.md schema)
  - Seed with current versions for all 6 products
  - Update downloads/page.tsx to fetch from Supabase instead of mock data

Footer season indicator SSR flash fix:
  - Wrap season indicator text in useEffect to read after mount
  - Show nothing on first render, then show season name

Footer social links:
  - Add real social links (Twitter/X, LinkedIn, GitHub)
  - Currently placeholder hrefs
```

---

## Phase 6 — Admin Portal

Read `docs/admin.md` fully before starting.

```
Middleware update:
  - admin.* subdomain: check staff table after Supabase session
  - Inject x-staff-role header for server components
  - /admin-login route accessible without session

Auth:
  - app/admin-login/page.tsx — staff login form
  - Supabase signInWithPassword + staff table check
  - Redirect to /admin/dashboard on success

Admin layout:
  - app/(admin)/layout.tsx — dark always, admin sidebar
  - components/admin/AdminSidebar.tsx — role-based nav items

Admin pages (all server components, fetch with service role):
  - app/(admin)/dashboard/page.tsx — 4 stat cards + revenue chart + recent signups
  - app/(admin)/customers/page.tsx — paginated table with search + filter
  - app/(admin)/customers/[id]/page.tsx — customer detail + licenses + payments + notes
  - app/(admin)/licenses/page.tsx — all licenses table with filters
  - app/(admin)/devices/page.tsx — all devices table
  - app/(admin)/payments/page.tsx — all payments table + summary bar
  - app/(admin)/subscriptions/page.tsx — active subscriptions + MRR
  - app/(admin)/products/page.tsx — edit product catalog
  - app/(admin)/versions/page.tsx — app version management (CRUD)
  - app/(admin)/staff/page.tsx — staff management (superadmin only)
  - app/(admin)/audit/page.tsx — audit log table

Admin API routes:
  - app/api/admin/customers/[id]/extend-trial/route.ts
  - app/api/admin/customers/[id]/suspend/route.ts
  - app/api/admin/customers/[id]/notes/route.ts
  - app/api/admin/licenses/[id]/revoke/route.ts
  - app/api/admin/licenses/[id]/reset-key/route.ts
  - app/api/admin/versions/route.ts (CRUD)
  - app/api/admin/staff/route.ts (CRUD, superadmin only)

All admin mutations write to audit_log table.
All admin API routes verify x-staff-role header before executing.
```

---

## Phase 7 — Stripe Integration

Read `docs/stripe.md` fully before starting.

```
Environment setup:
  - Add all Stripe env vars to .env.local and Vercel
  - Set up Stripe webhook in Stripe Dashboard
  - Add stripe_customer_id column to user_profiles

Stripe products/prices:
  - Create Stripe products and prices for all 6 products
  - Store Price IDs in environment variables or Supabase products table

Checkout flow:
  - app/api/checkout/route.ts — create Stripe Checkout Session
  - Handle unauthenticated users: save intended purchase, redirect to register
  - Success redirect to /dashboard with success toast
  - Cancel redirect back to product page

Webhook handler:
  - app/api/webhooks/stripe/route.ts — all 5 event types
  - checkout.session.completed → provision license + send email
  - invoice.payment_succeeded → extend subscription expiry
  - invoice.payment_failed → set grace period + send email
  - customer.subscription.deleted → mark cancelled
  - customer.subscription.updated → sync plan changes

Billing portal:
  - app/api/billing-portal/route.ts
  - Wire "Manage billing" button in /billing page

Resend email templates:
  - License delivery (sent on checkout.session.completed)
  - Renewal reminder (scheduled 7 days before expiry — use Supabase pg_cron or external cron)
  - Payment failed notification

ProductPricing.tsx updates:
  - Real checkout buttons replacing placeholders
  - Monthly/annual billing toggle
  - Correct Price IDs per product per plan per billing cycle

Testing:
  - Full test checklist from stripe.md before going live
  - Test with Stripe test mode cards
  - Verify webhook signatures work
  - Verify license created in Supabase after checkout
  - Verify email delivered via Resend
```

---

## Phase 8 — Final Polish and Launch Prep

```
SEO:
  - Metadata for all pages (title, description, og:image)
  - robots.txt and sitemap.xml
  - og:image for each product page (auto-generated or static)

Performance:
  - Lighthouse audit on homepage, product pages, portal
  - Target: > 90 on all pages
  - Optimize any images (use Next.js Image component everywhere)
  - Verify particles stay at 60fps on mid-range hardware
  - Bundle size audit

Accessibility:
  - Full keyboard navigation audit
  - Screen reader test on homepage
  - Color contrast verification

Domain and DNS:
  - Point thraive.com to Vercel
  - Set up app.thraive.com subdomain
  - Set up admin.thraive.com subdomain
  - SSL auto-configured by Vercel

Vercel configuration:
  - All environment variables set in Vercel dashboard
  - Vercel project linked to repo
  - Preview deployments for PRs enabled

Supabase production setup:
  - All tables created with RLS
  - app_versions table seeded for all 6 products
  - Email templates configured (from Supabase Auth settings)
  - Backup enabled

Monitoring:
  - Vercel Analytics enabled
  - Error tracking (optional: Sentry)
  - Uptime monitoring (optional: Better Uptime)

Pre-launch checklist:
  [ ] All pages load without errors
  [ ] Seasonal engine works correctly for current month
  [ ] Loading screen animates and exits correctly
  [ ] Dark mode toggle works
  [ ] All product pages have correct content
  [ ] Contact form sends emails
  [ ] Registration flow works end to end
  [ ] Purchase flow works (Stripe test mode)
  [ ] License key delivered by email after purchase
  [ ] Portal dashboard shows correct license data
  [ ] Downloads page shows correct versions
  [ ] Admin portal login works
  [ ] Mobile responsive on all pages
  [ ] All footer links work (no 404s)
  [ ] Privacy policy and terms accessible
  [ ] HTTPS on all subdomains
```
