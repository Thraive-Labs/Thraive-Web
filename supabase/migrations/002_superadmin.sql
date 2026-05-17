-- =============================================================
-- Create superadmin staff record
-- =============================================================
-- STEP 1: First create the user in Supabase Auth
--   Dashboard > Authentication > Users > Add user
--   Set email + password, confirm email immediately
--
-- STEP 2: Copy the UUID from the created user, then run:
-- =============================================================

INSERT INTO public.staff (id, full_name, role, is_active)
VALUES (
  '41745f61-c61b-4564-b037-32bffd403e45',   -- replace with the UUID from Supabase Auth
  'Udeesha Kularathne',              -- change to the real name
  'superadmin',
  true
)
ON CONFLICT (id) DO UPDATE
  SET role = 'superadmin', is_active = true;
