"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, LogIn, UserPlus, Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// Import Google font
import { Cormorant_Garamond, Inter } from "next/font/google";

// Define fonts
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

/**
 * User Authentication Page
 * Provides login and signup functionality for users
 */
export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, login, signup, forgotPassword, resendConfirmationEmail, isLoading, error: authError, lastUnconfirmedEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  // Forgot password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Check for unconfirmed email when component mounts or when lastUnconfirmedEmail changes
  useEffect(() => {
    if (lastUnconfirmedEmail) {
      setShowEmailConfirmation(true);
    } else {
      // Check localStorage for pending confirmation email
      if (typeof window !== 'undefined') {
        const pendingEmail = localStorage.getItem('pendingConfirmationEmail');
        if (pendingEmail && activeTab === 'login') {
          // Set the login email field to the pending confirmation email
          setLoginEmail(pendingEmail);
          setShowEmailConfirmation(true);
        } else {
          setShowEmailConfirmation(false);
        }
      } else {
        setShowEmailConfirmation(false);
      }
    }
  }, [lastUnconfirmedEmail, activeTab]);

  // Handle tab query parameter
  useEffect(() => {
    // Check for tab query parameter
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab');
      if (tab === 'signup') {
        setActiveTab('signup');
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    // Prevent redirect if we're still loading auth state
    if (isLoading) {
      console.log('Auth page: Auth state is still loading, waiting...');
      return;
    }

    if (isAuthenticated) {
      console.log('Auth page: User already authenticated, redirecting to account page');
      try {
        // Use replace instead of push for a more forceful navigation
        router.replace("/account");

        // Force a navigation after a short delay if the router doesn't redirect
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.pathname !== '/account') {
            console.log('Forcing navigation to account page');
            window.location.href = '/account';
          }
        }, 300);
      } catch (routerError) {
        console.error('Navigation error in useEffect:', routerError);
        // Use direct window location as a fallback
        if (typeof window !== 'undefined') {
          window.location.href = "/account";
        }
      }
    }
  }, [isAuthenticated, isLoading, router]);

  /**
   * Handle login form submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Validate email format
    if (!loginEmail.trim()) {
      setLoginError("Email is required");
      return;
    }

    // Use the same email validation as signup
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(loginEmail.trim())) {
      setLoginError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!loginPassword) {
      setLoginError("Password is required");
      return;
    }

    try {
      // We no longer need to check for email confirmation during login
      // Just clear any previous state
      setShowEmailConfirmation(false);
      setResendSuccess(false);

      // Validate email format before attempting login
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(loginEmail.trim())) {
        setLoginError("Please enter a valid email address");
        return;
      }

      // Validate password is not empty
      if (!loginPassword) {
        setLoginError("Password is required");
        return;
      }

      console.log('Auth page: Attempting login with email:', loginEmail.trim());

      // First, try to test the credentials directly to get a clear error message
      try {
        const testResult = await AuthService.testLoginCredentials(loginEmail.trim(), loginPassword);
        console.log('Auth page: Credential test result:', testResult);

        // If the test failed with a specific error, show it to the user
        if (!testResult.success) {
          if (testResult.message.includes('Invalid login credentials')) {
            setLoginError("The email or password you entered is incorrect. Please try again.");
            return;
          }
        }
      } catch (testError) {
        console.error('Auth page: Error testing credentials:', testError);
        // Continue with normal login flow even if the test fails
      }

      // Proceed with normal login
      const success = await login(loginEmail.trim(), loginPassword);

      if (success) {
        console.log('Auth page: Login successful, redirecting to account page');
        // Show success toast notification
        toast.success("Login successful! Welcome back.", {
          duration: 3000,
          position: "top-center"
        });

        // Set a flag in sessionStorage to show welcome toast on account page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('justLoggedIn', 'true');
        }

        // Add a small delay before redirecting to ensure the toast is visible
        setTimeout(() => {
          try {
            // Use replace instead of push for a more forceful navigation
            router.replace("/account");

            // Force a navigation after a short delay if the router doesn't redirect
            setTimeout(() => {
              if (typeof window !== 'undefined' && window.location.pathname !== '/account') {
                console.log('Forcing navigation to account page');
                window.location.href = '/account';
              }
            }, 300);
          } catch (routerError) {
            console.error('Navigation error:', routerError);
            // Use direct window location as a fallback
            window.location.href = "/account";
          }
        }, 500);
      } else {
        // Check if this is an email confirmation error
        if (authError && typeof authError === 'string' && authError.includes('not confirmed')) {
          console.log('Auth page: Email confirmation required');
          // Show a more helpful error message
          setLoginError("Your email address has not been confirmed. Please check your inbox for a confirmation email or use the 'Resend confirmation' button below.");
          // Store the email for resending confirmation
          if (loginEmail) {
            setShowEmailConfirmation(true);
            // Store the email for resend functionality
            if (typeof window !== 'undefined') {
              localStorage.setItem('pendingConfirmationEmail', loginEmail.trim());
            }
          }
        } else {
          // Handle other login errors
          const errorMessage = authError || "Invalid email or password";
          console.error('Auth page: Login failed with error:', errorMessage);
          setLoginError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Auth page: Unexpected error during login:', err);
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  /**
   * Handle signup form submission
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    // Validate form
    if (!signupName.trim()) {
      setSignupError("Name is required");
      return;
    }

    if (!signupEmail.trim()) {
      setSignupError("Email is required");
      return;
    }

    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(signupEmail.trim())) {
      setSignupError("Please enter a valid email address");
      return;
    }

    if (!signupPassword) {
      setSignupError("Password is required");
      return;
    }

    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    try {
      // Trim and sanitize inputs
      const sanitizedName = signupName.trim();
      const sanitizedEmail = signupEmail.trim().toLowerCase();

      const result = await signup(sanitizedName, sanitizedEmail, signupPassword);

      if (result.success) {
        // Clear the form on success
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");

        // Check if email confirmation is needed but still allow login
        if (result.emailConfirmationNeeded) {
          console.log('Auth page: Email confirmation needed after signup');
          // Show a toast notification about email confirmation
          toast.info(
            "Please check your email to confirm your account. You can still use the app in the meantime.",
            { duration: 6000 }
          );
        }

        // Since we're allowing login without email confirmation, always redirect to account page
        if (isAuthenticated) {
          // Show success toast notification
          toast.success("Account created successfully! Welcome to Aetheria.", {
            duration: 3000,
            position: "top-center"
          });

          // Set a flag in sessionStorage to show welcome toast on account page
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('justLoggedIn', 'true');
          }

          // Add a small delay before redirecting to ensure the toast is visible
          setTimeout(() => {
            try {
              // Use replace instead of push for a more forceful navigation
              router.replace("/account");

              // Force a navigation after a short delay if the router doesn't redirect
              setTimeout(() => {
                if (typeof window !== 'undefined' && window.location.pathname !== '/account') {
                  console.log('Forcing navigation to account page');
                  window.location.href = '/account';
                }
              }, 300);
            } catch (routerError) {
              console.error('Navigation error:', routerError);
              // Use direct window location as a fallback
              window.location.href = "/account";
            }
          }, 500);
        } else {
          // If for some reason we're not authenticated, switch to login tab
          setActiveTab("login");
          toast.info("Please log in with your new account");
        }
      } else {
        const errorMessage = authError || "Failed to create account";
        console.error('Auth page: Signup failed with error:', errorMessage);
        setSignupError(errorMessage);
      }
    } catch (err: any) {
      setSignupError(err?.message || "An error occurred during signup");
      console.error("Signup error:", err);
    }
  };

  /**
   * Handle forgot password form submission
   */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess(false);

    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError("Email is required");
      return;
    }

    // Use the same comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(forgotPasswordEmail.trim())) {
      setForgotPasswordError("Please enter a valid email address");
      return;
    }

    try {
      // Sanitize email
      const sanitizedEmail = forgotPasswordEmail.trim().toLowerCase();

      const success = await forgotPassword(sanitizedEmail);

      if (success) {
        setForgotPasswordSuccess(true);
      } else {
        const errorMessage = authError || "Email not found";
        console.error('Auth page: Forgot password failed with error:', errorMessage);
        setForgotPasswordError(errorMessage);
      }
    } catch (err) {
      setForgotPasswordError("An error occurred");
      console.error(err);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-[#F8F4E3] p-4 ${cormorant.variable} ${inter.variable}`}>
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
            <h2 className="font-serif text-xl font-semibold text-[#2D2D2D]">Loading...</h2>
            <p className="text-gray-600 text-sm font-sans">Please wait while we check your authentication status</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#F8F4E3] p-4 ${cormorant.variable} ${inter.variable}`}>
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-xl shadow-2xl">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D2D2D]/80 to-[#2B3A67]/80 z-10"></div>
          <Image
            src="/images/auth-background.png"
            alt="Luxury fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-8 text-white">
            <h1 className="font-serif text-4xl mb-4 font-bold">AETHERIA</h1>
            <p className="text-center font-serif text-lg mb-6">
              Discover luxury fashion reimagined for the modern era
            </p>
            <div className="w-16 h-1 bg-[#D4AF37] mb-6"></div>
            <p className="text-center text-sm font-sans">
              Join our exclusive community and experience fashion like never before
            </p>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full md:w-1/2 bg-white">
          {showForgotPassword ? (
            <div className="p-8">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex items-center text-sm text-gray-600 mb-6 hover:text-[#2B3A67] transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </button>

              <h2 className="font-serif text-3xl font-semibold mb-2 text-[#2D2D2D]">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-6 font-sans text-sm">
                Enter your email address and we'll send you a link to reset your password
              </p>

              {forgotPasswordSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4 mb-6">
                  <p>Password reset link sent! Please check your email.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotPasswordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {forgotPasswordError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="font-sans text-sm text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your@email.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8">
              <div className="md:hidden mb-6 text-center">
                <h1 className="font-serif text-3xl font-bold text-[#2D2D2D]">AETHERIA</h1>
                <p className="text-gray-600 text-sm mt-1 font-sans">
                  Luxury fashion reimagined
                </p>
              </div>

              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "login" | "signup")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger
                    value="login"
                    className="font-sans text-sm data-[state=active]:bg-[#2D2D2D] data-[state=active]:text-white"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="font-sans text-sm data-[state=active]:bg-[#2D2D2D] data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0 space-y-4">
                  <h2 className="font-serif text-2xl font-semibold text-[#2D2D2D]">
                    Welcome Back
                  </h2>

                  {showEmailConfirmation ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md mb-6">
                      <div className="flex items-center mb-3">
                        <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                        <h3 className="font-medium">Email confirmation</h3>
                      </div>
                      <p className="text-sm mb-3">
                        We've sent a confirmation link to <strong>{lastUnconfirmedEmail || (typeof window !== 'undefined' ? localStorage.getItem('pendingConfirmationEmail') : null) || loginEmail}</strong>.
                        Confirming your email helps secure your account.
                      </p>
                      <p className="text-sm mb-2">
                        Please check your inbox and spam folder. If you didn't receive the email, you can request a new one.
                      </p>
                      <p className="text-xs mb-4 text-amber-600">
                        <strong>Note:</strong> You can continue using the app without confirming your email.
                      </p>
                      {resendSuccess ? (
                        <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-md text-sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmation email sent! Please check your inbox.
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-amber-300 hover:bg-amber-100 text-amber-800 font-sans text-sm"
                          onClick={async () => {
                            setResendingEmail(true);
                            try {
                              // Try to get the email from lastUnconfirmedEmail or localStorage
                              let emailToConfirm = lastUnconfirmedEmail;

                              if (!emailToConfirm && typeof window !== 'undefined') {
                                emailToConfirm = localStorage.getItem('pendingConfirmationEmail');
                              }

                              if (!emailToConfirm) {
                                // If we still don't have an email, use the current login email
                                emailToConfirm = loginEmail.trim();
                              }

                              if (!emailToConfirm) {
                                toast.error('No email address to confirm');
                                return;
                              }

                              const success = await resendConfirmationEmail(emailToConfirm);
                              if (success) {
                                setResendSuccess(true);
                                toast.success('Confirmation email sent!');
                              }
                            } catch (error) {
                              console.error('Error resending confirmation email:', error);
                              toast.error('Failed to send confirmation email');
                            } finally {
                              setResendingEmail(false);
                            }
                          }}
                          disabled={resendingEmail}
                        >
                          {resendingEmail ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend confirmation email
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : loginError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-red-800 mb-1">Login failed</h3>
                        <p className="text-sm">{loginError}</p>
                        {loginError.includes("incorrect") && (
                          <div className="mt-2 text-xs text-red-600">
                            <p>Please check that:</p>
                            <ul className="list-disc ml-4 mt-1 space-y-1">
                              <li>Your email address is entered correctly</li>
                              <li>Your password is correct (check caps lock)</li>
                              <li>You have registered an account with this email</li>
                            </ul>
                          </div>
                        )}
                        <p className="text-xs mt-2 text-red-600">
                          If you continue to experience issues, please contact support at support@aetheria.com
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="font-sans"
                      onClick={() => console.log("Google login")}
                    >
                      <Image
                        src="/images/google-logo.svg"
                        alt="Google"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="font-sans"
                      onClick={() => console.log("Apple login")}
                    >
                      <Image
                        src="/images/apple-logo.svg"
                        alt="Apple"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      Apple
                    </Button>
                  </div>

                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative px-4 text-sm bg-white text-gray-500 font-sans">
                      Or login with email
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="font-sans text-sm text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password" className="font-sans text-sm text-gray-700">
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-[#2B3A67] hover:underline font-sans"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      />
                    </div>

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        className="w-full bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Logging in...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </span>
                        )}
                      </Button>

                      <div className="text-center text-sm text-gray-500 font-sans">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="text-[#2B3A67] hover:underline font-medium"
                          onClick={() => setActiveTab("signup")}
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0 space-y-4">
                  <h2 className="font-serif text-2xl font-semibold text-[#2D2D2D]">
                    Create Account
                  </h2>

                  {signupError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {signupError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="font-sans"
                      onClick={() => console.log("Google signup")}
                    >
                      <Image
                        src="/images/google-logo.svg"
                        alt="Google"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="font-sans"
                      onClick={() => console.log("Apple signup")}
                    >
                      <Image
                        src="/images/apple-logo.svg"
                        alt="Apple"
                        width={18}
                        height={18}
                        className="mr-2"
                      />
                      Apple
                    </Button>
                  </div>

                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative px-4 text-sm bg-white text-gray-500 font-sans">
                      Or sign up with email
                    </div>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="font-sans text-sm text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="font-sans text-sm text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="font-sans text-sm text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="font-sans text-sm text-gray-700">
                        Confirm Password
                      </Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      />
                    </div>

                    <div className="text-xs text-gray-500 font-sans">
                      By creating an account, you agree to our{" "}
                      <Link href="/terms" className="text-[#2B3A67] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#2B3A67] hover:underline">
                        Privacy Policy
                      </Link>
                    </div>

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        className="w-full bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating account...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Account
                          </span>
                        )}
                      </Button>

                      <div className="text-center text-sm text-gray-500 font-sans">
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="text-[#2B3A67] hover:underline font-medium"
                          onClick={() => setActiveTab("login")}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
