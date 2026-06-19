-- supabase/scripts/setup/create-auth-user-trigger.sql
-- Creates the auth.users signup trigger used to initialize public profile tables.
--
-- This version avoids relying on extensions.uuid_generate_v4() so new-user
-- creation does not fail when uuid-ossp has not been installed.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at, is_deleted)
  VALUES (NEW.id, NEW.email, NOW(), NOW(), FALSE);

  INSERT INTO public.user_preferences (id, user_id, has_completed_onboarding)
  VALUES (gen_random_uuid(), NEW.id, FALSE);

  INSERT INTO public.user_trials (id, user_id, trial_start_time, trial_end_time)
  VALUES (gen_random_uuid(), NEW.id, NOW(), NOW() + INTERVAL '48 hours');

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to initialize user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

SELECT
  'auth user trigger created' as status,
  tgname as trigger_name
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
