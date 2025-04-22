-- Create profile_users table with foreign key to profiles
CREATE TABLE IF NOT EXISTS profile_users (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_profile FOREIGN KEY (profile_id) REFERENCES profiles(id),
  CONSTRAINT unique_profile_id UNIQUE (profile_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profile_users_profile_id ON profile_users(profile_id);

-- Enable Row Level Security on profile_users
ALTER TABLE profile_users ENABLE ROW LEVEL SECURITY;

-- Create policies for profile_users
CREATE POLICY "Users can view their own profile_users" 
  ON profile_users 
  FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own profile_users" 
  ON profile_users 
  FOR UPDATE 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own profile_users" 
  ON profile_users 
  FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

-- Create function to automatically create profile_users entry when a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_users (profile_id, name, email)
  VALUES (NEW.id, NEW.name, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new profile creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_profile();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_profile_users_updated_at
BEFORE UPDATE ON profile_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing profiles to profile_users
INSERT INTO profile_users (profile_id, name, email)
SELECT id, name, email FROM profiles
ON CONFLICT (profile_id) DO NOTHING;
