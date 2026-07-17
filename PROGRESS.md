# Progress

**Last updated:** 2026-07-18

## Current State

Marketing site redesigned to "Editorial Warmth" — see Phase 9 below. All prior phases (1-8b) remain in place; the customer/admin portals were not touched.

## Phase 9 — Editorial Warmth Redesign (2026-07-18)

Feedback: the site felt "robotic — no warmth, no human feel, no luxury." Investigation found the site had zero real imagery anywhere, and the display font (`Instrument Serif`) was referenced in `--font-display` since Phase 2 but never actually installed, so headlines rendered in plain sans the whole time.

**Design tokens (`styles/globals.css`):**
- `Instrument Serif` installed (`@fontsource/instrument-serif`) and actually loaded in `app/layout.tsx`; applied to the hero H1 and every major section heading/pull-quote (fontWeight 400 — it's a single-weight font)
- Warm neutral palette replacing pure black/white/gray: cream/parchment in light mode, warm near-black in dark mode — same variable names (`--bg`, `--text-primary`, etc.), no component changes needed
- New terracotta/bronze "luxury signature" accent replacing flat purple `--color-brand`
- New semantic tokens `--color-success` / `--color-error` / `--color-success-bg` / `--color-error-bg` (warm-toned), replacing ~10 hardcoded hex values across `ProblemSection.tsx`, `ContactForm.tsx`, `ProductPricing.tsx`, `ProductHero.tsx`
- New `--signature-gold` hairline accent token
- `components/ui/GrainOverlay.tsx` — fixed, low-opacity SVG noise texture over the whole viewport

**Imagery:**
- `lib/editorialImages.ts` — centralized curated Unsplash photo URLs (real, standard-license, freely usable), one constant per slot, swap-in-place for real company photography later
- `components/ui/EditorialImage.tsx` — shared `next/image` wrapper applying a consistent warm color-grade filter, rounded frame, shadow, and grain so every photo reads as one art direction
- `next.config.ts` — `images.remotePatterns` allows `images.unsplash.com`
- Added photography to: homepage hero (asymmetric split layout), Problem section, testimonial avatars (replacing initials circles), About hero, About team (new photo grid — previously text-only), product page hero backdrop
- Deliberately left untouched (icon/typography only, no images): products grid, values, stats, how-it-works, FAQ, pricing, closing CTA — per "don't clutter"

**Seasonal FX toggle — defaults OFF (`contexts/seasonal-fx-context.tsx`, new):**
- The seasonal particle/color engine (non-negotiable per CLAUDE.md rules 1-4) is now optional while the redesign is evaluated in demo mode, default OFF
- Mechanism: the 9 `--season-*` UI tokens get a zero-specificity `:where(:root)` fallback in `globals.css` (the fixed luxury palette, `lib/luxuryPalette.ts`) that only applies when `data-season` is absent from `<html>`. A blocking anti-FOUC script in `app/layout.tsx` (same pattern as the existing dark/light `THEME_SCRIPT`) strips the season attributes before first paint unless `localStorage['seasonal-fx'] === 'on'`
- `SeasonalEngine.tsx` only mounts `ParticleCanvas`/`AccumulationCanvas` and only calls `applySeasonColorBlend` while FX is enabled; listens for a `seasonal-fx-change` event to toggle live without a reload
- `LoadingScreen.tsx` skips its internal particle layer when FX is off
- `SeasonAccentWord.tsx` skips its word-infection mask animation when FX is off (renders plain `var(--season-accent)` text)
- Control lives in the existing bottom-right `SeasonDevPanel` — an On/Off switch, not a new UI surface
- Verified: canvases mount/unmount correctly on toggle, zero console errors, confirmed via Playwright in both light and dark mode

**Other polish:**
- `ProductHero.tsx`'s `MockUI` redesigned with a photo backdrop behind it (layered composition) and a small live "Synced" pulse micro-interaction; traffic-light dots now use semantic/signature tokens instead of hardcoded hex
- `Footer.tsx` social links: real minimal SVG icons (X, LinkedIn) replacing letter-avatar placeholders; season easter-egg now hides cleanly instead of defaulting to "Winter" when FX is off
- `Navbar.tsx` mobile backdrop and dropdown shadow warmed from pure black to warm-ink rgba

Build, typecheck, and lint all pass (lint has 2 pre-existing, unrelated issues in `admin-login`/`login` pages not touched by this work). Scope was marketing site only per user decision — customer portal and admin portal unchanged.

---

## Prior state (through Phase 8b)

Phase 4 complete. All legal pages, blog placeholder, full customer portal (dashboard/downloads/billing/settings), auth pages (login/register/forgot-password), and middleware stub are built. No Supabase yet — all portal data is mock.

## Completed Phases

### Phase 1 — Seasonal Engine (2026-05-16)

- Next.js 16 (App Router), TypeScript strict, Tailwind v4, Framer Motion installed
- All CSS token files, lib/seasonal.ts, lib/particles.ts
- SeasonalEngine, LoadingScreen, ParticleCanvas, AccumulationCanvas, AuraLayer

### Phase 2 — Navbar, Footer, Homepage (2026-05-16)

**New files:**
- `lib/products.ts` — product definitions for all 6 products
- `contexts/loading-context.tsx` — loading state shared between SeasonalEngine and HeroSection
- `contexts/theme-context.tsx` — dark/light mode with localStorage persistence + anti-FOUC
- `components/ui/LogoMark.tsx` — shared diamond logomark SVG
- `components/ui/Button.tsx` — primary / secondary / ghost variants, sm/md/lg sizes
- `components/ui/Container.tsx` — max-width 1200px container
- `components/ui/SectionLabel.tsx` — small uppercase section label
- `components/ui/SeasonalDivider.tsx` — gradient divider using season ambient color
- `components/ui/GlassCard.tsx` — glass background card
- `components/ui/ProductCard.tsx` — product card with accent border, hover lift
- `components/ui/ProductIcons.tsx` — SVG icons for all 6 products
- `components/layout/Navbar.tsx` — sticky glass nav, products dropdown, mobile menu, dark toggle
- `components/layout/Footer.tsx` — 4-column footer, season indicator easter egg
- `components/home/HeroSection.tsx` — full viewport hero, word-stagger headline, badge, CTAs
- `components/home/StatementSection.tsx` — centered italic quote
- `components/home/ProductsSection.tsx` — 3×2 product grid with stagger
- `components/home/ProblemSection.tsx` — two-column with animated visual
- `components/home/ValuesSection.tsx` — 3 value blocks
- `components/home/StatsSection.tsx` — 4 stats on brand-colored band with count-up
- `components/home/HowItWorksSection.tsx` — 3 steps with connector line
- `components/home/TestimonialsSection.tsx` — 3 glass cards
- `components/home/ClosingSection.tsx` — dark CTA band

**Updated:**
- `app/layout.tsx` — added ThemeProvider, LoadingProvider, anti-FOUC script
- `components/seasonal/SeasonalEngine.tsx` — uses LoadingContext instead of local state
- `app/page.tsx` — full homepage composition

### Phase 3 — Product Pages, About, Contact (2026-05-16)

**New files:**
- `lib/product-details.ts` — extended product data with features, steps, FAQ, pricing for all 6 products
- `components/product/ProductHero.tsx` — product page hero with MockUI component
- `components/product/ProductProblem.tsx` — "Why it exists" section
- `components/product/ProductFeatures.tsx` — 3-col feature grid with 25+ SVG icon variants
- `components/product/ProductHowItWorks.tsx` — steps with connector lines, dynamic column count
- `components/product/ProductPricing.tsx` — 3-tier pricing cards, LKR pricing, highlighted plan
- `components/product/ProductFAQ.tsx` — accordion with AnimatePresence expand/collapse
- `components/product/ProductCTA.tsx` — closing trial/contact CTA section
- `app/products/[slug]/page.tsx` — dynamic route, generateStaticParams for all 6 slugs
- `app/products/page.tsx` — products index (server component)
- `components/products/ProductsClient.tsx` — client-side hero + grid + trust bar for products index
- `components/about/AboutHero.tsx` — about page hero
- `components/about/AboutMission.tsx` — two-column mission + 4 pillars
- `components/about/AboutValues.tsx` — 6-value grid
- `components/about/AboutTeam.tsx` — team section with contact CTA
- `app/about/page.tsx` — about page composition
- `components/contact/ContactInfo.tsx` — email, location, response time with icons
- `components/contact/ContactForm.tsx` — validated form, name/email/subject/message, mock submit success
- `app/contact/page.tsx` — contact page composition

**Updated:**
- `styles/globals.css` — added `@keyframes spin`, responsive grid helpers, `.sr-only` utility
- `components/home/ClosingSection.tsx` — fixed `<a href="/products">` → `<Link>`
- `components/layout/Navbar.tsx` — fixed 3x `<a href="/products">` → `<Link>`

Build: passing (13 static pages). Typecheck: passing. Lint: passing.

## Completed: Seasonal Visual Polish (2026-05-17)

### Particle system — summer overhaul
- July: monarch/swallowtail butterflies with magical glowing dust trail (DustTrail system)
- June: fireflies active at night + evening; 24 fireflies full-screen
- August: rising embers with maxAge fade-out
- `BUTTERFLY` and `EMBER` shape constants added to particles.ts
- `spawnFromTop: boolean` and `maxAge: number` per-particle properties

### Blend transition timing rework
- Outgoing months (2/5/8/11): secondary particles start after day 20, ramp 0→0.75 by end of month
- Primary particles simultaneously fade 1.0→0.35 via `getPrimaryFade(month, blend)` (exported)
- Incoming months (3/6/9/12): secondary starts at 0.70 blend (matching primaryFade end), tapers to 0 by day 4
- Live blend reading via `data-season-blend` DOM attribute in RAF loop (avoids stale closure)

### SeasonAccentWord infection system
- `components/home/SeasonAccentWord.tsx` — CSS mask-image radial gradient infection effect
- Shows next season's color seeping into specific heading words when blend > 0.01 and month is outgoing
- Applied to: "thrive." (Hero), "started?" (Closing), "working." (Statement), "work." (Values), "business." (Products)

### UI color blend (last 5 days of outgoing months)
- `lib/seasonColors.ts` (new) — PALETTE table for all 9 UI CSS vars per season per mode
- `colorBlend` field added to SeasonState; computed in getSeasonState
- `getInterpolatedColorVars()` — safe for server-side, returns interpolated Record<string, string>
- `applySeasonColorBlend()` — DOM-side, reads data-mode, sets inline CSS vars on `<html>`
- `layout.tsx` — passes initial interpolated vars as style prop on `<html>` (no SSR flash)
- `SeasonalEngine.tsx` — MutationObserver re-applies on dark/light toggle; re-applies on dev override

### Testimonial avatar circles
- Changed from neutral bg-subtle/border/text-muted to season-glow-soft/season-card-border/season-accent

### Navbar dropdown fix
- "View all products" link changed from --color-brand to --season-accent

### Phase 4 — Legal, Blog, Customer Portal, Auth (2026-05-17)

**New files:**
- `components/legal/LegalLayout.tsx` — shared legal page wrapper
- `app/legal/privacy/page.tsx` — 10-section Privacy Policy
- `app/legal/terms/page.tsx` — 14-section Terms of Service
- `app/blog/page.tsx` + `app/blog/BlogClient.tsx` — blog placeholder with notify form
- `components/portal/PortalSidebar.tsx` — sticky portal sidebar with nav, user badge, sign-out
- `app/(portal)/layout.tsx` — portal route group layout (bypasses loading screen)
- `app/(portal)/dashboard/page.tsx` — license cards with reveal/copy, account summary
- `app/(portal)/downloads/page.tsx` — download cards with checksums + installation help accordion
- `app/(portal)/billing/page.tsx` — plan cards, payment history table (coming-soon notice)
- `app/(portal)/settings/page.tsx` — profile/security/notifications toggles/danger zone
- `app/login/page.tsx` — sign-in form
- `app/register/page.tsx` — create account form with show/hide password toggle
- `app/forgot-password/page.tsx` — email reset form with success state
- `apps/web/middleware.ts` — subdomain routing stub

**Updated:**
- `styles/globals.css` — added `.legal-content` styles (h2/p/ul/ol/a)

Build: passing. Typecheck: passing. Lint: passing.

### Phase 5 — Supabase Integration (2026-05-17)

**New files:**
- `lib/supabase/client.ts` — `createBrowserClient` wrapper (for 'use client' components)
- `lib/supabase/server.ts` — async `createServerClient` with `cookies()` (for server components/route handlers)
- `.env.local.example` — environment variable template
- `app/auth/callback/route.ts` — OAuth/email verification code exchange → redirects to /dashboard
- `app/verify-email/page.tsx` — post-register email verification pending screen with resend button
- `app/update-password/page.tsx` — set new password after reset link (calls `supabase.auth.updateUser`)
- `app/(portal)/dashboard/LicenseCard.tsx` — client component extracted from dashboard; handles reveal/copy key, status badge, disabled download for expired licenses
- `app/(portal)/settings/SettingsClient.tsx` — client component; notification toggles persist via `supabase.from('notification_prefs').upsert()`; change password triggers `resetPasswordForEmail()`

**Updated:**
- `middleware.ts` — real `@supabase/ssr` session check; `app.*` subdomain redirects: unauthenticated → /login, authenticated on auth page → /dashboard
- `app/login/page.tsx` — `supabase.auth.signInWithPassword()`, error messages (invalid credentials / unverified email / rate limit), loading state, redirect to /dashboard
- `app/register/page.tsx` — `supabase.auth.signUp()` with `emailRedirectTo`, inserts `user_profiles` row, redirects to /verify-email
- `app/forgot-password/page.tsx` — `supabase.auth.resetPasswordForEmail()` with `redirectTo=/auth/callback?next=/update-password`
- `app/(portal)/layout.tsx` — fetches user display name via browser client on mount, passes to PortalSidebar
- `components/portal/PortalSidebar.tsx` — accepts `displayName` prop, real sign-out via `supabase.auth.signOut()` + router.push('/login')
- `app/(portal)/dashboard/page.tsx` — server component; fetches licenses + user profile from Supabase; shows empty state with "Browse products" CTA; real member-since date
- `app/(portal)/settings/page.tsx` — server component; fetches user_profiles + notification_prefs; passes to SettingsClient
- `app/(portal)/billing/page.tsx` — server component; fetches licenses + payment_history; shows real payment history table with refunded status

Build: passing. Typecheck: passing. Lint: passing.
Dashboard + settings + billing are live server components. Downloads remains client-side mock (app_versions table not yet seeded).

### Phase 5b — Resend + Downloads (2026-05-17)

**New files:**
- `app/api/contact/route.ts` — Resend integration for contact form (sends to support@thraive.com)
- `supabase/migrations/001_app_versions.sql` — app_versions table + seed data for all 6 products
- `app/(portal)/downloads/DownloadsClient.tsx` — extracted client component (checksum accordion, download links)

**Updated:**
- `components/contact/ContactForm.tsx` — real POST /api/contact call, server error display
- `app/(portal)/downloads/page.tsx` — converted to server component; fetches app_versions filtered to user's active licenses

### Phase 6 — Admin Portal (2026-05-17)

**New files:**
- `app/admin-login/page.tsx` — staff-only login (no register, no self-serve forgot password)
- `components/admin/AdminSidebar.tsx` — always-dark sidebar with role-based nav (Staff nav item superadmin only)
- `app/(admin)/layout.tsx` — always-dark via useEffect, staff auth verification, loading state
- `app/(admin)/admin-dashboard/page.tsx` + `AdminDashboardClient.tsx` — stats cards, recharts revenue line chart, recent signups, expiring soon, product breakdown
- `app/(admin)/customers/page.tsx` — paginated customer list with name search
- `app/(admin)/customers/[id]/page.tsx` + `CustomerActionsClient.tsx` — customer detail with licenses, payment history, admin notes
- `app/(admin)/licenses/page.tsx` — all licenses with product/status/billing filters
- `app/(admin)/devices/page.tsx` — all registered devices
- `app/(admin)/payments/page.tsx` — payment history with monthly summary bar
- `app/(admin)/subscriptions/page.tsx` — active subscriptions with MRR estimate
- `app/(admin)/products/page.tsx` — product catalog view
- `app/(admin)/app-versions/page.tsx` — version manifest grouped by product
- `app/(admin)/staff/page.tsx` — staff management (superadmin only, redirects others)
- `app/(admin)/audit-log/page.tsx` — read-only paginated audit log

**Updated:**
- `middleware.ts` — admin.* subdomain staff table check, x-staff-role header injection

**Supabase schema needed:**
```sql
CREATE TABLE staff (id uuid PRIMARY KEY REFERENCES auth.users(id), full_name text NOT NULL, role text NOT NULL CHECK (role IN ('superadmin','admin','support','finance')), is_active boolean DEFAULT true, created_at timestamptz DEFAULT now(), last_login timestamptz);
CREATE TABLE audit_log (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), staff_id uuid REFERENCES staff(id), action text NOT NULL, target_type text, target_id text, details jsonb, created_at timestamptz DEFAULT now());
CREATE TABLE customer_notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_id uuid REFERENCES auth.users(id), staff_id uuid REFERENCES staff(id), note text NOT NULL, created_at timestamptz DEFAULT now());
ALTER TABLE user_profiles ADD COLUMN stripe_customer_id text;
```

### Phase 7 — Stripe Integration (2026-05-17)

**New files:**
- `lib/license.ts` — generateLicenseKey with product-specific prefixes (WLDC/SMPS/PHRM/RTFL/ASVR/SNRA)
- `lib/resend.ts` — sendLicenseEmail, sendPaymentFailedEmail, sendRenewalReminderEmail
- `app/api/checkout/route.ts` — Stripe checkout session (get/create customer, resolve price ID from env vars)
- `app/api/webhooks/stripe/route.ts` — 5 event handlers (checkout.session.completed, invoice.payment_succeeded, invoice.payment_failed, customer.subscription.deleted, customer.subscription.updated); Stripe v22 compatible
- `app/api/billing-portal/route.ts` — Stripe billing portal redirect
- `app/(portal)/billing/ManageBillingButton.tsx` — client component for billing portal redirect

**Updated:**
- `components/product/ProductPricing.tsx` — real checkout buttons with billing cycle toggle (monthly/annual/lifetime); Custom plan links to /contact; non-logged-in users stored in sessionStorage and redirected to register
- `app/(portal)/billing/page.tsx` — ManageBillingButton added; removed "coming soon" banner

**Env vars required:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@thraive.com
STRIPE_WILDCAFE_STARTER_MONTHLY_PRICE_ID=price_xxx
# ... etc for all product/plan/billing combos
```

### Phase 8 — SEO (2026-05-17)

**New files:**
- `app/robots.txt/route.ts` — robots.txt with disallow for portal/admin/auth paths, sitemap URL
- `app/sitemap.xml/route.ts` — sitemap with all public pages (home, products, product slugs, about, contact, blog, legal)

**Updated:**
- `app/layout.tsx` — metadataBase, title template (`%s — Thraive Labs`), OpenGraph defaults, Twitter card, robots default
- `app/page.tsx` — page-level metadata with OpenGraph

### Phase 8b — Accessibility Audit (2026-05-17)

**Fixed:**
- Removed `outline: 'none'` from all inline input/select/textarea styles (11 files) — was suppressing `:focus-visible` ring (WCAG 2.4.7)
- Added `id` prop to `FieldError` in ContactForm so `aria-describedby` references resolve in the DOM
- Added `aria-describedby` to select and textarea in ContactForm
- Added `role="alert"` to error message divs in login, register, forgot-password, update-password pages so screen readers announce errors
- Added `aria-controls` + `id` to ProductFAQ accordion buttons and panels (`role="region"` + `aria-labelledby`)
- Added `aria-controls="products-dropdown"` to Navbar dropdown trigger; added `id="products-dropdown"` to the dropdown
- Added `@media (prefers-reduced-motion: reduce)` block to globals.css disabling CSS transitions/animations

Build: passing. Typecheck: passing. Lint: passing.

## State as of Phase 8b (superseded by Phase 9 above)

Phases 5b, 6, 7, 8, and 8b complete. Full application is built:
- Marketing site with seasonal engine
- Customer portal with Supabase auth and real data
- Admin portal with staff auth, all management pages, recharts dashboard
- Stripe checkout, webhook handling, billing portal
- Resend contact form + license/payment emails
- robots.txt and sitemap.xml

**To activate Stripe:** Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_*_PRICE_IDs to .env.local and run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local testing.

**To activate admin portal:** Create staff accounts via Supabase Auth, then INSERT into the staff table with appropriate roles.

## Known Issues

- Downloads page shows "No active licenses" if no licenses exist in Supabase yet (expected behavior).
- Footer season indicator reads `document.documentElement` directly — could flash on SSR. Simple fix: use a `useEffect` to read after mount (low priority, already handled).
- `color-mix()` used in section backgrounds — may need fallback for very old browsers.
