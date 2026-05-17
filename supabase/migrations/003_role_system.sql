-- =============================================================
-- Migration 003: Role system fixes + consumer blocking
-- Run in Supabase SQL Editor
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Fix: staff can read their own record
--    Unblocks login page redirect + Navbar auth state
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read own record"
  ON public.staff
  FOR SELECT
  USING (auth.uid() = id);

-- ---------------------------------------------------------------
-- 2. Fix: staff can read ALL staff records
--    Required for staff management page list view
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read all staff"
  ON public.staff
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 3. Staff can read all user profiles (admin customers page)
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read all user profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 4. Staff can read all licenses (admin licenses page)
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read all licenses"
  ON public.licenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 5. Staff can read all payment history (admin payments page)
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read all payment history"
  ON public.payment_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 6. Staff can read all license devices (admin devices page)
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read all license devices"
  ON public.license_devices
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 7. Staff can read audit log
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read audit log"
  ON public.audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 8. Staff can read and write customer notes
-- ---------------------------------------------------------------
CREATE POLICY "Staff can read customer notes"
  ON public.customer_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

CREATE POLICY "Staff can insert customer notes"
  ON public.customer_notes
  FOR INSERT
  WITH CHECK (
    staff_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() AND s.is_active = true
    )
  );

-- ---------------------------------------------------------------
-- 9. Add is_blocked to user_profiles for consumer blocking
-- ---------------------------------------------------------------
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;

-- ---------------------------------------------------------------
-- 10. Simplify staff roles to superadmin and admin only
-- ---------------------------------------------------------------
UPDATE public.staff SET role = 'admin' WHERE role IN ('support', 'finance');

ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE public.staff ADD CONSTRAINT staff_role_check CHECK (role IN ('superadmin', 'admin'));
