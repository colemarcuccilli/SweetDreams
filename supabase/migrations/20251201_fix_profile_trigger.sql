-- ============================================================================
-- FIX PROFILE AUTO-CREATION TRIGGER
-- Date: December 1, 2025
-- Purpose: Fix the handle_new_user() trigger to work correctly
-- ============================================================================

-- Drop and recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  display_name_value TEXT;
  slug_value TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get user email from NEW record
  user_email := COALESCE(NEW.email, 'user');

  -- Extract display name from email (part before @)
  -- Fallback to 'user' if email is null
  display_name_value := COALESCE(split_part(user_email, '@', 1), 'user');

  -- Create initial slug from display name (remove non-alphanumeric)
  slug_value := LOWER(REGEXP_REPLACE(display_name_value, '[^a-zA-Z0-9]', '', 'g'));

  -- If slug is empty after cleaning, use 'user'
  IF slug_value = '' THEN
    slug_value := 'user';
  END IF;

  -- Ensure slug is unique by appending counter if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE public_profile_slug = slug_value) LOOP
    counter := counter + 1;
    slug_value := LOWER(REGEXP_REPLACE(display_name_value, '[^a-zA-Z0-9]', '', 'g')) || counter::TEXT;
  END LOOP;

  -- Insert profile for new user
  BEGIN
    INSERT INTO public.profiles (user_id, display_name, public_profile_slug)
    VALUES (NEW.id, display_name_value, slug_value);

    RAISE NOTICE 'Created profile for user % with slug %', NEW.id, slug_value;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but don't block user creation
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
      -- Re-raise the exception so Supabase knows it failed
      RAISE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFY PERMISSIONS
-- ============================================================================

-- Ensure the function can access both auth.users and public.profiles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- COMPLETED
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Profile trigger function updated with better error handling';
END $$;
