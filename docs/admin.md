# Admin Portal (admin.thraive.com)

Internal staff tool. Never publicly accessible. Thraive Labs team only.

---

## Architecture

Same Next.js app, admin.* subdomain routing via middleware. Staff accounts are separate from customer accounts — stored in a `staff` table, not Supabase Auth's public user system.

Staff auth uses Supabase Auth with an additional check: after login, middleware verifies the user exists in the `staff` table with `is_active = true`. Regular customers who try to access admin.thraive.com are rejected even if they have a valid Supabase session.

---

## Staff Roles

```
superadmin    Full access including staff management and system settings
admin         All except staff management
support       Read-only customer/license data, can extend trials
finance       Revenue data, payment history, can issue refunds
```

---

## Authentication

### Staff Login (admin.thraive.com/login)

```
Same card layout as customer portal login
Different branding: "Admin — Thraive Labs" heading

[email input]
[password input]
[Sign in]

No register link — staff accounts created by superadmin only
No "forgot password" self-serve — superadmin resets passwords
```

On submit:
1. `supabase.auth.signInWithPassword()`
2. Middleware checks `staff` table for this user ID
3. If not in staff table or `is_active = false` → reject with "Access denied"
4. If staff → set staff role in session metadata → proceed to admin dashboard

---

## Admin Layout

```
Same sidebar pattern as customer portal but wider (260px)
Dark background regardless of user's light/dark preference
  ← Admin is always dark — reduces eye strain for internal users
  ← Also visually distinct from customer portal to avoid confusion

Sidebar:
  [◈ Thraive Labs Admin]

  ─── Overview ───
  Dashboard
  
  ─── Customers ───
  Customers
  Licenses
  Devices
  
  ─── Revenue ───
  Payments
  Subscriptions
  
  ─── Content ───
  Products
  App Versions
  
  ─── System ───
  Staff          ← superadmin only
  Audit Log
  Settings

Bottom:
  [staff name + role badge]
  [Sign out]
```

---

## Page 1: Admin Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard                              Today: 17 May 2026  │
├──────────────┬───────────────┬──────────────┬───────────────┤
│  TOTAL       │  ACTIVE       │  MRR         │  NEW TODAY    │
│  CUSTOMERS   │  LICENSES     │              │               │
│  142         │  89           │  LKR 184,500 │  3 customers  │
│  [glass]     │  [glass]      │  [glass]     │  [glass]      │
├──────────────┴───────────────┴──────────────┴───────────────┤
│                                                              │
│  REVENUE CHART (last 30 days)                               │
│  [line chart: daily revenue, LKR]                           │
│                                                              │
├───────────────────────────┬──────────────────────────────────┤
│  RECENT SIGNUPS           │  EXPIRING SOON                  │
│  [last 5 customers]       │  [licenses expiring < 7 days]   │
│  name, product, date      │  customer, product, date        │
│  [View all →]             │  [View all →]                   │
├───────────────────────────┴──────────────────────────────────┤
│  PRODUCT BREAKDOWN                                          │
│  WildCafe   32 licenses   36%   [bar]                       │
│  SmartPOS   28 licenses   31%   [bar]                       │
│  Pharmacy   14 licenses   16%   [bar]                       │
│  Sonara     8  licenses   9%    [bar]                       │
│  RouteFlow  5  licenses   6%    [bar]                       │
│  AutoServ   2  licenses   2%    [bar]                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Page 2: Customers

```
┌──────────────────────────────────────────────────────────────┐
│  Customers                     [Search...]    [Export CSV]  │
│  142 total customers           [Filter: All Products ▼]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  NAME          EMAIL              PRODUCTS  JOINED   STATUS │
│  ─────────────────────────────────────────────────────────  │
│  Kamal Silva   kamal@...  WildCafe, Sonara  Jan 26  Active  │
│  Nimal Perera  nimal@...  SmartPOS          Dec 25  Active  │
│  Suresh Kumar  suresh@... Pharmacy          Nov 25  Expired │
│  ...                                                        │
│                                                              │
│  [< Prev]  Page 1 of 8  [Next >]                           │
└──────────────────────────────────────────────────────────────┘
```

Click a customer row → Customer Detail page:

```
Customer: Kamal Silva
Email: kamal@example.com
Joined: 15 January 2026
Status: Active

LICENSES (2)
  WildCafe POS — Starter
  License key: WLDC-XXXX-XXXX-XXXX
  Status: Active · Expires: Never (one-time)
  Devices: 1/1

  Sonara — Pro
  License key: SNRA-XXXX-XXXX-XXXX
  Status: Active · Renews: 15 Jun 2026
  Devices: 1/2

PAYMENT HISTORY (3 payments)
  [table]

ACTIONS (support/admin only):
  [Extend trial by 7 days]
  [Reset license key]
  [Suspend account]
  [Delete account]

ADMIN NOTES
  [text area for internal notes, saved to customer record]
  [Save note]
```

---

## Page 3: Licenses

```
All licenses across all customers in one table.

Columns: License key (masked), Customer, Product, Plan, Status, Created, Expires

Filters:
  Product: All / WildCafe / SmartPOS / Pharmacy / RouteFlow / AutoServ / Sonara
  Status:  All / Active / Expired / Cancelled
  Plan:    All / Starter / Business
  Type:    All / One-time / Subscription

Actions per row:
  [View customer]  [Copy key]  [Extend]  [Revoke]
```

---

## Page 4: Devices

```
All registered devices.

Columns: Device ID (short), Customer, License/Product, Platform, Activated, Status

Filters: Platform, Status (active/inactive)

Actions:
  [Deactivate] — frees up device slot
  [View customer]
```

---

## Page 5: Payments

```
All payment records across all customers.

Columns: Date, Customer, Product, Amount (LKR), Status, Stripe Payment ID

Filters: Status (paid/failed/refunded), Date range, Product

Summary bar at top:
  This month: LKR X total · X payments · X refunds

Actions per row:
  [View in Stripe →]  opens Stripe dashboard for this payment
  [Issue refund]      finance role only
```

---

## Page 6: Subscriptions

```
All active subscriptions.

Columns: Customer, Product, Plan, Monthly amount (LKR), Next billing, Status

Filters: Product, Status (active/past_due/cancelled)

Summary:
  Active subscriptions: X
  MRR: LKR X
  At risk (past_due): X

Actions per row:
  [View in Stripe →]
  [Cancel]  admin only
```

---

## Page 7: Products

Manage the product catalog. Used to update product details that appear on the marketing site and customer portal.

```
List of 6 products with:
  Name, slug, status (active/inactive), accent color

Click a product:
  Edit: name, tagline, description, category, platforms, accent color, status
  [Save changes]
  ← Changes reflected on marketing site immediately (revalidates Next.js cache)
```

---

## Page 8: App Versions

Manage the version manifest that the desktop apps check for updates and the downloads page uses.

```
┌──────────────────────────────────────────────────────────────┐
│  App Versions                          [+ Add version]      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  WILDCAFE POS                                               │
│  Windows  v1.2.4  (current)  [Edit]  [Set as current]      │
│  Android  v1.2.3  (current)  [Edit]                        │
│                                                              │
│  SMARTPOS                                                   │
│  Windows  v1.0.8  (current)  [Edit]                        │
│  Android  v1.0.7  (current)  [Edit]                        │
│  ...                                                        │
└──────────────────────────────────────────────────────────────┘
```

Add/edit version form:
```
Product:       [WildCafe POS ▼]
Platform:      [Windows ▼]
Version:       [1.2.4]
Min version:   [1.0.0]  ← force update if below this
Download URL:  [https://github.com/...]
Changelog:     [text area]
Released at:   [date picker]
[Save]
```

When saved: updates `app_versions` table → in-app updater picks it up on next check → downloads page updates immediately.

---

## Page 9: Staff (superadmin only)

```
List of staff accounts:
  Name, Email, Role, Status, Last login, [Edit] [Deactivate]

[+ Add staff member]
  Name, Email, Role, Password (temporary, must change on first login)
```

Staff cannot delete their own account or change their own role.

---

## Page 10: Audit Log

Read-only log of all admin actions.

```
Columns: Timestamp, Staff member, Action, Target (customer/license), Details

Examples:
  2026-05-17 14:23  Udeesha  extended_trial  customer:kamal@..  +7 days
  2026-05-17 09:11  Udeesha  reset_license   license:WLDC-...
  2026-05-16 18:04  Udeesha  created_staff   staff:nimal@...

Filters: Staff member, Action type, Date range
Export: CSV
```

---

## Admin Supabase Schema

```sql
-- Staff accounts
CREATE TABLE staff (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name   text NOT NULL,
  role        text NOT NULL CHECK (role IN ('superadmin','admin','support','finance')),
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  last_login  timestamptz
);

-- Admin audit log
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    uuid REFERENCES staff(id),
  action      text NOT NULL,
  target_type text,          -- 'customer'|'license'|'staff'|'product'|'version'
  target_id   text,
  details     jsonb,
  created_at  timestamptz DEFAULT now()
);

-- Admin notes on customers
CREATE TABLE customer_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id),
  staff_id    uuid REFERENCES staff(id),
  note        text NOT NULL,
  created_at  timestamptz DEFAULT now()
);
```

RLS: staff table readable only by authenticated staff. Audit log insertable by staff, readable by admin+. Customer notes readable by all staff, insertable by all staff.

---

## Middleware Update for Admin

```typescript
// middleware.ts additions for admin subdomain

if (host.startsWith('admin.')) {
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = req.nextUrl.pathname === '/admin-login'

  if (!session) {
    if (!isLoginPage) return NextResponse.redirect(new URL('/admin-login', req.url))
    return res
  }

  // Check staff table
  const { data: staff } = await supabase
    .from('staff')
    .select('role, is_active')
    .eq('id', session.user.id)
    .single()

  if (!staff || !staff.is_active) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/admin-login?error=access_denied', req.url))
  }

  // Add staff role to request headers for server components to read
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-staff-role', staff.role)

  return NextResponse.next({ request: { headers: requestHeaders } })
}
```

---

## Visual Notes

- Admin portal is always dark mode regardless of system preference
- Same seasonal particles but even more reduced: 20% count, 1 aura thread at 5% opacity
- No loading screen
- Data tables use monospace font for IDs, keys, amounts
- All destructive actions (suspend, delete, revoke) require a confirmation dialog with the action typed out: "Type DELETE to confirm"
- Toast notifications for all actions: success (green), error (red), info (blue)
- Charts use recharts, same library as main site
