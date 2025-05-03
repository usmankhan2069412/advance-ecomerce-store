-- Add phone and address columns to profiles table if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Create a function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(tbl text, col text) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = tbl
    AND column_name = col
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to safely add a column if it doesn't exist
CREATE OR REPLACE FUNCTION safe_add_column(tbl text, col text, type text) RETURNS void AS $$
BEGIN
  IF NOT column_exists(tbl, col) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', tbl, col, type);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add any missing columns to profiles
SELECT safe_add_column('profiles', 'phone', 'TEXT');
SELECT safe_add_column('profiles', 'address', 'TEXT');

-- Add any missing columns to profile_users
SELECT safe_add_column('profile_users', 'phone', 'TEXT');
SELECT safe_add_column('profile_users', 'address', 'TEXT');

-- Create a function to sync profile data between tables
CREATE OR REPLACE FUNCTION sync_profile_data() RETURNS void AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- For each profile
  FOR profile_record IN SELECT * FROM profiles LOOP
    -- Check if there's a corresponding profile_users entry
    IF EXISTS (SELECT 1 FROM profile_users WHERE profile_id = profile_record.id) THEN
      -- Update the existing profile_users entry
      UPDATE profile_users
      SET 
        name = profile_record.name,
        email = profile_record.email,
        updated_at = NOW()
      WHERE profile_id = profile_record.id;
    ELSE
      -- Create a new profile_users entry
      INSERT INTO profile_users (profile_id, name, email, phone, address, created_at, updated_at)
      VALUES (
        profile_record.id,
        profile_record.name,
        profile_record.email,
        profile_record.phone,
        profile_record.address,
        NOW(),
        NOW()
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the sync function
SELECT sync_profile_data();

-- Create a trigger to keep profiles and profile_users in sync
CREATE OR REPLACE FUNCTION sync_profile_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Create a corresponding profile_users entry
    INSERT INTO profile_users (profile_id, name, email, phone, address, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.name,
      NEW.email,
      NEW.phone,
      NEW.address,
      NOW(),
      NOW()
    )
    ON CONFLICT (profile_id) 
    DO UPDATE SET
      name = NEW.name,
      email = NEW.email,
      phone = NEW.phone,
      address = NEW.address,
      updated_at = NOW();
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update the corresponding profile_users entry
    UPDATE profile_users
    SET 
      name = NEW.name,
      email = NEW.email,
      phone = NEW.phone,
      address = NEW.address,
      updated_at = NOW()
    WHERE profile_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS sync_profile_trigger ON profiles;

-- Create the trigger
CREATE TRIGGER sync_profile_trigger
AFTER INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION sync_profile_trigger_function();
