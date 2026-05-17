# Customer Portal (app.thraive.com)

The customer portal is where Thraive Labs customers manage their licenses, download software, and handle billing. It shares the seasonal engine and visual language with the main site but uses a different layout — sidebar navigation instead of a navbar.

---

## Architecture

```
app.thraive.com is served from the same Next.js app.
Routing is handled via middleware that checks the hostname:
  thraive.com        → public marketing site
  app.thraive.com    → customer portal (requires auth)
  admin.thraive.com  → staff portal (requires staff auth)

Middleware (middleware.ts):
  - Reads host header
  - Redirects app./* to login if no valid Supabase session
  - Redirects admin./* to staff login if no valid staff session
  - Passes through all public routes
```

---

## Authentication

Supabase Auth with email/password. No OAuth for now.

### Login Page (app.thraive.com/login)

```
Full viewport, centered card (max-width 400px)
Same seasonal engine running in background
Loading screen NOT shown on portal pages (only on main site)

[◈ Thraive Labs]  ← logo, links to thraive.com
[card — glass card style]

  Sign in to your account

  [email input]
  [password input]
  [Forgot password?]  ← right-aligned link

  [Sign in]  ← primary button, full width

  [divider]

  Don't have an account?
  [Create account]  ← links to /register

  OR

  [Get a product →]  ← links to thraive.com/products
  (for visitors who landed here but don't have an account yet)
```

Error states:
- Invalid credentials: "Incorrect email or password."
- Unverified email: "Please verify your email before signing in. [Resend verification]"
- Rate limited: "Too many attempts. Please try again in a few minutes."

### Register Page (app.thraive.com/register)

```
Same card layout as login

  Create your account

  [full name input]
  [email input]
  [password input]  — show/hide toggle
  [confirm password input]

  By creating an account you agree to our [Terms] and [Privacy Policy].

  [Create account]  ← primary button

  Already have an account? [Sign in]
```

On submit:
- Supabase creates user
- Sends verification email via Supabase Auth (customized with Resend)
- Redirects to: "Check your email — we sent a verification link to [email]."
- User clicks link → redirected to portal dashboard

### Forgot Password (app.thraive.com/forgot-password)

```
Simple card:
  [email input]
  [Send reset link]

Success: "Check your email for a reset link."
```

### Email Verification Pending

```
Simple centered card:
  "Check your email"
  "We sent a verification link to [email]."
  [Resend email]  [Change email]  [Back to sign in]
```

---

## Portal Layout

### Sidebar

```
Width: 240px fixed, left side
Background: var(--bg-subtle)
Border-right: 1px solid var(--border)

Top:
  [◈ Thraive Labs]  ← logo, links to thraive.com
  [user name]       ← first name from profile
  [plan badge]      ← "Free" or "Pro" pill

Navigation:
  Dashboard
  Downloads
  Billing
  Settings
  ────────────
  [← Back to main site]  ← links to thraive.com

Bottom:
  [Sign out]

Active item: 2px left border (--season-accent), tinted background
Same nav item styling as main site sidebar
```

### Portal Top Bar (per page)

```
Height: 56px
Border-bottom: 1px solid var(--border)
[Page title]     [contextual action button if needed]
```

### Seasonal Engine in Portal

Same seasonal particles and aura run in the portal but at reduced intensity:
- Particle count: 40% of main site count
- Aura: 1 thread, 8% opacity max
- Accumulation: still active but smaller pile
- No loading screen on portal pages
- Same seasonal color tokens applied

---

## Page 1: Dashboard (app.thraive.com/dashboard)

The first thing a customer sees after login. Shows all their licenses at a glance.

```
┌──────────────────────────────────────────────────────────────┐
│  Welcome back, [name].                       [date]         │
│  You have [N] active license(s).                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  YOUR LICENSES                                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [product icon]  WildCafe POS                       │    │
│  │  [accent top border in product color]               │    │
│  │                                                     │    │
│  │  Plan: Starter · 1 device                          │    │
│  │  Status: [● Active]                                 │    │
│  │  Expires: Never (one-time)                         │    │
│  │  License key: WLDC-XXXX-XXXX-XXXX  [Copy]         │    │
│  │                                                     │    │
│  │  [Download latest]  [Manage]                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [+ Add another product]  ← links to thraive.com/products  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ACCOUNT SUMMARY                                            │
│  Email: udeesha@example.com              [Change]           │
│  Member since: January 2026                                 │
│  Total products: 2                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**License card states:**

```
Active (one-time):
  Green dot + "Active"
  "Expires: Never"
  Download button enabled

Active (subscription):
  Green dot + "Active"
  "Renews: 15 Feb 2027"
  Download button enabled

Expiring soon (subscription, < 7 days):
  Amber dot + "Expiring soon"
  "Renews: [date]" in amber
  [Renew now] button shown

Expired:
  Red dot + "Expired"
  "Expired: [date]"
  Download button disabled
  [Renew] button shown

Cancelled:
  Grey dot + "Cancelled"
  "Access until: [date]"
  Download disabled after date
```

**License key display:**
- Shown partially masked by default: `WLDC-XXXX-XXXX-XXXX`
- [Reveal] button shows full key temporarily (5 seconds, then re-masks)
- [Copy] copies full key to clipboard
- Small toast on copy: "License key copied"

---

## Page 2: Downloads (app.thraive.com/downloads)

```
┌──────────────────────────────────────────────────────────────┐
│  Downloads                                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Download the latest version of your software.             │
│  Always download from here — never from third-party sites.  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [icon]  WildCafe POS                               │    │
│  │  Version 1.2.4 · Released 10 Jan 2026              │    │
│  │                                                     │    │
│  │  Windows installer    23.4 MB   [Download .exe]    │    │
│  │  Android APK          18.1 MB   [Download .apk]    │    │
│  │                                                     │    │
│  │  SHA256 checksum: [show/hide]                      │    │
│  │  [View changelog →]                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  INSTALLATION HELP                                          │
│  [accordion items]                                          │
│  How to install on Windows                                  │
│  How to install on Android                                  │
│  How to activate with your license key                      │
│  Troubleshooting                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Download logic:**
- Version info fetched from Supabase `app_versions` table
- Download links are GitHub Releases URLs (same as in-app updater)
- Only shows downloads for products the user has an active license for
- If license expired: shows version info but download button disabled with "Renew to download"

**Checksum:**
- SHA256 shown collapsed by default
- Click to expand: shows full hash in JetBrains Mono

---

## Page 3: Billing (app.thraive.com/billing)

Placeholder for now. Stripe integration comes in Phase 7.

```
┌──────────────────────────────────────────────────────────────┐
│  Billing                                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CURRENT PLAN                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  WildCafe POS — Starter                             │    │
│  │  One-time purchase · LKR 15,000                    │    │
│  │  Purchased: 15 Jan 2026                            │    │
│  │  [Upgrade to Business]                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  For subscription plans:                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SmartPOS — Business                                │    │
│  │  LKR 2,500 / month                                 │    │
│  │  Next billing: 15 Feb 2026                         │    │
│  │  [Cancel subscription]  [Update payment method]    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  PAYMENT HISTORY                                            │
│  [table: date, product, amount, status, invoice download]   │
│                                                              │
│  [Note: Payment management will open in Stripe portal]      │
│  ← For subscriptions, Stripe Customer Portal handles this   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Stripe Customer Portal:**
When user clicks "Update payment method" or "Cancel subscription":
- Server calls `stripe.billingPortal.sessions.create()`
- Redirects user to Stripe's hosted billing portal
- User manages card, cancels, or views invoices there
- Returns to app.thraive.com/billing on exit

---

## Page 4: Settings (app.thraive.com/settings)

```
┌──────────────────────────────────────────────────────────────┐
│  Settings                                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PROFILE                                                    │
│  Full name:  [Udeesha Kularathne]   [Edit]                 │
│  Email:      [udeesha@example.com]  [Change email]         │
│                                                              │
│  SECURITY                                                   │
│  Password:   ••••••••••••          [Change password]       │
│  Two-factor: Not enabled            [Enable 2FA]           │
│                                                              │
│  DEVICES                                                    │
│  ← Shows devices registered against each license           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WildCafe POS — Starter (1/1 device slot used)      │   │
│  │  Windows PC — Activated 15 Jan 2026  [Deactivate]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  NOTIFICATIONS                                             │
│  Renewal reminders    [toggle]                              │
│  New version alerts   [toggle]                              │
│  Marketing emails     [toggle]                              │
│                                                              │
│  DANGER ZONE                                               │
│  [Delete account]  ← requires password confirmation        │
│                                                             │
└──────────────────────────────────────────────────────────────┘
```

**Device deactivation:**
When user deactivates a device:
- Calls license server API: `DELETE /api/devices/{deviceId}`
- License server marks device as inactive in Firebase
- Device slot freed up
- User can now activate a new device
- Toast: "Device deactivated. Slot is now available."

**Change email flow:**
1. User enters new email
2. Verification email sent to new address
3. Email changes only when new address is verified
4. Old email gets a notification: "Your email was changed"

**2FA:**
- TOTP-based (Google Authenticator compatible)
- Supabase Auth MFA integration
- Shows QR code + manual entry code on setup
- Requires 2FA code to disable

---

## Portal Supabase Schema

```sql
-- User accounts (linked to Supabase Auth)
-- auth.users is Supabase built-in, we extend with:

CREATE TABLE user_profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name   text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Licenses (managed by license server, read by portal)
CREATE TABLE licenses (
  id              uuid PRIMARY KEY,
  user_id         uuid REFERENCES auth.users(id),
  product         text NOT NULL,   -- 'wildcafe'|'smartpos'|'pharmacy'|'routeflow'|'autoserv'|'sonara'
  plan            text NOT NULL,   -- 'starter'|'business'
  billing_type    text NOT NULL,   -- 'one_time'|'subscription'
  license_key     text UNIQUE NOT NULL,
  status          text NOT NULL,   -- 'active'|'expired'|'cancelled'
  stripe_sub_id   text,            -- null for one-time
  expires_at      timestamptz,     -- null for one-time
  created_at      timestamptz DEFAULT now()
);

-- Devices registered against each license
CREATE TABLE license_devices (
  id              uuid PRIMARY KEY,
  license_id      uuid REFERENCES licenses(id),
  device_id       text NOT NULL,
  platform        text NOT NULL,   -- 'windows'|'android'|'ios'
  activated_at    timestamptz DEFAULT now(),
  is_active       boolean DEFAULT true
);

-- Payment history (synced from Stripe webhooks)
CREATE TABLE payment_history (
  id              uuid PRIMARY KEY,
  user_id         uuid REFERENCES auth.users(id),
  license_id      uuid REFERENCES licenses(id),
  amount_cents    int NOT NULL,
  currency        text DEFAULT 'LKR',
  stripe_payment_id text,
  status          text NOT NULL,   -- 'paid'|'failed'|'refunded'
  paid_at         timestamptz
);

-- App versions (read by portal downloads page)
-- Already defined in main schema, portal reads from this

-- Notification preferences
CREATE TABLE notification_prefs (
  user_id             uuid PRIMARY KEY REFERENCES auth.users(id),
  renewal_reminders   boolean DEFAULT true,
  version_alerts      boolean DEFAULT true,
  marketing_emails    boolean DEFAULT false
);
```

RLS on every table: users can only read/update their own rows.

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON user_profiles
  FOR ALL USING (id = auth.uid());

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own licenses" ON licenses
  FOR ALL USING (user_id = auth.uid());

-- Same pattern for all tables
```

---

## Portal Middleware

```typescript
// middleware.ts (root of Next.js app)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const host = req.headers.get('host') ?? ''

  // Customer portal routes
  if (host.startsWith('app.')) {
    const { data: { session } } = await supabase.auth.getSession()
    const isAuthRoute = req.nextUrl.pathname.startsWith('/login')
                     || req.nextUrl.pathname.startsWith('/register')
                     || req.nextUrl.pathname.startsWith('/forgot-password')

    if (!session && !isAuthRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Admin portal routes
  if (host.startsWith('admin.')) {
    // Staff auth check — Phase 6
  }

  return res
}
```

---

## Visual Notes for Portal

- Same seasonal engine, same CSS tokens as main site
- No loading screen on portal pages
- Sidebar replaces top navbar on portal
- All cards use glass card style from design-system.md
- Form inputs: height 40px, border var(--border), focus border var(--season-accent)
- Status indicators use semantic colors (success/warning/error) not seasonal colors
- License key display uses JetBrains Mono font
- Toasts: appear top-right, same style as main site would use
- Tables: alternating row colors (--bg-card and --bg-subtle)
- Empty states: if no licenses, show "You don't have any products yet" with [Browse products →] link
