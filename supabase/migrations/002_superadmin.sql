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
  '<PASTE-USER-UUID-HERE>',   -- replace with the UUID from Supabase Auth
  'Super Admin',              -- change to the real name
  'superadmin',
  true
)
ON CONFLICT (id) DO UPDATE
  SET role = 'superadmin', is_active = true;
