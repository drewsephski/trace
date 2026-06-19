-- supabase/scripts/setup/enable-pgcrypto-extension.sql
-- Enable pgcrypto so gen_random_uuid() is available for profile and trial rows.
--
-- NOTE: You must enable this extension from the Supabase Dashboard:
-- 1. Go to Database > Extensions
-- 2. Search for "pgcrypto"
-- 3. Click to enable it
--
-- Alternatively, run this SQL in the SQL Editor:

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

SELECT
  'pgcrypto extension status' as check,
  extname,
  extversion
FROM pg_extension
WHERE extname = 'pgcrypto';
