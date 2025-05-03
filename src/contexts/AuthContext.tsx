"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService, UserProfile, AuthError } from "@/services/auth-service";
import { fixProfileIssues, retryWithBackoff } from "@/utils/auth-utils";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; emailConfirmationNeeded?: boolean }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  checkEmailConfirmation: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  lastUnconfirmedEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Manages authentication state throughout the application
 */
// Use named function with explicit return type
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUnconfirmedEmail, setLastUnconfirmedEmail] = useState<string | null>(null);

  // Check if user is already logged in on mount and when window gains focus
  const checkAuthStatus = async () => {
    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;

    const attemptAuthCheck = async (): Promise<boolean> => {
      try {
        // Check admin authentication (still using localStorage for admin)
        const adminAuthStatus = localStorage.getItem("adminAuthenticated");
        if (adminAuthStatus === "true") {
          setIsAdminAuthenticated(true);
        }

        // Check user authentication using Supabase
        const { user, error } = await AuthService.getCurrentUser();

        if (error) {
          console.error(`Auth check error (attempt ${retryCount + 1}):`, error);

          // Only set error message on final attempt
          if (retryCount >= maxRetries) {
            setError(error.message);
            // Clear authentication state if there's an error
            setIsAuthenticated(false);
            setUserProfile(null);

            // Clear the flag in localStorage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('userAuthenticated');
            }
          }
          return false;
        } else if (user) {
          console.log("Auth check: User is authenticated", user.id);
          setUserProfile(user);
          setIsAuthenticated(true);

          // Store a flag in localStorage to help with session persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('userAuthenticated', 'true');
          }
          return true;
        } else {
          // No user found, clear authentication state
          console.log("Auth check: No authenticated user found");
          setIsAuthenticated(false);
          setUserProfile(null);

          // Clear the flag in localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userAuthenticated');
          }
          return true; // This is a valid state, not an error
        }
      } catch (err) {
        console.error(`Auth check error (attempt ${retryCount + 1}):`, err);

        // Only set error message on final attempt
        if (retryCount >= maxRetries) {
          setError("Failed to check authentication status");
          // Clear authentication state on error
          setIsAuthenticated(false);
          setUserProfile(null);

          // Clear the flag in localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userAuthenticated');
          }
        }
        return false;
      }
    };

    // First attempt
    let success = await attemptAuthCheck();

    // Retry logic if first attempt fails
    while (!success && retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying auth check (attempt ${retryCount + 1} of ${maxRetries + 1})...`);

      // Wait a bit before retrying (increasing delay with each retry)
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

      success = await attemptAuthCheck();
    }

    setIsLoading(false);
  };

  // Check auth status on mount
  useEffect(() => {
    // Check if we have a flag in localStorage indicating the user was authenticated
    if (typeof window !== 'undefined' && localStorage.getItem('userAuthenticated') === 'true') {
      // Set a temporary authenticated state while we check with the server
      setIsAuthenticated(true);
    }

    // Now check the actual auth status
    checkAuthStatus().then(() => {
      // If there was an error during auth check, try to fix profile issues
      if (error) {
        console.log('Auth check had errors, attempting to fix profile issues...');
        fixProfileIssues().then(result => {
          if (result.success) {
            console.log('Profile issues fixed, retrying auth check...');
            // Clear the error and retry auth check
            setError(null);
            checkAuthStatus();
          } else {
            console.warn('Failed to fix profile issues:', result.message);
          }
        });
      }
    });
  }, []);

  // Re-check auth when window gains focus or visibility changes
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window focused, checking auth status");
      checkAuthStatus();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Document became visible, checking auth status");
        checkAuthStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up an interval to periodically check auth status (every 5 minutes)
    const intervalId = setInterval(() => {
      console.log("Periodic auth check");
      checkAuthStatus();
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  /**
   * User Login function
   * Validates user credentials and sets authentication state
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      console.log('AuthContext: Starting login process for email:', email);

      // Use retry with backoff for more reliable login
      const { user, error } = await retryWithBackoff(
        () => AuthService.signIn(email, password),
        2, // Max 2 retries (3 attempts total)
        500 // Start with 500ms delay
      );

      if (error) {
        // Ensure error is a proper object with required properties
        const safeError = {
          message: error.message || 'An unknown error occurred',
          code: error.code || 'unknown_error',
          email: error.email
        };

        console.error('AuthContext: Login error:', safeError);
        setError(safeError.message);

        // Add additional debugging information
        if (safeError.code) {
          console.log('AuthContext: Error code:', safeError.code);

          // Handle email not confirmed error
          if (safeError.code === 'email_not_confirmed' && safeError.email) {
            setLastUnconfirmedEmail(safeError.email);
          }

          // If we get a profile-related error, try to fix it
          if (safeError.message.includes('profile') || safeError.code.includes('profile')) {
            console.log('Attempting to fix profile issues...');
            const fixResult = await fixProfileIssues();
            if (fixResult.success) {
              // Try login again after fixing profiles
              console.log('Profile issues fixed, retrying login...');
              const retryResult = await AuthService.signIn(email, password);
              if (!retryResult.error && retryResult.user) {
                console.log('Login successful after fixing profiles');
                setUserProfile(retryResult.user);
                setIsAuthenticated(true);

                // Store a flag in localStorage to help with session persistence
                if (typeof window !== 'undefined') {
                  localStorage.setItem('userAuthenticated', 'true');
                }

                return true;
              }
            }
          }
        }

        return false;
      }

      if (user) {
        console.log('AuthContext: Login successful, user:', user.id);
        setUserProfile(user);
        setIsAuthenticated(true);

        // Store a flag in localStorage to help with session persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('userAuthenticated', 'true');
        }

        return true;
      }

      console.error('AuthContext: No user returned from login');
      setError('Login failed. Please try again.');
      return false;
    } catch (err) {
      console.error("AuthContext: Unexpected login error:", err);
      setError("An unexpected error occurred during login. Please try again later.");

      // Try to fix profile issues as a last resort
      try {
        console.log('Attempting to fix profile issues after login error...');
        await fixProfileIssues();
      } catch (fixErr) {
        console.error('Failed to fix profile issues:', fixErr);
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Admin Login function
   * Validates admin credentials and sets authentication state
   * Note: Still using hardcoded admin credentials for simplicity
   */
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // Fixed credentials for admin
      const validEmail = "usmankhan2069412@gmail.com";
      const validPassword = "Usman560213";

      if (email === validEmail && password === validPassword) {
        setIsAdminAuthenticated(true);
        localStorage.setItem("adminAuthenticated", "true");
        return true;
      }

      setError("Invalid admin credentials");
      return false;
    } catch (err) {
      console.error("Admin login error:", err);
      setError("An unexpected error occurred during admin login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User Signup function
   * Registers a new user and logs them in
   * Returns success status and whether email confirmation is needed
   */
  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; emailConfirmationNeeded?: boolean }> => {
    setError(null);
    setIsLoading(true);

    try {
      console.log('AuthContext: Starting signup process');
      const { user, error, emailConfirmationNeeded } = await AuthService.signUp(email, password, name);

      if (error) {
        // Ensure error is a proper object with required properties
        const safeError = {
          message: error.message || 'An unknown error occurred during signup',
          code: error.code || 'unknown_error'
        };

        console.log('AuthContext: Signup returned error:', safeError);

        // Check for specific error codes
        if (safeError.code === "23505") {
          setError("Email already in use");
          return { success: false };
        } else if (safeError.message && safeError.message.includes("profile")) {
          // This is likely a profile creation error, but the user was created successfully
          // We can continue with authentication and fix the profile later
          console.warn('Profile creation error, but continuing with authentication');
          toast.success("Account created successfully!");

          // If we have a user object, set it and continue
          if (user) {
            setUserProfile(user);
            setIsAuthenticated(true);
            return { success: true };
          } else {
            // Try to get the current user
            const getCurrentUserResult = await AuthService.getCurrentUser();
            if (getCurrentUserResult.user) {
              setUserProfile(getCurrentUserResult.user);
              setIsAuthenticated(true);
              return { success: true };
            } else {
              setError("Account created but unable to log in automatically. Please try logging in.");
              return { success: false };
            }
          }
        } else {
          setError(safeError.message);
        }
        return { success: false };
      }

      console.log('AuthContext: Signup successful, user:', user ? { ...user, id: user.id.substring(0, 8) + '...' } : null);

      // Check if email confirmation is needed
      if (emailConfirmationNeeded) {
        // Store the email that needs confirmation
        setLastUnconfirmedEmail(email);
        // Set the user as authenticated anyway (we're allowing login without confirmation)
        if (user) {
          setUserProfile(user);
          setIsAuthenticated(true);
          toast.success("Account created! Please check your email to confirm your account.");
          return { success: true, emailConfirmationNeeded: true };
        }
      } else if (user) {
        // Normal successful signup
        setUserProfile(user);
        setIsAuthenticated(true);
        toast.success("Account created successfully!");
        return { success: true };
      }

      return { success: false };
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err?.message || "An unexpected error occurred during signup");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Forgot Password function
   * Sends a password reset email
   */
  const forgotPassword = async (email: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await AuthService.resetPassword(email);

      if (error) {
        setError(error.message);
        return false;
      }

      toast.success("Password reset email sent");
      return true;
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update Password function
   * Updates the user's password after verification
   */
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await AuthService.updatePassword(currentPassword, newPassword);

      if (error) {
        setError(error.message);
        return false;
      }

      toast.success("Password updated successfully");
      return true;
    } catch (err) {
      console.error("Update password error:", err);
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   * Clears authentication state
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      if (isAdminAuthenticated) {
        setIsAdminAuthenticated(false);
        localStorage.removeItem("adminAuthenticated");
      }

      if (isAuthenticated) {
        const { error } = await AuthService.signOut();

        if (error) {
          console.error("Logout error:", error);
        }

        setIsAuthenticated(false);
        setUserProfile(null);

        // Clear the flag in localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userAuthenticated');
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if an email is confirmed
   * Checks the confirmation status of an email address
   */
  const checkEmailConfirmation = async (email: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const { confirmed, error } = await AuthService.checkEmailConfirmation(email);

      if (error) {
        setError(error.message);
        return false;
      }

      if (!confirmed) {
        // Store the unconfirmed email for potential resend
        setLastUnconfirmedEmail(email);
      }

      return confirmed;
    } catch (err) {
      console.error("Check email confirmation error:", err);
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend confirmation email function
   * Sends a new confirmation email to the user
   */
  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await AuthService.resendConfirmationEmail(email);

      if (error) {
        setError(error.message);
        return false;
      }

      toast.success("Confirmation email sent. Please check your inbox.");
      return true;
    } catch (err) {
      console.error("Resend confirmation email error:", err);
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isAdminAuthenticated,
      userProfile,
      login,
      adminLogin,
      signup,
      logout,
      forgotPassword,
      updatePassword,
      resendConfirmationEmail,
      checkEmailConfirmation,
      isLoading,
      error,
      lastUnconfirmedEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 */
// Use named function with explicit return type
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};