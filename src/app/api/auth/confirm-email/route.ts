import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with admin privileges
// Note: This should only be used in server-side code
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', // This is a server-side only key with admin privileges
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if we have the service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error',
          message: 'Please contact support to resolve this issue'
        },
        { status: 500 }
      );
    }

    // Get the user by email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers({
      filters: {
        email: email
      }
    });

    if (getUserError || !users || users.users.length === 0) {
      console.error('Error finding user:', getUserError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          message: 'No account found with this email address'
        },
        { status: 404 }
      );
    }

    const userId = users.users[0].id;

    // Update the user to confirm their email
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Error confirming email:', updateError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to confirm email',
          message: 'An error occurred while confirming your email'
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Email confirmed successfully' 
    });
  } catch (error) {
    console.error('Unexpected error in confirm-email API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
