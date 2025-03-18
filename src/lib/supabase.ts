import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lbmatrvcyiefxukntwsu.supabase.co';
// Use environment variable for the key
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase client instance
 * Used for database operations throughout the application
 */
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 