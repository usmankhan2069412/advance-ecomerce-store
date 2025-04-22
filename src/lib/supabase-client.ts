"use client";

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fighfyrrdtzjemggtbxw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZ2hmeXJyZHR6amVtZ2d0Ynh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTc2MzIsImV4cCI6MjA1OTc5MzYzMn0.CnGk7YbzGqLhwqPaFaHLY13Af1mRXX87tEWW54OkEJ4';

// Validate environment variables
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase-auth-token',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Export types for better type safety
export type { User, Session } from '@supabase/supabase-js';
