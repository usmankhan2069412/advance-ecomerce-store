"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Import Google font
import { Cormorant_Garamond, Inter } from "next/font/google";

// Initialize fonts
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * Reset Password Page
 * Handles password reset from email links
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the hash fragment from the URL (contains the access token)
  const [token, setToken] = useState<string | null>(null);
  
  // Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract the token from the URL on component mount
  useEffect(() => {
    // The token is in the hash fragment of the URL
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const accessToken = hash.split("access_token=")[1].split("&")[0];
      setToken(accessToken);
    } else {
      // Check if token is in the query params (for Supabase v2)
      const accessToken = searchParams.get("access_token");
      if (accessToken) {
        setToken(accessToken);
      }
    }
  }, [searchParams]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Update the password using the token
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Password updated successfully
      setIsSuccess(true);
      toast.success("Password updated successfully!");

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 ${serif.variable} ${sans.variable}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#2D2D2D]">AETHERIA</h1>
          <p className="text-gray-600 text-sm mt-1 font-sans">
            Luxury fashion reimagined
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {!token ? (
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
                <h2 className="font-serif text-2xl font-semibold text-[#2D2D2D]">
                  Invalid Reset Link
                </h2>
                <p className="text-gray-600 font-sans">
                  This password reset link is invalid or has expired. Please request a new password reset link.
                </p>
                <Button
                  className="w-full bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans mt-4"
                  onClick={() => router.push("/auth")}
                >
                  Back to Login
                </Button>
              </div>
            ) : isSuccess ? (
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#2D2D2D]">
                  Password Updated
                </h2>
                <p className="text-gray-600 font-sans">
                  Your password has been successfully updated. You will be redirected to the login page.
                </p>
                <Button
                  className="w-full bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans mt-4"
                  onClick={() => router.push("/auth")}
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-semibold mb-6 text-[#2D2D2D]">
                  Reset Your Password
                </h2>
                <p className="text-gray-600 mb-6 font-sans text-sm">
                  Please enter your new password below
                </p>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center mb-6">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="font-sans text-sm text-gray-700">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="font-sans text-sm text-gray-700">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37] font-sans"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans mt-2"
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
                        <Lock className="mr-2 h-4 w-4" />
                        Update Password
                      </span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/auth"
            className="text-sm text-gray-600 hover:text-[#2B3A67] font-sans"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
