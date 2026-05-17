-- App versions table: tracks current downloadable version per product+platform

CREATE TABLE app_versions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product      text NOT NULL,
  platform     text NOT NULL CHECK (platform IN ('windows', 'android')),
  version      text NOT NULL,
  min_version  text,
  download_url text NOT NULL,
  file_size    text,
  checksum     text,
  changelog    text,
  is_current   boolean DEFAULT false,
  released_at  timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now()
);

-- Only one current version per product+platform
CREATE UNIQUE INDEX app_versions_current_idx ON app_versions (product, platform) WHERE is_current = true;

-- RLS: any authenticated user can read current versions
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read app versions"
  ON app_versions FOR SELECT
  TO authenticated
  USING (true);

-- Seed data
INSERT INTO app_versions (product, platform, version, min_version, download_url, file_size, checksum, changelog, is_current, released_at) VALUES
  ('wildcafe',  'windows', '1.2.4', '1.0.0', 'https://github.com/thraive-labs/wildcafe/releases/download/v1.2.4/WildCafe-Setup-1.2.4.exe',  '23.4 MB', 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890ab', 'Bug fixes and performance improvements', true, '2026-01-10 00:00:00+00'),
  ('wildcafe',  'android', '1.2.3', '1.0.0', 'https://github.com/thraive-labs/wildcafe/releases/download/v1.2.3/WildCafe-1.2.3.apk',          '18.1 MB', 'b2c3d4e5f67890ab1234567890abcdef1234567890abcdef1234567890abcdef12', 'Bug fixes and performance improvements', true, '2026-01-08 00:00:00+00'),

  ('smartpos',  'windows', '2.0.1', '1.5.0', 'https://github.com/thraive-labs/smartpos/releases/download/v2.0.1/SmartPOS-Setup-2.0.1.exe',      '31.2 MB', 'c3d4e5f67890abcd1234567890abcdef1234567890abcdef1234567890abcdef12', 'New inventory module, offline sync improvements', true, '2026-03-05 00:00:00+00'),
  ('smartpos',  'android', '2.0.0', '1.5.0', 'https://github.com/thraive-labs/smartpos/releases/download/v2.0.0/SmartPOS-2.0.0.apk',            '22.5 MB', 'd4e5f67890abcde1234567890abcdef1234567890abcdef1234567890abcdef123', 'New inventory module', true, '2026-03-01 00:00:00+00'),

  ('pharmacy',  'windows', '1.1.2', '1.0.0', 'https://github.com/thraive-labs/pharmacy/releases/download/v1.1.2/PharmacyPOS-Setup-1.1.2.exe',    '27.8 MB', 'e5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234', 'Improved expiry tracking, minor UI fixes', true, '2026-02-14 00:00:00+00'),
  ('pharmacy',  'android', '1.1.1', '1.0.0', 'https://github.com/thraive-labs/pharmacy/releases/download/v1.1.1/PharmacyPOS-1.1.1.apk',          '19.3 MB', 'f67890abcdef12345678901234567890abcdef1234567890abcdef1234567890ab', 'Minor fixes', true, '2026-02-10 00:00:00+00'),

  ('routeflow', 'windows', '1.0.5', '1.0.0', 'https://github.com/thraive-labs/routeflow/releases/download/v1.0.5/RouteFlow-Setup-1.0.5.exe',      '29.1 MB', '7890abcdef123456789012345678901234567890abcdef1234567890abcdef1234', 'GPS accuracy improvements', true, '2026-04-01 00:00:00+00'),
  ('routeflow', 'android', '1.0.5', '1.0.0', 'https://github.com/thraive-labs/routeflow/releases/download/v1.0.5/RouteFlow-1.0.5.apk',            '24.6 MB', '890abcdef1234567890123456789012345678901234567890abcdef1234567890a', 'GPS accuracy improvements', true, '2026-04-01 00:00:00+00'),

  ('autoserv',  'windows', '1.0.2', '1.0.0', 'https://github.com/thraive-labs/autoserv/releases/download/v1.0.2/AutoServ-Setup-1.0.2.exe',        '25.3 MB', '90abcdef12345678901234567890123456789012345678901234567890abcdef12', 'Queue management fixes', true, '2026-03-20 00:00:00+00'),
  ('autoserv',  'android', '1.0.2', '1.0.0', 'https://github.com/thraive-labs/autoserv/releases/download/v1.0.2/AutoServ-1.0.2.apk',              '20.7 MB', '0abcdef123456789012345678901234567890123456789012345678901234567890', 'Queue management fixes', true, '2026-03-20 00:00:00+00'),

  ('sonara',    'windows', '3.1.0', '2.0.0', 'https://github.com/thraive-labs/sonara/releases/download/v3.1.0/Sonara-Setup-3.1.0.exe',            '18.9 MB', 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', 'AI assistant improvements, new voice commands', true, '2026-04-15 00:00:00+00'),
  ('sonara',    'android', '3.0.8', '2.0.0', 'https://github.com/thraive-labs/sonara/releases/download/v3.0.8/Sonara-3.0.8.apk',                  '15.2 MB', 'bcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc', 'Stability fixes', true, '2026-04-10 00:00:00+00');
