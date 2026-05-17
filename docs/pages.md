# Pages

Full spec for every page. Start with the homepage.

---

## Homepage (thraive.com)

The homepage tells a story. Each section answers one question in the visitor's mind. It is calm, spacious, and guided — never chaotic, never empty.

### Section 1 — Hero

```
Full viewport height (min 100svh)
Centered content, generous vertical padding

Background:
  Seasonal particles falling across full viewport
  Aura threads visible in hero area (15% opacity max)
  Radial gradient: season ambient color at 8% from top-center fading to transparent
  Time-of-day overlay applied as a color tint on top

Content (centered, max-width 720px):

  [pill badge — animated in first]
  ✦ 6 products · Built in Sri Lanka

  [hero headline — display font, large]
  "Your business,
   always running."
   ← "always running." in season accent color

  [subtext — body font, text-secondary, max-width 540px]
  [placeholder text — copywriter will fill this]
  [3-4 sentences guiding visitor into the story]

  [CTA buttons]
  [Explore products →]    [Learn more]
  primary filled           ghost

  [scroll indicator — subtle animated arrow at bottom of hero]
  Gentle bounce animation, fades out on scroll
```

Animation sequence (on load, after loading screen exits):
```
0ms:    Background gradient fades in
100ms:  Badge slides down + fades in
300ms:  Headline words animate in (60ms stagger per word)
600ms:  Subtext fades up
800ms:  Buttons fade up
1000ms: Scroll indicator appears
```

### Section 2 — Statement

```
Full-width section
Background: var(--bg-subtle) + season-bg-tint

Content (centered, max-width 640px):

  [large italic quote — display font, text-secondary]
  "We build software for people
   who can't afford for it to stop working."

  [thin seasonal glow divider below]

This section has no buttons, no icons, no list.
Just the statement. The whitespace carries it.
```

### Section 3 — Products

```
Section label: "What we build"
Heading: "Software for every corner of your business."
Subtext: [2-3 sentences about product breadth — copywriter fills]

Product grid: 3 columns × 2 rows (desktop), 2×3 (tablet), 1 col (mobile)

Each product card:
  [3px top border in product accent color]
  [product icon, 36px, in rounded square with accent-color/10 background]
  [product name, text-xl, font-semibold]
  [category tag: pill, text-xs, muted]
  [one-sentence description]
  [platform tags: "Windows · Android" etc., text-xs, muted]
  [Learn more →, ghost button, small]

Product definitions:
  WildCafe POS:    #F97316  Restaurant management for Sri Lankan cafes
  Pharmacy POS:    #06B6D4  Complete pharmacy and inventory management
  SmartPOS:        #10B981  Retail point-of-sale for any business size
  RouteFlow:       #3B82F6  Distribution agent management and route sales
  AutoServ:        #8B5CF6  Vehicle service station management
  Sonara:          #7C3AED  AI-powered vocal coaching — learn to sing

Cards stagger in when section enters viewport (80ms between cards).
```

### Section 4 — Problem / Empathy

```
Section label: "The problem"
Heading: [copywriter fills — something about the reality of running a business in Sri Lanka]

Two-column layout (desktop), single column (mobile):

Left column:
  [Large pull quote — the pain point]
  3-4 short paragraphs describing the daily reality:
  power cuts, unreliable internet, software not built for local context,
  businesses running on paper and WhatsApp

Right column:
  [Visual element — illustrated or abstract]
  Could be: a simple animation showing a power cut icon →
  a spinning loading icon → a red X → replaced by Thraive logo
  Or: a simple graphic showing the contrast before/after

This section should make the visitor feel understood.
Not lectured to — seen.
```

### Section 5 — Solution / Values

```
Section label: "How we're different"
Heading: "Built for how you actually work."

Three value blocks — generous spacing, no tight cards:

Block 1: Offline first
  [icon]
  "Works without internet."
  [2-3 sentences about offline-first design, power cuts, remote areas]

Block 2: Privacy first
  [icon]
  "Your data stays yours."
  [2-3 sentences about local data storage, no data selling, user ownership]

Block 3: Built for Sri Lanka
  [icon]
  "Made for this market."
  [2-3 sentences about local context, LKR pricing, local support]

Layout: 3 columns on desktop, 1 column on mobile
Each block: icon top, headline, body text
No cards, no borders — just breathing room and good type
```

### Section 6 — Stats Banner

```
Full-width section
Background: var(--color-brand) (brand color, both light and dark mode)
Text: white
Padding: 64px 0

Four stats in a row:
  6          4           1            Offline
Products   Platforms   Company        First

Numbers count up when section enters viewport.
Font: JetBrains Mono, 52px, weight 800
Label: Inter, 14px, weight 500, opacity 0.8
```

### Section 7 — How It Works

```
Section label: "Getting started"
Heading: "From purchase to running — in minutes."

Three steps in a horizontal flow (desktop) or vertical (mobile):

Step 1:
  [circle with "1"]
  "Choose a product"
  [2 sentences about visiting the product page and selecting a plan]

Step 2:
  [circle with "2"]
  "Pay and receive your key"
  [2 sentences about Stripe checkout, instant license key delivery by email]

Step 3:
  [circle with "3"]
  "Download and activate"
  [2 sentences about downloading the installer, entering the key, and being ready]

Visual connector between steps:
  Dashed line or arrow connecting the three circles
  Animated: line draws itself in when section enters viewport
  Color: var(--season-ambient), 40% opacity

Below steps:
  [CTA: "Get started → " linking to /products]
```

### Section 8 — Testimonials

```
Section label: "What people say"
Heading: "Trusted by businesses across Sri Lanka."

Three testimonial cards in a row (desktop), 1 column (mobile):

Each card (glass card style):
  [large quote mark — brand color, 48px]
  [quote text — placeholder, italic]
  [avatar circle — placeholder grey, 40px]
  [name — placeholder]
  [business type — placeholder, muted]
  [location — placeholder, muted]

Placeholder state (until real testimonials):
  Cards are visually complete but content is clearly placeholder
  Do not add a "coming soon" note — just design them to accept real content
  When real testimonials arrive: swap text content only, no redesign needed
```

### Section 9 — Closing CTA

```
Full-width section
Background: dark (var(--bg-subtle) in dark mode, #09090B in light mode)
This creates contrast with the rest of the page regardless of light/dark

Centered content, generous padding (120px top/bottom):

  [heading — display font, white]
  "Ready to get started?"

  [subtext — 1-2 sentences, white/70%]
  [placeholder for copywriter]

  [two buttons]
  [Explore products →]  white filled, dark text
  [Get in touch]        ghost, white border and text

Seasonal particles continue falling in this section.
The seasonal glow is more visible here (higher contrast background).
```

### Section 10 — Footer

See design-system.md Footer section.

---

## Product Landing Pages (thraive.com/[product])

Each product has its own dedicated landing page. Same seasonal engine, same navbar/footer. Content is product-specific.

### Template Structure

```
Hero:         Product name, tagline, hero visual (screenshot/mockup), CTA
Problem:      What problem this solves for this specific customer type
Features:     Key features — 4-6 blocks with icon, title, description
How it works: Step by step for this specific product
Pricing:      Plans and pricing (placeholder until Stripe integrated)
FAQ:          3-5 common questions
CTA:          Download / get started
```

Each product page inherits the homepage visual language but with the product's accent color used as the secondary highlight color throughout (alongside the seasonal ambient color).

---

## About Page

```
Hero: Company story — who we are, why we exist, where we're based
Team: Founder section (placeholder ready)
Mission: 2-3 paragraphs about the company's mission
Values: Same 3 values as homepage but expanded
Contact: Link to contact page
```

---

## Contact Page

```
Simple form:
  Name, email, subject (dropdown: Sales / Support / Partnership / Other), message
  Submit sends to Resend → team email
  Success state: thank you message, expected response time

Office info:
  Location: Sri Lanka
  Email address
  Response time commitment
```

---

## Blog (thraive.com/blog)

Placeholder for now. No posts yet. Page exists so the footer link doesn't 404.

```
Layout:
  Hero section: "Blog" heading, brief description
  "Coming soon — product updates, guides, and stories from Thraive Labs."
  [Notify me] — simple email capture form (stores in Supabase, Resend sends when posts go live)

When posts exist:
  Grid of post cards (title, excerpt, date, category tag, read time)
  Category filter (All, Product Updates, Guides, Company)
  No pagination needed until > 12 posts

Post card:
  [category tag pill]
  [title — text-xl, font-semibold]
  [excerpt — text-sm, text-secondary, 2 lines max]
  [date · read time — text-xs, muted]
  [Read more →]

Individual post page (/blog/[slug]):
  MDX-based content (files in /content/blog/)
  Estimated read time calculated from word count
  Author, date, category at top
  Table of contents sidebar (desktop, for long posts)
  Related posts at bottom
  Social share buttons
```

---

## Legal Pages

Both legal pages use the same layout. Plain, readable, no decorative elements — legal text needs clarity above all.

### Shared Layout

```
Navbar (same as rest of site)
Seasonal particles running but at 30% density — not distracting during reading
No accumulation on legal pages

Content:
  max-width: 720px
  margin: 0 auto
  padding: 80px 24px

  [h1: page title]
  [Last updated: date]
  [thin divider]
  [content sections]

Footer (same as rest of site)
```

### Privacy Policy (/legal/privacy)

Sections:
```
1. Introduction
   Who we are, what this policy covers, how to contact us

2. Information We Collect
   Account information (name, email, password hash)
   License and billing data (what you purchased, when)
   Usage data (which features are used — anonymized, no personal content)
   What we do NOT collect: your business data, customer data, transaction records

3. How We Use Your Information
   To provide and maintain your account
   To deliver license keys and software updates
   To send transactional emails (receipts, expiry reminders)
   To improve our products (only anonymized aggregate data)
   We never sell your data. Ever.

4. Data Storage and Security
   Account data: Supabase (hosted in appropriate region)
   Payment data: Stripe (we never store card details)
   Software data: stays on your device — we cannot access it
   Encryption: all data in transit via TLS, at rest encrypted

5. Your Rights
   Access your data
   Correct inaccurate data
   Delete your account and data
   Export your data
   Contact: [privacy@thraive.com]

6. Cookies
   We use only essential cookies (session management)
   No tracking cookies, no advertising cookies
   Dark mode preference stored in localStorage (not a cookie)

7. Third-Party Services
   Supabase (database and auth)
   Stripe (payments)
   Resend (transactional email)
   Vercel (hosting)
   GitHub (software distribution)
   Each has their own privacy policy

8. Children
   Our services are not directed at children under 13

9. Changes to This Policy
   We will notify you by email of material changes
   Last updated date always shown at top

10. Contact
    privacy@thraive.com
    Thraive Labs, Sri Lanka
```

### Terms of Service (/legal/terms)

Sections:
```
1. Acceptance
   By using our services you accept these terms

2. Description of Services
   Software products licensed for use
   Customer portal for license management
   All products are desktop/mobile applications

3. License Grant
   Personal, non-transferable, non-exclusive license
   Starter: use on up to N devices as defined by your plan
   Business: use on up to N devices across your organization
   One-time licenses: perpetual for the version purchased, updates for 1 year
   Subscription licenses: valid while subscription is active

4. Restrictions
   You may not resell, sublicense, or redistribute
   You may not reverse engineer (except as permitted by law)
   You may not use for illegal purposes
   You may not share license keys publicly

5. Payment Terms
   Prices in LKR, charged at purchase or subscription cycle
   Subscriptions auto-renew until cancelled
   Refund policy: 7 days from purchase if software does not function as described
   No refunds after 7 days or for subscription renewals already processed

6. Updates and Support
   We provide updates during the license period
   Support provided via email (support@thraive.com)
   We aim to respond within 2 business days
   We do not guarantee specific response times

7. Intellectual Property
   All software, trademarks, and content belong to Thraive Labs
   Your data belongs to you

8. Privacy
   See our Privacy Policy

9. Disclaimer of Warranties
   Software provided "as is"
   We do not guarantee the software will be error-free
   We are not liable for data loss — maintain your own backups

10. Limitation of Liability
    Our liability limited to the amount you paid in the last 12 months

11. Termination
    We may terminate accounts that violate these terms
    You may close your account at any time

12. Governing Law
    Laws of Sri Lanka

13. Changes
    We will notify you of material changes by email
    Continued use after changes = acceptance

14. Contact
    legal@thraive.com
    Thraive Labs, Sri Lanka
```

---

## Customer Portal (app.thraive.com)

See docs/portal.md for full spec.

Quick summary:
- Login with email/password (Supabase Auth)
- Dashboard: all owned licenses listed
- Downloads: download latest installer per product
- Billing: subscription management, upgrade/downgrade
- Settings: account email, password, 2FA, device management

Portal has the same seasonal engine as the main site at reduced intensity.
Sidebar navigation instead of top navbar.
No loading screen on portal pages.
