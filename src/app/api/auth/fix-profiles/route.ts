import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req: Request) {
  try {
    // Check if we have the service role key
    if (!supabaseServiceKey) {
      console.error('Missing SUPABASE_SERVICE_KEY environment variable');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error',
          message: 'Missing service key'
        },
        { status: 500 }
      );
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch profiles',
          message: profilesError.message
        },
        { status: 500 }
      );
    }

    console.log(`Found ${profiles.length} profiles to check`);
    
    // For each profile, check if there's a corresponding profile_users entry
    const results = {
      total: profiles.length,
      created: 0,
      errors: 0,
      details: [] as string[]
    };

    for (const profile of profiles) {
      try {
        // Check if profile_users entry exists
        const { data: profileUser, error: checkError } = await supabaseAdmin
          .from('profile_users')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle();

        if (checkError) {
          console.error(`Error checking profile_users for ${profile.id}:`, checkError);
          results.errors++;
          results.details.push(`Error checking profile ${profile.id}: ${checkError.message}`);
          continue;
        }

        // If no profile_users entry exists, create one
        if (!profileUser) {
          const { error: createError } = await supabaseAdmin
            .from('profile_users')
            .insert([{
              profile_id: profile.id,
              name: profile.name,
              email: profile.email,
              phone: '',
              address: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (createError) {
            console.error(`Error creating profile_users for ${profile.id}:`, createError);
            results.errors++;
            results.details.push(`Error creating profile_users for ${profile.id}: ${createError.message}`);
          } else {
            results.created++;
            results.details.push(`Created profile_users for ${profile.id}`);
          }
        }
      } catch (error: any) {
        console.error(`Unexpected error processing profile ${profile.id}:`, error);
        results.errors++;
        results.details.push(`Unexpected error for ${profile.id}: ${error.message}`);
      }
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${results.total} profiles, created ${results.created} profile_users entries, encountered ${results.errors} errors`,
      results
    });
  } catch (error: any) {
    console.error('Unexpected error in fix-profiles API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
