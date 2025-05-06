import { supabase } from '@/lib/supabase-client';

/**
 * Utility function to fix profile issues
 * This can be called when authentication errors occur
 */
export async function fixProfileIssues(): Promise<{ success: boolean; message: string }> {
  try {
    // First, check if the user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return { success: false, message: 'Not authenticated' };
    }

    if (!sessionData.session?.user) {
      return { success: false, message: 'No active session' };
    }

    const userId = sessionData.session.user.id;

    // Check if the user has a profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profile:', profileError);
    }

    // If no profile exists, create one
    if (!profileData) {
      console.log('Creating missing profile for user:', userId);

      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          name: sessionData.session.user.user_metadata?.name || 'User',
          email: sessionData.session.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        return { success: false, message: 'Failed to create profile' };
      }
    }

    // Check if the user has a profile_users entry
    const { data: profileUserData, error: profileUserError } = await supabase
      .from('profile_users')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle();

    if (profileUserError) {
      console.error('Error checking profile_users:', profileUserError);
    }

    // If no profile_users entry exists, create one
    if (!profileUserData) {
      console.log('Creating missing profile_users for user:', userId);

      // Get the profile data again if we just created it
      const { data: latestProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!latestProfile) {
        return { success: false, message: 'Profile not found' };
      }

      const { error: createProfileUserError } = await supabase
        .from('profile_users')
        .insert([{
          profile_id: userId,
          name: latestProfile.name,
          email: latestProfile.email,
          phone: latestProfile.phone || '',
          address: latestProfile.address || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (createProfileUserError) {
        console.error('Error creating profile_users:', createProfileUserError);
        return { success: false, message: 'Failed to create profile_users entry' };
      }
    }

    // Call the server-side fix-profiles API to ensure all profiles are fixed
    try {
      const response = await fetch('/api/auth/fix-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Server-side profile fix returned non-OK status:', response.status);
      }
    } catch (apiError) {
      console.error('Error calling fix-profiles API:', apiError);
      // Continue anyway, as we've already fixed the current user's profile
    }

    return { success: true, message: 'Profile issues fixed' };
  } catch (error) {
    console.error('Error fixing profile issues:', error);
    return { success: false, message: 'Unexpected error fixing profile issues' };
  }
}

/**
 * Utility function to retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in milliseconds
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();

      // For Supabase auth functions, check if the result has an error property
      // This handles cases where Supabase doesn't throw but returns an error object
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        console.log(`Attempt ${attempt + 1} returned an error object:`, result.error);

        // Store the error for potential retry
        lastError = result.error;

        // If this isn't the last attempt, retry
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // Skip to the next iteration
        }

        // If this is the last attempt, return the result anyway
        // The caller will handle the error property
        return result;
      }

      // If no error property or it's falsy, return the successful result
      return result;
    } catch (error) {
      lastError = error;

      // Log detailed error information
      console.error(`Attempt ${attempt + 1} failed with exception:`, error);
      if (error && typeof error === 'object') {
        console.log('Error properties:', Object.getOwnPropertyNames(error));
      }

      if (attempt < maxRetries) {
        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all attempts failed
  console.error(`All ${maxRetries + 1} attempts failed. Last error:`, lastError);

  // Create a safe error object to return
  const safeError = {
    message: lastError && typeof lastError === 'object' && lastError.message
      ? lastError.message
      : (typeof lastError === 'string' ? lastError : 'All retry attempts failed'),
    code: lastError && typeof lastError === 'object' && lastError.code
      ? lastError.code
      : 'retry_failed'
  };

  throw safeError;
}
