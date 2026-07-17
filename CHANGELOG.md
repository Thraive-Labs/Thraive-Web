# Changelog

Entries are newest-first.

---

## 2026-07-18 — Phase 9k (Remove cycling word + grid background)

Feedback: the cycling word wasn't good, remove it; the checker-pattern
background wasn't good either.

- Removed `CyclingWord` entirely. Subtext is now a plain static sentence:
  "Built for restaurants, pharmacies, retail shops, and garages across Sri
  Lanka. Offline-first, so a power cut is never a crisis." — keeps the more
  specific, less generic copy from 9j, loses the animation.
- Removed the grid-pattern background div entirely. Only the soft radial
  glow remains behind the hero content.
- The ambient photo-breathing motion (9j) was not called out and stays.

## 2026-07-18 — Phase 9j (Hero: ambient motion + cycling word for real life)

Feedback: the hero feels lifeless — images/layout fine, but everything
animates in once on load and then sits static, and the left-column copy
reads as generic feature-list text with no voice.

### feat: primary hero photo breathes continuously
- Restructured into a static outer frame (shadow, stays put) with a slow
  inner scale animation (1 → 1.035 → 1 over 10s, ease-in-out, infinite) —
  a near-imperceptible ambient zoom, not the earlier full Ken Burns pass.
  Respects `prefers-reduced-motion` (no animation, static frame only).
  Secondary overlapping photo stays static for hierarchy/contrast.

### feat: cycling word replaces the generic subtext
- New `CyclingWord` component: crossfades through "restaurants", "pharmacies",
  "retail shops", "garages", "delivery teams" every 2.2s (`AnimatePresence`,
  vertical slide, season-accent colored). Static under reduced motion (shows
  first word, no interval).
- Subtext rewritten around it: "Built for **[[cycling word]]** across Sri
  Lanka. Offline-first, so a power cut is never a crisis." — replaces
  "Offline-first business software for restaurants, pharmacies, and shops
  across Sri Lanka. Built for this market." (generic, no voice) with
  something with a specific, vivid claim and a continuously-alive detail.

## 2026-07-18 — Phase 9i (Hero content nudged down again)

### fix: still too close to the navbar
- 9h's `56px` still read as too high. Bumped top padding to `70px`.
  Verified at 1440x900 and mobile 390x844.

## 2026-07-18 — Phase 9h (Hero content nudged back down slightly)

### fix: hero content went too far up
- 9g's `40px` top padding overcorrected. Bumped to `56px` — a middle point
  between the original centered-and-too-low state and the flush-to-navbar
  9g state. Verified at 1440x900 and mobile 390x844.

## 2026-07-18 — Phase 9g (Hero content raised further)

### fix: hero content still sitting too low
- Switched the section from `alignItems: 'center'` (which vertically centers
  within `100svh`, pulled down by the sticky navbar's own height) to
  `alignItems: 'flex-start'` with a fixed, small top padding (`40px`) —
  direct control over position instead of relying on centering math
- Verified at 1440x900, 1280x720, and mobile 390x844 in both light and dark
  mode — content sits right below the navbar with a clean gap, photos still
  fully visible with room to spare before the fold

## 2026-07-18 — Phase 9f (Hero: overlapping photos, content raised, mobile image bug fixed)

### feat: two overlapping photos in the hero
- Added a second, smaller photo (`homeHeroSecondary`) overlapping the primary
  photo's bottom-left corner in a bordered "print" frame with its own shadow —
  a layered two-photo composition instead of one single frame
- Reduced hero top/bottom padding (`104px 24px 56px` → `76px 24px 40px`) so
  the content sits higher, less empty space above the fold

### fix: hero/about photos rendered at zero width on mobile
- Real bug, not a timing issue: `.hero-split-image { margin: 0 auto }` on a
  grid item with no intrinsic content width (the photo inside is built from
  `next/image fill`, which is `position: absolute` and contributes nothing to
  shrink-to-fit sizing) collapsed the whole image to `width: 0` on mobile —
  invisible, not just cropped
- Fixes with one line (`width: 100%` added to `.hero-split-image` in the
  mobile media query in `globals.css`) — also fixes `AboutHero.tsx`, which
  shares the same class and had the identical latent bug, confirmed via a
  before/after screenshot at 390x844
- Verified image loads and renders correctly at 1440x900, 1440x800, 1280x720,
  and mobile 390x844 (both the homepage hero and the About page hero)

## 2026-07-18 — Phase 9e (Hero: real photo back, first-paint cropping fixed)

Feedback: still not right — wanted an actual photo (not a pure product mockup),
and the layout let the visual spill past the bottom of the viewport so it
looked cut in half on first paint.

### fix: hero — real photo, height-capped so nothing overflows the first viewport
- Root cause of the cropping: text stacked above a large visual meant total
  content height could exceed one screen's worth of space, so the visual got
  sliced by the fold with no visual indication there was more below
- Fixed by going back to a side-by-side layout (text | photo) instead of
  stacking, and capping the photo's height explicitly (`height: min(58svh, 520px)`)
  so the pair can never require more vertical space than a typical viewport
  provides — verified at 1440x900, 1440x800, 1280x720, and mobile 390x844,
  nothing clipped at any size
- Removed `DashboardMockup` (introduced in 9d) entirely — no longer used
- `lib/editorialImages.ts`: `homeHero` restored (same photo as the original
  Phase 9 hero, now presented in a contained frame instead of full-bleed)

## 2026-07-18 — Phase 9d (Hero: product-led, not photo-led; images restored where asked)

Feedback: the full-bleed photo hero read as dated, and the Problem section's
demo-card-only rebuild also missed — the right side specifically needed an
image, and the site as a whole needed 1-2 more human photo moments.

### feat: hero rebuilt again — product-dominant, no photography
- Picked from a set of concrete reference directions: centered headline/subtext/CTA,
  then one large dominant product visual below — same pattern as Linear/Vercel/Apple
  marketing pages, not a lifestyle photo
- New `DashboardMockup`: a generalized (not product-specific) dashboard preview
  with a live sidebar, stat tiles, a small bar chart, and rows that reuse the
  Offline/Synced status-pill pattern from the earlier power-cut demo, cycling
  automatically
- Removed the Ken Burns/full-bleed photo, the dark scrim, and the mouse-parallax
  code entirely — none of it survived this pass

### fix: Problem section — photo is back, kept simple this time
- Reverted from the animated-demo-only version back to a photo, per direct
  feedback ("the right side is the problem it needs a image")
- Kept it deliberately plain this time: `EditorialImage` in its default framed
  presentation, no glass overlay, no layered composition — the earlier attempts
  at compositional cleverness were themselves part of what wasn't landing

### feat: one more photo added for site-wide human warmth
- `ValuesSection.tsx` now leads with a photo (a cashier using a tablet POS)
  paired with the section heading, photo on the left this time — alternates
  with the Problem section's photo-on-right for scroll rhythm
- `lib/editorialImages.ts`: swapped the now-unused `homeHero` entry back to
  `homeProblem`, added `valuesPhoto`

## 2026-07-18 — Phase 9c (Hero + Problem section rebuilt)

Feedback: the split text/photo hero composition itself wasn't working, and the
Problem section's photo-plus-comparison-card concept was wrong entirely — not
just unbalanced.

### feat: hero rebuilt as full-bleed cinematic composition
- Replaced the two-column split with one full-viewport photo background, a
  bottom-anchored content block, and a dark gradient scrim for legibility
  regardless of theme (same "always-dark" idea as the closing CTA band)
- Slow continuous Ken Burns zoom on the photo (respects `prefers-reduced-motion`)
- Subtle technical grid texture laid directly over the photo, fading toward the bottom
- Removed the separate floating "status chip" concept (was tied to the old
  split-card layout) — a small pulse dot lives in the badge pill instead

### feat: Problem section rebuilt as a working animated demo, not a photo
- Dropped the photo + comparison-card concept entirely
- New `PowerCutDemo`: a real, self-contained UI component (not a stock photo)
  that plays through a power cut once when scrolled into view — the toolbar
  status flips "Offline" → "Synced", an overlay with a spinner appears and
  clears, and the order rows animate from dimmed to fully active
- This is a genuine technical/craft showcase (real interaction logic) rather
  than art direction, and it naturally height-matches the left column since
  it's one compact card instead of a photo-plus-card stack
- Fixed a `react-hooks/set-state-in-effect` lint error surfaced by the reduced-motion branch (deferred via the timeout instead of a synchronous `setState`)

## 2026-07-18 — Phase 9b (Redesign feedback pass)

### fix: palette feedback — human warmth from photography, not brown chrome
- Reworked the whole token system from the terracotta/cream "Editorial Warmth" pass to a blue/black/white system: white light-mode background (was cream), warm near-black replaced with a true near-black, electric blue (`#2455E8`) signature accent replacing the terracotta one, and `lib/luxuryPalette.ts` updated to match — same mechanism, new hex values
- `EditorialImage.tsx` and the testimonial avatar filter: dropped the warm sepia color-grade push — the UI chrome now carries the precision (blue/black/white), the photography carries the human warmth as-shot, no artificial color grade fighting that
- Semantic success/error colors reverted to standard green/red (were unnecessarily re-themed warm in the first pass)

### fix: light theme is now the true default
- `THEME_SCRIPT` (`app/layout.tsx`) and `ThemeProvider` (`contexts/theme-context.tsx`) no longer fall back to `prefers-color-scheme` — only an explicit stored choice produces dark mode, otherwise light always wins, matching the ask directly

### feat: hero section redesigned — more eye-catching, more technical
- `GridBackdrop` — a faded blueprint grid pattern behind the hero (Vercel/Linear-style technical texture)
- `StatusChip` — a floating glassmorphic "Running offline · synced" chip overlapping the hero photo's corner, with a live pulse indicator
- Hero photo now sits at a slight rotation with subtle mouse-follow parallax (desktop only, skipped under `prefers-reduced-motion`)

### fix: Problem section left/right column height mismatch
- The right column was two stacked blocks (photo, then a full before/after card) and ended up far taller than the left column's copy
- Redesigned as one layered composition: the photo fills the whole column as a backdrop, and a condensed glassmorphic comparison panel (paired before → after rows, not two separate stacked lists) floats over its lower half — total height now matches the aspect-ratio-driven photo, not a photo-plus-card stack

## 2026-07-18 — Phase 9 (Editorial Warmth Redesign)

### feat: warm/editorial visual redesign of the marketing site
- Installed and actually loaded `Instrument Serif` (previously referenced in `--font-display` since Phase 2 but never installed); applied to hero H1, all major section headings, and pull-quotes
- New warm neutral palette (cream/parchment light mode, warm near-black dark mode) and a terracotta/bronze "luxury signature" accent replacing flat purple, via existing CSS custom property names — no component rewrites needed
- New semantic `--color-success`/`--color-error` tokens replace ~10 hardcoded hex values in `ProblemSection.tsx`, `ContactForm.tsx`, `ProductPricing.tsx`, `ProductHero.tsx`
- New `components/ui/GrainOverlay.tsx` and `components/ui/EditorialImage.tsx`; real curated photography (`lib/editorialImages.ts`, Unsplash) added to homepage hero, Problem section, testimonials, About hero, About team (new — was text-only), and product page hero
- `ProductHero.tsx`'s `MockUI` redesigned with a photo backdrop and a live "Synced" pulse micro-interaction
- `Footer.tsx` social icons: real SVGs replacing letter avatars; season easter-egg no longer defaults to "Winter" when data is absent
- Scope: marketing site only (home, products, about, contact) — customer/admin portals untouched

### feat: seasonal particle engine now optional, defaults off
- `contexts/seasonal-fx-context.tsx` (new) + `lib/luxuryPalette.ts` (new): a zero-specificity `:where(:root)` CSS fallback supplies the luxury palette for all `--season-*` tokens whenever `data-season` is absent from `<html>`
- Anti-FOUC script in `app/layout.tsx` strips season attributes before first paint unless `localStorage['seasonal-fx'] === 'on'` (mirrors the existing dark/light mode script)
- `SeasonalEngine.tsx`, `LoadingScreen.tsx`, `SeasonAccentWord.tsx` all gate particle rendering / color blending / infection animation behind the FX-enabled state
- Control added to the existing bottom-right `SeasonDevPanel` as an On/Off switch — no new UI surface

## 2026-05-17 — Phase 8b (Accessibility Audit)

### fix: restore focus-visible ring on all form inputs
- Removed `outline: 'none'` from inline styles in 11 files: ContactForm, login, register, forgot-password, update-password, admin-login, BlogClient, admin customers/licenses/payments search inputs, CustomerActionsClient textarea
- Global `:focus-visible` CSS rule now applies correctly (was overridden by inline styles)

### fix: aria-describedby IDs now resolve in ContactForm
- `FieldError` component gains an `id` prop; all four field errors pass the correct ID
- Added `aria-describedby` to select and textarea (previously only on inputs)

### fix: role="alert" on auth error messages
- login, register, forgot-password, update-password pages: error div gets `role="alert"` so screen readers announce errors on appearance

### fix: ProductFAQ accordion ARIA
- Each FAQ button: `id="faq-btn-{i}"`, `aria-controls="faq-panel-{i}"`
- Each FAQ panel: `id="faq-panel-{i}"`, `role="region"`, `aria-labelledby="faq-btn-{i}"`

### fix: Navbar products dropdown ARIA
- Button: `aria-controls="products-dropdown"`
- Dropdown: `id="products-dropdown"`

### feat: prefers-reduced-motion CSS support
- Added `@media (prefers-reduced-motion: reduce)` to globals.css disabling all CSS transitions/animations for users who opt out

---

## 2026-05-17 — Phases 5b, 6, 7, 8

### feat: contact form Resend integration (Phase 5b)

- `app/api/contact/route.ts` — POST handler using Resend; sends to support@thraive.com with replyTo from form
- `components/contact/ContactForm.tsx` — replaced mock setTimeout with real fetch to /api/contact; added server error display

### feat: app_versions table + downloads server component (Phase 5b)

- `supabase/migrations/001_app_versions.sql` — table definition with RLS + seed data for all 6 products (Windows + Android)
- `app/(portal)/downloads/page.tsx` — converted to async server component; fetches user's active licenses, then matching app_versions rows
- `app/(portal)/downloads/DownloadsClient.tsx` — extracted interactive client component (checksum toggle, download links)

### feat: admin portal — Phase 6

- `app/admin-login/page.tsx` — always-dark staff login; no register link; no self-serve password reset
- `components/admin/AdminSidebar.tsx` — 260px dark sidebar with role-based nav (Staff section superadmin-only)
- `app/(admin)/layout.tsx` — forces data-mode="dark" via useEffect; verifies staff table on mount; loading spinner
- `app/(admin)/admin-dashboard/page.tsx` + `AdminDashboardClient.tsx` — 4 stat cards, 30-day revenue line chart (recharts), recent signups, expiring-soon licenses, product breakdown bars
- `app/(admin)/customers/page.tsx` — paginated customer list with name search (20/page)
- `app/(admin)/customers/[id]/page.tsx` + `CustomerActionsClient.tsx` — customer detail with licenses, payment history, admin notes (saved to customer_notes table)
- `app/(admin)/licenses/page.tsx` — all licenses with product/status/billing_type filters
- `app/(admin)/devices/page.tsx` — all registered devices
- `app/(admin)/payments/page.tsx` — payment history with this-month summary bar
- `app/(admin)/subscriptions/page.tsx` — active subscriptions with MRR estimate
- `app/(admin)/products/page.tsx` — product catalog view
- `app/(admin)/app-versions/page.tsx` — version manifest grouped by product
- `app/(admin)/staff/page.tsx` — staff management (superadmin only; redirects others to admin-dashboard)
- `app/(admin)/audit-log/page.tsx` — read-only paginated audit log
- `middleware.ts` — admin.* subdomain staff table check; x-staff-role header injection; redirect non-staff to admin-login?error=access_denied

### feat: Stripe integration — Phase 7

- `lib/license.ts` — generateLicenseKey(product) with WLDC/SMPS/PHRM/RTFL/ASVR/SNRA prefixes
- `lib/resend.ts` — sendLicenseEmail, sendPaymentFailedEmail, sendRenewalReminderEmail
- `app/api/checkout/route.ts` — creates Stripe checkout session; get/create Stripe customer; resolves priceId from STRIPE_*_PRICE_ID env vars when not passed explicitly
- `app/api/webhooks/stripe/route.ts` — 5 webhook handlers; Stripe v22-compatible (Checkout.Session, invoice.parent.subscription_details, SubscriptionItem.current_period_end)
- `app/api/billing-portal/route.ts` — Stripe billing portal session redirect
- `app/(portal)/billing/ManageBillingButton.tsx` — client component calling /api/billing-portal
- `components/product/ProductPricing.tsx` — real checkout buttons with monthly/annual/lifetime billing toggle; Custom plan links to /contact; non-logged-in users stored in sessionStorage, redirected to /register?redirect=checkout

### feat: SEO — Phase 8

- `app/robots.txt/route.ts` — robots.txt; disallows portal/admin/auth paths; references sitemap
- `app/sitemap.xml/route.ts` — XML sitemap with all public routes (home, products, 6 product slugs, about, contact, blog, legal)
- `app/layout.tsx` — metadataBase, title template (%s — Thraive Labs), OpenGraph site defaults, Twitter card, robots default
- `app/page.tsx` — page-level metadata with full OpenGraph description

---

## 2026-05-17 — Phase 5: Supabase Integration

### feat: Supabase client utilities

- `lib/supabase/client.ts` — `createBrowserClient` from `@supabase/ssr`; used in `'use client'` components
- `lib/supabase/server.ts` — async `createServerClient` wrapping `cookies()` from `next/headers`; used in server components and route handlers
- `.env.local.example` — documents required `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### feat: auth pages — real Supabase calls

- `login/page.tsx` — `supabase.auth.signInWithPassword()`, error mapping (invalid credentials / unverified email / rate limit), loading state, `router.push('/dashboard')` on success
- `register/page.tsx` — `supabase.auth.signUp()` with `emailRedirectTo=/auth/callback`, upsert `user_profiles` with full name, redirect to `/verify-email`
- `forgot-password/page.tsx` — `supabase.auth.resetPasswordForEmail()` with `redirectTo=/auth/callback?next=/update-password`, loading + error states

### feat: auth flow pages

- `app/auth/callback/route.ts` — route handler; exchanges PKCE code for session via `exchangeCodeForSession()`; redirects to `?next=` param (defaults to /dashboard)
- `app/verify-email/page.tsx` — post-register holding screen; resend button via `supabase.auth.resend()`
- `app/update-password/page.tsx` — password reset form; `supabase.auth.updateUser({ password })`; redirects to /dashboard on success

### feat: middleware — real session check

- `middleware.ts` — `@supabase/ssr` `createServerClient` pattern; session cookie refresh on every request; `app.*` subdomain: unauthenticated routes → /login, authenticated on auth pages → /dashboard

### feat: portal sidebar — real sign-out

- `components/portal/PortalSidebar.tsx` — accepts `displayName` prop; sign-out calls `supabase.auth.signOut()` + `router.push('/login')` with loading state

### feat: portal layout — user display name

- `app/(portal)/layout.tsx` — fetches user + `user_profiles.full_name` via browser client on mount; passes first name to PortalSidebar

### feat: portal pages — server components with real data

- `app/(portal)/dashboard/page.tsx` — converted to async server component; fetches `licenses` + `user_profiles` for authenticated user; empty state with "Browse products" CTA; real member-since date
- `app/(portal)/dashboard/LicenseCard.tsx` — client component extracted; `StatusBadge` with expiring-soon amber warning; masked key reveal/copy; download button disabled for expired licenses
- `app/(portal)/settings/page.tsx` — async server component; fetches `user_profiles` + `notification_prefs`; passes initial data to `SettingsClient`
- `app/(portal)/settings/SettingsClient.tsx` — client component; toggles persist via `notification_prefs` upsert; "Change password" triggers `resetPasswordForEmail()`
- `app/(portal)/billing/page.tsx` — async server component; fetches `licenses` + `payment_history`; full table with refunded status support; empty states

---

## 2026-05-17 — Phase 4: Legal Pages, Blog, Customer Portal, Auth

### feat: legal pages

- `components/legal/LegalLayout.tsx` — shared wrapper with Navbar/Footer, styled h1/last-updated/hr
- `app/legal/privacy/page.tsx` — 10-section Privacy Policy (Introduction, Data Collected, Usage, Storage, Rights, Cookies, Third Parties, Children, Changes, Contact)
- `app/legal/terms/page.tsx` — 14-section Terms of Service (Acceptance, Services, License Grant, Restrictions, Payment, Updates/Support, IP, Privacy, Disclaimers, Liability, Termination, Governing Law, Changes, Contact)
- `.legal-content` CSS rules added to `globals.css` for h2/p/ul/ol/a inside legal pages

### feat: blog placeholder page

- `app/blog/page.tsx` — server component with metadata export
- `app/blog/BlogClient.tsx` — client component with email notify form, SectionLabel, GlassCard, focus-state border, success state

### feat: customer portal

- `components/portal/PortalSidebar.tsx` — 240px sticky sidebar with logo, user badge, nav items (Dashboard/Downloads/Billing/Settings), active state with season-accent left border, sign-out button with red hover
- `app/(portal)/layout.tsx` — calls `setLoaded()` to bypass loading screen; flex layout sidebar + main
- `app/(portal)/dashboard/page.tsx` — welcome header, 2 mock license cards with reveal/copy key, expiry info, Download/Manage actions, account summary
- `app/(portal)/downloads/page.tsx` — per-product download cards with Windows/Android buttons, SHA256 checksum accordion, changelog link, Installation Help accordion
- `app/(portal)/billing/page.tsx` — coming-soon notice banner, current plans cards (disabled upgrade buttons), payment history table with paid/failed status pills
- `app/(portal)/settings/page.tsx` — Profile/Security/Notifications/Danger Zone sections; toggle switches for notification prefs; red danger zone card

### feat: auth pages

- `app/login/page.tsx` — email + password form, forgot password link, create account link, get-a-product link
- `app/register/page.tsx` — full name/email/password/confirm fields with show/hide toggle, terms agreement text
- `app/forgot-password/page.tsx` — email input, send reset link button, success state message

### feat: middleware

- `apps/web/middleware.ts` — host-based routing stub; TODO placeholder for Supabase session check on app.* subdomain

---

## 2026-05-17 — Seasonal Visual Polish

### feat: summer particle overhaul

- July: monarch/swallowtail butterflies — realistic bezier wing paths, `ctx.scale(spread,1)` fold perspective, body+head drawn outside scale
- Butterfly dust trail: `DustTrail` system emits golden dust particles (`#FDE68A`, `#FCD34D`, `#FFFFFF`) when wings are open; max 90 dust particles, glow via shadowColor
- June: 24 fireflies full-screen (active at night + evening)
- August: 60 rising embers with `maxAge: 2.4` fade-out
- `BUTTERFLY` and `EMBER` shape constants added to `lib/particles.ts`
- `spawnFromTop: boolean` and `maxAge: number` added to `FallingParticle` interface
- Butterfly landed check: `p.spawnFromTop ? p.y > h + p.size : p.y < -p.size` (critical fix)

### feat: blend transition timing rework

- Outgoing months (2/5/8/11): secondary particles start after day 20, ramp 0→0.75 by end of month (not linear from day 1)
- Primary particle count fades 1.0→0.35 over days 20→end via `getPrimaryFade(month, blend)` (exported from seasonal.ts)
- Incoming months (3/6/9/12): secondary blend starts at 0.70 (=35% of old-season count), tapers to 0 by day 4 — seamless particle count at month boundary
- `data-season-blend` DOM attribute read live in RAF draw loop to avoid stale closure

### feat: SeasonAccentWord infection effect

- `components/home/SeasonAccentWord.tsx` — three-wave CSS mask-image radial gradient that floods next season's color into a word as the month ends; only fires when `isOutgoing(primary, secondary)` and blend > 0.01
- Applied to headings: "thrive." (Hero), "started?" (Closing), "working." (Statement), "work." (Values), "business." (Products)

### feat: UI color blend system (last 5 days of outgoing months)

- `lib/seasonColors.ts` (new) — PALETTE table with all 9 UI CSS vars (`--season-accent`, `--season-btn-bg`, `--season-btn-hover`, `--season-ambient`, `--season-ambient-dim`, `--season-glow`, `--season-glow-soft`, `--season-bg-tint`, `--season-card-border`) per season per dark/light mode
- `colorBlend: number` added to SeasonState; computed as 0→1 over last 5 days of months 2/5/8/11
- `getInterpolatedColorVars()` — server-safe lerp of all UI vars
- `applySeasonColorBlend()` — reads `data-mode` from DOM, sets interpolated inline CSS vars on `<html>`
- `layout.tsx` — initial interpolated style prop on `<html>` for zero-flash server render
- `SeasonalEngine.tsx` — MutationObserver re-applies blend on dark/light toggle; `colorStateRef` prevents stale closures

### feat: hero section button consistency

- Replaced `Button` component with raw inline `<Link>`/`<a>` matching ClosingSection button styles exactly
- Both CTA rows now identical: height 48, padding 0 24px, fontSize 15

### fix: testimonial avatar seasonal colors

- Avatar initials circles: `--bg-subtle` → `--season-glow-soft`, `--border` → `--season-card-border`, `--text-muted` → `--season-accent`

### fix: navbar dropdown brand link

- "View all products" footer link in products dropdown: `--color-brand` → `--season-accent`

---

## 2026-05-16 — Phase 3: Product Pages, About, Contact

### feat: product data layer

- `lib/product-details.ts` — extended `ProductDetail` interface with `features`, `steps`, `faq`, `pricing`; full content for all 6 products (WildCafe, SmartPOS, Pharmacy, RouteFlow, AutoServ, Sonara)
- LKR-denominated 3-tier pricing per product; enterprise plan with custom pricing

### feat: product landing page template

- `ProductHero` — category badge, name/tagline/longDescription, `MockUI` abstract UI mockup, two CTAs
- `ProductProblem` — "Why it exists" narrative section with accent underline
- `ProductFeatures` — 3-column grid, `FeatureIcon` component with 25+ named SVG icon variants
- `ProductHowItWorks` — dynamic column count, step circles with glow ring, connector lines between steps
- `ProductPricing` — 3-tier cards, "Most popular" badge on highlighted plan, LKR formatting, feature checklist
- `ProductFAQ` — accordion with AnimatePresence height animation, one-open-at-a-time state
- `ProductCTA` — closing CTA with trial + contact links

### feat: product routes

- `app/products/[slug]/page.tsx` — dynamic route with `generateStaticParams` for all 6 slugs, metadata per product
- `app/products/page.tsx` + `components/products/ProductsClient.tsx` — products index with hero, full grid, trust pillars

### feat: about page

- `AboutHero`, `AboutMission` (two-column with 4 pillars), `AboutValues` (6-value grid), `AboutTeam` (team narrative + CTA)
- `app/about/page.tsx` composition with static metadata

### feat: contact page

- `ContactInfo` — email, location, response time with inline SVG icons
- `ContactForm` — name/email/subject/message fields, client-side validation, mock submit success state (Resend wired in Phase 4)
- `app/contact/page.tsx` — two-column layout (info | form)

### fix: `<Link>` usage for internal navigation

- `ClosingSection.tsx` — replaced `<a href="/products">` with `<Link>`
- `Navbar.tsx` — replaced 3 instances of `<a href="/products">` with `<Link>`

### chore: globals.css additions

- `@keyframes spin` for contact form loading spinner
- Responsive grid helpers (`.grid-3`, `.grid-steps`, `.sm:grid-cols-2` at mobile breakpoints)
- `.sr-only` utility class

---

## 2026-05-16 — Phase 2: Navbar, Footer, Homepage

### feat: theme system with dark/light toggle and anti-FOUC

- `contexts/theme-context.tsx` — lazy localStorage read, crossfade on toggle via `.theme-transitioning` class
- `contexts/loading-context.tsx` — shared loading state between SeasonalEngine and page sections
- Anti-FOUC script in `app/layout.tsx` `<head>` applies saved theme before React hydrates

### feat: shared UI primitives

- `Button` — primary/secondary/ghost variants, sm/md/lg sizes, accessible focus rings
- `Container` — max-width 1200px with responsive padding
- `SectionLabel`, `SeasonalDivider`, `GlassCard`, `LogoMark`
- `ProductCard` — accent top border, hover lift, product icon, platform tags
- `ProductIcons` — custom SVG icons for all 6 products

### feat: Navbar

- Sticky glass navbar with products dropdown (hover + click, all 6 products in 2×3 grid)
- Dark mode toggle button synced to ThemeContext
- Mobile hamburger with full-screen overlay, body scroll lock
- Logo links via Next.js `Link`

### feat: Footer

- 4-column layout: brand/social, products, company, legal+support
- Bottom bar: copyright, season indicator easter egg, dark mode toggle

### feat: homepage — all 9 sections

- HeroSection: full-viewport, word-stagger headline, badge, CTAs, scroll indicator — waits for loading screen via LoadingContext
- StatementSection: centered italic quote with animated divider
- ProductsSection: 3×2 grid with stagger-in animation
- ProblemSection: 2-col copy + power-cut animation sequence
- ValuesSection: 3 value blocks (offline first, privacy first, local market)
- StatsSection: 4 stats on brand-color band with count-up animation
- HowItWorksSection: 3 steps with connector line, CTA
- TestimonialsSection: 3 placeholder glass cards
- ClosingSection: dark CTA band

---

## 2026-05-16 — Phase 1: Seasonal Engine

### feat: initialize Next.js 16 monorepo with full seasonal engine

- Bootstrapped `apps/web` with Next.js 16 App Router, TypeScript strict, Tailwind CSS v4
- Added Framer Motion, @fontsource/inter, @fontsource/jetbrains-mono
- Created pnpm workspace at repo root

### CSS token system (all seasons + time-of-day)

- `styles/globals.css` — base tokens, light/dark mode vars, time-of-day overlay vars
- `styles/seasonal/winter.css` — ice blue palette
- `styles/seasonal/spring.css` — sakura pink palette
- `styles/seasonal/summer.css` — warm gold palette + firefly vars
- `styles/seasonal/autumn.css` — burnt orange palette

### lib/seasonal.ts

- `getSeasonState(date, darkMode)` — full SeasonState with primary/secondary/blend
- `getTimeOfDay(hour)` — dawn/morning/afternoon/golden/evening/night
- SEASON_MAP with blend functions for all 12 months

### lib/particles.ts

- PARTICLE_CONFIGS for all 4 seasons
- `drawParticleShape()` — renders snowflakes, petals, leaves, dust to canvas
- `getParticleColors()` — per-season fill/stroke/glow rules
- All leaf and petal shape renderers

### app/layout.tsx — server-side seasonal data attributes

- `data-season`, `data-secondary-season`, `data-season-blend`, `data-time`, `data-mode` on `<html>`
- Season CSS activates before any JavaScript runs

### AuraLayer.tsx

- Noise-driven bezier silk thread animation in season colors
- Loading mode: 4 threads, 25-45% opacity; Page mode: 2 threads, 6-12% opacity
- Reduced motion: static radial glow

### ParticleCanvas.tsx

- All 4 season particle systems with shape rendering
- Autumn rain, summer fireflies (night only), secondary season blending
- requestAnimationFrame loop, offscreen culling, tab visibility pause

### AccumulationCanvas.tsx

- Column height map with neighbor spread for organic pile shape
- 4 season pile renders (snow gradient, petal/leaf sprites, dust shimmer)
- 4 clear animations: melt, gust, tumble, fade

### LoadingScreen.tsx

- Diamond logomark SVG, staggered wordmark, tagline
- 2.5s minimum / 8s maximum display
- Full reduced motion fallback

### SeasonalEngine.tsx

- Orchestrates LoadingScreen then AuraLayer + ParticleCanvas + AccumulationCanvas
- Wires particle land events to accumulation system

---

<!-- New entries go above this line -->
