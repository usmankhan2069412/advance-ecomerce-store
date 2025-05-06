import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Initialize direct Supabase client with admin privileges for debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fighfyrrdtzjemggtbxw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZ2hmeXJyZHR6amVtZ2d0Ynh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTc2MzIsImV4cCI6MjA1OTc5MzYzMn0.CnGk7YbzGqLhwqPaFaHLY13Af1mRXX87tEWW54OkEJ4';

export async function GET(req: Request) {
  try {
    console.log('API: Fetching users from Supabase');
    let allUsers = [];
    let debugInfo = {
      profiles: { count: 0, error: null },
      auth: { count: 0, error: null },
      profile_users: { count: 0, error: null },
      localStorage: { count: 0 }
    };

    // Create a Supabase client
    const supabase = await createClient();

    // First, try to get basic profile data
    console.log('Attempting to fetch from profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, avatar_url, created_at, updated_at');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      debugInfo.profiles.error = profilesError.message;
    } else {
      console.log(`Found ${profiles?.length || 0} profiles in the profiles table`);
      debugInfo.profiles.count = profiles?.length || 0;

      if (profiles && profiles.length > 0) {
        // Transform profiles into user objects
        const profileUsers = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown',
          email: profile.email || 'No email',
          avatar_url: profile.avatar_url,
          role: "Customer",
          status: "Active",
          lastLogin: profile.updated_at,
          createdAt: profile.created_at,
          phone: '',
          address: '',
          source: 'profiles'
        }));

        allUsers = [...allUsers, ...profileUsers];
      }
    }

    // Try to get users from auth.users table
    try {
      console.log('Attempting to fetch from auth.users table...');

      // Create a direct client for accessing auth schema
      const directClient = createSupabaseClient(supabaseUrl, supabaseKey);

      // Note: We're skipping the admin.listUsers() method since it requires admin privileges
      // and we're using the anon key. This is expected behavior.
      console.log('Skipping auth.admin.listUsers() - requires service role key');
      debugInfo.auth.error = "Admin API access requires service role key (expected, not an error)";

      // Instead, we'll focus on getting users from the profile_users table
      // which should contain all the users who have signed up on the website
    } catch (authFetchError) {
      console.error('Error accessing auth.users table:', authFetchError);
      debugInfo.auth.error = authFetchError.message || 'Unknown error';
    }

    // Always check the profile_users table, not just as a fallback
    console.log('Attempting to fetch from profile_users table...');
    const { data: profileUsers, error: profileUsersError } = await supabase
      .from('profile_users')
      .select('*'); // Select all columns to get all available data

    if (profileUsersError) {
      console.error('Error fetching profile_users:', profileUsersError);
      debugInfo.profile_users.error = profileUsersError.message;
    } else if (profileUsers && profileUsers.length > 0) {
      console.log(`Found ${profileUsers.length} users in profile_users table`);
      debugInfo.profile_users.count = profileUsers.length;

      const transformedProfileUsers = profileUsers.map(user => {
        // Log the user data to understand its structure
        console.log('Profile user data:', user);

        return {
          id: user.id || user.profile_id || `pu_${Math.random().toString(36).substring(2, 10)}`,
          name: user.name || user.full_name || 'Unknown',
          email: user.email || 'No email',
          avatar_url: user.avatar_url || null,
          role: user.role || "Customer",
          status: user.status || "Active",
          lastLogin: user.last_login || user.updated_at || user.created_at,
          createdAt: user.created_at || new Date().toISOString(),
          phone: user.phone || '',
          address: user.address || '',
          source: 'profile_users'
        };
      });

      // Merge with existing users, avoiding duplicates by email
      const existingEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
      const newProfileUsers = transformedProfileUsers.filter(u =>
        u.email && !existingEmails.has(u.email.toLowerCase())
      );

      allUsers = [...allUsers, ...newProfileUsers];
    }

    // Try to get users from localStorage as a last resort
    try {
      // This will only work on the client side, but we can check if there's any data in localStorage
      // that we can use to supplement our user list
      if (typeof window !== 'undefined' && window.localStorage) {
        const localStorageUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (localStorageUsers.length > 0) {
          console.log(`Found ${localStorageUsers.length} users in localStorage`);
          debugInfo.localStorage.count = localStorageUsers.length;

          // Add these users if they're not already in our list
          const existingIds = new Set(allUsers.map(u => u.id));
          const newLocalUsers = localStorageUsers.filter(u => !existingIds.has(u.id));

          allUsers = [...allUsers, ...newLocalUsers.map(u => ({
            ...u,
            source: 'localStorage'
          }))];
        }
      }
    } catch (localStorageError) {
      console.error('Error accessing localStorage:', localStorageError);
    }

    // Log the final result
    console.log(`Total users found across all sources: ${allUsers.length}`);

    // Don't create default users - we want to show only real users from the database
    if (allUsers.length === 0) {
      console.log('No users found in any data source');
    }

    // Return the combined results with debug info
    return NextResponse.json({
      success: true,
      data: allUsers,
      debug: debugInfo
    });
  } catch (error: any) {
    console.error('Unexpected error in users API:', error);

    // Return error without mock data
    return NextResponse.json({
      success: false,
      data: [],
      error: {
        message: error.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}
