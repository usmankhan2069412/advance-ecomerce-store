import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Initialize direct Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fighfyrrdtzjemggtbxw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZ2hmeXJyZHR6amVtZ2d0Ynh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTc2MzIsImV4cCI6MjA1OTc5MzYzMn0.CnGk7YbzGqLhwqPaFaHLY13Af1mRXX87tEWW54OkEJ4';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase clients
    const supabase = await createClient();
    const directClient = createSupabaseClient(supabaseUrl, supabaseKey);

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        auth: false,
        profile_users: false,
        localStorage: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Note: We're skipping the auth.users table check since it requires admin privileges
    // This is expected behavior when using the anon key
    console.log('Skipping auth.users check - requires service role key');

    // We'll focus on checking the profile_users table instead

    // Check profile_users table - try different column names since we're not sure of the schema
    try {
      // First try with email field
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table with email field:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      } else {
        // Try a more flexible approach - get all users and filter
        const { data: allProfileUsers, error: allUsersError } = await supabase
          .from('profile_users')
          .select('*');

        if (allUsersError) {
          console.error('Error fetching all profile_users:', allUsersError);
        } else if (allProfileUsers && allProfileUsers.length > 0) {
          console.log(`Found ${allProfileUsers.length} users in profile_users table, checking for match`);

          // Log the first user to understand the schema
          if (allProfileUsers.length > 0) {
            console.log('Sample user schema:', Object.keys(allProfileUsers[0]));
          }

          // Try to find the user by email in any field that might contain it
          const foundUser = allProfileUsers.find(user => {
            // Check all string fields for the email
            return Object.entries(user).some(([key, value]) => {
              if (typeof value === 'string' && value.toLowerCase() === email.toLowerCase()) {
                console.log(`Found match in field: ${key}`);
                return true;
              }
              return false;
            });
          });

          if (foundUser) {
            console.log('User found in profile_users table by searching all fields:', foundUser);
            results.found = true;
            results.locations.profile_users = true;

            if (!results.userData) {
              results.userData = foundUser;
            }
          }
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
