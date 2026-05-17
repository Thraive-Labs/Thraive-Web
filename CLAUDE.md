# Thraive Labs Website — Project Context

Read this fully, then `PROGRESS.md`, then the relevant `docs/` file for the current task.

## What This Is

The public-facing website and customer portal for Thraive Labs. Built with Next.js, hosted on Vercel.

Three distinct surfaces:
- `thraive.com` — public marketing site (this repo)
- `app.thraive.com` — customer portal (same repo, subdomain routing)
- `admin.thraive.com` — staff portal (same repo, subdomain routing)

## Stack

- **Framework:** Next.js 15 (App Router)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS v4 + CSS custom properties for seasonal tokens
- **Animations:** Framer Motion
- **Particles:** Custom Canvas API system (see docs/seasonal-engine.md)
- **DB (platform):** Supabase (licenses, tenants, products, staff)
- **Auth:** Supabase Auth (customer portal login)
- **Payments:** Stripe (Phase 7)
- **Email:** Resend
- **Language:** TypeScript strict

Do not introduce dependencies not in this list without asking.

## Repo Structure

```
/
├── CLAUDE.md
├── PROGRESS.md
├── CHANGELOG.md
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── api/
│       │   │   ├── checkout/route.ts
│       │   │   ├── webhooks/stripe/route.ts
│       │   │   ├── billing-portal/route.ts
│       │   │   ├── contact/route.ts
│       │   │   └── admin/...
│       │   ├── products/
│       │   ├── about/
│       │   ├── blog/
│       │   ├── contact/
│       │   ├── legal/
│       │   ├── login/
│       │   ├── register/
│       │   ├── forgot-password/
│       │   ├── verify-email/
│       │   ├── update-password/
│       │   ├── auth/callback/
│       │   ├── admin-login/
│       │   ├── (portal)/
│       │   │   ├── layout.tsx
│       │   │   ├── dashboard/
│       │   │   ├── downloads/
│       │   │   ├── billing/
│       │   │   └── settings/
│       │   └── (admin)/
│       │       ├── layout.tsx
│       │       ├── dashboard/
│       │       ├── customers/
│       │       ├── licenses/
│       │       ├── devices/
│       │       ├── payments/
│       │       ├── subscriptions/
│       │       ├── products/
│       │       ├── versions/
│       │       ├── staff/
│       │       └── audit/
│       ├── components/
│       │   ├── seasonal/
│       │   ├── layout/
│       │   ├── home/
│       │   ├── product/
│       │   ├── portal/
│       │   ├── admin/
│       │   └── ui/
│       ├── lib/
│       │   ├── seasonal.ts
│       │   ├── particles.ts
│       │   ├── products.ts
│       │   ├── product-details.ts
│       │   ├── seasonColors.ts
│       │   ├── license.ts
│       │   ├── resend.ts
│       │   └── supabase/
│       │       ├── client.ts
│       │       └── server.ts
│       └── styles/
│           ├── globals.css
│           └── seasonal/
└── docs/
    ├── seasonal-engine.md
    ├── pages.md
    ├── design-system.md
    ├── portal.md
    ├── admin.md           ← Phase 6 — admin portal spec
    ├── stripe.md          ← Phase 7 — Stripe integration spec
    └── phasing.md
```

## Documentation Map

- `@docs/seasonal-engine.md` — seasonal engine, particles, aura, loading screen
- `@docs/pages.md` — every page layout and content spec
- `@docs/design-system.md` — design token system, component patterns
- `@docs/portal.md` — customer portal spec (Phase 5)
- `@docs/admin.md` — admin portal spec (Phase 6) — READ BEFORE TOUCHING ADMIN
- `@docs/stripe.md` — Stripe integration spec (Phase 7) — READ BEFORE TOUCHING PAYMENTS
- `@docs/phasing.md` — all phases, current status, remaining work

## Non-Negotiable Rules

1. Seasonal engine loads before anything else — no flash of wrong season.
2. All seasonal state calculated server-side and passed as data attributes on `<html>`.
3. Particles are canvas-based — never DOM elements.
4. Loading screen minimum 2.5 seconds, only on main site — not portal or admin.
5. No emojis in code, UI, or commits.
6. TypeScript strict. No `any` without comment.
7. Run `pnpm lint` and `pnpm typecheck` after every change set.
8. Keep docs in sync with code.
9. Do not add co-author attribution to commits.
10. Accessibility: all interactive elements keyboard navigable, WCAG AA minimum.
11. Performance: Lighthouse > 90. Particles must not drop below 60fps.
12. All animations respect `prefers-reduced-motion`.
13. Admin portal is always dark mode — never follows user light/dark preference.
14. All admin mutations write an entry to the audit_log table.
15. Stripe webhook handler must verify signature before processing any event.

## Session Workflow

**Start:** Read CLAUDE.md → PROGRESS.md → relevant docs → confirm before coding.
**End:** Update PROGRESS.md → append CHANGELOG.md → update changed docs → commit.

## Conventions

- TypeScript strict. kebab-case files, PascalCase components, camelCase functions.
- Tailwind for layout and spacing. CSS custom properties for seasonal colors.
- Framer Motion for all UI transitions. Canvas API for particles only.
- Conventional commits: `feat:`, `fix:`, `perf:`, `chore:`, `docs:`
