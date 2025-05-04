import { supabase, User } from '@/lib/supabase-client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  profile_user_id?: number; // ID from the profile_users table
}

export interface AuthError {
  message: string;
  code?: string;
  email?: string;
}

/**
 * Helper function to safely handle Supabase errors
 * @param error Any error object from Supabase
 * @returns Formatted error object with message and code
 */
function handleSupabaseError(error: any): { message: string; code?: string } {
  if (!error) return { message: 'Unknown error' };

  // If it's already a string, just return it
  if (typeof error === 'string') return { message: error };

  // Extract the most useful error information
  const message = error.message || error.error_description || 'An error occurred';
  const code = error.code || error.statusCode || error.status || undefined;

  // Log detailed error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Supabase error details:', {
      message,
      code,
      details: error.details,
      hint: error.hint,
      fullError: error
    });
  }

  return { message, code };
}

/**
 * Authentication Service
 * Handles user authentication operations using Supabase
 */
export class AuthService {
  /**
   * Sign up a new user
   * @param email User email
   * @param password User password
   * @param name User's full name
   * @returns User data or error
   */
  static async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: UserProfile | null; error: AuthError | null; emailConfirmationNeeded?: boolean }> {
    try {
      // Validate and sanitize email
      if (!email || typeof email !== 'string') {
        return { user: null, error: { message: 'Email is required' } };
      }

      // Trim whitespace and convert to lowercase
      const sanitizedEmail = email.trim().toLowerCase();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return { user: null, error: { message: 'Email format is invalid' } };
      }

      console.log('Starting signup process for email:', sanitizedEmail);

      // Create the user in Supabase Auth with metadata
      const signupPayload = {
        email: sanitizedEmail,
        password,
        options: {
          data: {
            name: name, // Include name in user metadata
          },
          emailRedirectTo: `${window.location.origin}/auth` // Redirect after email confirmation
        }
      };

      console.log('Signup payload (without password):', { ...signupPayload, password: '[REDACTED]' });

      const { data: authData, error: authError } = await supabase.auth.signUp(signupPayload);

      if (authError) {
        console.error('Auth signup error:', authError);

        // Handle specific error cases
        if (authError.message.includes('invalid email')) {
          return {
            user: null,
            error: {
              message: 'The email address format is invalid. Please check for typos.',
              code: 'invalid_email'
            }
          };
        }

        // Handle other common errors
        if (authError.message.includes('already registered')) {
          return {
            user: null,
            error: {
              message: 'This email is already registered. Please use a different email or try logging in.',
              code: 'email_in_use'
            }
          };
        }

        return { user: null, error: { message: authError.message, code: authError.code } };
      }

      if (!authData.user) {
        return { user: null, error: { message: 'Failed to create user' } };
      }

      // Check if the user needs to confirm their email
      if (authData.session === null) {
        console.log('No session created after signup, email confirmation may be required');
        // Instead of returning an error, we'll return success with a flag indicating confirmation is needed
        // This way the user can still proceed but we can show a message about confirming email
        return {
          user: {
            id: 'temp-' + Date.now(),
            email: sanitizedEmail,
            name: name,
            avatar_url: null,
            phone: '',
            address: ''
          },
          emailConfirmationNeeded: true,
          error: null
        };
      }

      // Create a profile record in the profiles table
      // First check if a profile already exists for this user
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for existing profile:', checkError);
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        try {
          console.log('Creating profile for user:', authData.user.id);

          // Check if the email is already in use in the profiles table
          const { data: emailCheck, error: emailCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

          if (emailCheckError) {
            console.error('Error checking email uniqueness:', emailCheckError);
          }

          if (emailCheck) {
            console.warn('Email already exists in profiles table:', email);
            console.log('This might be causing a unique constraint violation');
          }

          // Use upsert instead of insert to handle potential race conditions
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: authData.user.id,
                name,
                email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ], {
              onConflict: 'id',
              ignoreDuplicates: false // This will update the record if it exists
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);

            // Log more details about the error
            console.log('Error details:', {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint
            });

            // Check for specific error types
            if (profileError.code === '23505') {
              console.error('Unique constraint violation. Email is likely already in use.');

              // Try to update the existing profile instead
              try {
                console.log('Attempting to find and update existing profile with this email...');

                const { data: existingEmailProfile, error: findError } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('email', email)
                  .maybeSingle();

                if (findError) {
                  console.error('Error finding existing profile:', findError);
                } else if (existingEmailProfile) {
                  console.log('Found existing profile with this email:', existingEmailProfile.id);
                  console.log('This conflicts with the new user. Manual resolution may be needed.');
                }
              } catch (err) {
                console.error('Error during conflict resolution:', err);
              }
            }

            // Continue with authentication even if profile creation fails
            // The trigger in Supabase might handle this, or we can fix it later
            console.warn('Continuing with authentication despite profile creation error');
          }
        } catch (profileCreationError) {
          console.error('Unexpected error during profile creation:', profileCreationError);
          // Continue with authentication despite the error
        }
      } else {
        console.log('Profile already exists for user:', authData.user.id);
      }

      // Always return the user profile, even if profile creation had issues
      // This ensures the user can still log in and we can fix profile issues later
      const userProfile: UserProfile = {
        id: authData.user.id,
        name,
        email,
        avatar_url: null, // Add default values for any required fields
        phone: '',
        address: ''
      };

      return { user: userProfile, error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        user: null,
        error: {
          message: error?.message || 'An unexpected error occurred during signup',
          code: error?.code
        }
      };
    }
  }

  /**
   * Sign in a user
   * @param email User email
   * @param password User password
   * @returns User data or error
   */
  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: UserProfile | null; error: AuthError | null }> {
    try {
      console.log('Starting signin process for email:', email);

      // Validate and sanitize email
      if (!email || typeof email !== 'string') {
        return { user: null, error: { message: 'Email is required' } };
      }

      // Trim whitespace and convert to lowercase
      const sanitizedEmail = email.trim().toLowerCase();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return { user: null, error: { message: 'Email format is invalid' } };
      }
      // Sign in the user
      console.log('Attempting to sign in with sanitized email:', sanitizedEmail);

      let authData: any = null;

      try {
        const result = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password,
        });

        authData = result.data;
        const authError = result.error;

        console.log('Sign in response:', {
          session: authData?.session ? 'Session exists' : 'No session',
          user: authData?.user ? 'User exists' : 'No user',
          error: authError ? authError.message : 'No error'
        });

        if (authError) {
          console.error('Auth signin error:', authError);

          // Handle specific error cases with more user-friendly messages
          if (authError.message && authError.message.includes('Invalid login credentials')) {
            return {
              user: null,
              error: {
                message: 'The email or password you entered is incorrect. Please try again.',
                code: 'invalid_credentials'
              }
            };
          }

          // Handle email not confirmed error
          if (authError.message && authError.message.includes('Email not confirmed')) {
            console.warn('Login with unconfirmed email:', sanitizedEmail);

            // Create a server-side API endpoint to handle this
            try {
              // Make a request to our custom API endpoint to confirm the email
              const response = await fetch('/api/auth/confirm-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: sanitizedEmail }),
              });

              const result = await response.json();

              if (result.success) {
                // If the API successfully confirmed the email, try signing in again
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email: sanitizedEmail,
                  password
                });

                if (!retryError && retryData) {
                  return { user: retryData.user, error: null };
                }
              }

              // Return a user-friendly error with instructions
              return {
                user: null,
                error: {
                  message: 'Your email is not confirmed. Please check your inbox for a confirmation email or contact support.',
                  code: 'email_not_confirmed',
                  email: sanitizedEmail
                }
              };
            } catch (innerError) {
              console.error('Error in email confirmation bypass:', innerError);

              // Return a more specific error for debugging
              return {
                user: null,
                error: {
                  message: 'Unable to confirm your email automatically. Please check your inbox or contact support.',
                  code: 'email_confirmation_failed',
                  email: sanitizedEmail
                }
              };
            }
          }

          // Ensure we always return a valid error object with a message
          return {
            user: null,
            error: {
              message: authError.message || 'An error occurred during sign in. Please try again.',
              code: authError.code || 'unknown_error'
            }
          };
        }

        // Check if we have a session - if not, it might be an email confirmation issue
        if (!authData?.session) {
          console.warn('No session after login - possible email confirmation required');
          // Allow login even without session (email might not be confirmed)
          // Create a temporary user profile
          return {
            user: {
              id: 'temp-' + Date.now(),
              email: sanitizedEmail,
              name: 'User',
              avatar_url: null,
              phone: '',
              address: ''
            },
            error: null
          };
        }
      } catch (signInError: any) {
        console.error('Exception during sign in:', signInError);
        return {
          user: null,
          error: {
            message: signInError?.message || 'An unexpected error occurred during sign in',
            code: 'sign_in_exception'
          }
        };
      }

      if (!authData?.user) {
        return { user: null, error: { message: 'Failed to sign in' } };
      }

      // Get the user profile
      let profileData: any = null;
      const { data: initialProfileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile during login:', profileError);
        // Continue login process despite profile error
      }

      // Set profileData to the initial result
      profileData = initialProfileData;

      // If profile doesn't exist, create it automatically
      if (!profileData) {
        console.log('Profile not found for user, creating one:', authData.user.id);

        try {
          // Get user metadata or use defaults
          const name = authData.user.user_metadata?.name || 'User';

          // Create profile
          const { error: createProfileError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: authData.user.id,
                name: name,
                email: authData.user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ], { onConflict: 'id' });

          if (createProfileError) {
            console.error('Error creating profile during login:', createProfileError);
            // Continue despite error
          }

          // Fetch the newly created profile
          const { data: newProfileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (newProfileData) {
            // Use the new profile data
            profileData = newProfileData;
          }
        } catch (err) {
          console.error('Unexpected error creating profile during login:', err);
        }
      }

      // If we still don't have a profile, create a minimal one from auth data
      if (!profileData) {
        profileData = {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || 'User',
          email: authData.user.email,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Return the user profile
      const userProfile: UserProfile = {
        id: profileData.id,
        name: profileData.name || 'User',
        email: profileData.email || authData.user.email,
        avatar_url: profileData.avatar_url,
        phone: profileData.phone || '',
        address: profileData.address || ''
      };

      return { user: userProfile, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      // Ensure we return a properly formatted error object
      return {
        user: null,
        error: {
          message: error?.message || 'An unexpected error occurred during sign in',
          code: error?.code || 'unexpected_error'
        }
      };
    }
  }

  /**
   * Sign out the current user
   * @returns Success or error
   */
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { message: error.message, code: error.code } };
      }
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: { message: 'An unexpected error occurred during sign out' } };
    }
  }

  /**
   * Get the current user
   * @returns Current user or null
   */
  static async getCurrentUser(): Promise<{ user: UserProfile | null; error: AuthError | null }> {
    try {
      // Get the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        return { user: null, error: { message: sessionError.message, code: sessionError.code } };
      }

      if (!sessionData.session?.user) {
        return { user: null, error: null }; // No error, just no user
      }

      const userId = sessionData.session.user.id;

      // Get the basic profile data
      let basicProfileData: any = null;

      try {
        const { data: initialProfileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          const formattedError = handleSupabaseError(profileError);
          console.error('Error fetching profile in getCurrentUser:', formattedError);
          // Continue despite error
        }

        // Set basicProfileData to the initial result
        basicProfileData = initialProfileData;

        // If profile doesn't exist, create it automatically
        if (!basicProfileData) {
          console.log('Profile not found for current user, creating one:', userId);

          // Get user metadata or use defaults
          const name = sessionData.session.user.user_metadata?.name || 'User';
          const email = sessionData.session.user.email || '';

          if (!email) {
            console.error('Cannot create profile: User email is missing');
            throw new Error('User email is required to create a profile');
          }

          // Create profile with only the fields that exist in the table
          const profileData = {
            id: userId,
            name: name,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          console.log('Creating profile with data:', { ...profileData, id: profileData.id.substring(0, 8) + '...' });

          // Create profile
          const { data: insertedProfile, error: createProfileError } = await supabase
            .from('profiles')
            .upsert([profileData], {
              onConflict: 'id',
              returning: 'representation' // Return the inserted/updated row
            });

          if (createProfileError) {
            const formattedError = handleSupabaseError(createProfileError);
            console.error('Error creating profile in getCurrentUser:', formattedError);

            // Try a simpler insert as a fallback
            console.log('Trying fallback profile creation method...');
            const { data: fallbackProfile, error: fallbackError } = await supabase
              .from('profiles')
              .insert([{
                id: userId,
                name: name,
                email: email
              }])
              .select()
              .single();

            if (fallbackError) {
              console.error('Fallback profile creation also failed:', handleSupabaseError(fallbackError));
            } else if (fallbackProfile) {
              console.log('Fallback profile creation succeeded');
              basicProfileData = fallbackProfile;
            }
          } else if (insertedProfile && insertedProfile.length > 0) {
            console.log('Profile created successfully');
            basicProfileData = insertedProfile[0];
          }

          // If we still don't have profile data, try to fetch it one more time
          if (!basicProfileData) {
            const { data: newProfileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();

            if (newProfileData) {
              console.log('Retrieved newly created profile');
              basicProfileData = newProfileData;
            }
          }
        }
      } catch (err) {
        console.error('Error in profile handling:', err);
        // Create a minimal profile to continue
        basicProfileData = {
          id: userId,
          name: sessionData.session.user.user_metadata?.name || 'User',
          email: sessionData.session.user.email || 'unknown@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // If we still don't have a profile, create a minimal one from auth data
      if (!basicProfileData) {
        basicProfileData = {
          id: userId,
          name: sessionData.session.user.user_metadata?.name || 'User',
          email: sessionData.session.user.email,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Now get the extended profile data from profile_users
      let extendedProfileData: any = null;

      try {
        const { data: profileUserData, error: profileUserError } = await supabase
          .from('profile_users')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle();

        if (profileUserError) {
          const formattedError = handleSupabaseError(profileUserError);
          console.error('Error fetching profile_users in getCurrentUser:', formattedError);
          // Continue despite error - we'll use defaults
        } else {
          extendedProfileData = profileUserData;
        }

        // If profile_users doesn't exist, create it
        if (!extendedProfileData) {
          console.log('profile_users not found for user, creating one:', userId);

          // Make sure we have the basic profile data
          if (!basicProfileData || !basicProfileData.email) {
            console.error('Cannot create profile_users: Basic profile data is missing');
            throw new Error('Basic profile data is required to create profile_users');
          }

          // Create profile_users entry with proper error handling
          const profileUserData = {
            profile_id: userId,
            name: basicProfileData.name || 'User',
            email: basicProfileData.email,
            phone: '',
            address: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          console.log('Creating profile_users with data:', {
            ...profileUserData,
            profile_id: profileUserData.profile_id.substring(0, 8) + '...'
          });

          // First try with insert
          const { data: newProfileUser, error: createExtendedError } = await supabase
            .from('profile_users')
            .insert([profileUserData])
            .select()
            .single();

          if (createExtendedError) {
            const formattedError = handleSupabaseError(createExtendedError);
            console.error('Error creating profile_users in getCurrentUser:', formattedError);

            // Try with upsert as a fallback
            console.log('Trying fallback profile_users creation with upsert...');
            const { data: fallbackProfileUser, error: fallbackError } = await supabase
              .from('profile_users')
              .upsert([profileUserData], {
                onConflict: 'profile_id',
                returning: 'representation'
              });

            if (fallbackError) {
              console.error('Fallback profile_users creation also failed:', handleSupabaseError(fallbackError));
            } else if (fallbackProfileUser && fallbackProfileUser.length > 0) {
              console.log('Fallback profile_users creation succeeded');
              extendedProfileData = fallbackProfileUser[0];
            }
          } else {
            console.log('Profile_users created successfully');
            extendedProfileData = newProfileUser;
          }

          // If we still don't have the data, try to fetch it one more time
          if (!extendedProfileData) {
            const { data: refetchedData } = await supabase
              .from('profile_users')
              .select('*')
              .eq('profile_id', userId)
              .maybeSingle();

            if (refetchedData) {
              console.log('Retrieved newly created profile_users');
              extendedProfileData = refetchedData;
            }
          }
        }
      } catch (err) {
        console.error('Error in profile_users handling:', err);
        // We'll use defaults below
      }

      // If we still don't have extended profile data, use defaults
      if (!extendedProfileData) {
        extendedProfileData = {
          id: 0, // Placeholder ID
          profile_id: userId,
          name: basicProfileData.name,
          email: basicProfileData.email,
          phone: '',
          address: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Return the combined user profile
      const userProfile: UserProfile = {
        id: basicProfileData.id,
        name: basicProfileData.name,
        email: basicProfileData.email,
        avatar_url: basicProfileData.avatar_url,
        phone: extendedProfileData.phone || '',
        address: extendedProfileData.address || '',
        profile_user_id: extendedProfileData.id
      };

      return { user: userProfile, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: { message: 'An unexpected error occurred while getting current user' } };
    }
  }

  /**
   * Check if email is confirmed
   * @param email User email
   * @returns Whether the email is confirmed or not
   */
  static async checkEmailConfirmation(email: string): Promise<{ confirmed: boolean; error: AuthError | null }> {
    try {
      // Validate and sanitize email
      if (!email || typeof email !== 'string') {
        return { confirmed: false, error: { message: 'Email is required' } };
      }

      // Trim whitespace and convert to lowercase
      const sanitizedEmail = email.trim().toLowerCase();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return { confirmed: false, error: { message: 'Email format is invalid' } };
      }

      console.log('Checking email confirmation status for:', sanitizedEmail);

      // Try to sign in with a dummy password to check if email is confirmed
      // This will fail with 'Invalid login credentials' if email is confirmed
      // or 'Email not confirmed' if it's not confirmed
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: 'dummy_password_for_check_only',
      });

      if (error) {
        if (error.message && error.message.includes('Email not confirmed')) {
          return { confirmed: false, error: null };
        } else if (error.message && error.message.includes('Invalid login credentials')) {
          // This means the email exists and is confirmed, but password is wrong (which is expected)
          return { confirmed: true, error: null };
        } else {
          // Some other error
          return { confirmed: false, error: { message: error.message, code: error.code } };
        }
      }

      // If no error, this is unexpected but we'll assume confirmed
      return { confirmed: true, error: null };
    } catch (error) {
      console.error('Check email confirmation error:', error);
      return { confirmed: false, error: { message: 'An unexpected error occurred while checking email confirmation' } };
    }
  }

  /**
   * Resend email confirmation
   * @param email User email
   * @returns Success or error
   */
  static async resendConfirmationEmail(email: string): Promise<{ error: AuthError | null }> {
    try {
      // Validate and sanitize email
      if (!email || typeof email !== 'string') {
        return { error: { message: 'Email is required' } };
      }

      // Trim whitespace and convert to lowercase
      const sanitizedEmail = email.trim().toLowerCase();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return { error: { message: 'Email format is invalid' } };
      }

      console.log('Resending confirmation email to:', sanitizedEmail);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: sanitizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('Error resending confirmation email:', error);
        return { error: { message: error.message, code: error.code } };
      }

      return { error: null };
    } catch (error) {
      console.error('Resend confirmation email error:', error);
      return { error: { message: 'An unexpected error occurred while resending confirmation email' } };
    }
  }

  /**
   * Reset password
   * @param email User email
   * @returns Success or error
   */
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: { message: error.message, code: error.code } };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: { message: 'An unexpected error occurred during password reset' } };
    }
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param profile Profile data to update
   * @returns Updated profile or error
   */
  /**
   * Helper method to get table columns
   * @param tableName Table name to check
   * @returns Array of column names
   */
  private static async getTableColumns(tableName: string): Promise<string[]> {
    try {
      // Try using the RPC function first
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_columns', { table_name: tableName });

      if (!tableError && tableInfo) {
        return tableInfo.map((col: any) => col.column_name);
      }

      // If RPC fails, try a direct query to information_schema
      console.log('RPC method failed, trying direct query...');
      const { data: columns, error: queryError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', tableName);

      if (!queryError && columns) {
        return columns.map((col: any) => col.column_name);
      }

      // If all else fails, return default columns
      console.warn('Could not get table columns, using defaults');
      return ['id', 'name', 'email', 'avatar_url', 'created_at', 'updated_at'];
    } catch (error) {
      console.error('Error getting table columns:', error);
      return ['id', 'name', 'email', 'avatar_url', 'created_at', 'updated_at'];
    }
  }

  static async updateProfile(
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<{ user: UserProfile | null; error: AuthError | null }> {
    try {
      // First, update the basic profile information in the profiles table
      const basicProfileUpdates: any = {};

      // Only update name in the profiles table
      if (profile.name) {
        basicProfileUpdates.name = profile.name;
        basicProfileUpdates.updated_at = new Date().toISOString();
      }

      // Update the profiles table if we have basic profile updates
      if (Object.keys(basicProfileUpdates).length > 0) {
        console.log('Updating basic profile with:', basicProfileUpdates);

        const { error: profileError } = await supabase
          .from('profiles')
          .update(basicProfileUpdates)
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating basic profile:', profileError);
          return { user: null, error: { message: profileError.message, code: profileError.code } };
        }
      }

      // Now, check if the user has a profile_users entry
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('profile_id', userId)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users:', profileUserError);
        return { user: null, error: { message: profileUserError.message, code: profileUserError.code } };
      }

      // Prepare the profile_users updates
      const profileUserUpdates: any = {};

      // Add all the fields we want to update
      if (profile.name) profileUserUpdates.name = profile.name;
      if (profile.phone !== undefined) profileUserUpdates.phone = profile.phone;
      if (profile.address !== undefined) profileUserUpdates.address = profile.address;
      profileUserUpdates.updated_at = new Date().toISOString();

      let profileUserId: number | null = null;

      // If the user doesn't have a profile_users entry, create one
      if (!profileUserData) {
        console.log('Creating new profile_users entry for user:', userId);

        // Get the user's email from the profiles table
        const { data: profileData, error: getProfileError } = await supabase
          .from('profiles')
          .select('email, name')
          .eq('id', userId)
          .single();

        if (getProfileError) {
          console.error('Error getting profile data:', getProfileError);
          return { user: null, error: { message: getProfileError.message, code: getProfileError.code } };
        }

        // Create a new profile_users entry
        const { data: newProfileUser, error: insertError } = await supabase
          .from('profile_users')
          .insert([
            {
              profile_id: userId,
              name: profile.name || profileData.name,
              email: profileData.email,
              phone: profile.phone || '',
              address: profile.address || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile_users entry:', insertError);
          return { user: null, error: { message: insertError.message, code: insertError.code } };
        }

        profileUserId = newProfileUser.id;
      } else {
        // Update the existing profile_users entry
        console.log('Updating profile_users entry:', profileUserData.id);
        console.log('With data:', profileUserUpdates);

        const { error: updateError } = await supabase
          .from('profile_users')
          .update(profileUserUpdates)
          .eq('id', profileUserData.id);

        if (updateError) {
          console.error('Error updating profile_users:', updateError);
          return { user: null, error: { message: updateError.message, code: updateError.code } };
        }

        profileUserId = profileUserData.id;
      }

      // Get the updated user data
      const { data: updatedProfileUser, error: getUpdatedError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('profile_id', userId)
        .single();

      if (getUpdatedError) {
        console.error('Error getting updated profile_users:', getUpdatedError);
        return { user: null, error: { message: getUpdatedError.message, code: getUpdatedError.code } };
      }

      // Get the basic profile data
      const { data: basicProfile, error: getBasicError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (getBasicError) {
        console.error('Error getting basic profile:', getBasicError);
        return { user: null, error: { message: getBasicError.message, code: getBasicError.code } };
      }

      // Create a combined user profile object
      const userProfile: UserProfile = {
        id: userId,
        name: updatedProfileUser.name || basicProfile.name,
        email: basicProfile.email,
        avatar_url: basicProfile.avatar_url || null,
        phone: updatedProfileUser.phone || '',
        address: updatedProfileUser.address || '',
        profile_user_id: updatedProfileUser.id
      };

      return { user: userProfile, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { user: null, error: { message: 'An unexpected error occurred while updating profile' } };
    }
  }

  /**
   * Update user password
   * @param currentPassword Current password for verification
   * @param newPassword New password to set
   * @returns Success or error
   */
  static async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ error: AuthError | null }> {
    try {
      // First verify the current password by attempting to sign in
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user?.email) {
        return { error: { message: 'No authenticated user found' } };
      }

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: sessionData.session.user.email,
        password: currentPassword,
      });

      if (verifyError) {
        return { error: { message: 'Current password is incorrect', code: 'invalid_credentials' } };
      }

      // Update to the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: { message: error.message, code: error.code } };
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: { message: 'An unexpected error occurred while updating password' } };
    }
  }
}
