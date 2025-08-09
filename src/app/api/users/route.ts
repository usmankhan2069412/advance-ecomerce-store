import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    console.log('API: Fetching users from Supabase');
    let allUsers = [];
    let debugInfo = {
      profiles: { count: 0, error: null },
      profile_users: { count: 0, error: null }
    };

    // Create a Supabase client using server-side helper
    const supabase = await createClient();

    // Fetch from profiles table
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

    // Fetch from profile_users table
    console.log('Attempting to fetch from profile_users table...');
    const { data: profileUsers, error: profileUsersError } = await supabase
      .from('profile_users')
      .select('*');

    if (profileUsersError) {
      console.error('Error fetching profile_users:', profileUsersError);
      debugInfo.profile_users.error = profileUsersError.message;
    } else if (profileUsers && profileUsers.length > 0) {
      console.log(`Found ${profileUsers.length} users in profile_users table`);
      debugInfo.profile_users.count = profileUsers.length;

      const transformedProfileUsers = profileUsers.map(user => ({
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
      }));

      // Merge with existing users, avoiding duplicates by email
      const existingEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
      const newProfileUsers = transformedProfileUsers.filter(u =>
        u.email && !existingEmails.has(u.email.toLowerCase())
      );

      allUsers = [...allUsers, ...newProfileUsers];
    }

    console.log(`Total users found: ${allUsers.length}`);

    return NextResponse.json({
      success: true,
      data: allUsers,
      debug: debugInfo
    });
  } catch (error: any) {
    console.error('Unexpected error in users API:', error);

    return NextResponse.json({
      success: false,
      data: [],
      error: {
        message: error.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
