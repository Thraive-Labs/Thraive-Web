-- =============================================================
-- Thraive Labs — Full Schema Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- =============================================================

-- ---------------------------------------------------------------
-- 1. user_profiles
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         text NOT NULL DEFAULT '',
  stripe_customer_id text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------
-- 2. licenses
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.licenses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product           text NOT NULL,
  plan              text NOT NULL,
  billing_type      text NOT NULL CHECK (billing_type IN ('monthly', 'annual', 'one_time')),
  status            text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
  license_key       text NOT NULL UNIQUE,
  stripe_sub_id     text,
  expires_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own licenses"
  ON public.licenses FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (used by webhooks)
CREATE POLICY "Service role full access on licenses"
  ON public.licenses FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------
-- 3. payment_history
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_history (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_id        uuid REFERENCES public.licenses(id) ON DELETE SET NULL,
  amount_cents      integer,
  currency          text NOT NULL DEFAULT 'LKR',
  stripe_payment_id text,
  status            text NOT NULL DEFAULT 'paid'
                    CHECK (status IN ('paid', 'failed', 'refunded')),
  paid_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payment history"
  ON public.payment_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on payment_history"
  ON public.payment_history FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------
-- 4. notification_prefs
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_prefs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  marketing_emails  boolean NOT NULL DEFAULT true,
  product_updates   boolean NOT NULL DEFAULT true,
  billing_alerts    boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notification prefs"
  ON public.notification_prefs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own notification prefs"
  ON public.notification_prefs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- 5. license_devices
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.license_devices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id     uuid NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  device_id      text NOT NULL,
  platform       text NOT NULL CHECK (platform IN ('windows', 'android', 'mac', 'linux')),
  is_active      boolean NOT NULL DEFAULT true,
  activated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.license_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read devices on own licenses"
  ON public.license_devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.licenses l
      WHERE l.id = license_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on license_devices"
  ON public.license_devices FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------
-- 6. staff
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text NOT NULL,
  role        text NOT NULL CHECK (role IN ('superadmin', 'admin', 'support', 'finance')),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  last_login  timestamptz
);

-- Staff table is read by middleware (service role) only — no RLS needed for portal users
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on staff"
  ON public.staff FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------
-- 7. audit_log
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  action       text NOT NULL,
  target_type  text,
  target_id    text,
  details      jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on audit_log"
  ON public.audit_log FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------
-- 8. customer_notes
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_id     uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  note         text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on customer_notes"
  ON public.customer_notes FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------
-- 9. products (catalog — admin read-only view)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  tagline     text,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Service role full access on products"
  ON public.products FOR ALL
  USING (auth.role() = 'service_role');

-- Seed product catalog
INSERT INTO public.products (slug, name, tagline, status) VALUES
  ('wildcafe',  'WildCafe POS',  'Complete cafe and restaurant management',        'active'),
  ('smartpos',  'SmartPOS',      'Retail point-of-sale for any shop size',          'active'),
  ('pharmacy',  'Pharmacy POS',  'Prescription management and inventory control',   'active'),
  ('routeflow', 'RouteFlow',     'Field sales and route optimisation',              'active'),
  ('autoserv',  'AutoServ',      'Vehicle workshop and service management',         'active'),
  ('sonara',    'Sonara',        'AI productivity suite for business teams',        'active')
ON CONFLICT (slug) DO NOTHING;
