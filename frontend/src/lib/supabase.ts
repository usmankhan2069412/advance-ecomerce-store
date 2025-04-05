import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase client instance
 * Used for database operations throughout the application
 */
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;